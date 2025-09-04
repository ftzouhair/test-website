// Enhanced Card Animations
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a page that uses enhanced cards
  const enhancedCardPages = ['page-home', 'page-services', 'page-booking', 'page-faq'];
  const bodyClass = document.body.className;
  
  if (!enhancedCardPages.some(page => bodyClass.includes(page))) {
    return;
  }
  
  // Add 3D tilt effect to cards
  const cards = document.querySelectorAll('.card, .service-card, .how-it-works-card, .performance-card, .destination-card, .testimonial, .faq-item');
  
  cards.forEach(card => {
    // Add mouse move event for 3D tilt effect
    card.addEventListener('mousemove', function(e) {
      const cardRect = this.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;
      
      const rotateY = (mouseX / cardRect.width) * 10; // Max 10 degrees
      const rotateX = -(mouseY / cardRect.height) * 10; // Max 10 degrees
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    // Reset transform on mouse leave
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
    
    // Add hover effect classes
    card.addEventListener('mouseenter', function() {
      this.classList.add('hover');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('hover');
    });
  });
  
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple element
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      // Position ripple at click location
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      // Add ripple to button
      this.appendChild(ripple);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add floating animation to cards
  function addFloatingAnimation() {
    const floatCards = document.querySelectorAll('.card, .service-card, .how-it-works-card, .performance-card, .destination-card');
    
    floatCards.forEach((card, index) => {
      // Add delay based on index for staggered effect
      const delay = index * 0.1;
      
      // Add floating animation
      card.style.animation = `float 6s ease-in-out ${delay}s infinite`;
    });
  }
  
  // Add floating animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.7);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Initialize floating animation
  addFloatingAnimation();
  
  // FAQ accordion functionality with enhanced animations
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      question.addEventListener('click', function() {
        const isOpen = answer.style.display === 'block';
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) {
              otherAnswer.style.display = 'none';
              otherItem.classList.remove('active');
            }
          }
        });
        
        // Toggle current item
        if (isOpen) {
          answer.style.display = 'none';
          item.classList.remove('active');
        } else {
          answer.style.display = 'block';
          item.classList.add('active');
          
          // Add smooth height animation
          answer.style.maxHeight = '0';
          answer.style.overflow = 'hidden';
          
          // Force reflow
          answer.offsetHeight;
          
          answer.style.maxHeight = answer.scrollHeight + 'px';
          
          // Clean up
          setTimeout(() => {
            answer.style.maxHeight = 'none';
          }, 300);
        }
      });
    }
  });
});