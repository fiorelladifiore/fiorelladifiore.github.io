(function () {
  var SUPPORTED = ['es', 'en'];
  var cache = {};

  function storedLang() {
    try { return localStorage.getItem('lang'); } catch (e) { return null; }
  }

  function initialLang() {
    var s = storedLang();
    if (SUPPORTED.indexOf(s) !== -1) return s;
    return (navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : 'es';
  }

  function load(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch('i18n/' + lang + '.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { cache[lang] = d; return d; });
  }

  function apply(lang, dict) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.dataset.i18n];
      if (v) el.textContent = v;
    });
    if (dict['meta.title']) document.title = dict['meta.title'];
    var desc = document.querySelector('meta[name="description"]');
    if (desc && dict['meta.description']) desc.content = dict['meta.description'];
    var cv = document.getElementById('cv-link');
    if (cv) cv.href = 'assets/fiorellaDiFioreCV_' + lang.toUpperCase() + '.pdf';
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = lang === 'es' ? 'EN' : 'ES';
      btn.setAttribute('aria-label', lang === 'es' ? 'Change language to English' : 'Cambiar idioma a español');
    }
  }

  function setLang(lang) {
    return load(lang).then(function (dict) {
      apply(lang, dict);
      window.currentLang = lang;
      try { localStorage.setItem('lang', lang); } catch (e) {}
      document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
    }).catch(function (e) { console.error('i18n error', e); });
  }

  window.currentLang = initialLang();
  window.setLang = setLang;

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.addEventListener('click', function () {
      setLang(window.currentLang === 'es' ? 'en' : 'es');
    });
    setLang(window.currentLang);
  });
})();
