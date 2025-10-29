// E.P.S.O Content Script - Anti-Fingerprinting

(function() {
  'use strict';

  // Inject anti-fingerprinting script into page context
  const script = document.createElement('script');
  script.src = browser.runtime.getURL('injected.js');
  script.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);

  // Block canvas fingerprinting
  const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
  const originalToBlob = HTMLCanvasElement.prototype.toBlob;
  const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

  // Add noise to canvas operations
  function addCanvasNoise(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Add minimal random noise to RGB channels
      data[i] += Math.floor(Math.random() * 3) - 1;
      data[i + 1] += Math.floor(Math.random() * 3) - 1;
      data[i + 2] += Math.floor(Math.random() * 3) - 1;
    }
    return imageData;
  }

  // Override canvas methods
  HTMLCanvasElement.prototype.toDataURL = function() {
    const context = this.getContext('2d');
    if (context) {
      const imageData = context.getImageData(0, 0, this.width, this.height);
      addCanvasNoise(imageData);
      context.putImageData(imageData, 0, 0);
    }
    return originalToDataURL.apply(this, arguments);
  };

  // Block WebGL fingerprinting
  const getParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function(parameter) {
    // Return generic values for fingerprinting parameters
    if (parameter === 37445) { // UNMASKED_VENDOR_WEBGL
      return 'Intel Inc.';
    }
    if (parameter === 37446) { // UNMASKED_RENDERER_WEBGL
      return 'Intel Iris OpenGL Engine';
    }
    return getParameter.apply(this, arguments);
  };

  // Block font fingerprinting
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    get: function() {
      const width = originalOffsetWidth.get.call(this);
      // Add small random variance to prevent font fingerprinting
      return width + (Math.random() * 0.0001);
    }
  });

  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    get: function() {
      const height = originalOffsetHeight.get.call(this);
      return height + (Math.random() * 0.0001);
    }
  });

  // Block audio fingerprinting
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) {
    const OriginalAudioContext = AudioContext;
    const nativeCreateBufferSource = AudioContext.prototype.createBufferSource;
    
    AudioContext.prototype.createBufferSource = function() {
      const source = nativeCreateBufferSource.call(this);
      const originalStart = source.start;
      
      source.start = function() {
        // Add minimal delay randomization
        const args = Array.from(arguments);
        if (args[0] !== undefined) {
          args[0] += Math.random() * 0.0001;
        }
        return originalStart.apply(this, args);
      };
      
      return source;
    };
  }

  // Prevent tracking through performance API
  if (window.performance && window.performance.getEntries) {
    const originalGetEntries = window.performance.getEntries;
    window.performance.getEntries = function() {
      const entries = originalGetEntries.call(this);
      // Filter out potential tracking entries
      return entries.filter(entry => {
        return !entry.name.includes('analytics') && 
               !entry.name.includes('tracking') &&
               !entry.name.includes('beacon');
      });
    };
  }

  console.log('E.P.S.O: Anti-fingerprinting protection active');
})();