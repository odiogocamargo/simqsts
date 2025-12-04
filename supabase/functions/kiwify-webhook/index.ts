import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-kiwify-signature',
};

// Kiwify webhook triggers (eventos)
type KiwifyTrigger = 
  | 'boleto_gerado'
  | 'pix_gerado'
  | 'carrinho_abandonado'
  | 'compra_recusada'
  | 'compra_aprovada'
  | 'compra_reembolsada'
  | 'chargeback'
  | 'subscription_canceled'
  | 'subscription_late'
  | 'subscription_renewed';

// Estrutura do payload da Kiwify (baseado na documentação oficial)
interface KiwifyWebhookPayload {
  // Identificadores da venda
  order_id: string;
  order_ref?: string;
  order_status: string;
  
  // Informações do produto
  product_id: string;
  product_name?: string;
  Product?: {
    id: string;
    name: string;
  };
  product?: {
    id: string;
    name: string;
  };
  
  // Informações de assinatura (para produtos recorrentes)
  subscription_id?: string;
  Subscription?: {
    id: string;
    status: string;
    plan?: {
      id: string;
      name: string;
      frequency: string;
    };
    charges?: {
      completed: number;
    };
    next_payment?: string;
    start_date?: string;
  };
  
  // Informações do cliente (Kiwify usa "Customer" com C maiúsculo no webhook)
  Customer?: {
    full_name?: string;
    name?: string;
    email: string;
    mobile?: string;
    CPF?: string;
    cpf?: string;
  };
  // Alternativa em lowercase (documentação API)
  customer?: {
    id?: string;
    name?: string;
    full_name?: string;
    email: string;
    cpf?: string;
    mobile?: string;
    instagram?: string;
    country?: string;
    address?: {
      street?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      zipcode?: string;
    };
  };
  
  // Informações de pagamento
  payment_method?: string;
  Commissions?: {
    charge_amount?: string;
    product_base_price?: string;
    kiwify_fee?: string;
    commissioned_stores?: Array<{
      id: string;
      type: string;
      custom_name: string;
      email: string;
      value: string;
    }>;
  };
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  approved_date?: string;
  sale_type?: string;
  
  // Tipo do evento (quando enviado no payload)
  webhook_event_type?: KiwifyTrigger;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validar token do webhook
    const webhookToken = Deno.env.get('KIWIFY_WEBHOOK_TOKEN');
    
    // Kiwify envia a assinatura como query parameter "signature"
    // A assinatura é um HMAC-SHA1 do body usando o token como chave
    const url = new URL(req.url);
    const receivedSignature = url.searchParams.get('signature');
    
    // Ler o body como texto para validação
    const bodyText = await req.text();
    
    console.log('Webhook received:', {
      hasConfiguredToken: !!webhookToken,
      receivedSignature: receivedSignature ? receivedSignature.substring(0, 8) + '...' : 'none',
      method: req.method,
      bodyLength: bodyText.length,
    });
    
    // Validar assinatura HMAC se token configurado
    if (webhookToken && webhookToken !== '' && receivedSignature) {
      // Calcular HMAC-SHA1 do body
      const encoder = new TextEncoder();
      const keyData = encoder.encode(webhookToken);
      const bodyData = encoder.encode(bodyText);
      
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
      );
      
      const signature = await crypto.subtle.sign('HMAC', key, bodyData);
      const expectedSignature = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      console.log('Signature validation:', {
        expected: expectedSignature.substring(0, 8) + '...',
        received: receivedSignature.substring(0, 8) + '...',
        matches: expectedSignature === receivedSignature,
      });
      
