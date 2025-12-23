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

// ===== PROJECT MODAL =====
const projectModal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');
const galleryMainImage = document.getElementById('gallery-main-image');
const galleryThumbnails = document.getElementById('gallery-thumbnails');
const galleryPrev = document.getElementById('gallery-prev');
const galleryNext = document.getElementById('gallery-next');
const modalTitle = document.getElementById('modal-title');
const modalCategory = document.getElementById('modal-category');
const modalDescription = document.getElementById('modal-description');
const modalTechTags = document.getElementById('modal-tech-tags');
const modalFeaturesList = document.getElementById('modal-features-list');
const modalAppLink = document.getElementById('modal-app-link');

// Project data with details and images
const projectsData = {
  'ui-story': {
    title: 'UI Story',
    category: 'iOS App',
    description: 'UI Story is a powerful design inspiration app that helps designers and developers discover, save, and organize beautiful UI patterns from top mobile applications. Browse through curated collections of stunning interfaces and get inspired for your next project.',
    tech: ['Swift', 'SwiftUI', 'Core Data', 'CloudKit', 'UIKit'],
    features: [
      'Curated collection of premium UI designs',
      'Smart categorization and tagging system',
      'Offline access to saved inspirations',
      'Cloud sync across all devices',
      'Advanced search and filtering options'
    ],
    images: ['./assets/images/ui_story.png'],
    appLink: '#'
  },
  'boxit4me': {
    title: 'Boxit4me',
    category: 'iOS App',
    description: 'Boxit4me is a comprehensive package tracking and management application that simplifies the way you handle deliveries. Track packages from multiple carriers in one place, get real-time notifications, and never miss a delivery again.',
    tech: ['Swift', 'UIKit', 'Push Notifications', 'REST APIs', 'Firebase'],
    features: [
      'Multi-carrier package tracking support',
      'Real-time delivery notifications',
      'Barcode and QR code scanning',
      'Delivery history and analytics',
      'Share tracking with family and friends'
    ],
    images: ['./assets/images/boxit4me_ios.png', './assets/images/boxit4me_android.png'],
    appLink: '#'
  },
  'meezan360': {
    title: 'Meezan360',
    category: 'iOS App',
    description: 'Meezan360 is a complete Islamic lifestyle companion app offering prayer times, Qibla direction, Quran with translations, and Duas. Designed with beautiful UI and accurate calculations to support your daily spiritual journey.',
    tech: ['Swift', 'SwiftUI', 'CoreLocation', 'AVFoundation', 'Combine'],
    features: [
      'Accurate prayer times based on location',
      'Precise Qibla compass direction',
      'Complete Quran with audio recitations',
      'Daily Duas and Adhkar collection',
      'Beautiful Islamic calendar integration'
    ],
    images: ['./assets/images/meezan360.png'],
    appLink: '#'
  },
  'tmbooking': {
    title: 'TMBooking',
    category: 'Android App',
    description: 'TMBooking is a seamless booking platform designed for service-based businesses. Users can easily browse available services, select time slots, and make reservations with just a few taps. Perfect for salons, spas, and appointment-based businesses.',
    tech: ['Kotlin', 'Jetpack Compose', 'Room DB', 'Retrofit', 'Firebase'],
    features: [
      'Easy service browsing and selection',
      'Real-time availability checking',
      'Secure payment integration',
      'Booking reminders and notifications',
      'Rating and review system'
    ],
    images: ['./assets/images/tmbooking.jpg'],
    appLink: '#'
  },
  'fursah': {
    title: 'Fursah App',
    category: 'iOS App',
    description: 'Fursah is a dynamic job search and career development platform connecting job seekers with top employers in the region. Features intelligent job matching, resume building tools, and career resources to help you land your dream job.',
    tech: ['Swift', 'UIKit', 'Alamofire', 'Core Data', 'Push Notifications'],
    features: [
      'AI-powered job recommendations',
      'Professional resume builder',
      'One-tap job applications',
      'Interview scheduling and reminders',
      'Career insights and salary data'
    ],
    images: ['./assets/images/fursah1.webp', './assets/images/fursah2.webp', './assets/images/fursah3.webp', './assets/images/fursah4.webp'],
    appLink: '#'
  },
  'fm91': {
    title: 'FM91',
    category: 'iOS App',
    description: 'FM91 is a feature-rich radio streaming application bringing the best of FM radio to your fingertips. Enjoy live broadcasts, on-demand shows, podcasts, and never miss your favorite programs with our smart recording feature.',
    tech: ['Swift', 'AVFoundation', 'MediaPlayer', 'Background Audio', 'Firebase'],
    features: [
      'High-quality live radio streaming',
      'On-demand show playback',
      'Background audio playback',
      'Program schedule and reminders',
      'Social sharing and interactions'
    ],
    images: ['./assets/images/fm1.jpeg', './assets/images/fm2.jpeg', './assets/images/fm3.jpeg', './assets/images/fm4.jpeg'],
    appLink: '#'
  },
  'catchmapp': {
    title: 'Catchmapp',
    category: 'Android App',
    description: 'Catchmapp is a location-based social discovery platform that helps you find interesting places, events, and people around you. Explore hidden gems in your city, discover trending spots, and connect with like-minded individuals.',
    tech: ['Kotlin', 'Google Maps SDK', 'Firebase', 'Retrofit', 'Room DB'],
    features: [
      'Real-time location discovery',
      'Interactive map with custom markers',
      'Social check-ins and reviews',
      'Event discovery and notifications',
      'Personalized recommendations'
    ],
    images: ['./assets/images/cm1.webp', './assets/images/cm2.webp', './assets/images/cm3.webp', './assets/images/cm4.webp', './assets/images/cm5.webp'],
    appLink: '#'
  },
  'dining': {
    title: 'Dining & Nightlife',
    category: 'Android App',
    description: 'Dining & Nightlife is your ultimate guide to the best restaurants, bars, and entertainment venues in your city. Discover new dining experiences, read reviews, make reservations, and explore the vibrant nightlife scene.',
    tech: ['Kotlin', 'Jetpack Compose', 'Google Places API', 'Firebase', 'Stripe'],
    features: [
      'Comprehensive restaurant directory',
      'Real-time table reservations',
      'User reviews and ratings',
      'Exclusive deals and offers',
      'Curated nightlife guide'
    ],
    images: ['./assets/images/dining1.webp', './assets/images/dining2.webp', './assets/images/dining3.webp', './assets/images/dining4.webp'],
    appLink: '#'
  }
};

