# Mantenimiento — Carta digital (NFC) del Mesón Darling

> ⚠️ **WEB DE PRUEBA** con datos inventados (ver `cliente.md`). Lleva `noindex` a propósito: no quitarlo hasta tener datos reales.

> Registro de cambios y de dónde está cada acceso. **NUNCA escribir aquí contraseñas, claves ni códigos.** Solo dónde encontrarlos.

## Datos del proyecto
- **Repositorio:** https://github.com/andresandmike-webs/carta-meson-darling (privado)
- **Hosting:** Cloudflare Workers (Static Assets), despliegue automático desde `main`
- **URL de Cloudflare:** https://carta-meson-darling.palomobernardoandres.workers.dev (desplegada y comprobada el 2026-11-27)
- **Dominio:** https://mesondarling.misioncumplida.app
- **Registrador:** dominio `misioncumplida.app` del usuario, ya gestionado en Cloudflare (nameservers alfred/keyla.ns.cloudflare.com, comprobado el 2026-11-27). Subdominio provisional hasta comprar un dominio propio para las cartas.
- **Formulario:** no
- **Pegatinas NFC/QR:** graban `https://mesondarling.misioncumplida.app`. Mientras sea prueba, solo pegatinas de prueba. Tras grabar y probar, **bloquear la pegatina** (protección contra escritura) para que nadie la reprograme.

## Accesos (sin contraseñas)
| Servicio | Cuenta / email | Dónde está la contraseña |
|---|---|---|
| Cloudflare | | Gestor de contraseñas |
| Registrador | | Gestor de contraseñas |
| Google Search Console | | Cuenta Google de … |
| Google Business Profile | | Propietario: … |
| Bing Places / Apple Business Connect | | |

## Seguridad (marcar cuando esté hecho; sin contraseñas)
- [ ] 2FA en GitHub (organización), Cloudflare y registrador
- [ ] Bloqueo de transferencia del dominio
- [ ] Cloudflare: Always Use HTTPS · TLS ≥ 1.2 · DNSSEC
- [ ] SPF / DKIM / DMARC (si hay correo propio)
- [ ] Web3Forms limitado al dominio (si hay formulario)
- [ ] Rama `main` protegida · repo privado
- [ ] Cabeceras comprobadas en vivo (securityheaders.com / observatory.mozilla.org)

## Legal
- [ ] Aviso legal y privacidad revisados por el titular o un profesional (fecha: …)
- [ ] Bloque «REVISAR ANTES DE PUBLICAR» retirado
- [ ] Alérgenos / registro turístico / colegiado según sector
- [ ] Fotos y textos con derechos confirmados

## Pendientes
- [ ] Pedir al restaurante los alérgenos de cada plato (no inventarlos)
- [ ] Revisar las traducciones al inglés con alguien con buen inglés
- [ ] Al cambiar un precio o plato, cambiarlo en `index.html` **y** en `en.html`; si cambia CSS/JS, subir el `?v=N` de sus enlaces
- [ ] Al pasar a datos reales: quitar `noindex` (index, legales) y los datos de prueba
- [ ] Mover a un dominio propio para las cartas cuando se compre
- [ ] Revisar legales y retirar el bloque «REVISAR ANTES DE PUBLICAR»
- [ ] Alta en Search Console, Bing Places y Apple Business Connect
- [ ] Añadir la URL a la ficha de Google

## Registro de cambios
| Fecha | Cambio | Archivos |
|---|---|---|
| 2026-11-27 | Alta de la web (primera versión) | todos |
| 2026-11-27 | Alta de la carta digital de prueba (diseño con Hallmark: emblema de la cazuela con vapor, barra de secciones fija, menú de hoy marcado) | todos |
| 2026-11-27 | Añade la carta en inglés (/en) con selector de idioma, hreflang y textos del JS por idioma; fuerza versión nueva de CSS/JS (?v=2) | public/index.html, public/en.html, public/css/estilos.css, public/js/main.js, public/sitemap.xml, public/_redirects, legales y 404 |
