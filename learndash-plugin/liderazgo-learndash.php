<?php
/**
 * Plugin Name:       El Liderazgo que Transforma — LearnDash
 * Plugin URI:        https://github.com/josepespar/liderazgo_coma
 * Description:       Módulo narrativo de liderazgo deportivo integrado con LearnDash LMS. Crea el curso con [Ajustes → Liderazgo LD] y usa el shortcode [liderazgo_ld] en cualquier lección o página.
 * Version:           1.0.0
 * Author:            Jordi Coma / UVic
 * Text Domain:       liderazgo-ld
 * License:           GPL-2.0+
 * Requires Plugins:  sfwd-lms
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'LTQ_LD_VERSION', '1.0.0' );
define( 'LTQ_LD_DIR',     plugin_dir_path( __FILE__ ) );
define( 'LTQ_LD_URL',     plugin_dir_url( __FILE__ ) );

/* ─────────────────────────────────────────────────────────
   1. MAPEO ESCENAS → LECCIONES
───────────────────────────────────────────────────────── */
function ltq_ld_scene_definitions() {
    return array(
        'E01' => array( 'title' => 'E01 · El Primer Silencio',         'act' => 1, 'order' => 1,  'excerpt' => 'Jordi Coma entra a una sala cargada de resistencia. El liderazgo empieza antes de abrir la boca.' ),
        'E02' => array( 'title' => 'E02 · El Modelo',                  'act' => 1, 'order' => 2,  'excerpt' => 'Presentación del Modelo Multidimensional de Chelladurai: conducta requerida, preferida y real.' ),
        'E03' => array( 'title' => 'E03 · La Grieta',                  'act' => 1, 'order' => 3,  'excerpt' => 'Jack rompe el protocolo. Primera gran decisión: ¿confrontas o cedes?' ),
        'E04' => array( 'title' => 'E04 · El Umbral',                  'act' => 2, 'order' => 4,  'excerpt' => 'Cruzar hacia el territorio desconocido del liderazgo adaptativo.' ),
        'E05' => array( 'title' => 'E05 · La Prueba',                  'act' => 2, 'order' => 5,  'excerpt' => 'Primer ejercicio práctico: temperatura del grupo bajo presión real.' ),
        'E06' => array( 'title' => 'E06 · La Aliada Inesperada',       'act' => 2, 'order' => 6,  'excerpt' => 'Elena cambia de posición. Hay una grieta en la resistencia del grupo.' ),
        'E07' => array( 'title' => 'E07 · El Punto de No Retorno ★',   'act' => 2, 'order' => 7,  'excerpt' => 'La escena pivote. Todo lo aprendido converge en una sola decisión.' ),
        'E08' => array( 'title' => 'E08 · La Prueba Real',             'act' => 2, 'order' => 8,  'excerpt' => 'Evaluación de comprensión del modelo. ¿Has interiorizado los conceptos?' ),
        'E09' => array( 'title' => 'E09 · La Víspera',                 'act' => 3, 'order' => 9,  'excerpt' => 'La noche antes del partido final. Consolidación del perfil de liderazgo.' ),
        'E10' => array( 'title' => 'E10 · El Amanecer ★',              'act' => 3, 'order' => 10, 'excerpt' => 'El retorno transformado. Cierre del viaje del héroe y síntesis del modelo.' ),
    );
}

function ltq_ld_act_labels() {
    return array(
        1 => 'Acto I · Mundo Ordinario',
        2 => 'Acto II · Las Pruebas',
        3 => 'Acto III · El Retorno',
    );
}

