# PrimeTeq Direct

Sitio para comprar equipos usados (iPhone, Samsung, Google Pixel, iPad) — flujo tipo trade-in:
modelo → operador/capacidad → cuestionario de condición → oferta → datos de pago/envío → orden.

## Correr en local

```bash
npm install          # solo la primera vez (necesita internet)
npm run dev -- -p 3100
```

- Sitio: http://localhost:3100
- Admin: http://localhost:3100/admin — la contraseña está en `.env.local` (`ADMIN_PASSWORD`).
  Para producción, copia `.env.example` y pon una contraseña nueva.

## Cómo se calculan los precios

`src/lib/pricing.ts`

```
reventa = precio manual (si existe) o precio de lanzamiento × curva de depreciación(edad)
oferta “buena” = reventa × (1 − comisión − riesgo − depreciación − ganancia) − limpieza − envíos
                 × calibración de marca
oferta final   = oferta “buena” × % operador × % condición  (redondeada hacia abajo)
```

Todo se ajusta en el admin:
- **Fórmula de precios**: costos, ganancia, % por condición y operador, curvas, calibración.
- **Catálogo y precios**: ver todas las ofertas; poner precio de reventa manual o importar CSV.
- **Calibración**: anotar precios de la competencia revisados a mano; “Aplicar ajuste” iguala el promedio.

Los valores por defecto están calibrados contra una cotización real de Gazelle
(iPhone 17 Pro 256GB desbloqueado, 14 oct 2026: $663/$663/$636/$378/$274).
Las curvas y ajustes por operador son estimados: calíbralos con más modelos.
Los modelos marcados “verificar datos” tienen precio/fecha de lanzamiento estimados.

## Datos

- **Con `DATABASE_URL`** (producción): todo se guarda en Postgres. Las tablas (`orders`, `app_kv`) se crean solas la primera vez.
- **Sin `DATABASE_URL`** (tu computadora): se guarda en `data/*.json`, como antes.

## Publicar en Vercel

1. Sube el proyecto a un repositorio privado de GitHub.
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el repositorio (detecta Next.js solo).
3. En el proyecto de Vercel → **Storage → Create Database → Neon (Postgres)** → conéctala al proyecto.
   Esto agrega `DATABASE_URL` automáticamente. (Otra opción: crear la base en neon.tech o supabase.com y pegar la URL.)
4. **Settings → Environment Variables** → agrega `ADMIN_PASSWORD` con una contraseña larga y nueva.
5. **Deploy**. Luego, en **Settings → Domains**, agrega `primeteqdirect.com` y copia los registros DNS que indica
   Vercel en el lugar donde compraste el dominio.

Cada `git push` a la rama principal vuelve a publicar el sitio.

## Emails y etiquetas de envío

- Al aceptar una oferta, el cliente recibe un email de confirmación automático.
- En el admin, cada orden tiene la sección **Shipping label**: “Copy customer address” → crear una
  **Return Label** en Pirate Ship (u otro servicio de envíos) → pegar el link de la etiqueta → **Send label to customer**.
  La orden pasa a “Label sent” y el cliente ve el botón “Print your shipping label” en su página de orden.
- Los emails salen desde `SMTP_USER` (Google Workspace, contraseña de aplicación en `SMTP_PASS`).
  Sin esas variables, en tu computadora se guardan en `data/outbox/` para verlos.

## Fotos de producto

Fotos originales en `photos-raw/<modelo>.jpg` → `npm run photos` → `public/devices/<modelo>.webp`.
Hay que hacer commit de `public/devices/` (y `src/data/photos.json`) para que aparezcan en el sitio publicado.

## Pendiente antes de lanzar

- Etiquetas de envío prepagadas (EasyPost / Shippo) y emails automáticos.
- Pagos (PayPal Payouts, Zelle, cheques) y verificación de IMEI / lista negra.
- Revisión legal de términos y licencia de comprador de artículos usados.

## Idiomas (español / inglés)

El sitio abre en **español** por defecto; el selector **ES | EN** está arriba a la derecha (y en el menú del celular). La elección se guarda en una cookie (`ptd_lang`). Los textos están en `src/i18n/es.ts` y `src/i18n/en.ts` (mismas claves). Los correos al cliente salen en el idioma que usó en el sitio. El admin sigue en inglés.

## Panamá: puntos de entrega, Yappy y ACH

En el checkout el cliente elige **Panamá** o **Estados Unidos**:

- **Panamá:** no hay envío. Elige un punto de entrega y se le paga por **Yappy** o **ACH** (banco, tipo de cuenta, número y titular). La orden queda en *Awaiting drop-off (PA)*.
- **EE. UU.:** etiqueta de envío gratis y pago por PayPal o Zelle (igual que antes).

Los puntos de entrega (nombre, dirección, zona, horario) se editan en `src/lib/locations.ts`.

## Aviso por WhatsApp al encargado

En cada orden nueva se envía automáticamente un resumen (equipo, oferta, cliente, contacto, pago, entrega y link al admin) por la **WhatsApp Cloud API de Meta**. Variables en Vercel:

| Variable | Qué es |
| --- | --- |
| `WHATSAPP_TOKEN` | Token permanente del usuario del sistema en Meta Business |
| `WHATSAPP_PHONE_NUMBER_ID` | ID del número de WhatsApp Business que envía |
| `WHATSAPP_NOTIFY_TO` | Número(s) del encargado, formato internacional sin `+`, separados por coma (ej. `50761234567`) |
| `WHATSAPP_TEMPLATE` | Nombre de la plantilla aprobada (ej. `nueva_orden`) |
| `WHATSAPP_TEMPLATE_LANG` | Idioma de la plantilla (por defecto `es`) |

La plantilla (categoría *Utility*) debe tener exactamente 8 variables en este orden:

```
Nueva orden {{1}}
Equipo: {{2}}
Oferta: {{3}}
Cliente: {{4}}
Contacto: {{5}}
Pago: {{6}}
Entrega: {{7}}
Ver: {{8}}
```

Mientras no esté configurado, cada orden en el admin tiene el botón **Send summary by WhatsApp**, que abre WhatsApp con el resumen listo para enviar. `/api/health` muestra `whatsappConfigured`.
