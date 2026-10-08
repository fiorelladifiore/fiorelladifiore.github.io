(function () {
  var root = document.documentElement;

  document.getElementById('year').textContent = new Date().getFullYear();

  // Tema claro/oscuro
  document.getElementById('theme-toggle').addEventListener('click', function () {
    var current = root.dataset.theme ||
      'light';
    var next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Menú móvil
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
