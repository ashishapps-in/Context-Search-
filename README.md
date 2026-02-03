# Context Search+ v2.0 🔍✨

**The Ultimate Power-User Tool with Smart Context-Aware Features**

A revolutionary Chrome extension that transforms how you interact with text on the web. Select any text and instantly access multiple search engines, smart utilities, and context-aware tools—all with a beautiful glassmorphism UI.

**Developer:** ASHISH APPS

---

## 🌟 What's New in v2.0

### 🛠️ Smart Utility Buttons
- **📋 Clean Copy** - Copy text as plain text, removing all formatting and "Read more..." links
- **🔊 Say It (TTS)** - Read highlighted text aloud using built-in Text-to-Speech
- **📖 Define** - Get instant dictionary definitions for words
- **💾 Save to Notes** - Save quotes and snippets for later reference

### 🧠 Context-Aware Intelligence
- **📍 Address Detection** - Automatically shows Google Maps button for addresses
- **💻 Code Detection** - Detects code snippets and prioritizes GitHub search
- **⚖️ Unit Converter** - Instantly converts measurements (kg↔lbs, km↔miles, °C↔°F, etc.)

### 🦆 Privacy Mode
- **DuckDuckGo Incognito** - Search privately without leaving traces in your history

### 🔧 Advanced Customization
- **Custom Search Engines** - Add your own specialized search URLs
- **Comprehensive Settings Page** - Enable/disable any feature
- **Flexible Display Modes** - Choose floating bubble, context menu, or both

### 🎨 Modern UI
- **Glassmorphism Design** - Beautiful blur effects and transparency
- **Dark Mode Support** - Automatically adapts to system preferences
- **Smooth Animations** - Polished transitions and interactions

---

## ✨ All Features

### Search Engines
- 🎥 **YouTube** - Find tutorials and videos
- 💬 **Reddit** - Discover real user reviews
- 💻 **GitHub** - Locate code snippets
- 🔍 **Google** - Standard web search
- 🦆 **DuckDuckGo** - Privacy-focused search (incognito mode)

### Utility Tools
- 🌐 **Translation** - Inline translation bubble
- 📋 **Clean Copy** - Copy as plain text
- 🔊 **Text-to-Speech** - Read aloud
- 📖 **Dictionary** - Word definitions
- 💾 **Save Notes** - Save for later
- ⚖️ **Unit Converter** - Auto-convert measurements

### Context-Aware Features
- 📍 **Address Detection** - Opens in Google Maps
- 💻 **Code Detection** - Prioritizes GitHub
- ⚖️ **Measurement Detection** - Shows conversion instantly
- 📖 **Single Word Detection** - Shows dictionary for single words

### Customization
- 🔗 **Custom Search URLs** - Add specialized databases
- ⚙️ **Full Settings Control** - Enable/disable any feature
- 🎨 **Display Options** - Floating bubble and/or context menu

---

## 📦 Installation

### Method 1: Load Unpacked (Development)

1. **Download** this repository
2. **Extract** the `context-search-plus` folder
3. Open Chrome and go to `chrome://extensions/`
4. Enable **"Developer mode"** (top-right corner)
5. Click **"Load unpacked"**
6. Select the `context-search-plus` folder
7. Done! 🎉

### Method 2: From Chrome Web Store (Coming Soon)
Extension will be published to the Chrome Web Store soon!

---

## 🚀 How to Use

### Floating Bubble (Default)
1. Highlight any text on a webpage
2. A beautiful glassmorphic bubble appears automatically
3. Click any icon to perform an action
4. Results open instantly!

### Right-Click Context Menu
1. Highlight any text
2. Right-click to open the context menu
3. Look for "Context Search+"
4. Select your desired option

### Context-Aware Examples

**Address Example:**
```
Highlight: "1600 Pennsylvania Avenue NW, Washington, DC"
→ Automatically shows 📍 Maps button
```

**Unit Example:**
```
Highlight: "50 kg"
→ Shows ⚖️ Convert button with "110.23 lbs"
```

**Code Example:**
```
Highlight: "const x = 5;"
→ Prioritizes 💻 GitHub button
```

---

## ⚙️ Settings & Customization

Access settings by clicking the extension icon → **Open Settings**

### Display Mode
- ✅ **Floating Bubble** - Modern inline menu
- ✅ **Context Menu** - Traditional right-click menu
- Choose one or both!

### Enable/Disable Features
Toggle any feature on or off:
- Search engines (YouTube, Reddit, GitHub, Google, DuckDuckGo)
- Utilities (Translate, Clean Copy, TTS, Define, Save Notes)
- Context-aware features (Maps, Unit Converter)

### Custom Search Engines
Add your own search URLs:

1. Go to Settings → Custom Search Engines
2. Enter:
   - **Name**: Wikipedia
   - **Icon**: 📚
   - **URL**: `https://en.wikipedia.org/wiki/%s`
3. Use `%s` where selected text should appear
4. Click "Add Custom Search"

**Example Custom Searches:**
```
Stack Overflow: https://stackoverflow.com/search?q=%s
MDN Docs: https://developer.mozilla.org/en-US/search?q=%s
Amazon: https://www.amazon.com/s?k=%s
Twitter: https://twitter.com/search?q=%s
IMDB: https://www.imdb.com/find?q=%s
```

