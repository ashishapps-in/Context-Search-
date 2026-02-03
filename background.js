// Background service worker for Context Search+ v2.0
// Created by ASHISH APPS

// Default settings
const DEFAULT_SETTINGS = {
  enableYouTube: true,
  enableReddit: true,
  enableGitHub: true,
  enableTranslate: true,
  enableGoogle: true,
  enableDuckDuckGo: true,
  enableCleanCopy: true,
  enableTTS: true,
  enableMaps: true,
  enableDefine: true,
  enableSaveNote: true,
  enableUnitConverter: true,
  useFloatingBubble: true,
  useContextMenu: true,
  customSearches: []
};

let settings = { ...DEFAULT_SETTINGS };

// Load settings on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('settings', (data) => {
    if (data.settings) {
      settings = { ...DEFAULT_SETTINGS, ...data.settings };
    } else {
      chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
    }
    createContextMenus();
  });
});

// Load settings on startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get('settings', (data) => {
    if (data.settings) {
      settings = { ...DEFAULT_SETTINGS, ...data.settings };
    }
    createContextMenus();
  });
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.settings) {
    settings = { ...DEFAULT_SETTINGS, ...changes.settings.newValue };
    createContextMenus();
  }
});

// Create context menu items based on settings
function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    if (!settings.useContextMenu) return;

    // Parent menu item
    chrome.contextMenus.create({
      id: "context-search-plus",
      title: "Context Search+",
      contexts: ["selection"]
    });

    // Search Engines
    if (settings.enableYouTube) {
      chrome.contextMenus.create({
        id: "search-youtube",
        parentId: "context-search-plus",
        title: "🎥 Search on YouTube",
        contexts: ["selection"]
      });
    }

    if (settings.enableReddit) {
      chrome.contextMenus.create({
        id: "search-reddit",
        parentId: "context-search-plus",
        title: "💬 Check Reddit",
        contexts: ["selection"]
      });
    }

    if (settings.enableGitHub) {
      chrome.contextMenus.create({
        id: "search-github",
        parentId: "context-search-plus",
        title: "💻 Find on GitHub",
        contexts: ["selection"]
      });
    }

    if (settings.enableGoogle) {
      chrome.contextMenus.create({
        id: "search-google",
        parentId: "context-search-plus",
        title: "🔍 Search Google",
        contexts: ["selection"]
      });
    }

    if (settings.enableDuckDuckGo) {
      chrome.contextMenus.create({
        id: "search-duckduckgo",
        parentId: "context-search-plus",
        title: "🦆 DuckDuckGo (Privacy)",
        contexts: ["selection"]
      });
    }

    // Separator
    chrome.contextMenus.create({
      id: "separator1",
      parentId: "context-search-plus",
      type: "separator",
      contexts: ["selection"]
    });

    // Utilities
    if (settings.enableTranslate) {
      chrome.contextMenus.create({
        id: "translate",
        parentId: "context-search-plus",
        title: "🌐 Translate",
        contexts: ["selection"]
      });
    }

    if (settings.enableCleanCopy) {
      chrome.contextMenus.create({
        id: "clean-copy",
        parentId: "context-search-plus",
        title: "📋 Clean Copy",
        contexts: ["selection"]
      });
    }

    if (settings.enableTTS) {
      chrome.contextMenus.create({
        id: "say-it",
        parentId: "context-search-plus",
        title: "🔊 Say It (TTS)",
        contexts: ["selection"]
      });
    }

    if (settings.enableDefine) {
      chrome.contextMenus.create({
        id: "define",
        parentId: "context-search-plus",
        title: "📖 Define",
        contexts: ["selection"]
      });
    }

    if (settings.enableSaveNote) {
      chrome.contextMenus.create({
        id: "save-note",
        parentId: "context-search-plus",
        title: "💾 Save to Notes",
        contexts: ["selection"]
      });
    }

    // Custom searches
    if (settings.customSearches && settings.customSearches.length > 0) {
      chrome.contextMenus.create({
        id: "separator2",
        parentId: "context-search-plus",
        type: "separator",
        contexts: ["selection"]
      });

      settings.customSearches.forEach((custom, index) => {
        chrome.contextMenus.create({
          id: `custom-${index}`,
          parentId: "context-search-plus",
          title: `${custom.icon || '🔗'} ${custom.name}`,
          contexts: ["selection"]
        });
      });
    }
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText;
  if (!selectedText) return;

  const encodedText = encodeURIComponent(selectedText);
  
  // Handle custom searches
  if (info.menuItemId.startsWith('custom-')) {
    const index = parseInt(info.menuItemId.split('-')[1]);
    const custom = settings.customSearches[index];
    if (custom && custom.url) {
      const url = custom.url.replace('%s', encodedText);
      chrome.tabs.create({ url: url });
    }
    return;
  }

  switch (info.menuItemId) {
    case "search-youtube":
      chrome.tabs.create({ url: `https://www.youtube.com/results?search_query=${encodedText}` });
      break;
    case "search-reddit":
      chrome.tabs.create({ url: `https://www.reddit.com/search/?q=${encodedText}` });
      break;
    case "search-github":
      chrome.tabs.create({ url: `https://github.com/search?q=${encodedText}&type=code` });
      break;
    case "search-google":
      chrome.tabs.create({ url: `https://www.google.com/search?q=${encodedText}` });
      break;
    case "search-duckduckgo":
      chrome.windows.create({ 
        url: `https://duckduckgo.com/?q=${encodedText}`,
        incognito: true 
      });
      break;
    case "translate":
      chrome.tabs.create({ url: `https://translate.google.com/?sl=auto&tl=en&text=${encodedText}` });
      break;
    case "clean-copy":
      chrome.tabs.sendMessage(tab.id, { 
        action: "cleanCopy", 
        text: selectedText 
      });
      break;
    case "say-it":
      chrome.tts.speak(selectedText, {
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0
      });
      break;
    case "define":
      chrome.tabs.sendMessage(tab.id, {
        action: "define",
        text: selectedText
      });
      break;
    case "save-note":
      saveNote(selectedText, tab.url);
      break;
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    const text = request.text;
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const translation = data[0][0][0];
        sendResponse({ translation: translation });
      })
      .catch(error => {
        console.error("Translation error:", error);
        sendResponse({ translation: "Translation failed" });
      });
    
    return true;
  }
  
  if (request.action === "getSettings") {
    sendResponse({ settings: settings });
    return true;
  }

  if (request.action === "define") {
    const word = request.text.trim().split(/\s+/)[0]; // Get first word
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data[0] && data[0].meanings && data[0].meanings[0]) {
          const definition = data[0].meanings[0].definitions[0].definition;
          const partOfSpeech = data[0].meanings[0].partOfSpeech;
          sendResponse({ 
            definition: definition,
            partOfSpeech: partOfSpeech,
            word: word
          });
        } else {
          sendResponse({ error: "Definition not found" });
        }
      })
      .catch(error => {
        console.error("Definition error:", error);
        sendResponse({ error: "Could not fetch definition" });
      });
    
    return true;
  }

  if (request.action === "convertUnit") {
    const conversion = convertUnit(request.text);
    sendResponse({ conversion: conversion });
    return true;
  }

  if (request.action === "detectAddress") {
    const isAddress = detectAddress(request.text);
    sendResponse({ isAddress: isAddress });
    return true;
  }

  if (request.action === "detectCode") {
    const isCode = detectCode(request.text);
    sendResponse({ isCode: isCode });
    return true;
  }

  if (request.action === "openMaps") {
    chrome.tabs.create({ 
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(request.text)}` 
    });
    return true;
  }

  if (request.action === "saveNote") {
    saveNote(request.text, request.url);
    sendResponse({ success: true });
    return true;
  }
});

// Save note to storage
function saveNote(text, url) {
  chrome.storage.local.get('notes', (data) => {
    const notes = data.notes || [];
    notes.unshift({
      text: text,
      url: url,
      timestamp: new Date().toISOString()
    });
    // Keep only last 100 notes
    if (notes.length > 100) notes.pop();
    chrome.storage.local.set({ notes: notes });
  });
}

// Unit conversion function
function convertUnit(text) {
  const conversions = {
    // Weight
    kg: { to: 'lbs', factor: 2.20462 },
    lbs: { to: 'kg', factor: 0.453592 },
    g: { to: 'oz', factor: 0.035274 },
    oz: { to: 'g', factor: 28.3495 },
    
    // Distance
    km: { to: 'miles', factor: 0.621371 },
    miles: { to: 'km', factor: 1.60934 },
    m: { to: 'ft', factor: 3.28084 },
    ft: { to: 'm', factor: 0.3048 },
    cm: { to: 'in', factor: 0.393701 },
    in: { to: 'cm', factor: 2.54 },
    
    // Temperature (special case)
    c: { to: 'f', formula: (c) => (c * 9/5) + 32 },
    f: { to: 'c', formula: (f) => (f - 32) * 5/9 }
  };

  const regex = /(\d+(?:\.\d+)?)\s*(kg|lbs|g|oz|km|miles|m|ft|cm|in|c|f)\b/i;
  const match = text.match(regex);

  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    const conversion = conversions[unit];

    if (conversion) {
      let result;
      if (conversion.formula) {
        result = conversion.formula(value);
      } else {
        result = value * conversion.factor;
      }
      return `${result.toFixed(2)} ${conversion.to}`;
    }
  }
  return null;
}

// Detect if text is an address
function detectAddress(text) {
  const addressPatterns = [
    /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|way)/i,
    /[\w\s]+,\s*[A-Z]{2}\s*\d{5}/,
    /\d+\s+[\w\s]+,\s*[\w\s]+,\s*[A-Z]{2}/i
  ];
  return addressPatterns.some(pattern => pattern.test(text));
}

// Detect if text is code
function detectCode(text) {
  const codePatterns = [
    /^\s*(const|let|var|function|class|def|public|private|import|require)\s+/i,
    /[{};()[\]]/,
    /=>/,
    /^\s*<[a-z]+.*>.*<\/[a-z]+>\s*$/i
  ];
  return codePatterns.some(pattern => pattern.test(text)) && text.length > 10;
}
