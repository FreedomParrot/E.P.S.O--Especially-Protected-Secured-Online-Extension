// E.P.S.O Popup Script

// Load current stats and settings
function loadStats() {
  browser.runtime.sendMessage({ type: 'getStats' }).then(response => {
    const { stats, settings } = response;
    
    // Update stats display
    document.getElementById('trackersBlocked').textContent = stats.trackersBlocked;
    document.getElementById('cookiesBlocked').textContent = stats.cookiesBlocked;
    
    // Update toggle states
    document.getElementById('blockTrackers').checked = settings.blockTrackers;
    document.getElementById('blockCookies').checked = settings.blockCookies;
    document.getElementById('spoofUserAgent').checked = settings.spoofUserAgent;
    document.getElementById('removeReferrer').checked = settings.removeReferrer;
    document.getElementById('httpsOnly').checked = settings.httpsOnly;
  });
}

// Save settings when toggles change
function setupToggleListeners() {
  const toggles = [
    'blockTrackers',
    'blockCookies',
    'spoofUserAgent',
    'removeReferrer',
    'httpsOnly'
  ];
  
  toggles.forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      const settings = {};
      settings[id] = e.target.checked;
      
      browser.runtime.sendMessage({
        type: 'updateSettings',
        settings: settings
      });
    });
  });
}

// Reset statistics
document.getElementById('resetStats').addEventListener('click', () => {
  browser.runtime.sendMessage({ type: 'resetStats' }).then(() => {
    loadStats();
  });
});

// Open settings page
document.getElementById('openSettings').addEventListener('click', () => {
  browser.runtime.openOptionsPage();
});

// Initialize
loadStats();
setupToggleListeners();

// Refresh stats every 2 seconds
setInterval(loadStats, 2000);