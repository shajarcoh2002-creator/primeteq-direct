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

## Pendiente antes de lanzar

- Base de datos real (hoy las órdenes y ajustes se guardan en `data/*.json`, sirve para un solo servidor).
- Etiquetas de envío prepagadas (EasyPost / Shippo) y emails automáticos.
- Pagos (PayPal Payouts, Zelle, cheques) y verificación de IMEI / lista negra.
- Revisión legal de términos y licencia de comprador de artículos usados.
