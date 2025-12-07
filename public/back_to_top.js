function goToSlide(index) {
  if (window.websiteController) {
    window.websiteController.goToSlide(index);
  }
}

class NumberRotator {
  constructor(element, target, duration = 2000) {
    this.element = element;
    this.target = parseFloat(target);
    this.duration = duration;
    this.current = 0;
    this.increment = this.target / (duration / 16); 
    this.isAnimating = false;
    this.hasAnimated = false;
  }

  animate() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.hasAnimated = true;

    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      this.current = this.target * easeOutQuart;

      let displayValue;
      if (this.target >= 10) {
        displayValue = Math.floor(this.current);
      } else {
        displayValue = this.current.toFixed(1);
      }

      this.element.textContent = displayValue;
      this.element.classList.add("animate", "text-glow");

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.element.textContent =
          this.target % 1 === 0 ? this.target : this.target.toFixed(1);
        this.isAnimating = false;
        this.element.classList.add("animation-complete");
        setTimeout(() => {
          this.element.classList.remove("text-glow");
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  }

  reset() {
    this.current = 0;
    this.element.textContent = "0";
    this.element.classList.remove("animate", "text-glow", "animation-complete");
    this.isAnimating = false;
    this.hasAnimated = false;
  }

  softReset() {
    this.current = 0;
    this.element.textContent = "0";
    this.element.classList.remove("animate", "text-glow", "animation-complete");
    this.isAnimating = false;
  }
}

class WebsiteController {
  constructor() {
    this.sections = [];
    this.navLinks = [];
    this.mobileNavLinks = [];
    this.currentActive = null;
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.rotators = new Map();
    this.rotatorObserver = null;

    this.lastScroll = 0;
    this.currentSlide = 0;
    this.isThrottled = false;
    this.scrollDirection = "down";
    this.animations = new Map();
    this.observers = new Map();
    this.navigationClickTime = 0;

    this.config = {
      scrollThreshold: 10,
      headerHideDelay: 100,
      slideInterval: 5000,
      throttleDelay: 16,
      observerThreshold: 0.3, 
      observerMargin: "0px 0px -50px 0px",
      navigationCooldown: 1500,
      rotatorObserverThreshold: 0.5, 
      rotatorObserverMargin: "0px 0px -100px 0px",
    };

    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupEventListeners();
    this.initializeComponents();
    this.createEnhancedEffects();
    this.setupDropdown();
    this.initializeNumberRotators();
    this.setupSVGAnimations();
  }

  setupSVGAnimations() {
    const svgSections = document.querySelectorAll("[data-svg-animation]");
    if (svgSections.length === 0) return;

    this.animationTimeouts = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startContinuousAnimation(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    svgSections.forEach((section) => {
      observer.observe(section);
    });
  }

  startContinuousAnimation(container) {
    const paths = container.querySelectorAll(".path");
    const circles = container.querySelectorAll(".circle");

    paths.forEach((path) => {
      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
    });

    circles.forEach((circle) => {
      circle.style.opacity = "0";
    });

    this.animateLoop(container);
  }

  animateLoop(container) {
    const paths = container.querySelectorAll(".path");
    const circles = container.querySelectorAll(".circle");
    const timeouts = [];

    this.resetSVGElements(container);

    paths.forEach((path, index) => {
      const delay = index * 0.2;
      const timeout = setTimeout(() => {
        path.style.transition = "stroke-dashoffset 1s ease-out";
        path.style.strokeDashoffset = "0";
      }, delay * 200); 
      timeouts.push(timeout);
    });

    circles.forEach((circle, index) => {
      const delay = index * 0.2 + 0.5;
      const timeout = setTimeout(() => {
        circle.style.transition = "opacity 0.5s ease-out";
        circle.style.opacity = "1";
      }, delay * 200); 
      timeouts.push(timeout);
    });

    const totalAnimationTime = Math.max(
      (paths.length - 1) * 0.2 * 200 + 1000,
      (circles.length - 1) * 0.2 * 200 + 0.5 * 200 + 500
    );

    const nextCycleTimeout = setTimeout(() => {
      this.animateLoop(container);
    }, totalAnimationTime + 1000); 
    timeouts.push(nextCycleTimeout);

    this.animationTimeouts.set(container, timeouts);
  }

  resetSVGElements(container) {
    const paths = container.querySelectorAll(".path");
    const circles = container.querySelectorAll(".circle");

    paths.forEach((path) => {
      path.style.transition = "none";
      path.style.strokeDashoffset = path.getTotalLength();
    });

    circles.forEach((circle) => {
      circle.style.transition = "none";
      circle.style.opacity = "0";
    });
  }

  stopAnimation(container) {
    const timeouts = this.animationTimeouts.get(container);
    if (timeouts) {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      this.animationTimeouts.delete(container);
    }

    this.resetSVGElements(container);
  }

  stopAllAnimations() {
    this.animationTimeouts.forEach((timeouts, container) => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      this.resetSVGElements(container);
    });
    this.animationTimeouts.clear();
  }