### Saved Notes
- View all saved text snippets
- Organized by date and source URL
- Clear all notes with one click
- Stores last 100 notes

---

## 🛠️ Technical Details

### Technologies
- **Manifest V3** - Latest Chrome extension standard
- **Service Workers** - Background processing
- **Selection API** - Text capture
- **Context Menus API** - Right-click integration
- **Storage API** - Settings and notes persistence
- **TTS API** - Text-to-speech functionality
- **Clipboard API** - Clean copy feature

### Architecture
```
context-search-plus/
├── manifest.json         # Extension configuration
├── background.js         # Service worker & context detection
├── content.js           # Floating bubble & page interaction
├── popup.css            # Glassmorphism styles
├── popup.html           # Extension popup
├── popup.js             # Popup functionality
├── options.html         # Settings page
├── options.js           # Settings logic
├── icons/               # Extension icons
└── README.md            # Documentation
```

### Permissions Required
- `contextMenus` - Right-click menu integration
- `activeTab` - Current page interaction
- `storage` - Save settings and notes
- `clipboardWrite` - Clean copy functionality
- `tts` - Text-to-speech

### APIs Used
- **Google Translate API** - For translation (unofficial)
- **Dictionary API** - For word definitions (dictionaryapi.dev)

---

## 🎨 UI/UX Features

### Glassmorphism
- Semi-transparent backgrounds
- Backdrop blur effects
- Subtle borders and shadows
- Modern, polished look

### Animations
- Smooth fade-in effects
- Hover transformations
- Button press feedback
- Notification slides

### Responsive Design
- Works on all screen sizes
- Adapts to available space
- Mobile-friendly

### Dark Mode
- Automatically detects system preference
- Adjusts colors and contrast
- Maintains readability

---

## 🔒 Privacy & Security

**We respect your privacy:**
- ✅ No data collection or tracking
- ✅ No analytics or telemetry
- ✅ Settings stored locally only
- ✅ Searches go directly to platforms
- ✅ Notes stored on your device only
- ✅ Open source and transparent

**DuckDuckGo Privacy Mode:**
- Opens in incognito window
- Doesn't save to history
- No tracking or targeted ads

---

## 📋 Keyboard Shortcuts (Planned)
Coming in future update:
- `Ctrl+Shift+S` - Open search menu
- `Ctrl+Shift+C` - Clean copy
- `Ctrl+Shift+T` - Translate
- `Ctrl+Shift+D` - Define word

---

## 🐛 Known Issues & Limitations

1. **Translation Rate Limits** - Uses unofficial API, may have rate limits
2. **TTS Voice** - Uses system default voice (can be changed in Chrome settings)
3. **Restricted Pages** - Won't work on chrome:// pages or extension pages
4. **Unit Converter** - Supports common units only (expandable in settings)
5. **Address Detection** - May not recognize all address formats

---

## 🔮 Roadmap

### v2.1 (Coming Soon)
- [ ] Keyboard shortcuts
- [ ] Export/import settings
- [ ] Note categories and tags
- [ ] More unit conversions
- [ ] QR code generator

### v3.0 (Future)
- [ ] Image search integration
- [ ] Multi-language interface
- [ ] Cloud sync for notes
- [ ] AI-powered summaries
- [ ] Browser action presets

---

## 🤝 Contributing

Contributions welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Setup
```bash
git clone https://github.com/yourname/context-search-plus
cd context-search-plus
# Load unpacked in Chrome at chrome://extensions/
```

---

## 📝 Changelog

### Version 2.0.0 (Current)
- ✨ Added Clean Copy utility
- ✨ Added Text-to-Speech feature
- ✨ Added Dictionary definitions
- ✨ Added Save to Notes feature
- ✨ Context-aware address detection
- ✨ Context-aware code detection
- ✨ Automatic unit conversion
- ✨ DuckDuckGo privacy mode
- ✨ Custom search engines support
- ✨ Comprehensive settings page
- ✨ Glassmorphism UI design
- ✨ Dark mode support
- 🔧 Improved bubble positioning
- 🔧 Enhanced animations
- 🐛 Fixed context menu ordering

### Version 1.0.0
- Initial release
- Basic search functionality
- Right-click menu
- Floating bubble
- YouTube, Reddit, GitHub, Google search
- Basic translation

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Developer

**ASHISH APPS**

Created with ❤️ for power users who want to search smarter, not harder!

---

## 🙏 Acknowledgments

- Thanks to the Chrome Extensions community
- Google Translate API for translation services
- Dictionary API for word definitions
- Icons inspired by modern design systems
- Glassmorphism UI inspired by macOS Big Sur and Windows 11

---

## 📧 Support & Feedback

- **Issues**: Open an issue on GitHub
- **Feature Requests**: Create a discussion
- **Questions**: Check the FAQ or open an issue

---

## 🌟 Star This Project

If you find Context Search+ useful, please give it a ⭐ on GitHub!

**Happy Searching! 🚀✨**

---

*Context Search+ v2.0 - The Ultimate Power-User Tool*  
*Developed by ASHISH APPS | © 2026*
