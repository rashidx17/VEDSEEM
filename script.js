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
  document.querySelectorAll(".fade-up, .fade-in, .scale-up, .heading-bounce ").forEach(el => {
    observer.observe(el);
  });

  document.querySelectorAll(
  ".fade-up, .fade-in, .scale-up, " +
  ".discuss-section, .discuss-content h2, .discuss-content p, .discuss-cta, " +
  ".site-footer, .footer-nav a, .footer-socials a, .footer-contacts .contact-item, .footer-policies a, .footer-bottom-row .copyright"
).forEach(el => observer.observe(el));

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


// Animate circles left -> right when in viewport
const circleObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // stagger effect: delay based on index
      const circles = entry.target.querySelectorAll('.circle');
      circles.forEach((circle, index) => {
        setTimeout(() => {
          circle.classList.add('show');
        }, index * 250); // 0.25s delay per circle
      });
      observer.unobserve(entry.target); // run once
    }
  });
}, { threshold: 0.3 });

// Observe the circles container
const circlesSection = document.querySelector('.why-choose .circles');
if (circlesSection) {
  circleObserver.observe(circlesSection);
}



// Tap-to-reveal for services (only above 768px)
if (window.innerWidth > 768) {
  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.service-item').forEach(i => i.classList.remove('active'));
      item.classList.toggle('active');
    });
  });
}


// simple IntersectionObserver to reveal founder cards in sequence
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('founders');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.founder-card'));
  const io = new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();

    // add section-level class (optional)
    section.classList.add('revealed');

    // stagger per card
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.style.transitionDelay = `${i * 140}ms`;
        card.classList.add('visible');   // class not required — CSS uses section.revealed for showing
      }, i * 180);
    });
  }, {threshold: 0.22});

  io.observe(section);
});





// For smooth scroll 
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



/* process-timeline.js
   Vanilla JS process/timeline animation:
   - Animates .timeline-line height
   - Reveals each .checkpoint .content only after:
       1) line reached the checkpoint
       2) the checkpoint is visible in viewport (with timeout fallback)
   - No GSAP. Uses requestAnimationFrame + IntersectionObserver.
   - Insert before </body> or in your script.js at the end.
*/

(function () {
  // CONFIG
  const LINE_ANIM_MS = 600;       // duration for each line stretch (ms)
  const PAUSE_BETWEEN_MS = 220;   // pause after revealing each step (ms)
  const VISIBILITY_THRESHOLD = 0.12; // intersection threshold when waiting for card visibility
  const VISIBILITY_TIMEOUT = 4500;   // timeout (ms) to force reveal if element never comes into view

  // Elements
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  const line = timeline.querySelector('.timeline-line');
  const checkpoints = Array.from(timeline.querySelectorAll('.checkpoint'));

  if (!line || !checkpoints.length) return;

  // If CSS hides the line (e.g. mobile media query), don't try to animate.
  const computedLineStyle = window.getComputedStyle(line);
  if (computedLineStyle.display === 'none' || computedLineStyle.visibility === 'hidden') {
    return;
  }

  // Add minimal reveal CSS fallback in case it's not present in your stylesheet.
  if (!document.getElementById('proc-tl-inline-style')) {
    const style = document.createElement('style');
    style.id = 'proc-tl-inline-style';
    style.textContent = `
      .checkpoint .content { opacity: 0; transform: translateY(24px); transition: opacity .55s cubic-bezier(.2,.9,.25,1), transform .55s cubic-bezier(.2,.9,.25,1); will-change: opacity, transform; }
      .checkpoint .content.show { opacity: 1; transform: translateY(0); }
      /* if your CSS uses a static ::before line, hide it while animating to avoid doubling.
         You may adapt the selector if your static line is different. */
      .timeline.animated::before { display: none !important; visibility: hidden !important; }
    `;
    document.head.appendChild(style);
  }

  // Helper: compute vertical target positions (px) measured from top of timeline element
  function computeTargets() {
    const timelineRect = timeline.getBoundingClientRect();
    // For accuracy, read fresh bounding rects of checkpoints
    return checkpoints.map(cp => {
      const cpRect = cp.getBoundingClientRect();
      const centerFromTimelineTop = (cpRect.top - timelineRect.top) + cpRect.height / 2;
      // Clamp to at least a small amount so tiny checks don't produce 0
      return Math.max(8, Math.round(centerFromTimelineTop));
    });
  }

  // Easing (easeOutCubic)
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Animate the line's height from current to target (px). Returns Promise resolved when done.
  function animateLineTo(targetPx, duration = LINE_ANIM_MS) {
    return new Promise(resolve => {
      // ensure target is number
      targetPx = Number(targetPx) || 0;
      const startHeight = parseFloat(getComputedStyle(line).height) || 0;
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const tRaw = Math.min(1, elapsed / duration);
        const t = easeOutCubic(tRaw);
        const current = startHeight + (targetPx - startHeight) * t;
        line.style.height = `${current}px`;
        if (tRaw < 1) {
          requestAnimationFrame(step);
        } else {
          // finalize exact height
          line.style.height = `${targetPx}px`;
          resolve();
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Wait until element is visible in viewport (threshold fraction) or timeout expires.
  function waitForVisibility(el, threshold = VISIBILITY_THRESHOLD, timeout = VISIBILITY_TIMEOUT) {
    return new Promise((resolve) => {
      // Quick heuristic: if some part is already within viewport bounds, resolve immediately.
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        resolve(true);
        return;
      }

      let resolved = false;
      const obs = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!resolved) {
              resolved = true;
              obs.disconnect();
              resolve(true);
            }
            break;
          }
        }
      }, { threshold });

      obs.observe(el);

      const to = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          obs.disconnect();
          resolve(false);
        }
      }, timeout);
    });
  }

  // Reveal content inside checkpoint by adding .show (after it's visible)
  async function revealWhenVisible(index) {
    const cp = checkpoints[index];
    if (!cp) return;
    const content = cp.querySelector('.content');
    // wait for visibility (or timeout). We DO wait; that means line animation will pause here.
    await waitForVisibility(cp, VISIBILITY_THRESHOLD, VISIBILITY_TIMEOUT);
    if (content) content.classList.add('show');
  }

  // Main sequence runner (runs sequentially)
  async function runSequence() {
    // mark timeline as animated so any CSS static line can be hidden (fallback)
    timeline.classList.add('animated');

    // initial line zero height
    line.style.height = '0px';

    // recompute targets now that fonts/images/layout settled
    const targets = computeTargets();

    for (let i = 0; i < targets.length; i++) {
      const target = Math.max(12, targets[i]); // ensure nonzero reasonable target
      // animate line to checkpoint center
      await animateLineTo(target, LINE_ANIM_MS);
      // reveal the card only when it becomes visible (or after timeout)
      await revealWhenVisible(i);
      // brief pause for feel
      await new Promise(r => setTimeout(r, PAUSE_BETWEEN_MS));
    }

    // final extend: grow to timeline full height (so line reaches bottom)
    const timelineFull = Math.max(parseFloat(line.style.height || 0), timeline.scrollHeight || timeline.offsetHeight);
    await animateLineTo(timelineFull, Math.round(LINE_ANIM_MS * 0.8));
  }

  // Only start the sequence once the timeline becomes visible in the viewport
  const startObserver = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        obs.disconnect(); // run only once
        // slight delay to allow layout to settle (images/fonts)
        setTimeout(() => {
          // run sequence, catch errors
          runSequence().catch(err => {
            console.error('Process timeline animation error:', err);
          });
        }, 120);
        break;
      }
    }
  }, { threshold: 0.22 });

  startObserver.observe(timeline);

  // Recalculate targets on resize/orientationchange BEFORE animation starts.
  let resized = false;
  window.addEventListener('resize', () => {
    resized = true;
    // if animation hasn't started yet, reset the line height to 0 so next compute is correct
    if (!timeline.classList.contains('animated')) {
      line.style.height = '0px';
    }
    // debounce
    clearTimeout(window._proc_tl_resize_to);
    window._proc_tl_resize_to = setTimeout(() => {
      resized = false;
    }, 180);
  });

  // safety: if user wants the line to move even when content hidden on purpose,
  // you can change behavior — but the above waits for visibility before revealing.
})();



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



