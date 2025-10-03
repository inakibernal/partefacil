import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, nombre, apellidos, dni, rol, telefono, empresas, residencias } = await req.json()

    if (!email || !password || !nombre || !apellidos || !dni || !rol) {
      throw new Error('Faltan campos obligatorios')
    }

    // 1. Crear usuario en auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) throw authError

    // 2. Insertar manualmente en tabla usuarios
    const { error: insertError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        id: authData.user.id,
        email,
        nombre,
        apellidos,
        dni,
        rol,
        telefono
      })

    if (insertError) throw insertError

    // 3. Insertar en usuario_login
    await supabaseAdmin
      .from('usuario_login')
      .insert({ dni, email })

    // 4. Insertar asignaciones según el rol
    if (rol === 'director' && empresas && empresas.length > 0) {
      const { error: errorEmpresas } = await supabaseAdmin
        .from('usuario_empresa')
        .insert(empresas.map(empresa_id => ({ 
          usuario_id: authData.user.id, 
          empresa_id 
        })))
      
      if (errorEmpresas) throw errorEmpresas
    }

    if (rol === 'trabajador' && residencias && residencias.length > 0) {
      const { error: errorResidencias } = await supabaseAdmin
        .from('usuario_residencia')
        .insert(residencias.map(residencia_id => ({ 
          usuario_id: authData.user.id, 
          residencia_id 
        })))
      
      if (errorResidencias) throw errorResidencias
    }

    return new Response(
      JSON.stringify({ success: true, user_id: authData.user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
