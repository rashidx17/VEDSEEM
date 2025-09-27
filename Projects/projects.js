// Mobile menu toggle
      (function () {
        const hamburger = document.querySelector(".hamburger");
        const mobileMenu = document.getElementById("mobile-menu");
        const mobileMenuInner = document.querySelector(".mobile-menu-inner");
        const body = document.body;
        let previouslyFocused = null;

        function openMenu() {
          previouslyFocused = document.activeElement;
          mobileMenu.classList.add("open");
          hamburger.classList.add("is-active");
          hamburger.setAttribute("aria-expanded", "true");
          mobileMenu.setAttribute("aria-hidden", "false");
          body.style.overflow = "hidden";
          const focusable = mobileMenuInner.querySelectorAll(
            'a,button,[tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length) focusable[0].focus();
          document.addEventListener("keydown", onKey);
        }

        function closeMenu() {
          mobileMenu.classList.remove("open");
          hamburger.classList.remove("is-active");
          hamburger.setAttribute("aria-expanded", "false");
          mobileMenu.setAttribute("aria-hidden", "true");
          body.style.overflow = "";
          document.removeEventListener("keydown", onKey);
          if (
            previouslyFocused &&
            typeof previouslyFocused.focus === "function"
          )
            previouslyFocused.focus();
        }

        function onKey(e) {
          if (e.key === "Escape") {
            closeMenu();
          }
          if (e.key === "Tab") {
            const focusable = Array.from(
              mobileMenuInner.querySelectorAll(
                'a,button,[tabindex]:not([tabindex="-1"])'
              )
            ).filter((el) => el.offsetParent !== null);
            if (focusable.length === 0) {
              e.preventDefault();
              return;
            }
            const first = focusable[0],
              last = focusable[focusable.length - 1];
            if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          }
        }

        if (hamburger) {
          hamburger.addEventListener("click", () => {
            const expanded = hamburger.getAttribute("aria-expanded") === "true";
            expanded ? closeMenu() : openMenu();
          });
        }

        if (mobileMenu) {
          mobileMenu.addEventListener("click", (e) => {
            if (e.target === mobileMenu) closeMenu();
          });
        }
      })();

      // Reveal on scroll animations
      const reveals = document.querySelectorAll(".reveal");

      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              observer.unobserve(entry.target); // trigger only once
            }
          });
        },
        { threshold: 0.2 }
      );

      reveals.forEach((r) => observer.observe(r));



      (function () {
    // Small, dependency-free reveal script for the discuss + footer block.
    document.addEventListener('DOMContentLoaded', () => {
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;

          // reveal the container
          el.classList.add('appear');

          // reveal direct children with a small timing stagger
          const children = Array.from(el.querySelectorAll('h2, p, a, .footer-link, .social-btn, .contact-item, .policy-link, .copyright'));
          children.forEach((c, i) => {
            if (prefersReduced) {
              c.classList.add('appear');
            } else {
              // add slight stagger
              setTimeout(() => c.classList.add('appear'), 80 * (i + 1));
            }
          });

          obs.unobserve(el);
        });
      }, { threshold: 0.12 });

      const discuss = document.querySelector('.discuss-section');
      const footer = document.querySelector('.site-footer');
      if (discuss) revealObserver.observe(discuss);
      if (footer) revealObserver.observe(footer);

      // If reduced motion, show immediately
      if (prefersReduced) {
        if (discuss) discuss.classList.add('appear');
        if (footer) footer.classList.add('appear');
        document.querySelectorAll('.discuss-content h2, .discuss-content p, .discuss-cta, .footer-nav a, .footer-socials a, .footer-contacts .contact-item, .footer-policies a, .footer-bottom-row .copyright')
          .forEach(el => el.classList.add('appear'));
      }
    });
  })();




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