/* ─────────────────────────────────────────────────────────
   2. CREAR CURSO LEARNDASH
───────────────────────────────────────────────────────── */
function ltq_ld_build_course() {
    if ( ! current_user_can( 'manage_options' ) ) { wp_die( 'No autorizado.' ); }
    check_admin_referer( 'ltq_ld_build_course_nonce' );

    $existing_course_id = get_option( 'ltq_ld_course_id', 0 );
    if ( $existing_course_id && get_post( $existing_course_id ) ) {
        wp_redirect( add_query_arg( array( 'page' => 'liderazgo-ld', 'msg' => 'exists' ), admin_url( 'options-general.php' ) ) );
        exit;
    }

    $course_id = wp_insert_post( array(
        'post_title'   => 'El Liderazgo que Transforma',
        'post_content' => '<p>Branching scenario interactivo sobre liderazgo deportivo basado en el Modelo Multidimensional de Chelladurai (1984).</p>\n<p>Usa el shortcode <code>[liderazgo_ld]</code> en la lección E01 para incrustar el módulo interactivo.</p>',
        'post_type'    => 'sfwd-courses',
        'post_status'  => 'publish',
    ) );

    if ( is_wp_error( $course_id ) ) {
        wp_redirect( add_query_arg( array( 'page' => 'liderazgo-ld', 'msg' => 'error_course' ), admin_url( 'options-general.php' ) ) );
        exit;
    }

    $course_meta = array(
        'sfwd-courses_course_price_type'     => 'open',
        'sfwd-courses_course_lesson_orderby' => 'post_date',
        'sfwd-courses_course_lesson_order'   => 'ASC',
        'sfwd-courses_course_points_enabled' => 1,
        'sfwd-courses_course_points'         => 100,
        'sfwd-courses_course_points_access'  => 0,
    );
    update_post_meta( $course_id, '_sfwd-courses', $course_meta );

    $scenes              = ltq_ld_scene_definitions();
    $lesson_map          = array();
    $lesson_ids_ordered  = array();

    foreach ( $scenes as $scene_id => $scene ) {
        $content   = ltq_ld_lesson_content( $scene_id, $scene );
        $lesson_id = wp_insert_post( array(
            'post_title'   => $scene['title'],
            'post_content' => $content,
            'post_excerpt' => $scene['excerpt'],
            'post_type'    => 'sfwd-lessons',
            'post_status'  => 'publish',
            'menu_order'   => $scene['order'],
        ) );
        if ( is_wp_error( $lesson_id ) ) { continue; }

        $lesson_meta = array(
            'sfwd-lessons_course'        => $course_id,
            'sfwd-lessons_lesson_order'  => $scene['order'],
            'sfwd-lessons_visible_after' => 0,
        );
        update_post_meta( $lesson_id, '_sfwd-lessons', $lesson_meta );
        update_post_meta( $lesson_id, 'course_id',    $course_id );
        update_post_meta( $lesson_id, 'ltq_scene_id', $scene_id );

        $lesson_map[ $scene_id ]   = $lesson_id;
        $lesson_ids_ordered[]      = $lesson_id;
    }

    if ( function_exists( 'learndash_course_set_steps' ) ) {
        $steps = array();
        foreach ( $lesson_ids_ordered as $lid ) {
            $steps[ $lid ] = array( 'type' => 'sfwd-lessons' );
        }
        learndash_course_set_steps( $course_id, $steps );
    } elseif ( function_exists( 'learndash_update_setting' ) ) {
        foreach ( $lesson_ids_ordered as $lid ) {
            learndash_update_setting( $lid, 'course', $course_id );
        }
    }

    update_option( 'ltq_ld_course_id',  $course_id );
    update_option( 'ltq_ld_lesson_map', $lesson_map );

    wp_redirect( add_query_arg( array( 'page' => 'liderazgo-ld', 'msg' => 'created', 'course' => $course_id ), admin_url( 'options-general.php' ) ) );
    exit;
}
add_action( 'admin_post_ltq_ld_build_course', 'ltq_ld_build_course' );

/* ─────────────────────────────────────────────────────────
   3. CONTENIDO DE CADA LECCIÓN
───────────────────────────────────────────────────────── */
function ltq_ld_lesson_content( $scene_id, $scene ) {
    $acts      = ltq_ld_act_labels();
    $act_label = isset( $acts[ $scene['act'] ] ) ? $acts[ $scene['act'] ] : '';

    if ( $scene_id === 'E01' ) {
        return '<p><em>' . esc_html( $act_label ) . '</em></p>\n<p>' . esc_html( $scene['excerpt'] ) . '</p>\n<p><strong>El módulo interactivo cubre todas las escenas de forma secuencial.</strong> Completa las actividades para avanzar automáticamente entre escenas y registrar tu progreso.</p>\n\n[liderazgo_ld altura="860px"]';
    }

    return '<p><em>' . esc_html( $act_label ) . ' · ' . esc_html( $scene_id ) . '</em></p>\n<p>' . esc_html( $scene['excerpt'] ) . '</p>\n<p>Esta lección forma parte del módulo narrativo interactivo. <a href="' . get_permalink( get_option( 'ltq_ld_course_id', 0 ) ) . '">Vuelve al inicio del módulo</a> para continuar desde donde lo dejaste.</p>';
}

