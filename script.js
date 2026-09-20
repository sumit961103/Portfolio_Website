/* ═══ script.js — Nocturnal Portfolio Interactions ═══ */

(function () {
  'use strict';

  /* ─── Scroll: header shadow + active nav ─── */
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .bottom-nav-item');

  function updateActiveNav() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 20);

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
      const sec = link.dataset.section;
      link.classList.toggle('active', sec === current);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ─── Reveal on scroll ─── */
  const revealEls = document.querySelectorAll('.timeline-card, .project-card, .cert-card, .social-card, .stat-card, .skill-category, .skill-bar-item, .hero-content > *, .content-block');
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── Skill bars animate on scroll ─── */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = entry.target.style.getPropertyValue('--pct');
        entry.target.style.width = pct;
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(bar => barObserver.observe(bar));

  /* ─── Experience & Credentials tabs ─── */
  function initTabs(tabAttr, panelPrefix) {
    const tabs = document.querySelectorAll(`[${tabAttr}]`);
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset[tabAttr === 'data-tab' ? 'tab' : 'tab2'];
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        document.querySelectorAll(`[id^="${panelPrefix}"]`).forEach(p => p.classList.remove('active'));
        const panel = document.getElementById(`${panelPrefix}${target}`);
        if (panel) panel.classList.add('active');
      });
    });
  }
  initTabs('data-tab', 'panel-');
  initTabs('data-tab2', 'panel2-');

  /* ─── Project filter ─── */
  const filterBtns = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ─── Contact form ─── */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting...';

      // Simulate async send (replace with real API call)
      await new Promise(resolve => setTimeout(resolve, 1400));

      submitBtn.textContent = '✓ Sent!';
      formSuccess.hidden = false;
      contactForm.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<svg viewBox="0 0 20 20" fill="none" class="btn-icon" style="width:16px;height:16px"><path d="M3 10l14-7-7 14v-7H3z" fill="currentColor"/></svg> Send Transmission`;
        formSuccess.hidden = true;
      }, 4000);
    });
  }

  /* ─── Smooth scroll nav links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Cursor glow effect (desktop) ─── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(240,244,248,0.025) 0%, transparent 65%);
      transform: translate(-50%, -50%);
      transition: left 0.12s ease, top 0.12s ease;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);
    window.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  /* ─── Typing effect on hero role ─── */
  const heroRole = document.querySelector('.hero-role');
  if (heroRole) {
    const roles = [
      'AI & Data Science Engineer',
      'Transportation & Logistics Specialist',
      'Machine Learning Researcher',
      'Railway Tech Innovator',
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pausing = false;

    function typeRole() {
      const current = roles[roleIdx];
      if (!deleting && !pausing) {
        heroRole.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
          pausing = true;
          setTimeout(() => { pausing = false; deleting = true; typeRole(); }, 2200);
          return;
        }
      } else if (deleting) {
        heroRole.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
        }
      }
      setTimeout(typeRole, deleting ? 45 : 90);
    }
    typeRole();
  }

})();
