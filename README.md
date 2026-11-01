# Mercè Riera · Perruqueria i Estètica

Web de **Mercè Riera Perruqueria i Estètica** (C/ de les Flors, 5 · Lloret de Mar).
Diseño y desarrollo: **DURDUC**.

- Web: https://durducco-source.github.io/merce-riera-web/ (catalán: añade `?lang=ca`)
- Instagram: https://www.instagram.com/mercerieraperruqueria/

Web estática (HTML, CSS y JavaScript) lista para GitHub Pages. **Bilingüe castellano / catalán** con
selector ES · CA en la cabecera (recuerda la elección del visitante).

## Estructura

```
MERCE-RIERA/
├── index.html      → contenido (cada texto aparece dos veces: data-l="es" y data-l="ca")
├── style.css       → diseño (colores y tipografías en :root)
├── script.js       → idioma, menú, visor, formulario de WhatsApp, horario (CONFIG)
├── 404.html · robots.txt · sitemap.xml · site.webmanifest · .nojekyll
└── assets/images · assets/icons
```

## Identidad visual

Ciruela y lila de la propia marca del salón, formas orgánicas (como sus portadas de historias),
caligrafía **Allura** para el nombre, **Cormorant Garamond** para titulares y **Jost** para el texto.

## Cómo editar

| Quiero cambiar…            | Dónde |
|----------------------------|-------|
| Un texto                   | `index.html`: cambia la versión `data-l="es"` y la `data-l="ca"` |
| WhatsApp / teléfono        | `script.js` → `CONFIG.whatsapp` y los `tel:` / textos de `index.html` |
| Horario                    | Tabla `data-hours` en `index.html` **y** `CONFIG.hours` en `script.js` |
| Mensajes de WhatsApp       | Atributos `data-wa-es` / `data-wa-ca` de cada botón |
| Colores / tipografías      | `style.css` → `:root` |

Publicar cambios: `git add . && git commit -m "cambios" && git push`.

## Fuentes del contenido

- **Instagram @mercerieraperruqueria**: fotos, servicios (historias destacadas: Maquillatge, Núvies,
  Tractament, Tintes, Nails, Est. facial), horario de invierno, WhatsApp y teléfono 671 66 92 47.
- **Dirección C/ Les Flors, 5**: carteles publicados por el salón y ficha de Google.
- **Valoración 5,0 en Google**: ficha pública del negocio. ⚠️ Confirmar con la clienta.
- **Horario**: "Horari d'hivern" de sus historias. ⚠️ Revisar cuando cambie a horario de verano.
- Las fotos de Instagram tienen baja resolución (≈640 px). Si la clienta envía fotos originales,
  sustituirlas mejorará mucho el resultado.

© Mercè Riera Perruqueria i Estètica · Diseño web por DURDUC
