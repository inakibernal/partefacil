import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const supabaseAuthed = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json().catch(() => ({}));
    const { targetUserId, nuevaPassword } = body;

    console.log('=== reset-password request ===');
    console.log('targetUserId:', targetUserId);

    // Validaciones básicas
    if (!targetUserId) return json({ success: false, error: 'Falta targetUserId' }, 400);
    if (!nuevaPassword || String(nuevaPassword).length < 6) {
      return json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' }, 400);
    }

    // Identificar al llamante
    const authHeader = req.headers.get('Authorization') || '';
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const { data: authData } = await supabaseAuthed.auth.getUser(bearer);

    let callerId: string | null = authData?.user?.id ?? null;

    // Fallback: decodificar JWT
    if (!callerId && bearer && bearer.split('.').length === 3) {
      try {
        const payload = JSON.parse(atob(bearer.split('.')[1]));
        if (payload?.sub) callerId = payload.sub;
      } catch (_e) {}
    }

    if (!callerId) {
      return json({ success: false, error: 'No autorizado' }, 403);
    }

    // Obtener rol del llamante
    const { data: caller } = await supabaseAdmin
      .from('usuarios')
      .select('rol')
      .eq('id', callerId)
      .single();

    if (!caller) {
      return json({ success: false, error: 'Usuario no encontrado' }, 403);
    }

    console.log('Caller rol:', caller.rol);

    // SUPERADMIN puede resetear a CUALQUIERA
    if (caller.rol === 'superadmin') {
      console.log('✅ Superadmin autorizado');
    }
    // DIRECTOR solo puede resetear trabajadores de sus residencias
    else if (caller.rol === 'director') {
      const { data: targetUser } = await supabaseAdmin
        .from('usuarios')
        .select('rol')
        .eq('id', targetUserId)
        .single();

      if (!targetUser || targetUser.rol !== 'trabajador') {
        return json({ success: false, error: 'Solo puedes resetear trabajadores' }, 403);
      }

      const { data: vinculo } = await supabaseAdmin
        .from('usuario_residencia')
        .select('residencia_id')
        .eq('usuario_id', targetUserId)
        .limit(1)
        .maybeSingle();

      if (!vinculo?.residencia_id) {
        return json({ success: false, error: 'Trabajador sin residencia' }, 403);
      }

      const { data: residencia } = await supabaseAdmin
        .from('residencias')
        .select('director_id')
        .eq('id', vinculo.residencia_id)
        .single();

      if (residencia?.director_id !== callerId) {
        return json({ success: false, error: 'Trabajador no pertenece a tus residencias' }, 403);
      }

      console.log('✅ Director autorizado');
    } else {
      return json({ success: false, error: 'Sin permisos' }, 403);
    }

    // Reset de contraseña
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${targetUserId}`, {
      method: 'PUT',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: String(nuevaPassword) }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error('Error:', res.status, data);
      return json({ success: false, error: data?.message || 'Error al resetear' }, res.status);
    }

    console.log('✅ Contraseña actualizada');
    return json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (err: any) {
    console.error('Exception:', err);
    return json({ success: false, error: err?.message || 'Error interno' }, 500);
  }
});
