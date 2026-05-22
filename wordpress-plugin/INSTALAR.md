# El Liderazgo que Transforma — Plugin WordPress

## Descargar los archivos

Necesitas 4 archivos. Descárgalos desde esta misma carpeta de GitHub:

```
wordpress-plugin/
├── liderazgo-coma.php          ← descarga este
├── assets/
│   ├── scorm-local.js          ← descarga este
│   ├── style.css               ← descarga desde: css/style.css (raíz del repo)
│   └── scenario.js             ← descarga desde: js/scenario.js (raíz del repo)
```

## Crear el ZIP para WordPress

1. Crea una carpeta llamada `liderazgo-coma`
2. Pon dentro el archivo `liderazgo-coma.php`
3. Crea dentro una subcarpeta `assets/`
4. Pon dentro de `assets/` los 3 archivos: `scorm-local.js`, `style.css`, `scenario.js`
5. Comprime la carpeta `liderazgo-coma` como ZIP

Estructura final del ZIP:
```
liderazgo-coma/
├── liderazgo-coma.php
└── assets/
    ├── scorm-local.js
    ├── style.css
    └── scenario.js
```

## Instalar en WordPress

1. WordPress Admin → **Plugins → Añadir nuevo → Subir plugin**
2. Sube el ZIP → **Instalar ahora → Activar**
3. Ve a la página donde quieres el módulo
4. Añade el shortcode: `[liderazgo_coma]`
5. Altura personalizable: `[liderazgo_coma altura="900px"]`

## Alternativa rápida: standalone.html

Si no quieres instalar el plugin, descarga el archivo `standalone.html`
(está en la raíz del repositorio). Ábrelo directamente en el navegador
o súbelo a cualquier hosting y accede con una URL.
