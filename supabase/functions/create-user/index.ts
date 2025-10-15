import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, nombre, apellidos, dni, rol, telefono, fecha_nacimiento, direccion, codigo_postal, ciudad, titulo_profesional, experiencia, empresas_asignadas, titulacion, numero_colegiado, turno, fecha_inicio, residencia_id } = await req.json()

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) throw authError

    const usuarioData: Record<string, any> = {
      id: authData.user.id,
      email,
      nombre,
      apellidos,
      dni,
      rol,
      telefono: telefono || null,
      fecha_nacimiento: fecha_nacimiento || null,
      direccion: direccion || null,
      codigo_postal: codigo_postal || null,
      ciudad: ciudad || null,
      activo: true,
      eliminado: false
    }

    if (rol === 'director') {
      usuarioData.titulo_profesional = titulo_profesional || null
      usuarioData.experiencia = experiencia || null
    }

    if (rol === 'trabajador') {
      usuarioData.titulacion = titulacion || null
      usuarioData.numero_colegiado = numero_colegiado || null
      usuarioData.turno = turno || null
      usuarioData.fecha_inicio = fecha_inicio || null
      usuarioData.residencia_id = residencia_id || null
    }

    const { error: insertError } = await supabaseAdmin
      .from('usuarios')
      .insert([usuarioData])

    if (insertError) throw insertError

    if (rol === 'director' && empresas_asignadas && empresas_asignadas.length > 0) {
      const { error: empresasError } = await supabaseAdmin
        .from('directores_empresas')
        .insert(empresas_asignadas.map((empresa_id: string) => ({
          director_id: authData.user.id,
          empresa_id
        })))

      if (empresasError) throw empresasError
    }

    return new Response(
      JSON.stringify({ success: true, user_id: authData.user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
