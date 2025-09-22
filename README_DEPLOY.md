# Deploy de Parte Fácil — Checklist Rápido

## 1) Preparación
- [ ] Node >= 18, pnpm/npm instalado
- [ ] Copiar `.env.example` a `.env.local` y rellenar si hay claves
- [ ] `npm install`
- [ ] `npm run build`
- [ ] `npm run start` (probar local)

## 2) Vercel (Front)
- [ ] Conectar repo `inakibernal/partefacil` a Vercel
- [ ] Project Settings → Build & Output:
      - Framework: Next.js
      - Build Command: `npm run build`
      - Output: `.next`
- [ ] Environment Variables: pegar las de `.env.local` (sin secretos en repo)
- [ ] Deploy → comprobar `/` y flujo login → nuevo parte → PDF

## 3) Datos (MVP)
- MVP local-first: `localStorage`.
- Para multiusuario/centros: valorar Supabase (Auth + Postgres + RLS) o sync local-first (Dexie/ElectricSQL).

## 4) PDFs
- jsPDF ok para tablas sencillas.
- Si maquetación legal compleja: considerar HTML-to-PDF vía Playwright o pdfmake en server.

## 5) Seguridad y Auditoría (cuando pases a producción)
- [ ] Roles y permisos serios (RLS si Postgres)
- [ ] Logs de actividad (quién/cómo/cuándo)
- [ ] Export legal por CCAA
- [ ] Sello temporal + firma simple del responsable
