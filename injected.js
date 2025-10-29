// E.P.S.O Injected Script - Page Context Protection

(function() {
  'use strict';

  // Spoof navigator properties
  Object.defineProperty(navigator, 'webdriver', {
    get: () => false
  });

  // Spoof battery API
  if (navigator.getBattery) {
    navigator.getBattery = () => Promise.reject(new Error('Battery API not available'));
  }

  // Spoof device memory
  if (navigator.deviceMemory) {
    Object.defineProperty(navigator, 'deviceMemory', {
      get: () => 8
    });
  }

  // Spoof hardware concurrency
  Object.defineProperty(navigator, 'hardwareConcurrency', {
    get: () => 4
  });

  // Block connection API
  if (navigator.connection) {
    Object.defineProperty(navigator, 'connection', {
      get: () => undefined
    });
  }

  // Spoof plugins
  Object.defineProperty(navigator, 'plugins', {
    get: () => {
      return {
        length: 0,
        item: () => null,
        namedItem: () => null,
        refresh: () => {}
      };
    }
  });

  // Spoof mimeTypes
  Object.defineProperty(navigator, 'mimeTypes', {
    get: () => {
      return {
        length: 0,
        item: () => null,
        namedItem: () => null
      };
    }
  });

  // Block notification permissions
  if (window.Notification) {
    const originalRequestPermission = Notification.requestPermission;
    Notification.requestPermission = function() {
      return Promise.resolve('denied');
    };
  }

  // Block geolocation
  if (navigator.geolocation) {
    const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
    const originalWatchPosition = navigator.geolocation.watchPosition;
    
    navigator.geolocation.getCurrentPosition = function(success, error) {
      if (error) {
        error({ code: 1, message: 'User denied geolocation' });
      }
    };
    
    navigator.geolocation.watchPosition = function(success, error) {
      if (error) {
        error({ code: 1, message: 'User denied geolocation' });
      }
      return 0;
    };
  }

  // Spoof timezone
  const originalDateTimeFormat = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function() {
    const instance = new originalDateTimeFormat(...arguments);
    const originalResolvedOptions = instance.resolvedOptions;
    
    instance.resolvedOptions = function() {
      const options = originalResolvedOptions.call(this);
      options.timeZone = 'UTC';
      return options;
    };
    
    return instance;
  };

  // Protect against timing attacks
  if (window.performance && window.performance.now) {
    const originalNow = window.performance.now;
    const startTime = originalNow.call(window.performance);
    
    window.performance.now = function() {
      // Round to millisecond precision to prevent timing attacks
      return Math.round(originalNow.call(window.performance) - startTime);
    };
  }

  // Block screen fingerprinting with variance
  const screenProperties = ['width', 'height', 'availWidth', 'availHeight', 'colorDepth', 'pixelDepth'];
  const originalScreen = window.screen;
  
  const spoofedScreen = {};
  screenProperties.forEach(prop => {
    Object.defineProperty(spoofedScreen, prop, {
      get: function() {
        const original = originalScreen[prop];
        // Add small variance to prevent fingerprinting
        if (typeof original === 'number') {
          return original + Math.floor(Math.random() * 3) - 1;
        }
        return original;
      }
    });
  });
  
  Object.setPrototypeOf(spoofedScreen, Screen.prototype);
  Object.defineProperty(window, 'screen', {
    get: () => spoofedScreen
  });

  console.log('E.P.S.O: Page context protection injected');
})();