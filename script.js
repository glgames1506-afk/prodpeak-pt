/* ========================================
   PRODPEAK BLOG — JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 60) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    // Back to top button
    if (scrollY > 600) {
      backToTop.classList.add('back-to-top--visible');
    } else {
      backToTop.classList.remove('back-to-top--visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Back to top ──
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Mobile nav toggle ──
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('navbar__links--open');
      // Animate hamburger
      const spans = navToggle.querySelectorAll('span');
      navToggle.classList.toggle('active');
      if (navLinks.classList.contains('navbar__links--open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('navbar__links--open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ── Scroll reveal animations ──
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Newsletter form handler ──
  const newsletterForms = document.querySelectorAll('#newsletter-form, #sidebar-newsletter-form');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      if (emailInput.value) {
        submitBtn.textContent = '✓ Subscribed!';
        submitBtn.style.background = '#22c55e';
        emailInput.value = '';
        emailInput.disabled = true;
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          emailInput.disabled = false;
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // ── Active Table of Contents tracking ──
  const tocLinks = document.querySelectorAll('.sidebar-toc__item');
  
  if (tocLinks.length > 0) {
    const sections = [];
    tocLinks.forEach(link => {
      const id = link.getAttribute('href');
      if (id && id.startsWith('#')) {
        const section = document.querySelector(id);
        if (section) sections.push({ el: section, link: link });
      }
    });

    const updateToc = () => {
      const scrollPos = window.scrollY + 120;
      
      let current = sections[0];
      sections.forEach(s => {
        if (s.el.offsetTop <= scrollPos) {
          current = s;
        }
      });

      tocLinks.forEach(l => l.classList.remove('sidebar-toc__item--active'));
      if (current) current.link.classList.add('sidebar-toc__item--active');
    };

    window.addEventListener('scroll', updateToc, { passive: true });
    updateToc();
  }

  // ── Animated counter for hero stats ──
  const statValues = document.querySelectorAll('.hero__stat-value');
  
  const animateCounter = (el) => {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[0]);
    const suffix = text.replace(match[0], '').trim();
    const prefix = text.substring(0, text.indexOf(match[0]));
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      
      el.textContent = prefix + value.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  if (statValues.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statValues.forEach(el => statsObserver.observe(el));
  }

  // ── Card hover tilt effect ──
  const cards = document.querySelectorAll('.featured-card, .product-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const rotateX = (y - 0.5) * -4;
      const rotateY = (x - 0.5) * 4;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Parallax orbs ──
  const orbs = document.querySelectorAll('.hero__orb');
  
  if (orbs.length > 0) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    }, { passive: true });
  }

  // ── Reading progress bar (article page) ──
  const articleBody = document.getElementById('article-body');
  
  if (articleBody) {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #f59e0b, #ef4444);
      z-index: 1001;
      transition: width 0.1s linear;
      width: 0%;
      border-radius: 0 2px 2px 0;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const articleTop = articleBody.offsetTop;
      const articleHeight = articleBody.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = window.scrollY - articleTop + windowHeight;
      const total = articleHeight + windowHeight;
      const progress = Math.min(Math.max(scrolled / total * 100, 0), 100);
      progressBar.style.width = progress + '%';
    }, { passive: true });
  }
});
