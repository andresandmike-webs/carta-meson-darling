// JS mínimo y sin dependencias: platos que aparecen, marca de sección que sigue la lectura,
// vapor de la cazuela (firma), «qué menú hay hoy» y botón de animaciones. Sin JS la carta se ve entera.
(function () {
  'use strict';

  var cl = document.documentElement.classList;
  var reducir = cl.contains('sin-mov') || (!cl.contains('mov') && !!window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hayIO = 'IntersectionObserver' in window;

  // ---- Platos que aparecen al llegar (escalonados dentro de cada lista)
  document.querySelectorAll('.platos, .menus').forEach(function (lista) {
    Array.prototype.forEach.call(lista.querySelectorAll('.rev'), function (el, i) { el.style.setProperty('--n', Math.min(i, 6)); });
  });
  var revelables = document.querySelectorAll('.rev');
  if (hayIO) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('vis'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    revelables.forEach(function (el) { io.observe(el); });
  } else {
    revelables.forEach(function (el) { el.classList.add('vis'); });
  }

  // ---- Barra de secciones: marca la sección que se está leyendo (aria-current) y desliza la marca
  var pista = document.querySelector('.secciones-pista');
  var marca = document.querySelector('.secciones-marca');
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('.secciones a'));
  var partes = enlaces.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var actual = -1;
  var colocar = function (i) {
    if (!marca || i < 0) return;
    var a = enlaces[i];
    var izq = a.offsetLeft + (i === 0 ? 0 : parseFloat(getComputedStyle(a).paddingLeft));
    var ancho = a.offsetWidth - (i === 0 ? 0 : parseFloat(getComputedStyle(a).paddingLeft)) - parseFloat(getComputedStyle(a).paddingRight);
    marca.style.setProperty('--x', izq + 'px');
    marca.style.setProperty('--w', (ancho / 100).toFixed(3));
    // Si la barra no cabe (móvil estrecho), mantiene a la vista el enlace activo
    if (pista && (izq < pista.scrollLeft || izq + ancho > pista.scrollLeft + pista.clientWidth)) {
      pista.scrollTo({ left: Math.max(0, izq - 24), behavior: reducir ? 'auto' : 'smooth' });
    }
  };
  var activar = function (i) {
    if (i === actual) return;
    actual = i;
    enlaces.forEach(function (a, k) { if (k === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    colocar(i);
  };
  var calcular = function () {
    var linea = window.innerHeight * 0.35, elegido = -1;
    partes.forEach(function (p, k) { if (p && p.getBoundingClientRect().top <= linea) elegido = k; });
    activar(elegido);
  };
  if (partes.every(Boolean)) {
    var pendiente = false;
    window.addEventListener('scroll', function () {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(function () { pendiente = false; calcular(); });
    }, { passive: true });
    window.addEventListener('resize', function () { var k = actual; actual = -1; activar(k); calcular(); });
    calcular();
    // Al saltar a una sección con el teclado, el foco va a su título para seguir leyendo desde ahí
    enlaces.forEach(function (a, k) {
      a.addEventListener('click', function () {
        var h = partes[k].querySelector('h2');
        if (h) { h.setAttribute('tabindex', '-1'); setTimeout(function () { h.focus({ preventScroll: true }); }, reducir ? 0 : 450); }
      });
    });
  }

  // ---- Firma: vapor de la cazuela. Color desde --firma-a. Pausa fuera de pantalla; quieta con movimiento reducido.
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var iniciarVapor = function (c) {
    var cfg = { n: 7, r: [14, 30], vx: [-0.08, 0.08], vy: [-0.45, -0.18], sway: 0.18, a: [0.04, 0.1], xs: [0.32, 0.68] };
    var ctx = c.getContext('2d');
    var color = (getComputedStyle(c).getPropertyValue('--firma-a') || '').trim();
    ctx.fillStyle = '#010203'; ctx.fillStyle = color;
    if (ctx.fillStyle === '#010203') color = 'rgb(243,234,214)';
    var sprite = document.createElement('canvas'); sprite.width = sprite.height = 64;
    var sc = sprite.getContext('2d'), gr = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    sc.fillStyle = gr; sc.fillRect(0, 0, 64, 64);
    sc.globalCompositeOperation = 'source-in'; sc.fillStyle = color; sc.fillRect(0, 0, 64, 64);

    var W = 0, H = 0, ps = [], visible = true, raf = 0;
    var nueva = function (ini) {
      var p = { r: rnd(cfg.r[0], cfg.r[1]), vx: rnd(cfg.vx[0], cfg.vx[1]), vy: rnd(cfg.vy[0], cfg.vy[1]), a: rnd(cfg.a[0], cfg.a[1]), t: rnd(0, 6.28) };
      p.x = rnd(cfg.xs[0] * W, cfg.xs[1] * W);
      p.y = ini ? rnd(0, H) : H + 8;
      return p;
    };
    var medir = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = c.clientWidth; H = c.clientHeight;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(60, Math.max(8, Math.round(W / cfg.n)));
      while (ps.length < n) ps.push(nueva(true));
      ps.length = n;
    };
    var pintar = function (mover) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        if (mover) {
          p.t += 0.015; p.x += p.vx + Math.sin(p.t) * cfg.sway; p.y += p.vy;
          if (p.y < -40 || p.x < -60 || p.x > W + 60) ps[i] = p = nueva(false);
        }
        var k = Math.max(0, Math.min(1, p.y / H)), r = p.r * (1 + (1 - k) * 1.6);
        ctx.globalAlpha = p.a * Math.sin(Math.PI * k);
        ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
    };
    var bucle = function () {
      if (!visible || document.hidden) { raf = 0; return; }
      pintar(true);
      raf = requestAnimationFrame(bucle);
    };
    var arrancar = function () { if (!raf && !reducir) raf = requestAnimationFrame(bucle); };
    medir();
    pintar(false);
    if (!reducir) {
      if (hayIO) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) arrancar(); }).observe(c);
      document.addEventListener('visibilitychange', arrancar);
      arrancar();
    }
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { medir(); if (reducir) pintar(false); }, 150); });
  };
  var lienzo = document.querySelector('canvas[data-firma="vapor"]');
  if (lienzo && lienzo.getContext) iniciarVapor(lienzo);

  // ---- Qué menú hay hoy (hora de Madrid). Mantener igual que cliente.md.
  // Día: 0 = domingo … 6 = sábado. Lunes y miércoles cerrado.
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var CLAVES = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  try {
    var p = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short' }).formatToParts(new Date())
      .forEach(function (x) { p[x.type] = x.value; });
    var hoy = CLAVES[p.weekday], texto;
    if (hoy === 1 || hoy === 3) texto = 'Hoy, ' + DIAS[hoy] + ', el mesón cierra. Te esperamos otro día.';
    else if (hoy === 6 || hoy === 0) texto = 'Hoy, ' + DIAS[hoy] + ', hay <strong>menú de fin de semana a 24,50 €</strong>.';
    else texto = 'Hoy, ' + DIAS[hoy] + ', hay <strong>menú del día a 14,90 €</strong>.';
    var aviso = document.getElementById('hoy');
    if (aviso) aviso.innerHTML = texto;
    document.querySelectorAll('.menu-tarjeta[data-dias]').forEach(function (t) {
      if (t.getAttribute('data-dias').split(',').indexOf(String(hoy)) > -1) {
        t.classList.add('hoy-toca');
        var m = document.createElement('span'); m.className = 'hoy-marca'; m.textContent = 'hoy';
        t.appendChild(m);
      }
    });
  } catch (e) { /* sin Intl: se queda el texto por defecto */ }

  // ---- Botón «Animaciones»: recuerda la elección del visitante en su navegador (solo esa preferencia, sin cookies)
  var bm = document.querySelector('.mov-boton');
  if (bm) {
    bm.setAttribute('aria-pressed', String(!reducir));
    bm.textContent = 'Animaciones: ' + (reducir ? 'desactivadas' : 'activadas');
    bm.addEventListener('click', function () {
      try { localStorage.setItem('mov', reducir ? 'si' : 'no'); } catch (e) {}
      location.reload();
    });
  }
})();
