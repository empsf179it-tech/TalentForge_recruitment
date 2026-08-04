document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const currentTheme = localStorage.getItem('theme') || 'light';

  if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    if (themeToggle) {
      themeToggle.innerHTML = '<i data-lucide="sun"></i>';
    }
  } else {
    if (themeToggle) {
      themeToggle.innerHTML = '<i data-lucide="moon"></i>';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i data-lucide="moon"></i>';
      } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i data-lucide="sun"></i>';
      }
      lucide.createIcons(); // Re-render icons
    });
  }

  // Initialize Lucide Icons
  lucide.createIcons();

  // Mobile Menu Logic
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const themeToggleBtn = document.querySelector('.theme-toggle');
  const ctaBtn = document.querySelector('.nav-actions .btn');
  const navActions = document.querySelector('.nav-actions');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      if (navLinks.classList.contains('active')) {
        mobileMenuBtn.innerHTML = '<i data-lucide="x"></i>';
        
        // Move items into the dropdown
        if (themeToggleBtn) {
          const liTheme = document.createElement('li');
          liTheme.className = 'mobile-extra';
          liTheme.appendChild(themeToggleBtn);
          navLinks.appendChild(liTheme);
          themeToggleBtn.style.display = 'flex';
        }
        if (ctaBtn) {
          const liCta = document.createElement('li');
          liCta.className = 'mobile-extra';
          liCta.appendChild(ctaBtn);
          navLinks.appendChild(liCta);
          ctaBtn.style.display = 'inline-flex';
        }
      } else {
        mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
        
        // Restore items to header
        if (themeToggleBtn) {
          themeToggleBtn.style.display = '';
          navActions.insertBefore(themeToggleBtn, mobileMenuBtn);
        }
        if (ctaBtn) {
          ctaBtn.style.display = '';
          navActions.insertBefore(ctaBtn, mobileMenuBtn);
        }
        
        // Remove empty wrappers
        document.querySelectorAll('.mobile-extra').forEach(el => el.remove());
      }
      lucide.createIcons();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && navLinks.classList.contains('active')) {
        mobileMenuBtn.click();
      }
    });
  }

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  
  window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Progress
    if (scrollProgress) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = scrolled + '%';
    }
  });

  // Mouse Glow Effect
  const mouseGlow = document.createElement('div');
  mouseGlow.classList.add('mouse-glow');
  document.body.appendChild(mouseGlow);

  document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
  });

  // Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Initialize Animations ---

  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }

  // Register GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Timeline Animation (Home Page - Section 2)
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const timelineProgress = document.querySelector('.timeline-progress');

    if (timelineNodes.length > 0 && timelineProgress) {
      gsap.to(timelineProgress, {
        width: '100%',
        ease: "none",
        scrollTrigger: {
          trigger: '.timeline-wrapper',
          start: 'left left',
          end: 'right right',
          scrub: 1,
        }
      });

      timelineNodes.forEach((node, i) => {
        gsap.from(node, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: node,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    }

    // Counter Animation (Home Page - Section 3)
    const counters = document.querySelectorAll('.dash-value');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          let current = 0;
          const increment = target / 50;
          const updateCounter = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.innerText = target + suffix;
              clearInterval(updateCounter);
            } else {
              // Format depending on if it's a decimal (e.g., 4.5) or integer
              counter.innerText = (current % 1 !== 0 && target % 1 !== 0) ? current.toFixed(1) + suffix : Math.ceil(current) + suffix;
            }
          }, 30);
        }
      });
    });
  }

  // Workflow Accordion (Services Page - Section 3)
  const workflowHeaders = document.querySelectorAll('.workflow-header');
  workflowHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all
      document.querySelectorAll('.workflow-item').forEach(wi => {
        wi.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
