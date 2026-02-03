# Context Search+ v2.0

Context Search+ is a context-aware Chrome extension that enhances text selection with instant search, utilities, and smart actions. Select text on any webpage and immediately perform searches or productivity tasks using a floating action bubble or the right-click menu.

**Developer:** ASHISH APPS

---

## Features

- Context-aware text actions
- Floating action bubble
- Right-click context menu
- Google, YouTube, Reddit, GitHub, DuckDuckGo search
- Clean Copy (plain text clipboard)
- Text-to-Speech (TTS)
- Dictionary definitions
- Save selected text as notes
- Address detection with Google Maps
- Code detection with GitHub prioritization
- Automatic unit conversion
- Custom search engines
- Glassmorphism UI
- Dark mode support
- Privacy-first (no tracking)

---

## Installation

### Load Unpacked (Developer Mode)

1. Download or clone this repository
2. Open Google Chrome
3. Go to `chrome://extensions/`
4. Enable **Developer mode**
5. Click **Load unpacked**
6. Select the project folder
7. Extension is ready to use

---

## Usage

### Floating Bubble
1. Select any text on a webpage
2. A floating action bubble appears
3. Click an icon to perform an action

### Context Menu
1. Select text
2. Right-click
3. Choose **Context Search+**
4. Select an option

### Examples

- Selecting an address shows a Maps option
- Selecting code prioritizes GitHub search
- Selecting units shows instant conversion
- Selecting a single word enables dictionary lookup

---

## Configuration

Open the extension settings to:

- Enable or disable features
- Choose display mode (bubble, context menu, or both)
- Add custom search engines using `%s`
- Manage saved notes
- Control context-aware detection

---

## Tech Stack

- JavaScript
- HTML
- CSS
- Chrome Extensions (Manifest V3)

---

## Permissions

- `contextMenus`
- `activeTab`
- `storage`
- `clipboardWrite`
- `tts`

Only required permissions are used.

---

## Privacy

- No analytics
- No tracking
- No data collection
- Notes stored locally
- Searches go directly to platforms
- DuckDuckGo searches open in incognito mode

---

## Limitations

- Does not work on `chrome://` pages
- Translation may be rate-limited
- Unit converter supports common units only
- Address detection depends on text format

---

## Roadmap

- Keyboard shortcuts
- Settings export/import
- More unit conversions
- Image search
- Cloud sync for notes

---

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

MIT License

---

## Author

ASHISH APPS
