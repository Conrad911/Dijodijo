/* Dijodijo — advanced animation layer */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Stagger indexes for siblings of reveal groups */
  [".menu-grid", ".gallery-grid", ".steps", ".location-card"].forEach(function (sel) {
    var parent = $(sel);
    if (!parent) return;
    Array.prototype.slice.call(parent.children).forEach(function (el, i) { el.style.setProperty("--i", i); });
  });

  var foot = $(".site-footer");
  if (foot) {
    if (!reduce && "IntersectionObserver" in window) {
      var fo = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { foot.classList.add("in"); fo.disconnect(); }
      }, { threshold: 0.15 });
      fo.observe(foot);
    } else { foot.classList.add("in"); }
  }

  if (reduce) return;

  /* Scroll progress bar + hero parallax (single rAF-throttled handler) */
  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  var heroImg = $(".hero-img img");
  var ticking = false;
  function frame() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    if (heroImg && y < window.innerHeight * 1.2) {
      heroImg.style.translate = "0 " + (y * 0.12).toFixed(1) + "px";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  frame();

  /* Split hero title into letters */
  var h1 = $(".hero h1");
  if (h1) {
    var text = h1.textContent;
    h1.setAttribute("aria-label", text);
    h1.textContent = "";
    text.split("").forEach(function (ch, i) {
      var s = document.createElement("span");
      s.className = "h1-letter";
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--i", i);
      s.textContent = ch;
      h1.appendChild(s);
    });
  }

  /* Rising embers in hero */
  var hero = $(".hero");
  if (hero) {
    var box = document.createElement("div");
    box.className = "embers";
    box.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 18; i++) {
      var e = document.createElement("span");
      e.className = "ember";
      e.style.setProperty("--x", (Math.random() * 100).toFixed(1) + "%");
      e.style.setProperty("--s", (3 + Math.random() * 6).toFixed(1) + "px");
      e.style.setProperty("--t", (7 + Math.random() * 8).toFixed(1) + "s");
      e.style.setProperty("--dl", (-Math.random() * 12).toFixed(1) + "s");
      e.style.setProperty("--dx", ((Math.random() - .5) * 120).toFixed(0) + "px");
      box.appendChild(e);
    }
    hero.appendChild(box);
    var cue = document.createElement("span");
    cue.className = "scroll-cue";
    cue.setAttribute("aria-hidden", "true");
    hero.appendChild(cue);
  }

  /* Count-up prices */
  function countUp(el) {
    var m = el.textContent.match(/^(\D*)(\d+)(.*)$/);
    if (!m) return;
    var pre = m[1], end = parseInt(m[2], 10), post = m[3], start = null, dur = 1100;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(end * eased) + post;
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = pre + "0" + post;
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var po = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); po.unobserve(en.target); }
      });
    }, { threshold: 0.8 });
    $$(".price").forEach(function (p) { po.observe(p); });

    /* Scroll-spy for nav */
    var links = $$('.nav-links a[href^="#"]:not(.btn)');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("active"); });
        var a = map[en.target.id];
        if (a) a.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) so.observe(sec);
    });
  }

  if (!fine) return;

  /* 3D tilt + glare on cards and gallery tiles */
  $$(".menu-card, .tile").forEach(function (card) {
    /* enable tilt only on first hover, after the reveal transition has played */
    card.addEventListener("pointerenter", function () {
      if (card.classList.contains("in")) card.classList.add("tilt");
    });
    card.addEventListener("pointermove", function (ev) {
      if (!card.classList.contains("tilt")) return;
      var r = card.getBoundingClientRect();
      var px = (ev.clientX - r.left) / r.width;
      var py = (ev.clientY - r.top) / r.height;
      card.style.setProperty("--ry", ((px - .5) * 10).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((.5 - py) * 8).toFixed(2) + "deg");
      card.style.setProperty("--ty", "-6px");
      card.style.setProperty("--gx", (px * 100).toFixed(0) + "%");
      card.style.setProperty("--gy", (py * 100).toFixed(0) + "%");
      card.classList.add("tilting");
    });
    card.addEventListener("pointerleave", function () {
      card.classList.remove("tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--ty", "0");
    });
  });

  /* Magnetic buttons */
  $$(".btn-lg, .hero-cta .btn, .nav-links .btn").forEach(function (b) {
    b.classList.add("magnetic");
    b.addEventListener("pointermove", function (ev) {
      var r = b.getBoundingClientRect();
      var dx = (ev.clientX - (r.left + r.width / 2)) * 0.22;
      var dy = (ev.clientY - (r.top + r.height / 2)) * 0.3;
      b.style.transform = "translate(" + dx.toFixed(1) + "px," + (dy - 2).toFixed(1) + "px)";
    });
    b.addEventListener("pointerleave", function () { b.style.transform = ""; });
  });
})();
