document.addEventListener("DOMContentLoaded", () => {
  /* ===========================
     IntersectionObserver + sequencing
     =========================== */

  // Core observer callback: adds .appear and sequences image pop after text appear
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      el.classList.add("appear");

      // If it's a story/mission text block, sequence the image pop AFTER text transition
      if (el.classList.contains('animate-from-left') || el.classList.contains('animate-from-right')) {
        const section = el.closest('.story-mission-section');
        if (section) {
          const art = section.querySelector('.section-art');
          if (art) {
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reduced) {
              art.classList.add('appear');
            } else {
              // Use transitionend on the text element, fallback timeout if needed
              let handled = false;

              const onTransitionEnd = (ev) => {
                // Make sure we only react to transitionend from the element itself
                if (ev.target !== el) return;
                if (handled) return;
                handled = true;
                art.classList.add('appear');
                el.removeEventListener('transitionend', onTransitionEnd);
              };

              el.addEventListener('transitionend', onTransitionEnd);

              // Fallback delay (slightly longer than the CSS text transition)
              const fallbackDelay = 460; // ms — adjust if text transition timing changes
              const fallbackTimer = setTimeout(() => {
                if (!handled) {
                  handled = true;
                  art.classList.add('appear');
                  el.removeEventListener('transitionend', onTransitionEnd);
                }
              }, fallbackDelay);

              // Clear fallback once art animation finishes (cleanup)
              art.addEventListener('animationend', () => clearTimeout(fallbackTimer), { once: true });
            }
          }
        }
      }

      // For other elements we just show and unobserve
      obs.unobserve(el);
    });
  }, { threshold: 0.18 }); // slightly lower threshold for smoother timing

  // Observe all animation-related classes
document.querySelectorAll(
  ".fade-up, .fade-in, .scale-up, .animate-from-left, .animate-from-right, .founder-photo img, .name-badge, .bio-card, .founders-title" 
).forEach(el => observer.observe(el));

document.querySelectorAll(
  ".fade-up, .fade-in, .scale-up, " +
  ".discuss-section, .discuss-content h2, .discuss-content p, .discuss-cta, " +
  ".site-footer, .footer-nav a, .footer-socials a, .footer-contacts .contact-item, .footer-policies a, .footer-bottom-row .copyright"
).forEach(el => observer.observe(el));



  /* ===========================
     Mobile Hamburger / Menu (accessible)
     =========================== */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuInner = document.querySelector('.mobile-menu-inner');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const body = document.body;

  // Focus trap selectors
  const FOCUSABLE_SELECTORS = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  let previouslyFocused = null;

  function openMenu() {
    previouslyFocused = document.activeElement;
    mobileMenu.classList.add('open');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    body.classList.add('no-scroll');

    // focus the first focusable element inside menu
    const focusable = mobileMenuInner.querySelectorAll(FOCUSABLE_SELECTORS);
    if (focusable.length) {
      focusable[0].focus();
    } else {
      // ensure inner container is focusable as a fallback
      mobileMenuInner.setAttribute('tabindex', '-1');
      mobileMenuInner.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');

    document.removeEventListener('keydown', handleKeyDown);

    // restore previously focused element
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  }

  function handleKeyDown(e) {
    // Close on Escape
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeMenu();
      return;
    }

    // Trap focus
    if (e.key === 'Tab') {
      const focusable = Array.from(mobileMenuInner.querySelectorAll(FOCUSABLE_SELECTORS))
        .filter(el => el.offsetParent !== null); // only visible elements

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });
  }

  // Close menu when a mobile link is clicked
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close when clicking outside the inner menu
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });
  }

  /* ===========================
     Optional: Improve initial visibility for images when user prefers reduced motion
     (ensures they don't remain hidden)
     =========================== */
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.section-art').forEach(img => img.classList.add('appear'));
  }

  /* ===========================
     End of script
     =========================== */
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





// Split each paragraph into spans
document.querySelectorAll(".section-text p").forEach((para) => {
  let clutter = "";
  para.textContent.split("").forEach((char) => {
    clutter += `<span>${char}</span>`;
  });
  para.innerHTML = clutter;

  // Create a GSAP animation for each paragraph separately
  gsap.to(para.querySelectorAll("span"), {
    scrollTrigger: {
      trigger: para,           // <-- animate paragraph independently
      start: "top 85%",        // adjust when to start
      end: "bottom 70%",       // adjust end for smoother flow
      scroller: "#main",       // locomotive scroller
      scrub: 0.5,
    },
    stagger: 0.02,             // each character slightly delayed
    color: "#fff",
    opacity: 1,
    ease: "power2.out",
  });
});
