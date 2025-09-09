document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Mobile menu toggle
  // =========================
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const body = document.body;

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    body.classList.add('no-scroll');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });
  }

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // =========================
  // Tap-to-reveal for services (mobile)
  // =========================
  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.service-item').forEach(i => i.classList.remove('active'));
      item.classList.toggle('active');
    });
  });

  // =========================
  // Scroll animations (Intersection Observer)
  // =========================
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
        observer.unobserve(entry.target); // run once
      }
    });
  }, { threshold: 0.2 });

  // Target all animated elements
  document.querySelectorAll(".fade-up, .fade-in, .scale-up, .heading-bounce").forEach(el => {
    observer.observe(el);
  });
});
