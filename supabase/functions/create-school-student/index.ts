import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify admin
    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: requestingUser }, error: userError } = await anonClient.auth.getUser();
    if (userError || !requestingUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: isAdmin } = await anonClient.rpc("has_role", {
      _user_id: requestingUser.id,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Forbidden - admin role required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { school_id, students } = await req.json();

    if (!school_id || !students || !Array.isArray(students) || students.length === 0) {
      return new Response(
        JSON.stringify({ error: "school_id e students (array) são obrigatórios" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify school exists
    const { data: school, error: schoolError } = await serviceClient
      .from("schools")
      .select("id, name")
      .eq("id", school_id)
      .single();

    if (schoolError || !school) {
      return new Response(
        JSON.stringify({ error: "Escola não encontrada" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: { email: string; success: boolean; error?: string }[] = [];

    for (const student of students) {
      const { email, password, full_name } = student;

      if (!email || !password) {
        results.push({ email: email || "unknown", success: false, error: "Email e senha obrigatórios" });
        continue;
      }

      if (password.length < 6) {
        results.push({ email, success: false, error: "Senha deve ter pelo menos 6 caracteres" });
        continue;
      }

      try {
        // Create user
        const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: full_name || "" },
        });

        if (createError) {
          results.push({ email, success: false, error: createError.message });
          continue;
        }

        // The trigger already creates profile + aluno role
        // Link student to school
        const { error: linkError } = await serviceClient
          .from("school_students")
          .insert({ school_id, user_id: newUser.user.id });

        if (linkError) {
          console.error(`Error linking student ${email} to school:`, linkError);
          results.push({ email, success: true, error: "Usuário criado, mas erro ao vincular à escola" });
          continue;
        }

        results.push({ email, success: true });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro desconhecido";
        results.push({ email, success: false, error: msg });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({ success: true, created: successCount, failed: failCount, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Unexpected error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
