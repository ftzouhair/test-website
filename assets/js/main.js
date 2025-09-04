function pad2(n){ return String(n).padStart(2,'0'); }

// Haversine formula for calculating distance between two points
function haversine(lat1, lon1, lat2, lon2) {
  const R = 3440; // Earth radius in nautical miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Format time in HH:MM format
function formatTime(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${pad2(h)}:${pad2(m)}`;
}

document.addEventListener('DOMContentLoaded', () => {

  // --- DATA-DEPENDENT INITIALIZATION ---
  async function initializeFlightDataDependentFeatures() {
    try {
      
      
      // Populate all departure <select> elements
      document.querySelectorAll('.departure-selector').forEach(sel => {
        const dest = sel.dataset.destination;
        if (!dest) return;
        
        sel.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Select departure';
        placeholder.disabled = true;
        placeholder.selected = true;
        sel.appendChild(placeholder);
        
        // Add all cities to the departure selector
        CITIES.forEach(city => {
          const opt = document.createElement('option');
          opt.value = city.c;
          opt.textContent = `${city.c} — ${city.i}/${city.o}`;
          opt.setAttribute('data-la', city.la);
          opt.setAttribute('data-lo', city.lo);
          sel.appendChild(opt);
        });
      });

      // Initialize flight calculators
      document.querySelectorAll('.flight-calculator').forEach(fc => {
        const craft = fc.querySelector('.aircraft-selector');
        const dep = fc.querySelector('.departure-selector');
        const out = fc.querySelector('.calc-result');
        if(craft && dep && out) {
          function compute(){
            // Get selected departure city
            const depOption = dep.options[dep.selectedIndex];
            if (!depOption || !depOption.value) {
              out.textContent = '';
              return;
            }
            
            // Get departure coordinates
            const depLat = parseFloat(depOption.getAttribute('data-la'));
            const depLon = parseFloat(depOption.getAttribute('data-lo'));
            
            // Get destination from aircraft selector
            const destination = craft.dataset.destination;
            
            // Find destination coordinates in CITIES array
            const destCity = CITIES.find(city => city.i === destination);
            if (!destCity) {
              out.textContent = '';
              return;
            }
            
            // Calculate distance using Haversine formula
            const distance = haversine(depLat, depLon, destCity.la, destCity.lo);
            
            // Get selected jet type
            const jetType = craft.value;
            const jet = JETS[jetType];
            
            if (!jet) {
              out.textContent = '';
              return;
            }
            
            // Calculate flight time
            const baseH = distance / 460 + 0.3; // Base flight time in hours
            const hrs = baseH * jet.m; // Adjusted flight time
            
            // Calculate stops
            const stops = Math.max(0, Math.ceil(distance / (jet.r * 0.85)) - 1);
            
            // Get passenger capacity
            const pax = jet.p;
            
            // Format output
            out.innerHTML = `
              Estimated flight time: ${formatTime(hrs)}<br>
              Estimated stops: ${stops}<br>
              Typical pax capacity: ${pax}
            `;
          }
          [craft, dep].forEach(el => el.addEventListener('change', compute));
          compute();
        }
      });

    } catch (error) {
      console.error("Could not initialize flight data-dependent components:", error);
    }
  }

  // --- NON-DATA-DEPENDENT INITIALIZATIONS ---
  
  // Mobile menu functionality
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('active');
      navLinks.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      mobileMenu.setAttribute('aria-expanded', String(!isOpen));
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          mobileMenu.classList.remove('open');
          mobileMenu.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Smooth scroll, FAQ, etc.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.faq-item').forEach((item, i) => {
    const btn = item.querySelector('.faq-question');
    const panel = item.querySelector('.faq-answer');
    if(btn && panel) {
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.style.display = open ? 'none' : 'block';
      });
    }
  });

  const initScrollAnimations = () => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          if (entry.target.classList.contains('funfact-item')) {
            const targetElement = entry.target.querySelector('h3');
            if (targetElement && !targetElement.classList.contains('animated')) {
              targetElement.classList.add('animated');
              const targetText = targetElement.getAttribute('data-target');
              let current = 0;
              const target = parseInt(targetText.replace(/[^0-9]/g, ''));
              const duration = 1000;
              const increment = Math.max(1, Math.ceil(target / (duration / 16)));
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                targetElement.textContent = current.toLocaleString() + targetText.replace(/[0-9]/g, '');
              }, 16);
            }
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  };

  // KICK OFF ALL INITIALIZATIONS
  initializeFlightDataDependentFeatures();
  initScrollAnimations();
  
  // Booking form handler
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(bookingForm);
      const data = Object.fromEntries(formData.entries());
      
      // Add trip type if it exists
      const tripTypeInput = document.getElementById('trip-type');
      if (tripTypeInput) {
        data.tripType = tripTypeInput.value;
      }
      
      // Add additional services if they exist
      const additionalServices = [];
      document.querySelectorAll('input[name="additional-services"]:checked').forEach(checkbox => {
        additionalServices.push(checkbox.value);
      });
      if (additionalServices.length > 0) {
        data.additionalServices = additionalServices;
      }
      
      try {
        // Submit form data to API
        const response = await fetch('/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.ok) {
          // Redirect to thank you page on success
          window.location.href = '/thank-you.html';
        } else {
          // Display errors
          alert('Error: ' + result.errors.join(', '));
        }
      } catch (error) {
        console.error('Booking error:', error);
        alert('An unexpected error occurred. Please try again later.');
      }
    });
  }
  
  // GSAP Hero Section Animation
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    
    // 1. Background fade + scale
    tl.from(".hero-bg", {
      opacity: 0,
      scale: 1.05,
      duration: 1.2
    });
    
    // 2. Headline gold shimmer mask
    tl.from(".hero-title", {
      opacity: 0,
      y: 30,
      duration: 1,
      onStart: () => {
        const title = document.querySelector(".hero-title");
        title.classList.add("gold-shimmer"); // CSS handles shimmer effect
      }
    }, "-=0.8");
    
    // 3. Subheadline slide-up
    tl.from(".hero-subtitle", {
      opacity: 0,
      y: 30,
      duration: 0.8
    }, "-=0.6");
    
    // 4. CTA buttons stagger
    tl.from(".hero-cta", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.15,
      ease: "back.out(1.7)"
    }, "-=0.4");
    
    // 5. Scroll-triggered hero scale down
    gsap.to(".hero-section", {
      scale: 0.95,
      opacity: 0.85,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "bottom top",
        scrub: true
      }
    });
  }
});