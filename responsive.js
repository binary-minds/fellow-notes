// Fellow Notes 2.0 - Backward-compatibility forwarder
(function() {
  if (typeof window !== 'undefined' && !window.__FELLOW_NOTES_INITIALIZED__) {
    // If app.js is not already loaded, dynamically load it safely
    if (!document.querySelector('script[src*="app.js"]')) {
      const script = document.createElement('script');
      script.src = 'app.js';
      script.defer = true;
      document.head.appendChild(script);
    }
  }
})();
