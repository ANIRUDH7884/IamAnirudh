document.addEventListener("DOMContentLoaded", function() {
  // Initialize AOS animations
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out"
    });
  }

  // Optional JavaScript for click functionality
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
      window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  }

  // Form submission handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Here you would typically send the data to a server
      console.log('Form submitted:', data);
      
      // Show success message
      alert('Thank you for your message! I will get back to you soon.');
      
      // Reset form
      contactForm.reset();
      
      // Reset labels position if needed
      document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        if (input.value === '') {
          const label = input.previousElementSibling;
          if (label && label.tagName === 'LABEL') {
            label.style.transform = '';
          }
        }
      });
    });
  }
  
  // Animate form elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.contact-info-card, .contact-form-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  };
  
  animateOnScroll();

  // Theme Toggle Functionality
  const themeToggle = document.getElementById("darkModeToggle");
  if (themeToggle) {
    const body = document.body;
    const themeIcon = themeToggle.querySelector("i");
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      body.classList.add("light-mode");
    }
    
    // Update icon based on current theme
    function updateThemeIcon() {
      if (body.classList.contains("light-mode")) {
        themeIcon.classList.remove("bi-moon");
        themeIcon.classList.add("bi-sun");
      } else {
        themeIcon.classList.remove("bi-sun");
        themeIcon.classList.add("bi-moon");
      }
    }
    
    updateThemeIcon();
    
    // Toggle theme on button click
    themeToggle.addEventListener("click", function() {
      body.classList.toggle("light-mode");
      const mode = body.classList.contains("light-mode") ? "light" : "dark";
      localStorage.setItem("theme", mode);
      updateThemeIcon();
    });
  }

  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const sidebar = document.getElementById("sidebar");
  
  if (mobileToggle && sidebar) {
    function checkScreenSize() {
      if (window.innerWidth <= 768) {
        mobileToggle.style.display = "block";
        sidebar.classList.add("collapsed");
      } else {
        mobileToggle.style.display = "none";
        sidebar.classList.remove("collapsed");
      }
    }
    
    mobileToggle.addEventListener("click", function() {
      sidebar.classList.toggle("collapsed");
      sidebar.classList.toggle("expanded");
    });
    
    window.addEventListener("resize", checkScreenSize);
    checkScreenSize();
  }

  // Smooth Scrolling for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth"
        });
        
        // Close mobile menu if open
        if (window.innerWidth <= 768 && sidebar) {
          sidebar.classList.add("collapsed");
          sidebar.classList.remove("expanded");
        }
      }
    });
  });

  // Active Section Highlighting
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("#sidebar .nav-link");
  
  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", function() {
      let current = "";
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    });
  }

  // Enhanced Typing Animation
  const roles = [
    "Full Stack Developer (MERN)", 
    "Web Application Developer",
    "Digital Experience Crafter",
    "Tech Enthusiast"
  ];
  
  const roleElement = document.getElementById('typed-role');
  if (roleElement) {
    let currentRole = 0;
    let isTyping = false;
    let isDeleting = false;
    let charIndex = 0;
    
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    roleElement.parentNode.insertBefore(cursor, roleElement.nextSibling);
    
    // Set fixed width based on the longest role
    function setFixedWidth() {
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.position = 'absolute';
      tempSpan.style.font = window.getComputedStyle(roleElement).font;
      document.body.appendChild(tempSpan);
      
      let maxWidth = 0;
      roles.forEach(role => {
        tempSpan.textContent = role;
        maxWidth = Math.max(maxWidth, tempSpan.offsetWidth);
      });
      
      document.body.removeChild(tempSpan);
      roleElement.style.minWidth = `${maxWidth}px`;
    }
    
    setFixedWidth();
    
    function type() {
      if (!isTyping && !isDeleting) {
        isTyping = true;
        cursor.style.opacity = '1';
        
        const typingInterval = setInterval(() => {
          if (charIndex < roles[currentRole].length) {
            roleElement.textContent = roles[currentRole].substring(0, charIndex + 1);
            charIndex++;
          } else {
            clearInterval(typingInterval);
            isTyping = false;
            setTimeout(() => {
              isDeleting = true;
              erase();
            }, 2000);
          }
        }, 100);
      }
    }
    
    function erase() {
      const erasingInterval = setInterval(() => {
        if (charIndex > 0) {
          charIndex--;
          roleElement.textContent = roles[currentRole].substring(0, charIndex);
        } else {
          clearInterval(erasingInterval);
          isDeleting = false;
          currentRole = (currentRole + 1) % roles.length;
          setTimeout(type, 500);
        }
      }, 50);
    }
    
    // Blinking cursor effect
    function blinkCursor() {
      let isVisible = true;
      setInterval(() => {
        if (!isTyping && !isDeleting) {
          cursor.style.opacity = isVisible ? '1' : '0';
          isVisible = !isVisible;
        }
      }, 500);
    }
    
    type();
    blinkCursor();
  }

  // Projects Carousel
  const projectSwiper = document.querySelector(".project-swiper");
  if (projectSwiper && typeof Swiper !== 'undefined') {
    new Swiper(".project-swiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      initialSlide: Math.floor(document.querySelectorAll(".swiper-slide").length / 2),
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2,
        slideShadows: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          coverflowEffect: {
            modifier: 1.5,
          }
        },
        576: {
          coverflowEffect: {
            modifier: 1,
          }
        }
      }
    });
  }

  // Project Card Hover Effects
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("mouseenter", function() {
      this.style.transform = "scale(1.05)";
      this.style.zIndex = "10";
      this.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.3)";
    });

    card.addEventListener("mouseleave", function() {
      this.style.transform = "";
      this.style.zIndex = "";
      this.style.boxShadow = "";
    });
  });

  // Ripple Effect for Buttons
  document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 1000);
    });
  });

  // Text Rotator
  const rotator = document.querySelector('.text-rotator');
  if (rotator) {
    const words = JSON.parse(rotator.getAttribute('data-rotate'));
    let currentIndex = 0;
    
    function rotateText() {
      rotator.textContent = words[currentIndex];
      currentIndex = (currentIndex + 1) % words.length;
    }
    
    // Initial display
    rotateText();
    
    // Rotate every 3 seconds (adjust as needed)
    setInterval(rotateText, 3000);
  }
});