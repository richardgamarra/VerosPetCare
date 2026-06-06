/* ============================================================
   VERO'S PET CARE — main.js
   Vanilla JS · defer · no dependencies
   ============================================================ */

/* ---- Mobile nav ---- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ---- Active nav link ---- */
(function () {
  const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const path  = window.location.pathname.replace(/\/$/, '') || '/';
  links.forEach(function (link) {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path || (path === '/' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* ---- Theme toggle ---- */
(function () {
  var toggleBtns = document.querySelectorAll('.theme-toggle');
  if (!toggleBtns.length) return;

  var stored = localStorage.getItem('vpc_theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var currentTheme = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(currentTheme);
      localStorage.setItem('vpc_theme', currentTheme);
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    toggleBtns.forEach(function (btn) {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }
})();

/* ---- Language toggle ---- */
(function () {
  const toggleBtns = document.querySelectorAll('.lang-toggle');
  if (!toggleBtns.length) return;

  let currentLang = localStorage.getItem('vpc_lang') || 'en';
  applyLang(currentLang);

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      currentLang = currentLang === 'en' ? 'es' : 'en';
      applyLang(currentLang);
      localStorage.setItem('vpc_lang', currentLang);
    });
  });

  function applyLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    toggleBtns.forEach(function (btn) {
      btn.textContent = lang === 'en' ? '🌐 ES' : '🌐 EN';
      btn.setAttribute('aria-label', lang === 'en' ? 'Cambiar a Español' : 'Switch to English');
    });
    // Swap data-en / data-es text nodes
    document.querySelectorAll('[data-en]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang) || el.getAttribute('data-en');
    });
  }
})();

/* ---- Cookie consent ---- */
(function () {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const consent = localStorage.getItem('vpc_cookie');
  if (!consent) {
    banner.style.display = 'flex';
  } else if (consent === 'accepted') {
    initAnalytics();
  }

  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (acceptBtn) acceptBtn.addEventListener('click', function () { setCookieConsent('accepted'); });
  if (declineBtn) declineBtn.addEventListener('click', function () { setCookieConsent('declined'); });

  function setCookieConsent(choice) {
    localStorage.setItem('vpc_cookie', choice);
    banner.style.display = 'none';
    if (choice === 'accepted') initAnalytics();
  }

  function initAnalytics() {
    // GA4 — fires only after cookie consent
    var s1 = document.createElement('script');
    s1.async = true;
    s1.src = 'https://www.googletagmanager.com/gtag/js?id=[REPLACE: G-XXXXXXXXXX]';
    document.head.appendChild(s1);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '[REPLACE: G-XXXXXXXXXX]');
  }
})();

/* ---- FAQ accordion ---- */
(function () {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      // Close all
      document.querySelectorAll('.faq-item.is-open').forEach(function (el) {
        el.classList.remove('is-open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ---- Intersection Observer: fade-in on scroll ---- */
(function () {
  if (!('IntersectionObserver' in window)) return;

  var style = document.createElement('style');
  style.textContent = '.fade-in{opacity:0;transform:translateY(20px);transition:opacity .55s ease,transform .55s ease}.fade-in.visible{opacity:1;transform:none}';
  document.head.appendChild(style);

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.service-card,.testimonial-card,.step,.dog-profile-card,.service-full-card,.value-card,.gallery-item,.credential-item').forEach(function (el) {
    el.classList.add('fade-in');
    observer.observe(el);
  });
})();

/* ---- Booking form validation ---- */
(function () {
  var form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var isValid = true;

    var fields = [
      { id: 'owner-name',  errId: 'err-owner-name',  msg: 'Please enter your name.',         test: function(v){ return v.length > 0; } },
      { id: 'email',       errId: 'err-email',        msg: 'Please enter a valid email.',      test: function(v){ return /^[^@]+@[^@]+\.[^@]+$/.test(v); } },
      { id: 'phone',       errId: 'err-phone',        msg: 'Please enter your phone number.',  test: function(v){ return v.length > 0; } },
      { id: 'dog-name',    errId: 'err-dog-name',     msg: "Please enter your dog's name.",    test: function(v){ return v.length > 0; } },
      { id: 'service',     errId: 'err-service',      msg: 'Please select a service.',         test: function(v){ return v !== ''; } },
      { id: 'date',        errId: 'err-date',         msg: 'Please select a preferred date.',  test: function(v){ return v.length > 0; } }
    ];

    fields.forEach(function (f) {
      var el  = document.getElementById(f.id);
      var err = document.getElementById(f.errId);
      if (!el || !err) return;
      if (!f.test(el.value.trim())) {
        err.textContent = f.msg;
        isValid = false;
      } else {
        err.textContent = '';
      }
    });

    if (isValid) {
      var feedback = document.getElementById('form-feedback');
      if (feedback) {
        feedback.style.color = 'var(--clr-secondary)';
        feedback.textContent = '✓ Sending your request...';
      }
      form.submit();
    }
  });
})();

/* ---- Dog of the Month auto-slider ---- */
(function () {
  var slides = document.querySelectorAll('.dotm-slide');
  var dots   = document.querySelectorAll('.dotm-dot');
  if (!slides.length || slides.length <= 1) return;
  var current = 0;
  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }
  dots.forEach(function (dot, i) { dot.addEventListener('click', function () { goTo(i); }); });
  setInterval(function () { goTo(current + 1); }, 5000);
})();