let currentGalleryIndex = 0;
let currentProjectImages = [];

// Open project modal
function openProjectModal(projectId) {
  const project = projectsData[projectId];
  if (!project) return;

  // Set modal content
  modalTitle.textContent = project.title;
  modalCategory.textContent = project.category;
  modalDescription.textContent = project.description;

  // Set tech tags
  modalTechTags.innerHTML = project.tech
    .map(tech => `<span class="tech-tag">${tech}</span>`)
    .join('');

  // Set features list
  modalFeaturesList.innerHTML = project.features
    .map(feature => `<li>${feature}</li>`)
    .join('');

  // Set app link
  if (project.appLink && project.appLink !== '#') {
    modalAppLink.href = project.appLink;
    modalAppLink.classList.remove('hidden');
  } else {
    modalAppLink.classList.add('hidden');
  }

  // Set gallery images
  currentProjectImages = project.images;
  currentGalleryIndex = 0;
  updateGallery();

  // Create thumbnails
  galleryThumbnails.innerHTML = currentProjectImages
    .map((img, index) => `
      <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
        <img src="${img}" alt="Thumbnail ${index + 1}" loading="lazy">
      </div>
    `)
    .join('');

  // Add thumbnail click handlers
  galleryThumbnails.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
      currentGalleryIndex = parseInt(thumb.dataset.index);
      updateGallery();
    });
  });

  // Show modal
  projectModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close project modal
function closeProjectModal() {
  projectModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Update gallery display
function updateGallery() {
  galleryMainImage.src = currentProjectImages[currentGalleryIndex];
  galleryMainImage.alt = `Screenshot ${currentGalleryIndex + 1}`;

  // Update thumbnail active state
  galleryThumbnails.querySelectorAll('.gallery-thumbnail').forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentGalleryIndex);
  });

  // Hide/show nav buttons based on image count
  if (currentProjectImages.length <= 1) {
    galleryPrev.style.display = 'none';
    galleryNext.style.display = 'none';
  } else {
    galleryPrev.style.display = 'flex';
    galleryNext.style.display = 'flex';
  }
}

// Gallery navigation
function navigateGallery(direction) {
  currentGalleryIndex += direction;
  if (currentGalleryIndex < 0) {
    currentGalleryIndex = currentProjectImages.length - 1;
  } else if (currentGalleryIndex >= currentProjectImages.length) {
    currentGalleryIndex = 0;
  }
  updateGallery();
}

// Event Listeners
if (projectModal) {
  // Project card click handlers
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = card.dataset.project;
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  // Close modal handlers
  modalClose.addEventListener('click', closeProjectModal);
  modalBackdrop.addEventListener('click', closeProjectModal);

  // Gallery navigation handlers
  galleryPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateGallery(-1);
  });

  galleryNext.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateGallery(1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!projectModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeProjectModal();
    } else if (e.key === 'ArrowLeft') {
      navigateGallery(-1);
    } else if (e.key === 'ArrowRight') {
      navigateGallery(1);
    }
  });
}