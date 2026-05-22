<?php
/**
 * Plugin Name:       El Liderazgo que Transforma
 * Plugin URI:        https://github.com/josepespar/liderazgo_coma
 * Description:       Branching scenario interactivo sobre liderazgo deportivo basado en el Modelo Multidimensional de Chelladurai. Usa el shortcode [liderazgo_coma] en cualquier página o entrada.
 * Version:           1.0.0
 * Author:            Jordi Coma / UVic
 * Text Domain:       liderazgo-coma
 * License:           GPL-2.0+
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function ltq_enqueue_assets() {
    global $post;
    if ( is_a( $post, 'WP_Post' ) && ! has_shortcode( $post->post_content, 'liderazgo_coma' ) ) {
        return;
    }
    $base = plugin_dir_url( __FILE__ ) . 'assets/';
    $ver  = '1.0.0';
    wp_enqueue_style( 'ltq-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@1,400;1,700&family=Roboto+Mono:wght@400;500&display=swap', array(), null );
    wp_enqueue_style( 'ltq-style', $base . 'style.css', array( 'ltq-fonts' ), $ver );
    wp_enqueue_script( 'ltq-scorm', $base . 'scorm-local.js', array(), $ver, true );
    wp_enqueue_script( 'ltq-scenario', $base . 'scenario.js', array( 'ltq-scorm' ), $ver, true );
}
add_action( 'wp_enqueue_scripts', 'ltq_enqueue_assets' );

function ltq_shortcode( $atts ) {
    $atts = shortcode_atts( array( 'altura' => '820px' ), $atts, 'liderazgo_coma' );
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
add_shortcode( 'liderazgo_coma', 'ltq_shortcode' );

function ltq_inline_css() {
    global $post;
    if ( ! is_a( $post, 'WP_Post' ) || ! has_shortcode( $post->post_content, 'liderazgo_coma' ) ) return;
    echo '<style id="ltq-wp-override">
      #ltq-wrapper { position: relative; overflow: hidden; }
      #ltq-wrapper #hud { position: sticky; top: 0; z-index: 100; }
      #ltq-wrapper #layout { position: relative; }
      #ltq-wrapper #temp-sidebar, #ltq-wrapper #right-panel { position: absolute; top: 56px; bottom: 0; }
      #ltq-wrapper #temp-sidebar { left: 0; }
      #ltq-wrapper #right-panel  { right: 0; }
    </style>' . "\n";
}
add_action( 'wp_head', 'ltq_inline_css' );

function ltq_admin_menu() {
    add_options_page( 'Liderazgo que Transforma', 'Liderazgo Coma', 'manage_options', 'liderazgo-coma', 'ltq_settings_page' );
}
add_action( 'admin_menu', 'ltq_admin_menu' );

function ltq_settings_page() { ?>
    <div class="wrap">
      <h1>El Liderazgo que Transforma</h1>
      <p>Shortcode: <code>[liderazgo_coma]</code> — con altura personalizable: <code>[liderazgo_coma altura="900px"]</code></p>
      <hr/><h2>Notas</h2>
      <ul>
        <li>El progreso se guarda en el <strong>localStorage</strong> del navegador del usuario.</li>
        <li>No requiere plugins SCORM adicionales.</li>
        <li>Compatible con Gutenberg, Elementor y cualquier page builder.</li>
      </ul>
    </div><?php
}