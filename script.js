// Prathmesh.dev — interactions
const progressBar = document.getElementById('scrollProgress');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const toast = document.getElementById('toast');
const copyEmailButton = document.getElementById('copyEmail');
const emailButton = document.getElementById('emailButton');

// Update the top reading-progress line without doing work on every paint.
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  window.requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${progress}%`;
    scrollTicking = false;
  });
}, { passive: true });

// Mobile navigation.
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  });
});

// Reveal sections as they enter the viewport.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

// Active navigation link based on the section in view.
const sections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const activeId = entry.target.id;
      navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

// Edit this email and the social profile URLs before publishing.
const CONTACT_EMAIL = 'your.email@example.com';
emailButton.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Hello Prathmesh')}`;

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

copyEmailButton.addEventListener('click', async () => {
  if (CONTACT_EMAIL === 'your.email@example.com') {
    showToast('First add your real email in script.js.');
    return;
  }
  try {
    await navigator.clipboard.writeText(CONTACT_EMAIL);
    showToast('Email copied to clipboard!');
  } catch {
    showToast(`Email: ${CONTACT_EMAIL}`);
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