      if (expectedSignature !== receivedSignature) {
        console.error('Invalid webhook signature');
        return new Response(JSON.stringify({ error: 'Unauthorized - Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.log('Signature validation passed!');
    } else if (!receivedSignature) {
      console.log('No signature received - skipping validation');
    }
    
    // Parse do payload
    const payload: KiwifyWebhookPayload = JSON.parse(bodyText);
    console.log('Kiwify webhook payload:', JSON.stringify(payload, null, 2));

    // Inicializar cliente Supabase com service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extrair dados do cliente (aceita ambos os formatos)
    const customerData = payload.Customer || payload.customer;
    if (!customerData) {
      console.error('Customer data not found in payload');
      return new Response(JSON.stringify({ error: 'Customer data is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const customerEmail = customerData.email?.toLowerCase();
    // CPF pode vir em diferentes formatos (CPF ou cpf)
    const rawCpf = (customerData as any).CPF || (customerData as any).cpf;
    const customerCpf = rawCpf?.replace(/\D/g, '');
    const customerName = customerData.full_name || customerData.name || '';
    const customerPhone = customerData.mobile;

    if (!customerEmail) {
      console.error('Customer email is required');
      return new Response(JSON.stringify({ error: 'Customer email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determinar o tipo de evento baseado no payload
    let eventType: KiwifyTrigger = payload.webhook_event_type || 'compra_aprovada';
    
    // Se não tiver o tipo explícito, inferir do status
    if (!payload.webhook_event_type) {
      const status = payload.order_status?.toLowerCase() || payload.Subscription?.status?.toLowerCase();
      
      if (status === 'paid' || status === 'approved' || status === 'completed') {
        eventType = 'compra_aprovada';
      } else if (status === 'refunded') {
        eventType = 'compra_reembolsada';
      } else if (status === 'canceled' || status === 'cancelled') {
        eventType = 'subscription_canceled';
      } else if (status === 'late' || status === 'overdue') {
        eventType = 'subscription_late';
      } else if (status === 'renewed' || status === 'active') {
        // Se tiver subscription_id e status active, provavelmente é renovação
        if (payload.subscription_id || payload.Subscription?.id) {
          eventType = 'subscription_renewed';
        }
      } else if (status === 'chargeback') {
        eventType = 'chargeback';
      }
    }

    console.log('Processing event:', eventType, 'for customer:', customerEmail);

    // Buscar usuário existente
    let userId: string | null = null;
    
    // Primeiro, buscar por email na auth.users
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const existingAuthUser = authUsers?.users?.find(
      u => u.email?.toLowerCase() === customerEmail
    );

    if (existingAuthUser) {
      userId = existingAuthUser.id;
      console.log('Found existing user by email:', userId);
    } else if (customerCpf) {
      // Tentar buscar por CPF na tabela profiles
      const { data: profileByCpf } = await supabase
        .from('profiles')
        .select('id')
        .eq('cpf', customerCpf)
        .single();
      
      if (profileByCpf) {
        userId = profileByCpf.id;
        console.log('Found existing user by CPF:', userId);
      }
    }

    // Se usuário não existe e é evento de compra, criar conta automaticamente
    const purchaseEvents: KiwifyTrigger[] = ['compra_aprovada', 'subscription_renewed'];
    if (!userId && purchaseEvents.includes(eventType)) {
      console.log('Creating new user account for:', customerEmail);
      
      // Gerar senha temporária
      const tempPassword = crypto.randomUUID();
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: customerName,
          cpf: customerCpf,
          whatsapp: customerPhone,
        }
      });

      if (createError) {
        console.error('Error creating user:', createError);
        // Não falha o webhook, apenas loga o erro
      } else if (newUser?.user) {
        userId = newUser.user.id;
        console.log('Created new user:', userId);

        // Atualizar profile com dados adicionais
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            cpf: customerCpf, 
            full_name: customerName,
            whatsapp: customerPhone,
          })
          .eq('id', userId);
          
        if (profileError) {
          console.error('Error updating profile:', profileError);
        }

        // Enviar email de recuperação de senha para usuário definir sua senha
        const { error: resetError } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: customerEmail,
          options: {
            redirectTo: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovable.app')}/auth`,
          }
        });

        if (resetError) {
          console.error('Error generating password reset link:', resetError);
        } else {
          console.log('Password reset link generated for new user');
        }
      }
    }

    // Mapear evento para status da assinatura
    let subscriptionStatus: 'active' | 'canceled' | 'late' | 'refunded' | 'pending';
    switch (eventType) {
      case 'compra_aprovada':
      case 'subscription_renewed':
        subscriptionStatus = 'active';
        break;
      case 'subscription_canceled':
        subscriptionStatus = 'canceled';
        break;
      case 'subscription_late':
        subscriptionStatus = 'late';
        break;
      case 'compra_reembolsada':
      case 'chargeback':
        subscriptionStatus = 'refunded';
        break;
      default:
        subscriptionStatus = 'pending';
    }

    // Extrair nome do produto
    const productName = payload.product_name || 
                       payload.Product?.name || 
                       payload.product?.name || 
                       'Assinatura';

    // Calcular data de expiração (30 dias para assinatura mensal)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Identificador único da assinatura
    const subscriptionIdentifier = payload.subscription_id || 
                                   payload.Subscription?.id || 
                                   payload.order_id;

    // Upsert do registro de assinatura
    const subscriptionData = {
      user_id: userId,
      kiwify_subscription_id: subscriptionIdentifier,
      kiwify_customer_email: customerEmail,
      kiwify_customer_cpf: customerCpf || null,
      plan_name: productName,
      status: subscriptionStatus,
      started_at: payload.approved_date || payload.created_at || new Date().toISOString(),
      expires_at: subscriptionStatus === 'active' ? expiresAt.toISOString() : null,
      canceled_at: subscriptionStatus === 'canceled' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    console.log('Upserting subscription:', subscriptionData);

    const { data: subscription, error: upsertError } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'kiwify_subscription_id',
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting subscription:', upsertError);
      return new Response(JSON.stringify({ error: 'Failed to process subscription', details: upsertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Subscription processed successfully:', subscription);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Webhook processed: ${eventType}`,
      subscription_id: subscription.id,
      user_id: userId,
      status: subscriptionStatus,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