/* ─────────────────────────────────────────────────────────
   4. ASSETS
───────────────────────────────────────────────────────── */
function ltq_ld_enqueue_assets() {
    global $post;
    if ( ! is_a( $post, 'WP_Post' ) ) { return; }
    if ( ! has_shortcode( $post->post_content, 'liderazgo_ld' ) ) { return; }

    $base = LTQ_LD_URL . 'assets/';
    $ver  = LTQ_LD_VERSION;

    wp_enqueue_style( 'ltq-ld-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@1,400;1,700&family=Roboto+Mono:wght@400;500&display=swap',
        array(), null );
    wp_enqueue_style( 'ltq-ld-style',    $base . 'style.css',    array( 'ltq-ld-fonts' ), $ver );
    wp_enqueue_style( 'ltq-ld-override', $base . 'ld-style.css', array( 'ltq-ld-style' ), $ver );

    wp_enqueue_script( 'ltq-ld-scorm',    $base . 'scorm-local.js', array(),                                    $ver, true );
    wp_enqueue_script( 'ltq-ld-scenario', $base . 'scenario.js',    array( 'ltq-ld-scorm' ),                    $ver, true );
    wp_enqueue_script( 'ltq-ld-bridge',   $base . 'ld-bridge.js',   array( 'jquery', 'ltq-ld-scenario' ),       $ver, true );

    wp_localize_script( 'ltq-ld-bridge', 'LTQ_LD', array(
        'ajaxUrl'   => admin_url( 'admin-ajax.php' ),
        'nonce'     => wp_create_nonce( 'ltq_ld_nonce' ),
        'courseId'  => (int) get_option( 'ltq_ld_course_id', 0 ),
        'lessonMap' => (object) get_option( 'ltq_ld_lesson_map', array() ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'ltq_ld_enqueue_assets' );

/* ─────────────────────────────────────────────────────────
   5. SHORTCODE [liderazgo_ld]
───────────────────────────────────────────────────────── */
function ltq_ld_shortcode( $atts ) {
    $atts   = shortcode_atts( array( 'altura' => '820px' ), $atts, 'liderazgo_ld' );
    $altura = esc_attr( $atts['altura'] );
    ob_start();
    ?>
    <div id="ltq-wrapper" style="min-height:<?php echo $altura; ?>; position:relative;">
      <header id="hud">
        <div id="hud-left">
          <span class="hud-label">ESCENA</span>
          <span id="hud-progress-text" class="hud-value">1 / 10</span>
          <div id="hud-progress-track"><div id="hud-progress-bar"></div></div>
        </div>
        <div id="hud-center"><span id="hud-course-title">El Liderazgo que Transforma</span></div>
        <div id="hud-right">
          <span class="hud-label">PUNTUACIÓN</span>
          <span id="hud-score" class="hud-value">0 pts</span>
        </div>
      </header>
      <div id="layout">
        <aside id="temp-sidebar">
          <span class="sidebar-label">GRUPO</span>
          <div id="temp-bar-track"><div id="temp-fill"></div></div>
          <div id="temp-info"><span id="temp-icon">🟡</span><span id="temp-label">Tenso</span></div>
        </aside>
        <main id="scene-container"></main>
        <aside id="right-panel">
          <div id="minimap">
            <span class="sidebar-label">RUTA</span>
            <div class="mm-tree">
              <div data-scene="E01" class="mm-node">E01</div><div class="mm-connector"></div>
              <div data-scene="E02" class="mm-node">E02</div><div class="mm-connector"></div>
              <div data-scene="E03" class="mm-node">E03</div>
              <div class="mm-fork">
                <div class="mm-branch-a">
                  <div data-scene="E04" class="mm-node">E04</div><div class="mm-connector"></div>
                  <div data-scene="E05" class="mm-node">E05</div>
                </div>
                <div class="mm-branch-b"><div data-scene="E03b" class="mm-node mm-branch">E03b</div></div>
              </div>
              <div class="mm-connector"></div>
              <div data-scene="E06" class="mm-node">E06</div><div class="mm-connector"></div>
              <div data-scene="E07" class="mm-node mm-star">E07★</div><div class="mm-connector"></div>
              <div data-scene="E08" class="mm-node">E08</div><div class="mm-connector"></div>
              <div data-scene="E09" class="mm-node">E09</div><div class="mm-connector"></div>
              <div data-scene="E10" class="mm-node mm-star">E10★</div>
            </div>
          </div>
          <div id="decision-tracker-block">
            <span class="sidebar-label">ÚLTIMAS DECISIONES</span>
            <div id="decision-tracker"></div>
          </div>
        </aside>
      </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'liderazgo_ld', 'ltq_ld_shortcode' );

/* ─────────────────────────────────────────────────────────
   6. CSS INLINE (HUD dentro de WP/LD)
───────────────────────────────────────────────────────── */
function ltq_ld_inline_css() {
    global $post;
    if ( ! is_a( $post, 'WP_Post' ) || ! has_shortcode( $post->post_content, 'liderazgo_ld' ) ) { return; }
    echo '<style id="ltq-ld-wp-override">
      #ltq-wrapper { position: relative; overflow: hidden; }
      #ltq-wrapper #hud { position: sticky; top: 0; z-index: 200; }
      #ltq-wrapper #layout { position: relative; }
      #ltq-wrapper #temp-sidebar, #ltq-wrapper #right-panel { position: absolute; top: 56px; bottom: 0; }
      #ltq-wrapper #temp-sidebar { left: 0; }
      #ltq-wrapper #right-panel  { right: 0; }
    </style>' . "\n";
}
add_action( 'wp_head', 'ltq_ld_inline_css' );

/* ─────────────────────────────────────────────────────────
   7. AJAX — MARCAR LECCIÓN COMPLETA
───────────────────────────────────────────────────────── */
function ltq_ld_ajax_complete_lesson() {
    check_ajax_referer( 'ltq_ld_nonce', 'nonce' );
    $lesson_id = (int) ( $_POST['lesson_id'] ?? 0 );
    $score     = (int) ( $_POST['score']     ?? 0 );
    $user_id   = get_current_user_id();
    if ( ! $lesson_id || ! $user_id ) { wp_send_json_error( 'invalid_params' ); }
    if ( get_post_type( $lesson_id ) !== 'sfwd-lessons' ) { wp_send_json_error( 'not_a_lesson' ); }
    $course_id = (int) get_option( 'ltq_ld_course_id', 0 );
    if ( function_exists( 'learndash_process_mark_complete' ) ) {
        learndash_process_mark_complete( $user_id, $lesson_id, false, $course_id );
    } else {
        update_user_meta( $user_id, 'learndash_lesson_' . $lesson_id . '_' . $course_id . '_completed', time() );
    }
    update_user_meta( $user_id, 'ltq_ld_score', $score );
    wp_send_json_success( array( 'lesson' => $lesson_id, 'score' => $score ) );
}
add_action( 'wp_ajax_ltq_ld_complete_lesson',        'ltq_ld_ajax_complete_lesson' );
add_action( 'wp_ajax_nopriv_ltq_ld_complete_lesson', 'ltq_ld_ajax_complete_lesson' );

/* ─────────────────────────────────────────────────────────
   8. AJAX — COMPLETAR CURSO
───────────────────────────────────────────────────────── */
function ltq_ld_ajax_complete_course() {
    check_ajax_referer( 'ltq_ld_nonce', 'nonce' );
    $course_id = (int) ( $_POST['course_id'] ?? 0 );
    $score     = (int) ( $_POST['score']     ?? 0 );
    $profile   = sanitize_text_field( $_POST['profile'] ?? '' );
    $badges    = sanitize_text_field( $_POST['badges']  ?? '[]' );
    $user_id   = get_current_user_id();
    if ( ! $course_id || ! $user_id ) { wp_send_json_error( 'invalid_params' ); }
    update_user_meta( $user_id, 'ltq_ld_final_score',        $score );
    update_user_meta( $user_id, 'ltq_ld_leadership_profile', $profile );
    update_user_meta( $user_id, 'ltq_ld_badges',             $badges );
    update_user_meta( $user_id, 'ltq_ld_completed_at',       time() );
    $lesson_map = get_option( 'ltq_ld_lesson_map', array() );
    if ( function_exists( 'learndash_process_mark_complete' ) ) {
        foreach ( $lesson_map as $lid ) {
            $lid = (int) $lid;
            if ( ! learndash_is_lesson_complete( $user_id, $lid, $course_id ) ) {
                learndash_process_mark_complete( $user_id, $lid, false, $course_id );
            }
        }
        learndash_process_mark_complete( $user_id, $course_id );
    }
    if ( function_exists( 'learndash_update_user_course_points' ) && $score >= 60 ) {
        learndash_update_user_course_points( $user_id, $course_id, $score );
    }
    wp_send_json_success( array( 'course' => $course_id, 'score' => $score, 'profile' => $profile ) );
}
add_action( 'wp_ajax_ltq_ld_complete_course',        'ltq_ld_ajax_complete_course' );
add_action( 'wp_ajax_nopriv_ltq_ld_complete_course', 'ltq_ld_ajax_complete_course' );

/* ─────────────────────────────────────────────────────────
   9. ELIMINAR CURSO
───────────────────────────────────────────────────────── */
function ltq_ld_delete_course() {
    if ( ! current_user_can( 'manage_options' ) ) { wp_die( 'No autorizado.' ); }
    check_admin_referer( 'ltq_ld_delete_course_nonce' );
    $course_id  = (int) get_option( 'ltq_ld_course_id', 0 );
    $lesson_map = get_option( 'ltq_ld_lesson_map', array() );
    if ( $course_id ) { wp_delete_post( $course_id, true ); }
    foreach ( $lesson_map as $lid ) { wp_delete_post( (int) $lid, true ); }
    delete_option( 'ltq_ld_course_id' );
    delete_option( 'ltq_ld_lesson_map' );
    wp_redirect( add_query_arg( array( 'page' => 'liderazgo-ld', 'msg' => 'deleted' ), admin_url( 'options-general.php' ) ) );
    exit;
}
add_action( 'admin_post_ltq_ld_delete_course', 'ltq_ld_delete_course' );

/* ─────────────────────────────────────────────────────────
   10. COLUMNAS DE USUARIO
───────────────────────────────────────────────────────── */
function ltq_ld_add_user_column( $columns ) {
    $columns['ltq_ld_profile'] = 'Perfil Liderazgo';
    $columns['ltq_ld_score']   = 'Puntuación LTQ';
    return $columns;
}
add_filter( 'manage_users_columns', 'ltq_ld_add_user_column' );

function ltq_ld_user_column_value( $value, $column_name, $user_id ) {
    if ( $column_name === 'ltq_ld_profile' ) {
        $p = get_user_meta( $user_id, 'ltq_ld_leadership_profile', true );
        return $p ? esc_html( strtoupper( $p ) ) : '—';
    }
    if ( $column_name === 'ltq_ld_score' ) {
        $s = get_user_meta( $user_id, 'ltq_ld_final_score', true );
        return $s !== '' ? (int) $s . ' pts' : '—';
    }
    return $value;
}
add_filter( 'manage_users_custom_column', 'ltq_ld_user_column_value', 10, 3 );

/* ─────────────────────────────────────────────────────────
   11. ADMIN
───────────────────────────────────────────────────────── */
function ltq_ld_admin_menu() {
    add_options_page( 'Liderazgo que Transforma — LearnDash', 'Liderazgo LD', 'manage_options', 'liderazgo-ld', 'ltq_ld_settings_page' );
}
add_action( 'admin_menu', 'ltq_ld_admin_menu' );

function ltq_ld_settings_page() {
    $course_id  = (int) get_option( 'ltq_ld_course_id', 0 );
    $lesson_map = get_option( 'ltq_ld_lesson_map', array() );
    $msg        = $_GET['msg'] ?? '';
    ?>
    <div class="wrap">
      <h1>El Liderazgo que Transforma — LearnDash</h1>
      <?php if ( $msg === 'created' ) : ?>
        <div class="notice notice-success is-dismissible"><p><strong>Curso creado correctamente.</strong>
          <?php $nc = (int)($_GET['course']??0); if($nc) printf(' <a href="%s" target="_blank">Ver →</a> | <a href="%s" target="_blank">Editar →</a>', esc_url(get_permalink($nc)), esc_url(get_edit_post_link($nc))); ?></p></div>
      <?php elseif ( $msg === 'exists' ) : ?>
        <div class="notice notice-warning is-dismissible"><p>Ya existe un curso. Elimínalo primero para regenerarlo.</p></div>
      <?php elseif ( $msg === 'deleted' ) : ?>
        <div class="notice notice-info is-dismissible"><p>Curso y lecciones eliminados.</p></div>
      <?php elseif ( $msg === 'error_course' ) : ?>
        <div class="notice notice-error"><p>Error al crear el curso. Comprueba que LearnDash está activo.</p></div>
      <?php endif; ?>
      <p>Usa <code>[liderazgo_ld]</code> en la lección E01. Parámetro opcional: <code>[liderazgo_ld altura="900px"]</code></p>
      <hr/>
      <?php if ( ! class_exists( 'SFWD_LMS' ) ) : ?>
        <div class="notice notice-error"><p><strong>LearnDash no está activo.</strong> Actívalo antes de continuar.</p></div>
      <?php endif; ?>
      <?php if ( $course_id && get_post( $course_id ) ) : ?>
        <h2>Curso existente</h2>
        <table class="widefat" style="max-width:700px"><tbody>
          <tr><th>ID del curso</th><td><?php echo $course_id; ?> (<a href="<?php echo esc_url(get_permalink($course_id)); ?>" target="_blank">Ver</a> | <a href="<?php echo esc_url(get_edit_post_link($course_id)); ?>" target="_blank">Editar</a>)</td></tr>
          <tr><th>Lecciones creadas</th><td><?php echo count($lesson_map); ?> / 10</td></tr>
        </tbody></table>
        <h3>Mapa de escenas → lecciones</h3>
        <table class="widefat" style="max-width:700px">
          <thead><tr><th>Escena</th><th>ID</th><th>Título</th><th>Editar</th></tr></thead>
          <tbody>
            <?php foreach ( $lesson_map as $sid => $lid ) : ?>
              <tr><td><code><?php echo esc_html($sid); ?></code></td><td><?php echo (int)$lid; ?></td><td><?php echo esc_html(get_the_title($lid)); ?></td><td><a href="<?php echo esc_url(get_edit_post_link($lid)); ?>" target="_blank">Editar</a></td></tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        <br/>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" onsubmit="return confirm('¿Eliminar curso y lecciones?');">
          <?php wp_nonce_field( 'ltq_ld_delete_course_nonce' ); ?>
          <input type="hidden" name="action" value="ltq_ld_delete_course">
          <button type="submit" class="button button-secondary" style="color:#c00;">Eliminar curso y lecciones</button>
        </form>
      <?php else : ?>
        <h2>Crear curso LearnDash</h2>
        <p>Genera automáticamente el curso con 10 lecciones y la estructura de navegación.</p>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
          <?php wp_nonce_field( 'ltq_ld_build_course_nonce' ); ?>
          <input type="hidden" name="action" value="ltq_ld_build_course">
          <button type="submit" class="button button-primary button-large">Crear curso «El Liderazgo que Transforma»</button>
        </form>
      <?php endif; ?>
      <hr/>
      <h2>Notas de uso</h2>
      <ul>
        <li>El módulo interactivo se incrusta con <code>[liderazgo_ld]</code> en la lección E01.</li>
        <li>Cada vez que el alumno avanza de escena, la lección LD correspondiente se marca completada vía AJAX.</li>
        <li>Al finalizar E10, el curso entero se marca como superado y la puntuación queda en los metadatos del usuario.</li>
        <li>El progreso de sesión se guarda en localStorage. Las lecciones LD permanecen marcadas aunque el alumno cambie de dispositivo.</li>
        <li>Compatible con LearnDash 3.x y 4.x.</li>
      </ul>
    </div>
    <?php
}
