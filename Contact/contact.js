document.addEventListener("DOMContentLoaded", () => {
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
});



/* --- Advanced contact form behavior --- */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // simple validation example (name or email required)
      const email = contactForm.email.value.trim();
      const firstName = contactForm.firstName.value.trim();
      const message = contactForm.message.value.trim();

      if (!email || (!firstName && !message)) {
        status.textContent = 'Please enter your name or email and a short message.';
        status.style.color = '#f1c0c0';
        return;
      }

      // fake send animation / feedback
      const btn = contactForm.querySelector('.btn-primary');
      btn.disabled = true;
      btn.style.opacity = '0.9';
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending...';

      setTimeout(() => {
        btn.innerHTML = 'Sent ✓';
        status.textContent = 'Thanks — your message has been received. We will contact you soon.';
        status.style.color = 'rgba(255,255,255,0.9)';
        contactForm.reset();

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalText;
          status.textContent = '';
        }, 2200);
      }, 850);
    });
  }

  // optional: country select autofill effect (no external libs)
  const phone = document.getElementById('phone');
  const country = document.getElementById('country');
  if (country && phone) {
    country.addEventListener('change', () => {
      // ensure phone field starts with selected code hint (not enforced)
      if (!phone.value.trim().startsWith(country.value)) {
        phone.placeholder = country.value + '  Phone Number';
      }
    });
  }
});


/* --- Scroll reveal animations --- */
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(
    ".fade-slide-up, .fade-slide-left, .fade-slide-right"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          // optional: unobserve so it triggers only once
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
});



function loco() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
}
loco();




/* Prevent the browser from restoring the previous scroll on reload */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

/* When page is unloaded, ensure position recorded is top (safer for some browsers) */
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

/* On load, force scroll to top.
   If you use LocomotiveScroll, try to call its scrollTo method too (examples below). */
window.addEventListener('load', () => {
  // plain page: jump to top
  window.scrollTo(0, 0);

  // if you initialize LocomotiveScroll in script.js and expose the instance
  // try one of these (uncomment the one that matches your code):

  // common var names:
  // if you stored the instance as `locoScroll`:
  // if (window.locoScroll && typeof window.locoScroll.scrollTo === 'function') {
  //   window.locoScroll.scrollTo(0, { offset: 0 });
  // }

  // if you stored instance as `scroll`:
  // if (window.scroll && typeof window.scroll.scrollTo === 'function') {
  //   window.scroll.scrollTo(0);
  // }

  // fallback: small timeout then window.scrollTo in case the scroller hijacks immediate scroll
  setTimeout(() => window.scrollTo(0, 0), 40);
});
