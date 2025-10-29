# 🛡️ E.P.S.O - Especially Protected Secured Online

A comprehensive privacy protection extension for Firefox that keeps you anonymous online and protects against data harvesting and surveillance.

## 🚀 Features

### Core Privacy Protection
- **Tracker Blocking**: Blocks Google Analytics, Facebook Pixel, DoubleClick, and other major tracking services
- **Cookie Protection**: Automatically blocks third-party cookies to prevent cross-site tracking
- **HTTPS Enforcement**: Automatically upgrades insecure HTTP connections to HTTPS
- **Header Privacy**: Removes referrer headers and spoofs User-Agent strings

### Advanced Anti-Fingerprinting
- **Canvas Fingerprinting Protection**: Adds noise to canvas operations to prevent fingerprinting
- **WebGL Fingerprinting Defense**: Spoofs WebGL renderer information
- **Font Fingerprinting Prevention**: Adds variance to font measurements
- **Audio Fingerprinting Protection**: Randomizes audio context signatures
- **Screen Fingerprinting**: Adds variance to screen dimension readings

### Additional Protections
- **WebRTC IP Leak Prevention**: Blocks WebRTC to prevent IP address leaks
- **Geolocation Blocking**: Denies geolocation requests by default
- **Battery API Blocking**: Prevents battery status fingerprinting
- **Notification Blocking**: Denies notification permission requests
- **Performance API Protection**: Filters tracking-related performance entries

## 📁 File Structure

```
E.P.S.O/
├── manifest.json          # Extension configuration
├── background.js          # Core privacy protection logic
├── content.js            # Content script for fingerprinting protection
├── injected.js           # Page context protection
├── popup/
│   ├── popup.html        # Extension popup interface
│   └── popup.js          # Popup functionality
├── options/
│   └── options.html      # Settings page (create this)
└── icons/
    ├── shield-48.png     # Extension icon 48x48
    └── shield-96.png     # Extension icon 96x96
```

## 🔧 Installation

### Step 1: Create the Extension Files

1. Create a new folder called `E.P.S.O`
2. Inside it, create the following subfolders:
   - `popup/`
   - `options/`
   - `icons/`

3. Copy each file to its correct location:
   - `manifest.json` → root folder
   - `background.js` → root folder
   - `content.js` → root folder
   - `injected.js` → root folder
   - `popup.html` → `popup/` folder
   - `popup.js` → `popup/` folder

### Step 2: Create Icons

Create two shield icons for your extension:
- `icons/shield-48.png` (48x48 pixels)
- `icons/shield-96.png` (96x96 pixels)

You can use any shield/security icon or create simple colored squares as placeholders.

### Step 3: Create Options Page

Create `options/options.html` with this basic content:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>E.P.S.O Settings</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      color: #1e3c72;
    }
  </style>
</head>
<body>
  <h1>🛡️ E.P.S.O Settings</h1>
  <p>Advanced settings will be available in future versions.</p>
  <p>Use the popup to toggle protection features.</p>
</body>
</html>
```

### Step 4: Install in Firefox

1. Open Firefox and type `about:debugging` in the address bar
2. Click on "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to your `E.P.S.O` folder
5. Select the `manifest.json` file
6. Click "Open"

The extension is now installed! You should see the shield icon in your toolbar.

## 📊 Usage

1. **Click the shield icon** in your toolbar to open the popup
2. **View statistics** showing how many trackers and cookies have been blocked
3. **Toggle features** on/off using the switches
4. **Reset statistics** using the Reset Stats button

### Protection Features

All features are enabled by default:

- ✅ **Block Trackers** - Stops known tracking domains
- ✅ **Block Third-Party Cookies** - Prevents cross-site tracking
- ✅ **Spoof User Agent** - Hides your browser fingerprint
- ✅ **Remove Referrer Headers** - Prevents referer tracking
- ✅ **HTTPS Only** - Forces secure connections

## 🔍 What Gets Blocked?

The extension blocks requests to known tracking domains including:
- google-analytics.com
- facebook.net
- doubleclick.net
- googletagmanager.com
- googlesyndication.com
- And many more...

## ⚠️ Important Notes

- This is a **temporary installation**. The extension will be removed when you restart Firefox.
- For **permanent installation**, you'll need to sign the extension through Mozilla or use Firefox Developer Edition.
- Some websites may not function correctly with all protections enabled. You can disable specific features if needed.

## 🛠️ Development

To make changes:
1. Edit the relevant files
2. Go to `about:debugging`
3. Click "Reload" next to your extension

## 📝 License

This extension is provided as-is for privacy protection purposes.

## 🔒 Privacy Statement

E.P.S.O does not collect, store, or transmit any user data. All protection happens locally on your device.

---

**Stay safe. Stay anonymous. Stay protected with E.P.S.O.**