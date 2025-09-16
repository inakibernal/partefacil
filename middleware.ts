import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting simple (en producción usar Redis o similar)
const rateLimitMap = new Map()

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // 1. Rate Limiting básico
  const clientIP = request.ip || 'unknown'
  const currentTime = Date.now()
  const windowMs = 60 * 1000 // 1 minuto
  const maxRequests = 100 // máximo 100 requests por minuto
  
  if (!rateLimitMap.has(clientIP)) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: currentTime + windowMs })
  } else {
    const clientData = rateLimitMap.get(clientIP)
    
    if (currentTime > clientData.resetTime) {
      clientData.count = 1
      clientData.resetTime = currentTime + windowMs
    } else {
      clientData.count++
      
      if (clientData.count > maxRequests) {
        return new NextResponse('Too Many Requests', { status: 429 })
      }
    }
  }
  
  // 2. Headers de seguridad adicionales
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // 3. Validar User-Agent sospechoso
  const userAgent = request.headers.get('user-agent') || ''
  const suspiciousPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'scanner',
    'curl', 'wget', 'python-requests', 'postman'
  ]
  
  const isSuspicious = suspiciousPatterns.some(pattern => 
    userAgent.toLowerCase().includes(pattern)
  )
  
  if (isSuspicious && !request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`Blocked suspicious user agent: ${userAgent}`)
    return new NextResponse('Forbidden', { status: 403 })
  }
  
  // 4. Proteger rutas sensibles
  const protectedPaths = ['/informes', '/nuevo-parte', '/mis-partes']
  
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    // En un entorno real, aquí verificarías el token JWT
    // Por ahora, dejamos que las páginas manejen la autenticación
  }
  
  // 5. Bloquear ciertos métodos HTTP en rutas específicas
  if (request.method !== 'GET' && request.method !== 'POST' && 
      request.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse('Method Not Allowed', { status: 405 })
  }
  
  // 6. Validar origen en requests POST
  if (request.method === 'POST') {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    
    if (origin && !origin.includes(host || '')) {
      console.log(`Blocked request from invalid origin: ${origin}`)
      return new NextResponse('Forbidden', { status: 403 })
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}