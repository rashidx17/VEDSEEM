    // Mobile menu toggle script
    (function () {
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

      hamburger && hamburger.addEventListener('click', function (e) {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        if (expanded) closeMenu(); else openMenu();
      });

      mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

      // close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
          closeMenu();
        }
      });

      // click outside to close (on overlay)
      mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) closeMenu();
      });
    })();





    // Enable tap-to-reveal on mobile
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('click', () => {
    // Remove active from others
    document.querySelectorAll('.service-item').forEach(i => i.classList.remove('active'));
    item.classList.toggle('active');
  });
});
