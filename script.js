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




// ---------------- Page 4 video autoplay + toggle ----------------
(function setupPage4Video() {
  const video = document.getElementById("page4-video");
  const btn = document.getElementById("page4-play");
  if (!video || !btn) return;

  video.muted = true; // required for autoplay

  // Try autoplay
  const attempt = video.play();
  if (attempt !== undefined) {
    attempt.then(() => {
      // autoplay success → hide button
      btn.classList.add("playing");
    }).catch(() => {
      // autoplay blocked → keep button visible
      btn.classList.remove("playing");
    });
  }

  // Toggle on click
  function togglePlay() {
    if (video.paused) {
      video.play().then(() => {
        btn.classList.add("playing");
      }).catch(() => {});
    } else {
      video.pause();
      btn.classList.remove("playing");
    }
  }

  btn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  // Keep button in sync if user presses keyboard controls
  video.addEventListener("pause", () => btn.classList.remove("playing"));
  video.addEventListener("play", () => btn.classList.add("playing"));
})();


// Page 4 scroll-triggered animations
document.addEventListener("DOMContentLoaded", () => {
  const page4 = document.querySelector(".page4");
  if (!page4) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          page4.classList.add("in-view");
          observer.unobserve(page4); // trigger once
        }
      });
    },
    { threshold: 0.3 } // 30% visible before triggering
  );

  observer.observe(page4);
});


