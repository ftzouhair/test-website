// Service Image Handling
document.addEventListener('DOMContentLoaded', function() {
  // Handle service image placeholders
  const serviceImages = document.querySelectorAll('.service-img, .fleet-img');
  
  serviceImages.forEach(img => {
    // Create placeholder if image fails to load
    img.addEventListener('error', function() {
      const parent = this.parentElement;
      parent.classList.add('image-error');
      
      // Add retry mechanism
      setTimeout(() => {
        this.src = this.src + '?retry=' + new Date().getTime();
      }, 5000);
    });
    
    // Add loading class for styling
    img.classList.add('loading');
    
    // Remove loading class when image loads
    img.addEventListener('load', function() {
      this.classList.remove('loading');
    });
  });
  
  // Add intersection observer for image lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });
    
    serviceImages.forEach(img => {
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }
  
  // Add fallback for browsers that don't support IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    serviceImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  }
});