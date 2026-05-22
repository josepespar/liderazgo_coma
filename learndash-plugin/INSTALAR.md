# El Liderazgo que Transforma — Plugin LearnDash

## Requisitos

- WordPress 5.8+
- LearnDash LMS 3.x o 4.x (plugin activo)
- PHP 7.4+

## Instalación

1. Descarga la carpeta `learndash-plugin/` completa
2. Comprímela como `liderazgo-learndash.zip` (la carpeta debe llamarse `liderazgo-learndash`)
3. En WordPress Admin → Plugins → Añadir nuevo → Subir plugin
4. Activa el plugin **El Liderazgo que Transforma — LearnDash**

## Crear el curso

1. Ve a **Ajustes → Liderazgo LD**
2. Pulsa **«Crear curso El Liderazgo que Transforma»**
3. El plugin generará:
   - 1 curso `sfwd-courses`
   - 10 lecciones `sfwd-lessons` (E01–E10)
   - La lección E01 contiene el shortcode `[liderazgo_ld altura="860px"]`

## Cómo funciona

| Acción del alumno | Lo que ocurre en LearnDash |
|---|---|
| Completa la actividad de E01 | Lección 1 marcada como completada (AJAX) |
| Avanza a E02, E03… | Cada lección anterior se marca completa |
| Llega a la pantalla final (E10) | Todas las lecciones + el curso marcados como superados |
| Puntuación ≥ 60 | Se asignan los puntos del curso (si LD Points está activo) |

## Datos guardados en user meta

| Meta key | Contenido |
|---|---|
| `ltq_ld_final_score` | Puntuación final (0–100) |
| `ltq_ld_leadership_profile` | `transformacional` / `situacional` / `correctivo` / `reactivo` |
| `ltq_ld_badges` | JSON array de badges desbloqueados |
| `ltq_ld_completed_at` | Timestamp Unix de finalización |

## Shortcode

```
[liderazgo_ld]                    → altura por defecto 820px
[liderazgo_ld altura="900px"]     → altura personalizada
```

## Notas

- El progreso de sesión se guarda en `localStorage` del navegador.
- Las lecciones LD permanecen marcadas aunque el alumno borre la caché.
- Compatible con Elementor, Gutenberg y cualquier page builder.
- El botón "Marcar como completado" de LD se oculta automáticamente en la lección E01.
