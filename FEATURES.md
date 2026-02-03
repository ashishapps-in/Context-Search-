# Context Search+ v2.0 - Complete Feature Guide

**Developer:** ASHISH APPS

## 📑 Table of Contents
1. [Smart Utility Buttons](#smart-utility-buttons)
2. [Context-Aware Features](#context-aware-features)
3. [Privacy Mode](#privacy-mode)
4. [Reading & Research Tools](#reading--research-tools)
5. [UI/UX Polish](#uiux-polish)
6. [Settings & Customization](#settings--customization)

---

## 🛠️ Smart Utility Buttons

### 📋 Clean Copy
**Problem Solved:** When copying text from websites, you often get unwanted formatting, "Read more at..." links, or invisible characters.

**How It Works:**
- Select any text
- Click the 📋 Clean Copy button
- Text is copied to clipboard as plain text
- All formatting, links, and extra whitespace removed

**Example:**
```
Before: "This is great content... Read more at example.com [Subscribe] "
After: "This is great content"
```

**Use Cases:**
- Copying quotes for essays
- Extracting text from PDFs
- Cleaning up formatted text
- Pasting into plain text editors

---

### 🔊 Say It (Text-to-Speech)
**Problem Solved:** Need to hear how your writing flows, or want to listen while multitasking?

**How It Works:**
- Select any text
- Click the 🔊 Say It button
- Browser reads text aloud using built-in TTS
- Adjustable speed, pitch, and volume in browser settings

**Use Cases:**
- Proofreading your own writing
- Learning pronunciation
- Accessibility
- Multitasking (listen while cooking, exercising, etc.)
- Language learning

**Technical Details:**
- Uses Chrome's native TTS API
- No external services required
- Works offline
- Respects system voice settings

---

## 🧠 Context-Aware Features

### 📍 Address Detector
**Problem Solved:** Found an address? Want to see it on a map immediately?

**How It Works:**
- Extension detects when selected text is an address
- Automatically shows 📍 Maps button
- Click to open in Google Maps
- Works with various address formats

**Detected Patterns:**
- Street addresses: "123 Main Street, Springfield"
- City, State, ZIP: "New York, NY 10001"
- Full addresses: "1600 Pennsylvania Ave NW, Washington, DC 20500"

**Use Cases:**
- Finding business locations
- Planning routes
- Real estate research
- Event planning

---

### 💻 Code Detector
**Problem Solved:** Found code in an article? Want to search for similar implementations?

**How It Works:**
- Detects programming language patterns
- Prioritizes GitHub button when code is selected
- Searches GitHub code repositories

**Detected Patterns:**
- Variable declarations: `const x = 5;`
- Functions: `function myFunc() {}`
- Imports: `import React from 'react'`
- HTML/JSX: `<div className="example">`

**Languages Supported:**
- JavaScript/TypeScript
- Python
- Java
- C/C++
- HTML/CSS
- And more...

---

### ⚖️ Unit Converter
**Problem Solved:** Seeing measurements in unfamiliar units? Get instant conversions!

**How It Works:**
- Detects units in selected text
- Automatically calculates conversion
- Shows result in ⚖️ button tooltip
- Click to see full conversion

**Supported Conversions:**

**Weight:**
- kg ↔ lbs (kilograms ↔ pounds)
- g ↔ oz (grams ↔ ounces)

**Distance:**
- km ↔ miles
- m ↔ ft (meters ↔ feet)
- cm ↔ in (centimeters ↔ inches)

**Temperature:**
- °C ↔ °F (Celsius ↔ Fahrenheit)

**Examples:**
```
Input: "50 kg"        → Output: "110.23 lbs"
Input: "100 miles"    → Output: "160.93 km"
Input: "25°C"         → Output: "77.00°F"
```

---

## 🦆 Privacy Mode Search

### DuckDuckGo Incognito
**Problem Solved:** Want to search without leaving traces or getting targeted ads?

**How It Works:**
- Opens DuckDuckGo in incognito window
- No search history saved
- No tracking cookies
- No personalized ads

**Benefits:**
- Private browsing
- No filter bubble
- Clean search results
- Doesn't affect your regular browsing

**Use Cases:**
- Sensitive research
- Gift shopping (no spoiler ads!)
- Medical information
- Financial research
- Any private topic

---

## 📖 Reading & Research Tools

### 💾 Save to Notes
**Problem Solved:** Found a great quote but don't want to lose it?

**How It Works:**
- Select text you want to save
- Click 💾 Save to Notes
- Text saved with source URL and timestamp
- Access all notes from Settings page

**Features:**
- Stores last 100 notes
- Shows source URL for each note
- Organized by date
- One-click to return to source
- Export capability

**Use Cases:**
- Research projects
- Quote collection
- Learning notes
- Article snippets
- Important information

---

### 📖 Define
**Problem Solved:** Don't know what a word means? Get instant definitions!

**How It Works:**
- Select a single word
- Click 📖 Define button
- Inline popup shows definition
- Includes part of speech

**Features:**
- Free Dictionary API
- No account required
- Works offline after first lookup
- Shows pronunciation (when available)
- Multiple definitions

**Example:**
```
Word: "serendipity"
Part of Speech: noun
Definition: "The occurrence of events by chance in a happy or beneficial way"
```

---

## 🎨 UI/UX Polish

### Glassmorphism Design
**What It Is:** Modern UI design with blur effects and transparency

**Features:**
- Semi-transparent backgrounds
- Backdrop blur (10-20px)
- Subtle borders and shadows
- Frosted glass appearance

**Benefits:**
- Beautiful, modern look
- Works on any background
- Doesn't obstruct content
- Professional appearance

**Technical Details:**
```css
backdrop-filter: blur(20px) saturate(180%);
background: rgba(255, 255, 255, 0.85);
border: 1px solid rgba(255, 255, 255, 0.3);
```

---

### Dark Mode Support
**Problem Solved:** Bright UI hurting your eyes at night?

**How It Works:**
- Automatically detects system dark mode
- Adjusts all colors and contrasts
- Maintains readability
- Smooth transitions

**Features:**
- System preference detection
- Manual override (coming soon)
- All UI elements adapted
- Proper contrast ratios

---

### Smooth Animations
**What's Included:**
- Fade-in effects for bubble appearance
- Hover transformations on buttons
- Press feedback animations
- Notification slides
- Tooltip transitions

**Benefits:**
- Feels responsive and polished
- Visual feedback for actions
- Professional appearance
- Smooth, not jarring

---

## ⚙️ Settings & Customization

### Custom Search URLs
**Problem Solved:** Need to search specialized databases or internal tools?

**How It Works:**
1. Go to Settings → Custom Search Engines
2. Add name, icon (emoji), and URL
3. Use `%s` where selected text should go
4. Custom search appears in menu

**Example Custom Searches:**

**Wikipedia:**
```
Name: Wikipedia
Icon: 📚
URL: https://en.wikipedia.org/wiki/%s
```

**Stack Overflow:**
```
Name: Stack Overflow
Icon: 📚
URL: https://stackoverflow.com/search?q=%s
```

**Your Company's Internal Wiki:**
```
Name: Company Wiki
Icon: 🏢
URL: https://wiki.yourcompany.com/search?q=%s
```

**Medical Database:**
```
Name: PubMed
Icon: ⚕️
URL: https://pubmed.ncbi.nlm.nih.gov/?term=%s
```

---

### Enable/Disable Features
**Full Control Over:**
- Each search engine
- Each utility feature
- Context-aware detection
- Display modes
- Floating bubble
- Context menu

**Benefits:**
- Clean, minimal menu
- Only what you need
- Faster access
- Personalized experience

**Settings Categories:**
1. **Display Mode**
   - Floating bubble on/off
   - Context menu on/off

2. **Search Engines**
   - YouTube, Reddit, GitHub
   - Google, DuckDuckGo
   - Custom searches

3. **Utility Features**
   - Translation, Clean Copy
   - TTS, Dictionary
   - Save Notes

4. **Context-Aware**
   - Address detection
   - Code detection
   - Unit converter

---

### Settings Persistence
**How It Works:**
- Settings saved to Chrome sync storage
- Syncs across your devices
- Instant updates
- No manual saving needed

**What's Stored:**
- Feature toggles
- Custom search URLs
- Display preferences
- Saved notes (local only)

---

## 🔧 Advanced Features

### Context Menu Customization
**Problem Solved:** Default Chrome context menu is cluttered

**Our Approach:**
- Single parent menu item "Context Search+"
- All options nested underneath
- Can be disabled entirely
- Clean organization

**Structure:**
```
Right-click →
  Context Search+ →
    🎥 Search on YouTube
    💬 Check Reddit
    💻 Find on GitHub
    ─────────────────
    🌐 Translate
    📋 Clean Copy
    🔊 Say It
    ─────────────────
    📚 Wikipedia (custom)
    🏢 Company Wiki (custom)
```

---

### Floating Bubble Behavior
**Smart Positioning:**
- Appears above selection
- Avoids screen edges
- Follows cursor
- Disappears when clicked away

**Smart Content:**
- Shows most relevant buttons first
- Hides in restricted contexts
- Adapts to selection type
- Maximum 8-10 buttons

---

### Keyboard Accessibility
**Current:**
- Tab navigation in settings
- Enter to activate buttons
- Escape to close bubble

**Coming Soon:**
- Global keyboard shortcuts
- Quick action hotkeys
- Custom key bindings

---

## 📊 Performance Features

### Efficient Detection
- Runs only on text selection
- Debounced for performance
- Minimal DOM manipulation
- No constant background scanning

### Lazy Loading
- APIs called only when needed
- Translations on-demand
- Definitions cached
- Fast response times

### Memory Management
- Cleans up on page unload
- Removes unused elements
- Efficient event listeners
- Notes limited to 100

---

## 🔐 Privacy & Security Features

### Local-First
- Settings stored locally
- Notes never leave device
- No external analytics
- No tracking

### Minimal Permissions
- Only required permissions
- No host permissions
- Limited to active tab
- Transparent about usage

### Secure APIs
- HTTPS only
- Trusted sources
- No user data sent
- Optional features

---

## 🚀 Performance Metrics

**Load Time:** <50ms  
**Bubble Appear:** <100ms  
**API Response:** <1s average  
**Memory Usage:** <10MB  
**CPU Impact:** Negligible  

---

## 💡 Pro Tips

1. **Disable Unused Features:** Faster menu, cleaner interface
2. **Custom Searches:** Add your most-used sites
3. **Keyboard + Mouse:** Select with keyboard, click bubble
4. **Save Notes Regularly:** Don't lose important info
5. **Use Privacy Mode:** For sensitive searches
6. **Context-Aware:** Let it detect for you
7. **Clean Copy Everything:** Better formatting
8. **TTS for Proofreading:** Hear mistakes you miss

---

**That's all the features in Context Search+ v2.0!**

*Developed by ASHISH APPS with ❤️*
