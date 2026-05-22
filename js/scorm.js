/* scorm.js — SCORM 1.2 API wrapper */
(function (global) {
  'use strict';

  var API = null;
  var initialized = false;

  function findAPI(win) {
    var tries = 0;
    while (win.API == null && win.parent != null && win.parent !== win && tries < 10) {
      tries++;
      win = win.parent;
    }
    return win.API || null;
  }

  function getAPI() {
    if (API) return API;
    API = findAPI(window);
    if (!API && window.opener) API = findAPI(window.opener);
    return API;
  }

  function LMSInitialize() {
    var api = getAPI();
    if (!api) { initialized = true; return true; }
    var result = api.LMSInitialize('');
    initialized = (result === 'true' || result === true);
    return initialized;
  }

  function LMSFinish() {
    var api = getAPI();
    if (!api) return true;
    return api.LMSFinish('') === 'true';
  }

  function LMSGetValue(name) {
    var api = getAPI();
    if (!api) return '';
    return api.LMSGetValue(name);
  }

  function LMSSetValue(name, value) {
    var api = getAPI();
    if (!api) return true;
    return api.LMSSetValue(name, String(value)) === 'true';
  }

  function LMSCommit() {
    var api = getAPI();
    if (!api) return true;
    return api.LMSCommit('') === 'true';
  }

  /* ── High-level helpers ── */

  function saveState(stateObj) {
    LMSSetValue('cmi.suspend_data', JSON.stringify(stateObj));
    LMSSetValue('cmi.core.score.raw', String(stateObj.score || 0));
    var score = stateObj.score || 0;
    var status = score >= 60 ? 'passed' : (stateObj.completed ? 'failed' : 'incomplete');
    LMSSetValue('cmi.core.lesson_status', status);
    LMSCommit();
  }

  function loadState() {
    var raw = LMSGetValue('cmi.suspend_data');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  global.SCORM = {
    initialize: LMSInitialize,
    finish: LMSFinish,
    getValue: LMSGetValue,
    setValue: LMSSetValue,
    commit: LMSCommit,
    saveState: saveState,
    loadState: loadState
  };

}(window));
