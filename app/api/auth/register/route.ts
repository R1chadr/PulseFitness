import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ⚠️ Usa tu SERVICE ROLE KEY (no pública)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, last_name, age, weight, correo, password, conf_password } = body;

    // Validaciones básicas
    if (!name || !last_name || !age || !weight || !correo || !password || !conf_password) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    if (password !== conf_password) {
      return NextResponse.json({ error: "Las contraseñas no coinciden" }, { status: 400 });
    }

    // 1️⃣ Crear usuario en AUTH (Authentication)
    const { data: signData, error: signError } = await supabaseAdmin.auth.admin.createUser({
      email: correo,
      password: password,
      email_confirm: true,   // el usuario queda verificado automáticamente
    });

    if (signError) {
      return NextResponse.json({ error: signError.message }, { status: 400 });
    }

    const userId = signData.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "No se pudo crear el usuario" }, { status: 500 });
    }

    // 2️⃣ Guardar datos adicionales en tu tabla personalizada `public.users`
    const { error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        auth_id: userId,
        email: correo,
        name,
        last_name,
        age: Number(age),
        weight: Number(weight),
        role: "client",
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, userId }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
