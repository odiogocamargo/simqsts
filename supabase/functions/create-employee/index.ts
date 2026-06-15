import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: "A senha deve ter pelo menos 8 caracteres" };
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const complexity = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  if (complexity < 3) {
    return { valid: false, error: "A senha deve conter ao menos 3 de: maiúscula, minúscula, número, caractere especial" };
  }
  const common = ["password", "senha123", "12345678", "qwerty123", "abc12345"];
  if (common.includes(password.toLowerCase())) {
    return { valid: false, error: "Senha muito comum, escolha outra" };
  }
  return { valid: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized - no auth header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: requestingUser }, error: userError } = await anonClient.auth.getUser();
    if (userError || !requestingUser) {
      return new Response(JSON.stringify({ error: "Unauthorized - invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin, error: roleError } = await anonClient.rpc("has_role", {
      _user_id: requestingUser.id,
      _role: "admin",
    });

    if (roleError || !isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden - admin role required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, password, full_name, role = "professor" } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email e senha são obrigatórios" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pwCheck = validatePasswordStrength(password);
    if (!pwCheck.valid) {
      return new Response(JSON.stringify({ error: pwCheck.error }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validRoles = ["admin", "professor"];
    if (!validRoles.includes(role)) {
      return new Response(JSON.stringify({ error: "Role inválida. Use: admin ou professor" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (createError || !newUser?.user) {
      return new Response(JSON.stringify({ error: createError?.message || "Erro ao criar usuário" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create profile (trigger no longer auto-creates)
    const { error: profileError } = await serviceClient
      .from("profiles")
      .upsert({ id: newUser.user.id, full_name: full_name ?? null });

    if (profileError) {
      console.error("Error creating profile:", profileError);
    }

    // Assign role
    const { error: insertRoleError } = await serviceClient
      .from("user_roles")
      .insert({ user_id: newUser.user.id, role });

    if (insertRoleError) {
      console.error("Error inserting role:", insertRoleError);
      return new Response(JSON.stringify({
        error: "Usuário criado, mas erro ao definir permissão: " + insertRoleError.message,
      }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      success: true,
      user: { id: newUser.user.id, email: newUser.user.email, role },
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Unexpected error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