  stopAllAnimations() {
    if (this.animationTimeouts) {
      this.animationTimeouts.forEach((timeouts, container) => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
      });
      this.animationTimeouts.clear();
    }
  }

  initializeNumberRotators() {
    const rotatingElements = document.querySelectorAll(
      ".rotating-number, [data-rotate-number]"
    );

    rotatingElements.forEach((element) => {
      const target =
        element.getAttribute("data-target") ||
        element.getAttribute("data-rotate-number") ||
        element.textContent.trim();

      if (target && !isNaN(parseFloat(target))) {
        const rotator = new NumberRotator(element, target);
        this.rotators.set(element, rotator);
        rotator.reset();
      }
    });

    this.setupRotatorScrollObserver();
  }

  setupRotatorScrollObserver() {
    if (this.rotators.size === 0) return;

    const rotatorObserverOptions = {
      threshold: this.config.rotatorObserverThreshold,
      rootMargin: this.config.rotatorObserverMargin,
    };

    this.rotatorObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const rotator = this.rotators.get(entry.target);
        if (!rotator) return;

        if (entry.isIntersecting) {
          const delay = this.calculateStaggerDelay(entry.target);
          setTimeout(() => {
            if (!rotator.hasAnimated) {
              rotator.animate();
            }
          }, delay);
        } else {
          const rect = entry.target.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
            rotator.reset();
          }
        }
      });
    }, rotatorObserverOptions);

    this.rotators.forEach((rotator, element) => {
      this.rotatorObserver.observe(element);
    });
  }
  calculateStaggerDelay(element) {
    const section = element.closest("section");
    if (!section) return 0;

    const sectionRotators = Array.from(
      section.querySelectorAll(".rotating-number, [data-rotate-number]")
    );
    const index = sectionRotators.indexOf(element);

    return index * 150;
  }

  setupNavigation() {
    this.setupSections();
    this.setupNavLinks();
    this.setupMobileMenu();
    this.setupDropdown();

    setTimeout(() => {
      this.setActiveLink("home");
    }, 100);
  }

  setupSections() {
    this.sections = Array.from(document.querySelectorAll("section[id]"));
  }

  setupNavLinks() {
    this.navLinks = Array.from(
      document.querySelectorAll(".nav-link[data-section]")
    );
    this.mobileNavLinks = Array.from(
      document.querySelectorAll(".mobile-nav-link[data-section]")
    );
  }

  setActiveLink(sectionId) {
    if (this.currentActive === sectionId) return;

    this.currentActive = sectionId;

    [...this.navLinks, ...this.mobileNavLinks].forEach((link) => {
      link.classList.remove("active");
    });

    const activeDesktopLink = this.navLinks.find(
      (link) => link.dataset.section === sectionId
    );
    const activeMobileLink = this.mobileNavLinks.find(
      (link) => link.dataset.section === sectionId
    );

    if (activeDesktopLink) {
      activeDesktopLink.classList.add("active");
    }
    if (activeMobileLink) {
      activeMobileLink.classList.add("active");
    }

    const companyBtn = document.getElementById("companyDropdownBtn");
    if (sectionId === "projects" || sectionId === "leadership") {
      if (companyBtn) {
        companyBtn.classList.add("active");
      }
    } else {
      if (companyBtn) {
        companyBtn.classList.remove("active");
      }
    }
  }

  setupMobileMenu() {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuClose = document.getElementById("mobile-menu-close-button");
    const mobileMenuBackdrop = document.getElementById("mobile-menu-backdrop");

    const openMobileMenu = () => {
      mobileMenu.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    };

    const closeMobileMenu = () => {
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = "";
    };

    this.closeMobileMenu = closeMobileMenu;

    mobileMenuButton?.addEventListener("click", openMobileMenu);
    mobileMenuClose?.addEventListener("click", closeMobileMenu);
    mobileMenuBackdrop?.addEventListener("click", closeMobileMenu);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
        closeMobileMenu();
      }
    });
  }

  setupDropdown() {
    const dropdownBtn = document.getElementById("companyDropdownBtn");
    const dropdown = document.getElementById("companyDropdown");
    const icon = document.getElementById("dropdownIcon");

    if (dropdownBtn && dropdown && icon) {
      const toggleDropdown = () => {
        const isOpen = !dropdown.classList.contains("hidden");
        dropdown.classList.toggle("hidden");
        icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
        dropdownBtn.setAttribute("aria-expanded", !isOpen);
      };

      dropdownBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown();
      });

      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target) && !dropdownBtn.contains(e.target)) {
          dropdown.classList.add("hidden");
          icon.style.transform = "rotate(0deg)";
        }
      });

      const dropdownLinks = dropdown.querySelectorAll("a");
      dropdownLinks.forEach((link) => {
        link.addEventListener("click", () => {
          dropdown.classList.add("hidden");
          icon.style.transform = "rotate(0deg)";
        });
      });

      dropdownBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleDropdown();
        } else if (
          e.key === "Escape" &&
          !dropdown.classList.contains("hidden")
        ) {
          dropdown.classList.add("hidden");
          icon.style.transform = "rotate(0deg)";
        }
      });
    }
  }

  setupAnimations() {
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            this.triggerCustomAnimation(
              entry.target,
              entry.target.dataset.animate
            );
          }
        });
      },
      {
        threshold: this.config.observerThreshold,
        rootMargin: this.config.observerMargin,
      }
    );

    document
      .querySelectorAll(
        ".fade-in, .slide-up, .slide-left, .slide-right, [data-animate]"
      )
      .forEach((el) => {
        animationObserver.observe(el);
      });

    this.observers.set("animations", animationObserver);
  }

  animateSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const animatableElements = section.querySelectorAll(
      ".fade-in, .slide-up, .slide-left, .slide-right, [data-animate]"
    );
    animatableElements.forEach((el) => {
      el.classList.add("animate");
      if (el.dataset.animate) {
        this.triggerCustomAnimation(el, el.dataset.animate);
      }
    });
  }

  initHeaderScrollBehavior() {
    const header = document.getElementById("main-header");
    if (!header) return;

    header.classList.add("transition-all", "duration-300", "ease-in-out");

    window.addEventListener(
      "scroll",
      this.throttle(() => {
        const currentScroll = window.pageYOffset;
        const scrollDelta = Math.abs(currentScroll - this.lastScroll);

        if (scrollDelta < this.config.scrollThreshold) return;

        this.scrollDirection = currentScroll > this.lastScroll ? "down" : "up";

        const shouldPreventHide = this.isScrolling;

        if (currentScroll > 100) {
          if (this.scrollDirection === "down" && !shouldPreventHide) {
            header.classList.add("-translate-y-full", "shadow-none");
            header.classList.remove("shadow-lg");
          } else if (this.scrollDirection === "up") {
            header.classList.remove("-translate-y-full");
            header.classList.add("shadow-lg", "backdrop-blur-md");
          }
          header.classList.add("shadow-md");
        } else {
          header.classList.remove(
            "-translate-y-full",
            "shadow-lg",
            "backdrop-blur-md",
            "shadow-md"
          );
        }

        this.lastScroll = currentScroll;
        this.dispatchScrollEvent(currentScroll, this.scrollDirection);
      }, this.config.throttleDelay)
    );
  }

  initSlideshow() {
    const slides = document.querySelectorAll(".slide");
    const indicators = document.querySelectorAll(".indicator");

    if (!slides.length || !indicators.length) return;

    let slideInterval;
    let isAutoPlaying = true;

    slides.forEach((slide) => {
      slide.style.transition =
        "opacity 0.8s ease-in-out, transform 0.8s ease-in-out";
    });

    this.changeSlide = (index) => {
      if (index === this.currentSlide) return;

      const direction = index > this.currentSlide ? "next" : "prev";

      slides[this.currentSlide].style.opacity = "0";

      setTimeout(() => {
        slides[this.currentSlide].classList.remove("active");

        this.currentSlide = index;
        if (this.currentSlide < 0) this.currentSlide = slides.length - 1;
        if (this.currentSlide >= slides.length) this.currentSlide = 0;

        slides[this.currentSlide].style.opacity = "0";
        slides[this.currentSlide].classList.add("active");

        if (direction === "next") {
          slides[this.currentSlide].style.transform = "translateX(20px)";
        } else {
          slides[this.currentSlide].style.transform = "translateX(-20px)";
        }

        void slides[this.currentSlide].offsetWidth;

        slides[this.currentSlide].style.opacity = "1";
        slides[this.currentSlide].style.transform = "translateX(0)";

        indicators.forEach((indicator, i) => {
          indicator.classList.toggle("active", i === this.currentSlide);
        });
      }, 800);
    };

    const startAutoPlay = () => {
      if (slideInterval) clearInterval(slideInterval);
      slideInterval = setInterval(() => {
        if (isAutoPlaying) {
          this.changeSlide(this.currentSlide + 1);
        }
      }, this.config.slideInterval);
    };

    const stopAutoPlay = () => {
      isAutoPlaying = false;
      if (slideInterval) clearInterval(slideInterval);
    };

    const resumeAutoPlay = () => {
      isAutoPlaying = true;
      startAutoPlay();
    };

    const slideContainer =
      document.querySelector(".slideshow-container") ||
      slides[0]?.parentElement;
    if (slideContainer) {
      let touchStartX = 0;
      let touchEndX = 0;

      slideContainer.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      });

      slideContainer.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchStartX - touchEndX;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
          if (swipeDistance > 0) {
            this.changeSlide(this.currentSlide + 1);
          } else {
            this.changeSlide(this.currentSlide - 1);
          }
        }

        setTimeout(resumeAutoPlay, 3000);
      });

      slideContainer.addEventListener("mouseenter", stopAutoPlay);
      slideContainer.addEventListener("mouseleave", resumeAutoPlay);
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        this.changeSlide(index);
        stopAutoPlay();
        setTimeout(resumeAutoPlay, 3000);
      });
    });

    slides[0].classList.add("active");
    slides[0].style.opacity = "1";
    indicators[0].classList.add("active");

    startAutoPlay();
  }

  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        const target = document.querySelector(targetId);

        if (target) {
          const targetPosition =
            target.getBoundingClientRect().top + window.pageYOffset - 20;

          this.smoothScrollTo(targetPosition, 1000);
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  initEnhancedBackToTop() {
    const backToTopBtn = document.getElementById("back-to-top");
    const progressCircle = document.getElementById("progress-circle");

    if (!backToTopBtn) return;

    const totalHeight = () => document.body.scrollHeight - window.innerHeight;
    const circumference = 283;
    let lastScrollPosition = window.scrollY;

    if (progressCircle) {
      progressCircle.style.strokeDasharray = circumference;
      progressCircle.style.strokeDashoffset = circumference;
    }

    window.addEventListener(
      "scroll",
      this.throttle(() => {
        const currentScroll = window.scrollY;
        const scrollProgress = Math.min(currentScroll / totalHeight(), 1);
        const isNearBottom =
          currentScroll > totalHeight() - window.innerHeight - 100;

        if (progressCircle) {
          const offset = circumference * (1 - scrollProgress);
          progressCircle.style.strokeDashoffset = offset;

          let color;
          if (scrollProgress < 0.5) {
            const intensity = scrollProgress / 0.5;
            const r = Math.round(82 + (228 - 82) * intensity);
            const g = Math.round(192 + (24 - 192) * intensity);
            const b = Math.round(184 + (112 - 184) * intensity);
            color = `rgb(${r}, ${g}, ${b})`;
          } else {
            color = "#E41870";
          }

          progressCircle.style.stroke = color;
          progressCircle.style.transition = "stroke 0.3s ease-out";
        }

        if (currentScroll > 300) {
          backToTopBtn.classList.remove(
            "opacity-0",
            "scale-0",
            "translate-y-8"
          );
          backToTopBtn.classList.add(
            "opacity-100",
            "scale-100",
            "translate-y-0"
          );
          if (currentScroll > 300 && lastScrollPosition <= 300) {
            backToTopBtn.classList.add("animate-bounce");
            setTimeout(
              () => backToTopBtn.classList.remove("animate-bounce"),
              1000
            );
          }
          const arrowIcon = backToTopBtn.querySelector("svg");
          if (isNearBottom && arrowIcon) {
            arrowIcon.classList.add("rotate-180");
            arrowIcon.style.fill = "#c9b07a";
            arrowIcon.style.transition = "fill 0.3s ease, transform 0.3s ease";
          } else if (arrowIcon) {
            arrowIcon.classList.remove("rotate-180");
            arrowIcon.style.fill = "#a89262";
            arrowIcon.style.transition = "fill 0.3s ease, transform 0.3s ease";
          }
        } else {
          backToTopBtn.classList.add("opacity-0", "scale-0", "translate-y-8");
          backToTopBtn.classList.remove(
            "opacity-100",
            "scale-100",
            "translate-y-0"
          );
        }

        lastScrollPosition = currentScroll;
      }, this.config.throttleDelay)
    );

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      backToTopBtn.classList.add("scale-95", "bg-[#c9b07a]");
      setTimeout(() => {
        backToTopBtn.classList.remove("scale-95");
        backToTopBtn.classList.add("bg-[#a89262]");
      }, 150);

      this.smoothScrollTo(0, 1000);
    });
  }

  createEnhancedEffects() {
    this.setupAnimations();
    this.createParallaxEffect();
    this.createLoadingAnimations();
    this.createHoverEffects();
  }

  createParallaxEffect() {
    const parallaxElements = document.querySelectorAll("[data-parallax]");
    if (!parallaxElements.length) return;

    window.addEventListener(
      "scroll",
      this.throttle(() => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach((element) => {
          const speed = parseFloat(element.dataset.parallax) || 0.5;
          const yPos = -(scrolled * speed);
          element.style.transform = `translateY(${yPos}px)`;
        });
      }, this.config.throttleDelay)
    );
  }

  createLoadingAnimations() {
    const images = document.querySelectorAll("img[data-src]");

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;

          img.classList.add("animate-pulse", "bg-gray-200");

          img.src = img.dataset.src;
          img.onload = () => {
            img.classList.remove("animate-pulse", "bg-gray-200");
            img.classList.add("animate-fade-in");
          };

          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  createHoverEffects() {
    const magneticElements = document.querySelectorAll("[data-magnetic]");

    magneticElements.forEach((element) => {
      element.addEventListener("mousemove", (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        element.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "translate(0px, 0px)";
      });
    });
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  smoothScrollTo(targetPosition, duration, callback) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = this.easeInOutQuart(
        timeElapsed,
        startPosition,
        distance,
        duration
      );
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else if (callback) {
        callback();
      }
    };

    requestAnimationFrame(animation);
  }

  easeInOutQuart(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t * t + b;
    t -= 2;
    return (-c / 2) * (t * t * t * t - 2) + b;
  }

  dispatchScrollEvent(scrollPosition, direction) {
    const event = new CustomEvent("enhancedScroll", {
      detail: { scrollPosition, direction },
    });
    document.dispatchEvent(event);
  }

  triggerCustomAnimation(element, type) {
    const animations = {
      "fade-in": () => (element.style.opacity = "1"),
      "slide-up": () => (element.style.transform = "translateY(0)"),
      "scale-in": () => (element.style.transform = "scale(1)"),
      "rotate-in": () => (element.style.transform = "rotate(0deg)"),
    };

    if (animations[type]) {
      animations[type]();
    }
  }

  setupEventListeners() {
    [...this.navLinks, ...this.mobileNavLinks].forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const targetId = link.getAttribute("href").substring(1);
        this.scrollToSection(targetId);
        this.closeMobileMenu();
      });
    });

    const contactBtn = document.getElementById("contactBtn");
    const mobileContactBtn = document.getElementById("mobileContactBtn");

    if (contactBtn) {
      contactBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.scrollToSection("contact");
      });
    }

    if (mobileContactBtn) {
      mobileContactBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.scrollToSection("contact");
        this.closeMobileMenu();
      });
    }

    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (
        link &&
        !link.classList.contains("nav-link") &&
        !link.classList.contains("mobile-nav-link")
      ) {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        this.scrollToSection(targetId);
      }
    });

    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.handleResize();
      }, 250)
    );

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });

    document.addEventListener("keydown", (e) => {
      this.handleKeyboard(e);
    });
  }

  initializeComponents() {
    this.initHeaderScrollBehavior();
    this.initSlideshow();
    this.initSmoothScrolling();
    this.initEnhancedBackToTop();
  }

  handleResize() {
    this.observers.forEach((observer) => observer.disconnect());
    this.setupAnimations();
  }

  handleKeyboard(e) {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "Home":
          e.preventDefault();
          this.smoothScrollTo(0, 800);
          break;
        case "End":
          e.preventDefault();
          this.smoothScrollTo(document.body.scrollHeight, 800);
          break;
      }
    }
  }

  pauseAnimations() {
    document.body.classList.add("animations-paused");
  }

  resumeAnimations() {
    document.body.classList.remove("animations-paused");
  }

  scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
      console.error(`Section with ID ${sectionId} not found`);
      return;
    }

    this.setActiveLink(sectionId);
    this.navigationClickTime = Date.now();
    this.isScrolling = true;

    const header = document.getElementById("main-header");
    if (header) {
      header.classList.remove("-translate-y-full");
      header.classList.add("shadow-lg");
      header.offsetHeight;
    }

    let targetPosition;
    if (sectionId === "home") {
      targetPosition = 0;
    } else {
      requestAnimationFrame(() => {
        const sectionTop = targetSection.getBoundingClientRect().top;
        const headerHeight = header ? header.offsetHeight : 80;
        targetPosition = sectionTop + window.pageYOffset - 40;

        this.smoothScrollTo(targetPosition, 800, () => {
          this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
            this.hideHeaderAfterNavigation();
            // Trigger rotators in the target section if they haven't animated
            this.triggerSectionRotators(targetSection);
          }, 200);
        });
      });
      return;
    }

    this.smoothScrollTo(targetPosition, 800, () => {
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
        this.hideHeaderAfterNavigation();
        if (sectionId === "home") {
          this.triggerSectionRotators(targetSection);
        }
      }, 200);
    });

    history.pushState(null, null, `#${sectionId}`);
  }

  triggerSectionRotators(section) {
    if (!section) return;

    const sectionRotators = section.querySelectorAll(
      ".rotating-number, [data-rotate-number]"
    );
    sectionRotators.forEach((element, index) => {
      const rotator = this.rotators.get(element);
      if (rotator && !rotator.hasAnimated) {
        setTimeout(() => {
          rotator.animate();
        }, index * 150);
      }
    });
  }

  // Manual trigger for rotators (for click events, etc.)
  triggerRotator(element) {
    const rotator = this.rotators.get(element);
    if (rotator) {
      rotator.reset();
      setTimeout(() => {
        rotator.animate();
      }, 100);
    }
  }

  // Reset all rotators
  resetAllRotators() {
    this.rotators.forEach((rotator) => {
      rotator.reset();
    });
  }

  // Replay all visible rotators
  replayVisibleRotators() {
    this.rotators.forEach((rotator, element) => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        rotator.softReset();
        setTimeout(() => {
          rotator.animate();
        }, Math.random() * 300);
      }
    });
  }

  // Add click handlers for rotator cards
  setupRotatorClickHandlers() {
    document
      .querySelectorAll(".card-hover, .stats-card, [data-rotator-card]")
      .forEach((card) => {
        card.addEventListener("click", () => {
          const rotatingNumber = card.querySelector(
            ".rotating-number, [data-rotate-number]"
          );
          if (rotatingNumber) {
            this.triggerRotator(rotatingNumber);
          }
        });
      });
  }

  hideHeaderAfterNavigation() {
    const header = document.getElementById("main-header");
    const currentScroll = window.pageYOffset;

    // Hide header immediately if we're not at the top and not scrolling up
    if (currentScroll > 100 && header) {
      header.classList.add("-translate-y-full", "shadow-none");
      header.classList.remove("shadow-lg");
    }
  }
  goToSlide(index) {
    this.changeSlide(index);
    this.stopAutoPlay();
    setTimeout(() => this.resumeAutoPlay(), 3000);
  }

  scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      const targetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - 20;
      this.smoothScrollTo(targetPosition, 1000);
    }
  }

  getCurrentActive() {
    return this.currentActive;
  }
}

