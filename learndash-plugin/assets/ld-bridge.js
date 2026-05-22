/* ld-bridge.js — Conecta el motor narrativo con LearnDash vía AJAX.
   Requiere: jQuery (WP), LTQ_LD (localizado desde PHP), scenario.js con LTQ_HOOKS. */
(function ($) {
  'use strict';

  if (typeof LTQ_LD === 'undefined') { return; }

  window.LTQ_HOOKS = {

    /**
     * Disparo al avanzar de escena: marca la lección LD de fromScene como completada.
     * @param {string} fromScene  Escena recién completada
     * @param {string} toScene    Escena de destino
     * @param {object} state      Objeto STATE del motor
     */
    onSceneChange: function (fromScene, toScene, state) {
      var lessonId = LTQ_LD.lessonMap[fromScene];
      if (!lessonId || !LTQ_LD.courseId) { return; }

      $.post(LTQ_LD.ajaxUrl, {
        action   : 'ltq_ld_complete_lesson',
        lesson_id: lessonId,
        scene_id : fromScene,
        score    : state.score,
        nonce    : LTQ_LD.nonce
      }).fail(function () { /* silencioso */ });

      /* Actualizar barra de progreso LD si está visible en la página */
      var pct = Math.round((state.canonicalProgress / 10) * 100);
      var ldBar = document.querySelector('.learndash-wrapper .ld-progress-bar-percentage');
      if (ldBar) { ldBar.style.width = pct + '%'; }
    },

    /**
     * Disparo al llegar a la pantalla de resultados: marca el curso completo.
     * @param {object} state  Objeto STATE del motor
     */
    onComplete: function (state) {
      if (!LTQ_LD.courseId) { return; }

      $.post(LTQ_LD.ajaxUrl, {
        action    : 'ltq_ld_complete_course',
        course_id : LTQ_LD.courseId,
        score     : state.score,
        profile   : state.leadershipProfile,
        badges    : JSON.stringify(state.badgesUnlocked || []),
        nonce     : LTQ_LD.nonce
      }).fail(function () { /* silencioso */ });
    }
  };

}(jQuery));
