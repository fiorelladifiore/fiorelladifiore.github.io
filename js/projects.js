(function () {
  var projects = null;
  var dict = {};

  function t(key, fallback) { return dict[key] || fallback; }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function link(href, label) {
    var a = el('a', null, label + ' ↗');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    return a;
  }

  function card(p, lang) {
    var c = p[lang] || p.es;
    var article = el('article', 'card project');

    var bar = el('div', 'project-bar');
    var dots = el('div', 'dots');
    for (var i = 0; i < 3; i++) dots.appendChild(el('i'));
    bar.appendChild(dots);
    bar.appendChild(el('span', null, '~/projects/' + (p.file || 'proyecto')));
    article.appendChild(bar);

    if (p.image) {
      var img = el('img');
      img.src = p.image;
      img.alt = c.title;
      img.loading = 'lazy';
      article.appendChild(img);
    }

    var body = el('div', 'project-body');
    if (p.status) {
      body.appendChild(el('span', 'status status-' + p.status, t('status.' + p.status, p.status)));
    }
    body.appendChild(el('h3', null, c.title));
    body.appendChild(el('p', 'project-desc', c.description));
    if (c.role) {
      var role = el('p', 'project-role');
      role.appendChild(el('strong', null, t('projects.role', 'Rol') + ': '));
      role.appendChild(document.createTextNode(c.role));
      body.appendChild(role);
    }
    var tags = el('ul', 'tags');
    p.stack.forEach(function (s) { tags.appendChild(el('li', null, s)); });
    body.appendChild(tags);

    var links = el('div', 'project-links');
    if (p.repo) links.appendChild(link(p.repo, 'code'));
    else if (p.repoPrivate) links.appendChild(el('span', 'private', t('projects.private', 'repo privado')));
    if (p.demo) links.appendChild(link(p.demo, 'demo'));
    if (links.childNodes.length) body.appendChild(links);

    article.appendChild(body);
    return article;
  }

  function render(lang) {
    if (!projects) return;
    ['work', 'academic'].forEach(function (group) {
      var grid = document.getElementById('projects-' + group);
      if (!grid) return;
      grid.textContent = '';
      projects.filter(function (p) { return p.group === group; })
        .forEach(function (p) { grid.appendChild(card(p, lang)); });
    });
  }

  function load(lang) {
    // El diccionario lo carga i18n.js; lo pedimos de nuevo (queda en caché del navegador)
    return fetch('i18n/' + lang + '.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { dict = d; render(lang); });
  }

  fetch('data/projects.json')
    .then(function (r) { return r.json(); })
    .then(function (d) { projects = d; return load(window.currentLang || 'es'); })
    .catch(function (e) { console.error('projects error', e); });

  document.addEventListener('langchange', function (e) { load(e.detail); });
})();
