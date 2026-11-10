(function () {
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  var year = document.getElementById("yr");
  if (year) year.textContent = String(new Date().getFullYear());

  function setOpen(open) {
    if (!toggle || !links) return;
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      setOpen(!links.classList.contains("open"));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
  }

  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  var items = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var lb = document.querySelector(".lightbox");
  if (!lb || !items.length) return;

  var lbImg = lb.querySelector("img");
  var btnClose = lb.querySelector(".lb-close");
  var btnPrev = lb.querySelector(".lb-prev");
  var btnNext = lb.querySelector(".lb-next");
  var index = 0;
  var lastFocus = null;

  function srcOf(el) { return el.getAttribute("href"); }
  function altOf(el) {
    var img = el.querySelector("img");
    return (img && img.getAttribute("alt")) || "";
  }

  function uniqueItems() {
    var seen = {};
    return items.filter(function (el) {
      var src = srcOf(el);
      if (seen[src]) return false;
      seen[src] = true;
      return true;
    });
  }

  var gallery = uniqueItems();

  function show(i) {
    if (!gallery.length) return;
    index = (i + gallery.length) % gallery.length;
    var el = gallery[index];
    lbImg.src = srcOf(el);
    lbImg.alt = altOf(el);
  }

  function open(el) {
    var i = gallery.indexOf(el);
    if (i < 0) {
      var src = srcOf(el);
      i = gallery.findIndex(function (g) { return srcOf(g) === src; });
    }
    lastFocus = document.activeElement;
    show(i < 0 ? 0 : i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }

  function close() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  items.forEach(function (el) {
    el.addEventListener("click", function (ev) {
      ev.preventDefault();
      open(el);
    });
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", function () { show(index - 1); });
  btnNext.addEventListener("click", function () { show(index + 1); });
  lb.addEventListener("click", function (ev) { if (ev.target === lb) close(); });

  document.addEventListener("keydown", function (ev) {
    if (lb.hidden) return;
    if (ev.key === "Escape") close();
    if (ev.key === "ArrowLeft") show(index - 1);
    if (ev.key === "ArrowRight") show(index + 1);
  });
})();
