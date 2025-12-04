import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Kiwify webhook event types
type KiwifyEvent = 
  | 'order_approved'       // Compra aprovada
  | 'subscription_renewed' // Assinatura renovada
  | 'subscription_canceled'// Assinatura cancelada
  | 'subscription_late'    // Assinatura em atraso
  | 'order_refunded'       // Compra reembolsada
  | 'chargeback';          // Chargeback

interface KiwifyWebhookPayload {
  order_id: string;
  order_ref: string;
  order_status: string;
  product_id: string;
  product_name: string;
  subscription_id?: string;
  subscription_status?: string;
  Customer: {
    full_name: string;
    email: string;
    mobile?: string;
    CPF?: string;
  };
  created_at: string;
  approved_date?: string;
  webhook_event_type?: KiwifyEvent;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate webhook token
    const webhookToken = Deno.env.get('KIWIFY_WEBHOOK_TOKEN');
    const authHeader = req.headers.get('x-kiwify-signature') || req.headers.get('authorization');
    
    // Some webhooks send token in query params
    const url = new URL(req.url);
    const queryToken = url.searchParams.get('token');
    
    const receivedToken = authHeader || queryToken;
    
    if (webhookToken && receivedToken !== webhookToken && receivedToken !== `Bearer ${webhookToken}`) {
      console.error('Invalid webhook token');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: KiwifyWebhookPayload = await req.json();
    console.log('Kiwify webhook received:', JSON.stringify(payload, null, 2));

    // Initialize Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const customerEmail = payload.Customer?.email?.toLowerCase();
    const customerCpf = payload.Customer?.CPF?.replace(/\D/g, ''); // Remove non-digits
    const customerName = payload.Customer?.full_name;

    if (!customerEmail) {
      console.error('Customer email is required');
      return new Response(JSON.stringify({ error: 'Customer email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine event type
    const eventType = payload.webhook_event_type || 
      (payload.order_status === 'paid' ? 'order_approved' : 
       payload.subscription_status === 'active' ? 'subscription_renewed' :
       payload.subscription_status === 'canceled' ? 'subscription_canceled' :
       payload.subscription_status === 'late' ? 'subscription_late' : 
       'order_approved');

    console.log('Processing event:', eventType);

    // Find user by email or CPF
    let userId: string | null = null;
    
    // First, try to find by email in auth.users
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const existingAuthUser = authUsers?.users?.find(
      u => u.email?.toLowerCase() === customerEmail
    );

    if (existingAuthUser) {
      userId = existingAuthUser.id;
      console.log('Found existing user by email:', userId);
    } else if (customerCpf) {
      // Try to find by CPF in profiles
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

    // If user doesn't exist and it's a purchase event, create account
    if (!userId && (eventType === 'order_approved' || eventType === 'subscription_renewed')) {
      console.log('Creating new user account for:', customerEmail);
      
      // Generate a temporary password
      const tempPassword = crypto.randomUUID();
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: customerName,
          cpf: customerCpf,
        }
      });

      if (createError) {
        console.error('Error creating user:', createError);
        // Don't fail the webhook, just log the error
      } else if (newUser?.user) {
        userId = newUser.user.id;
        console.log('Created new user:', userId);

        // Update profile with CPF if provided
        if (customerCpf) {
          await supabase
            .from('profiles')
            .update({ cpf: customerCpf, full_name: customerName })
            .eq('id', userId);
        }

        // Send password reset email so user can set their password
        const { error: resetError } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: customerEmail,
        });

        if (resetError) {
          console.error('Error generating password reset link:', resetError);
        }
      }
    }

    // Map Kiwify event to subscription status
    let subscriptionStatus: 'active' | 'canceled' | 'late' | 'refunded' | 'pending';
    switch (eventType) {
      case 'order_approved':
      case 'subscription_renewed':
        subscriptionStatus = 'active';
        break;
      case 'subscription_canceled':
        subscriptionStatus = 'canceled';
        break;
      case 'subscription_late':
        subscriptionStatus = 'late';
        break;
      case 'order_refunded':
      case 'chargeback':
        subscriptionStatus = 'refunded';
        break;
      default:
        subscriptionStatus = 'pending';
    }

    // Calculate expiration date (30 days for monthly subscription)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Upsert subscription record
    const subscriptionData = {
      user_id: userId,
      kiwify_subscription_id: payload.subscription_id || payload.order_id,
      kiwify_customer_email: customerEmail,
      kiwify_customer_cpf: customerCpf,
      plan_name: payload.product_name,
      status: subscriptionStatus,
      started_at: payload.approved_date ? new Date(payload.approved_date).toISOString() : new Date().toISOString(),
      expires_at: subscriptionStatus === 'active' ? expiresAt.toISOString() : null,
      canceled_at: subscriptionStatus === 'canceled' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { data: subscription, error: upsertError } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, {
        onConflict: 'kiwify_subscription_id',
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Error upserting subscription:', upsertError);
      return new Response(JSON.stringify({ error: 'Failed to process subscription' }), {
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
