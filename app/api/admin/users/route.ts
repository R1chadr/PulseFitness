import { createClient } from "@/lib/supabaseServer";import { supabaseAdmin } from "@/lib/supabaseAdmin";import { NextResponse } from "next/server";

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "Error al verificar permisos" },
        { status: 500 }
      );
    }

    if (userData.role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permisos para acceder a esta información" },
        { status: 403 }
      );
    }

    // Obtener todos los usuarios usando supabaseAdmin para evitar RLS
    const { data: users, error: usersError } = await supabaseAdmin
      .from("users")
      .select("id, name, last_name, email, role, created_at")
      .order("created_at", { ascending: false });

    if (usersError) {
      console.error("Error al obtener usuarios:", usersError);
      return NextResponse.json(
        { error: "Error al obtener usuarios" },
        { status: 500 }
      );
    }

    console.log(`GET /api/admin/users - Usuarios encontrados: ${users?.length || 0}`);
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/admin/users:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo usuario
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verificar autenticación y permisos
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", user.id)
      .single();

    if (!userData || userData.role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permisos" },
        { status: 403 }
      );
    }

    // Obtener datos del nuevo usuario
    const body = await request.json();
    console.log("Body recibido en POST:", body);
    const { name, last_name, email, password, role } = body;

    // Validar campos requeridos
    if (!name || !last_name || !email || !password || !role) {
      console.log("Campos faltantes:", { name, last_name, email, password: !!password, role });
      return NextResponse.json(
        { error: "Todos los campos son requeridos (nombre, apellido, email, password, rol)" },
        { status: 400 }
      );
    }

    // Crear usuario en Supabase Auth usando service role
    console.log("Intentando crear usuario en Auth...");
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      console.error("Error al crear en Auth:", authError);
      return NextResponse.json(
        { error: `Error al crear usuario: ${authError.message}` },
        { status: 500 }
      );
    }

    console.log("Usuario creado en Auth, insertando en tabla users...");

    // Crear usuario en tabla users usando supabaseAdmin para evitar RLS
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        auth_id: authData.user.id,
        name,
        last_name,
        email,
        role
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error al insertar en tabla users:", insertError);
      // Si falla, intentar eliminar el usuario de auth usando supabaseAdmin
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { error: "Error al guardar datos del usuario: " + insertError.message },
        { status: 500 }
      );
    }

    console.log("Usuario creado exitosamente:", newUser);
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/admin/users:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
