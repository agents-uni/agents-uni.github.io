// Agents Uni — Interactions

document.addEventListener('DOMContentLoaded', () => {
  initFadeInObserver();
  initStatCounters();
  initTypewriter();
  initSmoothScroll();
  initArchSvgInteractions();
  initMobileMenuListeners();
});

// ─── Scroll-triggered fade-in ───

function initFadeInObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
}

// ─── Copy to clipboard ───

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.opacity = '1';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.opacity = '';
    }, 1500);
  });
}

// ─── Mobile menu ───

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  menu.classList.toggle('open');
}

function initMobileMenuListeners() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;

  // Close menu when a link is clicked
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 640 && menu.classList.contains('open')) {
      menu.classList.remove('open');
    }
  });
}

// ─── Animated counters ───

function initStatCounters() {
  const statElements = document.querySelectorAll('.stat-number');
  if (statElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  statElements.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (isNaN(target)) return;

  const duration = 1500;
  const startTime = performance.now();

  function tick(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

// ─── Typewriter effect ───

function initTypewriter() {
  const el = document.querySelector('.typewriter');
  if (!el) return;

  const fullText = el.getAttribute('data-text') || el.textContent;
  el.textContent = '';
  el.style.visibility = 'visible';

  let charIndex = 0;
  const speed = 60;

  function type() {
    if (charIndex < fullText.length) {
      el.textContent += fullText.charAt(charIndex);
      charIndex++;
      setTimeout(type, speed);
    } else {
      el.classList.add('done');
    }
  }

  // Start typewriter when element scrolls into view, or immediately if visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          type();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(el);
}

// ─── Smooth scroll for anchor links ───

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ─── Architecture SVG hover interactions ───

function initArchSvgInteractions() {
  const archNodes = document.querySelectorAll('.arch-node');
  const archLines = document.querySelectorAll('.arch-line');

  if (archNodes.length === 0) return;

  archNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      const connectedTo = node.getAttribute('data-connects');
      if (!connectedTo) return;

      const connectedIds = connectedTo.split(',').map((id) => id.trim());

      // Highlight connected nodes
      archNodes.forEach((n) => {
        if (connectedIds.includes(n.id) || n === node) {
          n.classList.add('highlighted');
        }
      });

      // Highlight connected lines
      archLines.forEach((line) => {
        const lineFrom = line.getAttribute('data-from');
        const lineTo = line.getAttribute('data-to');
        if (
          (lineFrom === node.id && connectedIds.includes(lineTo)) ||
          (lineTo === node.id && connectedIds.includes(lineFrom))
        ) {
          line.classList.add('highlighted');
        }
      });
    });

    node.addEventListener('mouseleave', () => {
      archNodes.forEach((n) => n.classList.remove('highlighted'));
      archLines.forEach((l) => l.classList.remove('highlighted'));
    });
  });
}
