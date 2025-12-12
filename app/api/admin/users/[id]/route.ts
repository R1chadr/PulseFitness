import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// PATCH - Actualizar usuario
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const supabase = await createClient();

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Verificar permisos de admin
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

    // Obtener datos a actualizar
    const body = await request.json();
    console.log("Body recibido en PATCH:", body);
    console.log("Tipo de cada campo:", {
      name: typeof body.name,
      last_name: typeof body.last_name,
      email: typeof body.email,
      role: typeof body.role
    });
    
    const { name, last_name, email, role } = body;

    // Preparar objeto de actualización (solo campos válidos)
    const updateData: any = {};
    if (name !== undefined && name !== null && name !== "" && name !== "undefined") {
      updateData.name = name;
    }
    if (last_name !== undefined && last_name !== null && last_name !== "" && last_name !== "undefined") {
      updateData.last_name = last_name;
    }
    if (email !== undefined && email !== null && email !== "" && email !== "undefined") {
      updateData.email = email;
    }
    if (role !== undefined && role !== null && role !== "" && role !== "undefined") {
      updateData.role = role;
    }

    // Verificar que hay algo que actualizar
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No hay datos para actualizar" },
        { status: 400 }
      );
    }

    // Obtener auth_id del usuario para actualizar en Auth
    const { data: userRecord } = await supabaseAdmin
      .from("users")
      .select("auth_id")
      .eq("id", resolvedParams.id)
      .single();

    // Actualizar usuario en tabla users
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update(updateData)
      .eq("id", resolvedParams.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error al actualizar en tabla users:", updateError);
      return NextResponse.json(
        { error: "Error al actualizar usuario: " + updateError.message },
        { status: 500 }
      );
    }

    // Si se actualizó el email, también actualizar en Supabase Auth
    if (email && userRecord?.auth_id) {
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        userRecord.auth_id,
        { email }
      );

      if (authUpdateError) {
        console.error("Error al actualizar email en Auth:", authUpdateError);
        // No retornamos error aquí, el usuario ya se actualizó en la tabla
      }
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error en PATCH /api/admin/users/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const supabase = await createClient();

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Verificar permisos de admin
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

    // Obtener auth_id del usuario a eliminar
    const { data: userToDelete } = await supabaseAdmin
      .from("users")
      .select("auth_id")
      .eq("id", resolvedParams.id)
      .single();

    if (!userToDelete) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar de tabla users
    const { error: deleteError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", resolvedParams.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Error al eliminar usuario" },
        { status: 500 }
      );
    }

    // Eliminar de Supabase Auth
    if (userToDelete.auth_id) {
      await supabaseAdmin.auth.admin.deleteUser(userToDelete.auth_id);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error en DELETE /api/admin/users/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