// Global function to maintain compatibility
function scrollToContact() {
  if (window.websiteController) {
    window.websiteController.scrollToSection("contact");
  }
}

// Global function for dropdown compatibility
function toggleDropdown() {
  const dropdown = document.getElementById("companyDropdown");
  const icon = document.getElementById("dropdownIcon");

  if (dropdown && icon) {
    const isOpen = !dropdown.classList.contains("hidden");
    dropdown.classList.toggle("hidden");
    icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.websiteController = new WebsiteController();

  const header = document.getElementById("main-header");
  if (window.scrollY > 10) {
    header?.classList.add("shadow-md");
  } else {
    window.websiteController.setActiveLink("home");
  }

  const style = document.createElement("style");
  style.textContent = `
        .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .slide-out-left {
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
        }
        
        .slide-out-right {
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
        }
        
        .slide-in-left {
            transform: translateX(0);
            transition: transform 0.3s ease-in-out;
        }
        
        .slide-in-right {
            transform: translateX(0);
            transition: transform 0.3s ease-in-out;
        }
        
        .animations-paused * {
            animation-play-state: paused !important;
        }
        
        [data-magnetic] {
            transition: transform 0.3s cubic-bezier(0.23, 1, 0.320, 1);
        }

        /* Active navigation styles */
        .nav-link.active,
        .mobile-nav-link.active,
        #companyDropdownBtn.active {
            color: #c9b07a !important;
        }
    `;
  document.head.appendChild(style);
});

window.addEventListener("popstate", () => {
  const hash = window.location.hash.substring(1);
  if (hash && window.websiteController) {
    window.websiteController.scrollToSection(hash);
  }
});

if ("PerformanceObserver" in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === "measure") {
        console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
      }
    }
  });
  observer.observe({ entryTypes: ["measure"] });
}
