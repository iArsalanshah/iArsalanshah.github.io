/*===================================*\
  #MODERN PORTFOLIO SCRIPTS
  Author: Syed Arsalan Shah
  Version: 2.0
\*===================================*/

'use strict';

// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const skillCards = document.querySelectorAll('.skill-card');
const typedText = document.getElementById('typed-text');
const statNumbers = document.querySelectorAll('.stat-number');
const themeToggle = document.getElementById('theme-toggle');

// ===== THEME TOGGLE =====
const THEME_KEY = 'portfolio-theme';

function getPreferredTheme() {
  // Check localStorage first
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    return savedTheme;
  }
  // Fall back to system preference
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

// Initialize theme on page load
setTheme(getPreferredTheme());

// Listen for theme toggle button click
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  // Only update if user hasn't manually set a preference
  if (!localStorage.getItem(THEME_KEY)) {
    setTheme(e.matches ? 'light' : 'dark');
  }
});

// ===== TYPING EFFECT =====
const titles = [
  'Mobile App Developer',
  'iOS Developer',
  'Android Developer',
  'Swift Enthusiast',
  'Kotlin Developer'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeEffect() {
  const currentTitle = titles[titleIndex];

  if (!isDeleting) {
    typedText.textContent = currentTitle.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentTitle.length) {
      isDeleting = true;
      setTimeout(typeEffect, pauseTime);
      return;
    }
  } else {
    typedText.textContent = currentTitle.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
    }
  }

  setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
}

// Start typing effect
if (typedText) {
  setTimeout(typeEffect, 1000);
}

// ===== MOBILE NAVIGATION =====
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// ===== NAVBAR SCROLL EFFECT =====
let lastScrollY = window.scrollY;

function handleNavbarScroll() {
  const scrollY = window.scrollY;

  if (scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScrollY = scrollY;
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

function highlightActiveNavLink() {
  const scrollY = window.scrollY + 150;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', highlightActiveNavLink, { passive: true });

// ===== PORTFOLIO FILTER =====
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filterValue = btn.dataset.filter;

    projectCards.forEach(card => {
      if (filterValue === 'all' || card.dataset.category === filterValue) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== STATS COUNTER ANIMATION =====
function animateCounter(element) {
  const target = parseInt(element.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += step;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

// ===== SKILL BAR ANIMATION =====
function animateSkillBar(card) {
  const progressBar = card.querySelector('.skill-progress');
  if (progressBar) {
    const progress = progressBar.dataset.progress;
    progressBar.style.width = `${progress}%`;
  }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.2
};

// Observer for fade-in animations
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observer for stats counter
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observer for skill bars
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkillBar(entry.target);
      skillsObserver.unobserve(entry.target);
    }
  });
}, { ...observerOptions, threshold: 0.5 });

// Apply observers
document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
  fadeObserver.observe(el);
});

statNumbers.forEach(stat => {
  statsObserver.observe(stat);
});

skillCards.forEach(card => {
  skillsObserver.observe(card);
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== PARALLAX EFFECT FOR HERO =====
const heroVisual = document.querySelector('.hero-visual');

function handleParallax() {
  if (heroVisual && window.innerWidth > 768) {
    const scrollY = window.scrollY;
    heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
  }
}

window.addEventListener('scroll', handleParallax, { passive: true });

// ===== PRELOADER (Optional Enhancement) =====
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Trigger initial animations
  const heroElements = document.querySelectorAll('.hero-content > *');
  heroElements.forEach((el, index) => {
    el.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
    el.style.opacity = '0';
  });
});

// ===== EXTRA CSS ANIMATION KEYFRAMES =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ===== CONSOLE MESSAGE =====
console.log('%c👋 Hello, fellow developer!', 'font-size: 20px; font-weight: bold; color: #00FFD1;');
console.log('%cThis portfolio was crafted with ❤️ by Syed Arsalan Shah', 'font-size: 14px; color: #00D4FF;');
console.log('%cLooking for a mobile developer? Get in touch!', 'font-size: 12px; color: #888;');