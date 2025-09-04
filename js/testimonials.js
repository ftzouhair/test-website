// Enhanced testimonial carousel with premium features
document.addEventListener('DOMContentLoaded', function() {
  const testimonialsShowcase = document.getElementById('testimonialsShowcase');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  const playPauseBtn = document.querySelector('.carousel-nav.play-pause');
  const pauseIcon = playPauseBtn?.querySelector('.pause-icon');
  const playIcon = playPauseBtn?.querySelector('.play-icon');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentSlide = 0;
  let slideInterval;
  let isPlaying = true;
  let touchStartX = 0;
  let touchEndX = 0;
  let filteredTestimonials = Array.from(testimonialCards);

  // Initialize the carousel
  function initCarousel() {
    // Set up automatic rotation
    if (isPlaying) {
      slideInterval = setInterval(nextSlide, 10000);
    }

    // Add event listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
      });
    }

    // Play/Pause button
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', togglePlayPause);
    }

    // Add click events to indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToSlide(index);
        resetInterval();
      });
    });

    // Pause on hover
    testimonialsShowcase.addEventListener('mouseenter', pauseInterval);
    testimonialsShowcase.addEventListener('mouseleave', () => {
      if (isPlaying) {
        slideInterval = setInterval(nextSlide, 10000);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        resetInterval();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetInterval();
      } else if (e.key === ' ' && testimonialsShowcase.contains(document.activeElement)) {
        e.preventDefault();
        togglePlayPause();
      }
    });

    // Touch events for mobile
    testimonialsShowcase.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    testimonialsShowcase.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active filter button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter testimonials
        const filter = btn.dataset.filter;
        filterTestimonials(filter);

        // Reset carousel
        currentSlide = 0;
        updateCarousel();
        resetInterval();
      });
    });

    // Image error handling
    document.querySelectorAll('.aircraft-image, .client-avatar img').forEach(img => {
      img.addEventListener('error', function() {
        this.src = '/images/placeholder.jpg'; // Fallback image
        this.alt = 'Image not available';
      });
    });

    // Initialize with proper state
    updateCarousel();
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left, go to next slide
        nextSlide();
      } else {
        // Swipe right, go to previous slide
        prevSlide();
      }
      resetInterval();
    }
  }

  function togglePlayPause() {
    isPlaying = !isPlaying;

    if (isPlaying) {
      slideInterval = setInterval(nextSlide, 10000);
      if (pauseIcon) pauseIcon.style.display = 'block';
      if (playIcon) playIcon.style.display = 'none';
      playPauseBtn.setAttribute('aria-label', 'Pause auto-rotation');
    } else {
      clearInterval(slideInterval);
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (playIcon) playIcon.style.display = 'block';
      playPauseBtn.setAttribute('aria-label', 'Play auto-rotation');
    }

    // Track interaction
    trackTestimonialInteraction(isPlaying ? 'play' : 'pause', 'carousel');
  }

  function filterTestimonials(filter) {
    // Reset filtered testimonials array
    if (filter === 'all') {
      filteredTestimonials = Array.from(testimonialCards);
    } else {
      // Filter testimonials based on data attribute
      filteredTestimonials = Array.from(testimonialCards).filter(card => {
        return card.dataset.category === filter;
      });
    }

    // Hide all testimonials first
    testimonialCards.forEach(card => {
      card.style.display = 'none';
      card.classList.remove('active');
    });

    // Show filtered testimonials
    filteredTestimonials.forEach(card => {
      card.style.display = 'flex';
    });

    // Update indicators
    updateIndicators();

    // If no testimonials match the filter, show a message
    if (filteredTestimonials.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'No testimonials match this filter.';
      testimonialsShowcase.appendChild(noResults);
    } else {
      const noResults = testimonialsShowcase.querySelector('.no-results');
      if (noResults) {
        noResults.remove();
      }
    }
  }

  function updateIndicators() {
    // Hide all indicators
    indicators.forEach(indicator => {
      indicator.style.display = 'none';
    });

    // Show indicators for filtered testimonials
    for (let i = 0; i < filteredTestimonials.length && i < indicators.length; i++) {
      indicators[i].style.display = 'block';
    }
  }

  function nextSlide() {
    const next = currentSlide === filteredTestimonials.length - 1 ? 0 : currentSlide + 1;
    goToSlide(next);
  }

  function prevSlide() {
    const prev = currentSlide === 0 ? filteredTestimonials.length - 1 : currentSlide - 1;
    goToSlide(prev);
  }

  function goToSlide(index) {
    // Ensure index is within bounds
    if (index < 0 || index >= filteredTestimonials.length) return;

    // Remove active classes
    filteredTestimonials.forEach(card => card.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active class to current slide and indicator
    if (filteredTestimonials[index]) {
      filteredTestimonials[index].classList.add('active');
      filteredTestimonials[index].focus();
    }

    if (indicators[index]) {
      indicators[index].classList.add('active');
    }

    currentSlide = index;

    // Announce slide change to screen readers
    announceSlideChange(index);

    // Track testimonial view
    if (filteredTestimonials[index]) {
      const testimonialId = filteredTestimonials[index].dataset.testimonial;
      trackTestimonialInteraction('view', testimonialId);
    }
  }

  function announceSlideChange(index) {
    // Create announcement element for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = `Showing testimonial ${index + 1} of ${filteredTestimonials.length}`;
    document.body.appendChild(announcement);

    // Remove announcement after it's been read
    setTimeout(() => announcement.remove(), 1000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    if (isPlaying) {
      slideInterval = setInterval(nextSlide, 10000);
    }
  }

  function pauseInterval() {
    clearInterval(slideInterval);
  }

  function trackTestimonialInteraction(action, testimonialId) {
    // This function would integrate with your analytics platform
    // Example for Google Analytics
    if (typeof gtag === 'function') {
      gtag('event', action, {
        'event_category': 'Testimonials',
        'event_label': testimonialId
      });
    }

    // Example for a custom analytics system
    if (typeof trackEvent === 'function') {
      trackEvent('testimonials', action, testimonialId);
    }

    // Console logging for development
    console.log(`Testimonial interaction: ${action} on ${testimonialId}`);
  }

  // Initialize the carousel
  initCarousel();

  // Update active slide on visibility change
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      pauseInterval();
    } else if (isPlaying) {
      slideInterval = setInterval(nextSlide, 10000);
    }
  });

  // Expose functions for external access if needed
  window.testimonialsCarousel = {
    nextSlide,
    prevSlide,
    goToSlide,
    togglePlayPause,
    filterTestimonials
  };
});
