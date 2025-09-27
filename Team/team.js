// Small JS: reveal (IntersectionObserver) + accessible mobile menu
document.addEventListener('DOMContentLoaded', () => {
// Reveal simple elements
const io = new IntersectionObserver((entries, obs) => {
entries.forEach(e => {
if (!e.isIntersecting) return;
e.target.classList.add('appear');
obs.unobserve(e.target);
});
}, {threshold:0.18});


document.querySelectorAll('.fade-up, .scale-up').forEach(el => io.observe(el));


// Mobile menu behavior (basic accessible trap)
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileInner = document.querySelector('.mobile-menu-inner');
const body = document.body;


function openMenu(){
hamburger.classList.add('is-active');
hamburger.setAttribute('aria-expanded','true');
mobileMenu.classList.add('open');
mobileMenu.setAttribute('aria-hidden','false');
body.classList.add('no-scroll');
// focus
const first = mobileInner.querySelector('a');
if(first) first.focus();
document.addEventListener('keydown', onKey);
}
function closeMenu(){
hamburger.classList.remove('is-active');
hamburger.setAttribute('aria-expanded','false');
mobileMenu.classList.remove('open');
mobileMenu.setAttribute('aria-hidden','true');
body.classList.remove('no-scroll');
document.removeEventListener('keydown', onKey);
hamburger.focus();
}
function onKey(e){
if(e.key === 'Escape') closeMenu();
}


if(hamburger){
hamburger.addEventListener('click', ()=>{
const expanded = hamburger.getAttribute('aria-expanded') === 'true';
expanded ? closeMenu() : openMenu();
});
}


// close on outside click
mobileMenu.addEventListener('click', (ev)=>{ if (ev.target === mobileMenu) closeMenu(); });
});





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



