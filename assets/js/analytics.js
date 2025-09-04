// Analytics script for VELARION Skies
(function() {
  // Check if analytics should be loaded
  if (typeof window === 'undefined') return;
  
  // Load Google Analytics if ID is provided
  const gaMeasurementId = process.env.GA_MEASUREMENT_ID || window.env?.GA_MEASUREMENT_ID;
  if (gaMeasurementId) {
    // Create script element
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
    
    // Insert script before first script tag
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(gaScript, firstScript);
    
    // Initialize GA
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', gaMeasurementId);
    
    console.log('Google Analytics loaded with ID:', gaMeasurementId);
  }
  
  // Load Microsoft Clarity if ID is provided
  const clarityId = process.env.CLARITY_ID || window.env?.CLARITY_ID;
  if (clarityId) {
    // Create script element
    const clarityScript = document.createElement('script');
    clarityScript.textContent = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");
    `;
    
    // Insert script before first script tag
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(clarityScript, firstScript);
    
    console.log('Microsoft Clarity loaded with ID:', clarityId);
  }
  
  // Track page views
  function trackPageView() {
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }
  
  // Track clicks on external links
  function trackExternalLinks() {
    document.addEventListener('click', function(event) {
      const link = event.target.closest('a');
      if (link && link.hostname !== window.location.hostname) {
        if (typeof gtag === 'function') {
          gtag('event', 'click', {
            event_category: 'outbound',
            event_label: link.href,
            transport_type: 'beacon'
          });
        }
      }
    });
  }
  
  // Track form submissions
  function trackFormSubmissions() {
    document.addEventListener('submit', function(event) {
      const form = event.target;
      if (form.tagName === 'FORM') {
        const formId = form.id || form.name || 'unknown';
        if (typeof gtag === 'function') {
          gtag('event', 'submit', {
            event_category: 'form',
            event_label: formId
          });
        }
      }
    });
  }
  
  // Initialize tracking when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      trackPageView();
      trackExternalLinks();
      trackFormSubmissions();
    });
  } else {
    trackPageView();
    trackExternalLinks();
    trackFormSubmissions();
  }
  
  // Track page views on SPA navigation
  window.addEventListener('popstate', trackPageView);
})();