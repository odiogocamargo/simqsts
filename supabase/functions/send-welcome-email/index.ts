import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to: ${email}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SIM Questões <onboarding@resend.dev>",
        to: [email],
        subject: "Bem-vindo ao SIM Questões! 🎓",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">SIM Questões</h1>
                        <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">Sua jornada para a aprovação começa agora!</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Olá, ${name}! 👋</h2>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          Seja muito bem-vindo(a) ao <strong>SIM Questões</strong>! Estamos felizes em tê-lo(a) conosco nessa jornada rumo à aprovação.
                        </p>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          Você agora tem acesso a:
                        </p>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                          <tr>
                            <td style="padding: 15px; background-color: #eff6ff; border-radius: 8px; margin-bottom: 10px;">
                              <table cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding-right: 15px; vertical-align: top;">📚</td>
                                  <td>
                                    <strong style="color: #1d4ed8;">Banco de Questões Completo</strong>
                                    <p style="color: #4b5563; margin: 5px 0 0 0; font-size: 14px;">Questões de ENEM, PAES UEMA e outros vestibulares</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr><td style="height: 10px;"></td></tr>
                          <tr>
                            <td style="padding: 15px; background-color: #eff6ff; border-radius: 8px;">
                              <table cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding-right: 15px; vertical-align: top;">📊</td>
                                  <td>
                                    <strong style="color: #1d4ed8;">Análise de Desempenho</strong>
                                    <p style="color: #4b5563; margin: 5px 0 0 0; font-size: 14px;">Acompanhe sua evolução e identifique pontos fracos</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr><td style="height: 10px;"></td></tr>
                          <tr>
                            <td style="padding: 15px; background-color: #eff6ff; border-radius: 8px;">
                              <table cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding-right: 15px; vertical-align: top;">🎯</td>
                                  <td>
                                    <strong style="color: #1d4ed8;">Prática Direcionada</strong>
                                    <p style="color: #4b5563; margin: 5px 0 0 0; font-size: 14px;">Filtre questões por matéria, conteúdo e tópico</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                          <strong>Você tem 2 dias de acesso gratuito</strong> para explorar a plataforma. Aproveite!
                        </p>
                        
                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="https://ovpvsysssqnvqwkqeybh.lovableproject.com/dashboard" 
                                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                Começar a Estudar →
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 14px; margin: 0;">
                          Dúvidas? Responda este email que teremos prazer em ajudar.
                        </p>
                        <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">
                          © 2024 SIM Questões. Todos os direitos reservados.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Resend API error: ${errorData}`);
    }

    const data = await res.json();
    console.log("Welcome email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
