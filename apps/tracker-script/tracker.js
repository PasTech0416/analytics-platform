(function() {
  const BACKEND_URL = 'http://localhost:4000/api/collect';

  function trackEvent(eventName, metadata = {}) {
    const payload = {
      event: eventName,
      url: window.location.href,
      timestamp: Date.now(),
      metadata: metadata
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(BACKEND_URL, JSON.stringify(payload));
    } else {
      fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    trackEvent('page_view');
  });

  window.AnalyticsTracker = { trackEvent };
})();