// Testimonials carousel slider
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".testimonials-track");
  const cards = Array.from(track.querySelectorAll(".testimonial-card"));
  const prevBtn = document.querySelector(".test-nav.prev");
  const nextBtn = document.querySelector(".test-nav.next");

  let index = 0; // leftmost visible card
  const visibleCount = 3;
  const cardWidth = cards[0].offsetWidth + 36; // width + gap

  function updateClasses() {
    cards.forEach(c => c.classList.remove("active","inactive"));
    // mark visible window
    for (let i=0; i<visibleCount; i++) {
      const card = cards[index+i];
      if (!card) continue;
      if (i === 1) card.classList.add("active"); // center
      else card.classList.add("inactive"); // sides
    }
  }

  function updateTrack() {
    track.style.transform = `translateX(-${index * cardWidth}px)`;
    updateClasses();
  }

  nextBtn.addEventListener("click", () => {
    if (index < cards.length - visibleCount) {
      index++;
    } else {
      index = 0; // loop back
    }
    updateTrack();
  });

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
    } else {
      index = cards.length - visibleCount; // loop to end
    }
    updateTrack();
  });

  // initial setup
  updateTrack();
});





// PROJECT 
var nextBtn = document.querySelector('.next'),
    prevBtn = document.querySelector('.prev'),
    carousel = document.querySelector('.carousel'),
    list = document.querySelector('.list'), 
    item = document.querySelectorAll('.item'),
    runningTime = document.querySelector('.carousel .timeRunning') 

let timeRunning = 3000 
let timeAutoNext = 7000

nextBtn.onclick = function(){
    showSlider('next')
}

prevBtn.onclick = function(){
    showSlider('prev')
}

let runTimeOut 

let runNextAuto = setTimeout(() => {
    nextBtn.click()
}, timeAutoNext)


function resetTimeAnimation() {
    runningTime.style.animation = 'none'
    runningTime.offsetHeight /* trigger reflow */
    runningTime.style.animation = null 
    runningTime.style.animation = 'runningTime 7s linear 1 forwards'
}


function showSlider(type) {
    let sliderItemsDom = list.querySelectorAll('.carousel .list .item')
    if(type === 'next'){
        list.appendChild(sliderItemsDom[0])
        carousel.classList.add('next')
    } else{
        list.prepend(sliderItemsDom[sliderItemsDom.length - 1])
        carousel.classList.add('prev')
    }

    clearTimeout(runTimeOut)

    runTimeOut = setTimeout( () => {
        carousel.classList.remove('next')
        carousel.classList.remove('prev')
    }, timeRunning)


    clearTimeout(runNextAuto)
    runNextAuto = setTimeout(() => {
        nextBtn.click()
    }, timeAutoNext)

    resetTimeAnimation() // Reset the running time animation
}

// Start the initial animation 
resetTimeAnimation()
// END 












