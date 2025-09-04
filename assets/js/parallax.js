// Parallax scrolling effect for hero section
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the home page
  if (!document.body.classList.contains('page-home')) {
    return;
  }

  // Get the hero section
  const heroSection = document.querySelector('.hero');
  
  // If hero section exists, add parallax effect
  if (heroSection) {
    // Store the original background
    const originalBackground = heroSection.style.background || '';
    
    // Add scroll event listener for parallax effect
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      // Apply parallax transformation
      heroSection.style.backgroundPosition = `center ${50 + rate * 0.1}%`;
    });
  }
});