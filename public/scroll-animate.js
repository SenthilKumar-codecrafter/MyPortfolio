// Scroll Animation Script
(function() {
  'use strict';

  // Add animation classes to elements
  const animateOnScroll = () => {
    // Select all sections and their children
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      // Add animation class to section itself
      if (!section.classList.contains('scroll-animate')) {
        section.classList.add('scroll-animate', 'scroll-fade-up');
      }
      
      // Add animation to specific elements within sections
      const animatableElements = section.querySelectorAll(
        'h2, h3, p, .grid > div, .flex > div, form, .border-l-2 > div, .max-w-3xl > p, .space-y-4 > div'
      );
      
      animatableElements.forEach((el, index) => {
        if (!el.classList.contains('scroll-animate')) {
          el.classList.add('scroll-animate', 'scroll-fade-up');
          // Add staggered delay
          el.style.transitionDelay = `${index * 0.1}s`;
        }
      });
    });
  };

  // Intersection Observer to trigger animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
      }
    });
  }, observerOptions);

  // Initialize animations
  const init = () => {
    animateOnScroll();
    
    // Observe all elements with scroll-animate class
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));
  };

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize on Angular content changes
  setTimeout(() => {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));
  }, 500);
})();