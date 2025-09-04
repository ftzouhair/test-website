// Enhanced Functionality for VELARION Skies

document.addEventListener('DOMContentLoaded', function() {
  // FAQ Accordion Functionality
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = question.querySelector('svg') || question.querySelector('.icon-plus');
    
    question.addEventListener('click', () => {
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.querySelector('.faq-answer').style.display = 'none';
          const otherIcon = otherItem.querySelector('.faq-question svg') || otherItem.querySelector('.icon-plus');
          if (otherIcon) {
            // Reset icon to plus
            otherIcon.innerHTML = '<path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="currentColor"/>';
          }
        }
      });
      
      // Toggle current item
      const isOpen = answer.style.display === 'block';
      answer.style.display = isOpen ? 'none' : 'block';
      
      if (icon) {
        if (isOpen) {
          // Change to plus icon
          icon.innerHTML = '<path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="currentColor"/>';
        } else {
          // Change to minus icon
          icon.innerHTML = '<path d="M19 13H5v-2h14v2z" fill="currentColor"/>';
        }
      }
    });
  });
  
  // Booking Form Enhancements
  const tripTypeButtons = document.querySelectorAll('.trip-type-btn');
  const returnDateGroup = document.getElementById('return-date-group');
  
  if (tripTypeButtons.length > 0 && returnDateGroup) {
    tripTypeButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        tripTypeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Show/hide return date based on selection
        if (this.dataset.value === 'round-trip') {
          returnDateGroup.style.display = 'block';
        } else {
          returnDateGroup.style.display = 'none';
        }
      });
    });
  }
  
  // Set minimum dates to today
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.min) {
      input.min = today;
    }
  });
  
  // Form validation enhancements
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(bookingForm);
      const data = {};
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      // Simple validation
      let isValid = true;
      const requiredFields = bookingForm.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
        } else {
          field.classList.remove('error');
        }
      });
      
      if (isValid) {
        // In a real implementation, you would send this data to a server
        alert('Thank you for your booking request. Our concierge team will contact you shortly with tailored options.');
        bookingForm.reset();
        
        // Reset trip type buttons
        tripTypeButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.trip-type-btn[data-value="one-way"]').classList.add('active');
        returnDateGroup.style.display = 'none';
      } else {
        alert('Please fill in all required fields.');
      }
    });
  }
  
  // Animation enhancements for scroll-triggered elements
  const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);
  
  animateOnScrollElements.forEach(el => {
    observer.observe(el);
  });
  
  // Mobile menu enhancements
  const mobileMenuButton = document.querySelector('.mobile-menu');
  const navLinks = document.getElementById('mainNav');
  
  if (mobileMenuButton && navLinks) {
    mobileMenuButton.addEventListener('click', function() {
      const isOpen = navLinks.classList.contains('active');
      navLinks.classList.toggle('active');
      mobileMenuButton.setAttribute('aria-expanded', String(!isOpen));
      
      // Change hamburger icon to X when open
      const icon = mobileMenuButton.querySelector('.mobile-menu-icon');
      if (icon) {
        if (isOpen) {
          // Change to hamburger icon
          icon.innerHTML = '<path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" fill="currentColor"/>';
        } else {
          // Change to X icon
          icon.innerHTML = '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>';
        }
      }
    });
  }
  
  // Back to top button functionality
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Number counting animation for fun facts
  const funFactItems = document.querySelectorAll('.funfact-item h3[data-target]');
  
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseInt(element.getAttribute('data-target'));
        if (!isNaN(target) && !element.classList.contains('counted')) {
          element.classList.add('counted');
          let current = 0;
          const increment = target > 10000 ? Math.ceil(target / 20) : 
                          target > 1000 ? Math.ceil(target / 15) : 
                          target > 100 ? Math.ceil(target / 10) : 
                          target.includes('+') ? 5 : 10;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            element.textContent = current.toLocaleString() + (target.includes('+') ? '+' : '');
          }, 50);
        }
      }
    });
  }, observerOptions);
  
  funFactItems.forEach(item => {
    countObserver.observe(item);
  });
});