/* ---- Clients Gallery: pagination + lightbox ---- */
(function () {
  var pages    = document.querySelectorAll('.gallery-page');
  if (!pages.length) return;

  var prevBtn  = document.querySelector('.pag-prev');
  var nextBtn  = document.querySelector('.pag-next');
  var pagNums  = document.querySelectorAll('.pag-num');
  var section  = document.querySelector('.clients-gallery-section');
  var current  = 0;

  /* flat list of all photos across all pages for lightbox */
  var allPhotos = [];
  pages.forEach(function (page) {
    page.querySelectorAll('.clients-photo img').forEach(function (img) {
      allPhotos.push(img);
    });
  });

  function showPage(n) {
    pages[current].classList.remove('active');
    current = n;
    pages[current].classList.add('active');
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === pages.length - 1;
    pagNums.forEach(function (el) { el.textContent = current + 1; });
    if (section) window.scrollTo({ top: section.offsetTop - 80, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', function () { if (current > 0) showPage(current - 1); });
  nextBtn.addEventListener('click', function () { if (current < pages.length - 1) showPage(current + 1); });

  /* lightbox */
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  var lbImg    = lightbox.querySelector('.lightbox-img');
  var lbPrev   = lightbox.querySelector('.lightbox-prev');
  var lbNext   = lightbox.querySelector('.lightbox-next');
  var lbClose  = lightbox.querySelector('.lightbox-close');
  var curIdx   = 0;

  function openLightbox(idx) {
    curIdx = idx;
    lbImg.src = allPhotos[idx].src;
    lbImg.alt = allPhotos[idx].alt;
    lbPrev.disabled = idx === 0;
    lbNext.disabled = idx === allPhotos.length - 1;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.clients-photo').forEach(function (photo, i) {
    photo.addEventListener('click', function () { openLightbox(i); });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () { if (curIdx > 0) openLightbox(curIdx - 1); });
  lbNext.addEventListener('click', function () { if (curIdx < allPhotos.length - 1) openLightbox(curIdx + 1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft'  && curIdx > 0) openLightbox(curIdx - 1);
    if (e.key === 'ArrowRight' && curIdx < allPhotos.length - 1) openLightbox(curIdx + 1);
  });
})();

/* ---- Hero Slider ---- */
(function () {
  var slider = document.querySelector('.hero-slider');
  if (!slider) return;
  var slides = slider.querySelectorAll('.hero-slide');
  var dots   = slider.querySelectorAll('.slider-dot');
  var current = 0;
  var timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function startAuto() { timer = setInterval(function () { goTo(current + 1); }, 5000); }
  function stopAuto()  { clearInterval(timer); }

  slider.querySelector('.slider-prev').addEventListener('click', function () { stopAuto(); goTo(current - 1); startAuto(); });
  slider.querySelector('.slider-next').addEventListener('click', function () { stopAuto(); goTo(current + 1); startAuto(); });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { stopAuto(); goTo(i); startAuto(); });
  });
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  startAuto();
})();
