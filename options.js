// E.P.S.O Options/Settings Page Script

let whitelist = [];

// Load all settings
async function loadSettings() {
  const response = await browser.runtime.sendMessage({ type: 'getStats' });
  const { settings } = response;
  
  // Update all toggle switches
  document.getElementById('blockTrackers').checked = settings.blockTrackers;
  document.getElementById('blockCookies').checked = settings.blockCookies;
  document.getElementById('spoofUserAgent').checked = settings.spoofUserAgent;
  document.getElementById('removeReferrer').checked = settings.removeReferrer;
  document.getElementById('httpsOnly').checked = settings.httpsOnly;
  document.getElementById('blockWebRTC').checked = settings.blockWebRTC;
  document.getElementById('blockFingerprinting').checked = settings.blockFingerprinting;
  
  // Load whitelist
  const stored = await browser.storage.local.get('whitelist');
  if (stored.whitelist) {
    whitelist = stored.whitelist;
    renderWhitelist();
  }
}

// Save all settings
async function saveSettings() {
  const settings = {
    blockTrackers: document.getElementById('blockTrackers').checked,
    blockCookies: document.getElementById('blockCookies').checked,
    spoofUserAgent: document.getElementById('spoofUserAgent').checked,
    removeReferrer: document.getElementById('removeReferrer').checked,
    httpsOnly: document.getElementById('httpsOnly').checked,
    blockWebRTC: document.getElementById('blockWebRTC').checked,
    blockFingerprinting: document.getElementById('blockFingerprinting').checked
  };
  
  await browser.runtime.sendMessage({
    type: 'updateSettings',
    settings: settings
  });
  
  // Save whitelist
  await browser.storage.local.set({ whitelist: whitelist });
  
  // Show success message
  showStatusMessage();
}

// Show status message
function showStatusMessage() {
  const message = document.getElementById('statusMessage');
  message.style.display = 'block';
  
  setTimeout(() => {
    message.style.display = 'none';
  }, 3000);
}

// Render whitelist items
function renderWhitelist() {
  const container = document.getElementById('whitelistItems');
  container.innerHTML = '';
  
  if (whitelist.length === 0) {
    container.innerHTML = '<p style="color: #9ca3af; font-size: 14px;">No domains whitelisted yet.</p>';
    return;
  }
  
  whitelist.forEach((domain, index) => {
    const tag = document.createElement('div');
    tag.className = 'whitelist-tag';
    tag.innerHTML = `
      <span>${domain}</span>
      <button onclick="removeDomain(${index})">×</button>
    `;
    container.appendChild(tag);
  });
}

// Add domain to whitelist
function addDomain() {
  const input = document.getElementById('whitelistInput');
  const domain = input.value.trim().toLowerCase();
  
  if (!domain) {
    alert('Please enter a domain name');
    return;
  }
  
  // Basic domain validation
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
  if (!domainRegex.test(domain)) {
    alert('Please enter a valid domain (e.g., example.com)');
    return;
  }
  
  // Check if already in whitelist
  if (whitelist.includes(domain)) {
    alert('This domain is already in the whitelist');
    return;
  }
  
  whitelist.push(domain);
  renderWhitelist();
  input.value = '';
  
  // Auto-save
  browser.storage.local.set({ whitelist: whitelist });
}

// Remove domain from whitelist
window.removeDomain = function(index) {
  if (confirm('Remove this domain from whitelist?')) {
    whitelist.splice(index, 1);
    renderWhitelist();
    
    // Auto-save
    browser.storage.local.set({ whitelist: whitelist });
  }
};

// Reset all data
async function resetAllData() {
  const confirmed = confirm(
    'Are you sure you want to reset all data?\n\n' +
    'This will:\n' +
    '- Clear all statistics\n' +
    '- Remove all whitelisted domains\n' +
    '- Reset settings to defaults\n\n' +
    'This action cannot be undone!'
  );
  
  if (!confirmed) return;
  
  // Reset statistics
  await browser.runtime.sendMessage({ type: 'resetStats' });
  
  // Clear whitelist
  whitelist = [];
  await browser.storage.local.remove('whitelist');
  renderWhitelist();
  
  // Reset settings to defaults
  const defaultSettings = {
    blockTrackers: true,
    blockCookies: true,
    spoofUserAgent: true,
    removeReferrer: true,
    blockWebRTC: true,
    blockFingerprinting: true,
    httpsOnly: true
  };
  
  await browser.runtime.sendMessage({
    type: 'updateSettings',
    settings: defaultSettings
  });
  
  // Reload settings display
  await loadSettings();
  
  alert('All data has been reset successfully!');
}

// Event listeners
document.getElementById('saveSettings').addEventListener('click', saveSettings);
document.getElementById('addWhitelist').addEventListener('click', addDomain);
document.getElementById('resetAll').addEventListener('click', resetAllData);

// Allow Enter key to add domain
document.getElementById('whitelistInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addDomain();
  }
});

// Auto-save when toggles change
const toggles = [
  'blockTrackers',
  'blockCookies',
  'spoofUserAgent',
  'removeReferrer',
  'httpsOnly',
  'blockWebRTC',
  'blockFingerprinting'
];

toggles.forEach(id => {
  document.getElementById(id).addEventListener('change', saveSettings);
});

// Initialize
loadSettings();