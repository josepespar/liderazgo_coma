/* scorm-local.js — SCORM API emulada con localStorage */
(function (global) {
  'use strict';
  var KEY = 'ltq_scorm_state';
  global.SCORM = {
    initialize: function () { return true; },
    finish:     function () { return true; },
    getValue:   function () { return ''; },
    setValue:   function () { return true; },
    commit:     function () { return true; },
    saveState: function (stateObj) {
      try { localStorage.setItem(KEY, JSON.stringify(stateObj)); } catch (e) {}
    },
    loadState: function () {
      try {
        var raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    }
  };
}(window));