/* ===================================================
   LUMINA — Main JS
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll ─────────────────────────────── */
  const nav = document.querySelector('.nav');
  const scrollTopBtn = document.querySelector('.scroll-top');

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    scrollTopBtn?.classList.toggle('visible', y > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Mobile menu ────────────────────────────────── */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Scroll reveal (Intersection Observer) ──────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));

  /* ── Testimonials carousel ──────────────────────── */
  const track = document.querySelector('.testimonials__track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-btn--prev');
  const nextBtn = document.querySelector('.carousel-btn--next');

  let current = 0;
  const total = slides.length;

  const goTo = (index) => {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Auto-play
  let autoplay = setInterval(() => goTo(current + 1), 5500);
  track?.parentElement?.addEventListener('mouseenter', () => clearInterval(autoplay));
  track?.parentElement?.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 5500);
  });

  // Touch/swipe support
  let touchStartX = 0;
  track?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  track?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });

  goTo(0);

  /* ── Counter animation ──────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(c => counterObserver.observe(c));

  /* ── Smooth scroll for anchor links ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Form submission ─────────────────────────────── */
  const form = document.querySelector('.contact__form--full');
  form?.addEventListener('submit', e => {
    e.preventDefault();

    // Basic required field check
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.classList.remove('cform__input--error');
      if (!field.value.trim()) {
        field.classList.add('cform__input--error');
        valid = false;
      }
    });
    if (!valid) return;

    const btn  = form.querySelector('.cform__btn');
    const success = form.querySelector('.cform__success');

    btn.disabled = true;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin .7s linear infinite" aria-hidden="true"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-dasharray="28" stroke-dashoffset="28"/></svg>
      Enviando...
    `;

    // Simulate send (replace with real endpoint)
    setTimeout(() => {
      form.querySelectorAll('.cform__input, .cform__select, .cform__textarea').forEach(f => f.value = '');
      form.querySelectorAll('.cform__chip input').forEach(c => c.checked = false);
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      btn.disabled = false;
      btn.innerHTML = `Enviar Mensagem <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>`;
      setTimeout(() => { success.hidden = true; }, 6000);
    }, 1400);
  });

  // Remove error highlight on input
  form?.addEventListener('input', e => {
    e.target.classList.remove('cform__input--error');
  });

});
