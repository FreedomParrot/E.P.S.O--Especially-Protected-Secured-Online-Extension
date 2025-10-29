// E.P.S.O Background Script - Privacy Protection Core

// Known tracking domains and patterns
const trackingDomains = [
  'google-analytics.com',
  'facebook.net',
  'doubleclick.net',
  'scorecardresearch.com',
  'amazon-adsystem.com',
  'googletagmanager.com',
  'googlesyndication.com',
  'facebook.com/tr',
  'connect.facebook.net',
  'adservice.google.com',
  'ads.twitter.com',
  'analytics.twitter.com'
];

// Privacy settings
let settings = {
  blockTrackers: true,
  blockCookies: true,
  spoofUserAgent: true,
  removeReferrer: true,
  blockWebRTC: true,
  blockFingerprinting: true,
  httpsOnly: true
};

// Statistics
let stats = {
  trackersBlocked: 0,
  cookiesBlocked: 0,
  requestsModified: 0
};

// Whitelist
let whitelist = [];

// Load settings and whitelist
browser.storage.local.get(['epsoSettings', 'whitelist']).then(result => {
  if (result.epsoSettings) {
    settings = { ...settings, ...result.epsoSettings };
  }
  if (result.whitelist) {
    whitelist = result.whitelist;
  }
});

// Check if domain is whitelisted
function isWhitelisted(url) {
  try {
    const hostname = new URL(url).hostname;
    return whitelist.some(domain => {
      return hostname === domain || hostname.endsWith('.' + domain);
    });
  } catch (e) {
    return false;
  }
}

// Block tracking requests
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!settings.blockTrackers) return {};
    
    // Skip if domain is whitelisted
    if (isWhitelisted(details.url)) return {};
    
    const url = new URL(details.url);
    
    // Check if domain matches tracking patterns
    for (let domain of trackingDomains) {
      if (url.hostname.includes(domain)) {
        stats.trackersBlocked++;
        updateBadge();
        return { cancel: true };
      }
    }
    
    return {};
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Modify headers for privacy
browser.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    // Skip if domain is whitelisted
    if (isWhitelisted(details.url)) return {};
    
    let headers = details.requestHeaders;
    
    // Remove/modify tracking headers
    if (settings.removeReferrer) {
      headers = headers.filter(h => h.name.toLowerCase() !== 'referer');
      stats.requestsModified++;
    }
    
    // Spoof User-Agent
    if (settings.spoofUserAgent) {
      const genericUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0';
      headers = headers.map(h => {
        if (h.name.toLowerCase() === 'user-agent') {
          stats.requestsModified++;
          return { name: h.name, value: genericUA };
        }
        return h;
      });
    }
    
    // Remove tracking headers
    const trackingHeaders = ['x-client-data', 'x-chrome-uma-enabled'];
    headers = headers.filter(h => !trackingHeaders.includes(h.name.toLowerCase()));
    
    return { requestHeaders: headers };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

// Block third-party cookies
browser.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (!settings.blockCookies) return {};
    
    // Skip if domain is whitelisted
    if (isWhitelisted(details.url)) return {};
    
    let headers = details.responseHeaders;
    
    // Remove Set-Cookie headers from third-party requests
    if (details.type !== 'main_frame') {
      const cookieHeaders = headers.filter(h => h.name.toLowerCase() === 'set-cookie');
      if (cookieHeaders.length > 0) {
        stats.cookiesBlocked += cookieHeaders.length;
        headers = headers.filter(h => h.name.toLowerCase() !== 'set-cookie');
        updateBadge();
      }
    }
    
    return { responseHeaders: headers };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]
);

// Upgrade to HTTPS
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!settings.httpsOnly) return {};
    
    if (details.url.startsWith('http://')) {
      const httpsUrl = details.url.replace('http://', 'https://');
      return { redirectUrl: httpsUrl };
    }
    return {};
  },
  { urls: ["http://*/*"] },
  ["blocking"]
);

// Update badge with blocked count
function updateBadge() {
  const total = stats.trackersBlocked + stats.cookiesBlocked;
  browser.browserAction.setBadgeText({ text: total > 0 ? total.toString() : '' });
  browser.browserAction.setBadgeBackgroundColor({ color: '#FF6B6B' });
}

// Handle messages from popup/content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getStats') {
    sendResponse({ stats, settings });
  } else if (message.type === 'updateSettings') {
    settings = { ...settings, ...message.settings };
    browser.storage.local.set({ epsoSettings: settings });
    sendResponse({ success: true });
  } else if (message.type === 'resetStats') {
    stats = { trackersBlocked: 0, cookiesBlocked: 0, requestsModified: 0 };
    updateBadge();
    sendResponse({ success: true });
  } else if (message.type === 'updateWhitelist') {
    whitelist = message.whitelist;
    browser.storage.local.set({ whitelist: whitelist });
    sendResponse({ success: true });
  }
  return true;
});

// Apply privacy settings to browser
function applyPrivacySettings() {
  if (settings.blockWebRTC) {
    // Block WebRTC to prevent IP leaks
    browser.privacy.network.webRTCIPHandlingPolicy.set({
      value: 'disable_non_proxied_udp'
    });
  }
  
  // Additional privacy settings
  browser.privacy.websites.thirdPartyCookiesAllowed.set({ value: false });
  browser.privacy.services.passwordSavingEnabled.set({ value: false });
}

// Initialize
applyPrivacySettings();
console.log('E.P.S.O Privacy Protection Active');