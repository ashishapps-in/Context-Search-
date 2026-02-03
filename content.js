// Content script for Context Search+ v2.0
// Created by ASHISH APPS

let translationBubble = null;
let settings = {};

// Load settings
chrome.runtime.sendMessage({ action: "getSettings" }, (response) => {
  if (response && response.settings) {
    settings = response.settings;
  }
});

// Listen for text selection
document.addEventListener('mouseup', handleTextSelection);

function handleTextSelection(event) {
  if (!settings.useFloatingBubble) return;

  setTimeout(() => {
    const selectedText = window.getSelection().toString().trim();
    
    // Remove existing bubble if any
    if (translationBubble) {
      translationBubble.remove();
      translationBubble = null;
    }
    
    if (selectedText.length > 0 && selectedText.length < 500) {
      if (selectedText.length < 2) return;
      
      // Detect context
      detectContext(selectedText).then(context => {
        createSmartBubble(event.pageX, event.pageY, selectedText, context);
      });
    }
  }, 10);
}

// Detect what type of content is selected
async function detectContext(text) {
  const context = {
    isAddress: false,
    isCode: false,
    hasUnit: false,
    unitConversion: null,
    isSingleWord: text.split(/\s+/).length === 1
  };

  // Check for address
  const addressPatterns = [
    /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|way)/i,
    /[\w\s]+,\s*[A-Z]{2}\s*\d{5}/,
    /\d+\s+[\w\s]+,\s*[\w\s]+,\s*[A-Z]{2}/i
  ];
  context.isAddress = addressPatterns.some(pattern => pattern.test(text));

  // Check for code
  const codePatterns = [
    /^\s*(const|let|var|function|class|def|public|private|import|require)\s+/i,
    /[{};()[\]]/,
    /=>/,
    /^\s*<[a-z]+.*>.*<\/[a-z]+>\s*$/i
  ];
  context.isCode = codePatterns.some(pattern => pattern.test(text)) && text.length > 10;

  // Check for units
  const unitRegex = /(\d+(?:\.\d+)?)\s*(kg|lbs|g|oz|km|miles|m|ft|cm|in|c|f)\b/i;
  if (unitRegex.test(text)) {
    context.hasUnit = true;
    // Get conversion
    const response = await chrome.runtime.sendMessage({ 
      action: "convertUnit", 
      text: text 
    });
    context.unitConversion = response.conversion;
  }

  return context;
}

function createSmartBubble(x, y, text, context) {
  const bubble = document.createElement('div');
  bubble.className = 'context-search-plus-bubble glass-morphism';
  
  let buttons = [];

  // Context-aware buttons
  if (context.isAddress && settings.enableMaps) {
    buttons.push({
      icon: '📍',
      action: 'maps',
      title: 'Open in Maps',
      class: 'csp-maps'
    });
  }

  if (context.isCode && settings.enableGitHub) {
    buttons.push({
      icon: '💻',
      action: 'github',
      title: 'Find on GitHub',
      class: 'csp-github'
    });
  }

  if (context.hasUnit && context.unitConversion && settings.enableUnitConverter) {
    buttons.push({
      icon: '⚖️',
      action: 'convert',
      title: `Convert: ${context.unitConversion}`,
      class: 'csp-convert',
      data: context.unitConversion
    });
  }

  // Standard search buttons
  if (settings.enableYouTube) {
    buttons.push({
      icon: '🎥',
      action: 'youtube',
      title: 'Search YouTube',
      class: 'csp-youtube'
    });
  }

  if (settings.enableReddit) {
    buttons.push({
      icon: '💬',
      action: 'reddit',
      title: 'Check Reddit',
      class: 'csp-reddit'
    });
  }

  if (!context.isCode && settings.enableGitHub && !buttons.some(b => b.action === 'github')) {
    buttons.push({
      icon: '💻',
      action: 'github',
      title: 'Find on GitHub',
      class: 'csp-github'
    });
  }

  if (settings.enableGoogle) {
    buttons.push({
      icon: '🔍',
      action: 'google',
      title: 'Search Google',
      class: 'csp-google'
    });
  }

  if (settings.enableDuckDuckGo) {
    buttons.push({
      icon: '🦆',
      action: 'duckduckgo',
      title: 'DuckDuckGo (Privacy)',
      class: 'csp-duckduckgo'
    });
  }

  // Utility buttons
  if (settings.enableTranslate) {
    buttons.push({
      icon: '🌐',
      action: 'translate',
      title: 'Translate',
      class: 'csp-translate'
    });
  }

  if (settings.enableCleanCopy) {
    buttons.push({
      icon: '📋',
      action: 'cleanCopy',
      title: 'Clean Copy',
      class: 'csp-clean-copy'
    });
  }

  if (settings.enableTTS) {
    buttons.push({
      icon: '🔊',
      action: 'tts',
      title: 'Say It (TTS)',
      class: 'csp-tts'
    });
  }

  if (context.isSingleWord && settings.enableDefine) {
    buttons.push({
      icon: '📖',
      action: 'define',
      title: 'Define',
      class: 'csp-define'
    });
  }

  if (settings.enableSaveNote) {
    buttons.push({
      icon: '💾',
      action: 'saveNote',
      title: 'Save to Notes',
      class: 'csp-save-note'
    });
  }

  // Build button HTML
  let buttonsHTML = buttons.map(btn => `
    <button class="csp-btn ${btn.class}" 
            data-action="${btn.action}" 
            ${btn.data ? `data-conversion="${btn.data}"` : ''}
            title="${btn.title}">
      ${btn.icon}
    </button>
  `).join('');

  bubble.innerHTML = `<div class="csp-bubble-content">${buttonsHTML}</div>`;
  
  // Position the bubble
  bubble.style.position = 'absolute';
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y - 60}px`;
  bubble.style.zIndex = '999999';
  
  document.body.appendChild(bubble);
  translationBubble = bubble;
  
  // Add click handlers
  const btnElements = bubble.querySelectorAll('.csp-btn');
  btnElements.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const action = btn.getAttribute('data-action');
      const conversion = btn.getAttribute('data-conversion');
      handleAction(action, text, conversion);
    });
  });
  
  // Remove bubble when clicking elsewhere
  setTimeout(() => {
    document.addEventListener('click', removeBubbleOnClick, { once: true });
  }, 100);
}

function removeBubbleOnClick(event) {
  if (translationBubble && !translationBubble.contains(event.target)) {
    translationBubble.remove();
    translationBubble = null;
  }
}

function handleAction(action, text, data) {
  const encodedText = encodeURIComponent(text);
  
  switch (action) {
    case 'youtube':
      window.open(`https://www.youtube.com/results?search_query=${encodedText}`, '_blank');
      closeBubble();
      break;
    case 'reddit':
      window.open(`https://www.reddit.com/search/?q=${encodedText}`, '_blank');
      closeBubble();
      break;
    case 'github':
      window.open(`https://github.com/search?q=${encodedText}&type=code`, '_blank');
      closeBubble();
      break;
    case 'google':
      window.open(`https://www.google.com/search?q=${encodedText}`, '_blank');
      closeBubble();
      break;
    case 'duckduckgo':
      // Request to open in incognito
      chrome.runtime.sendMessage({ 
        action: 'openIncognito', 
        url: `https://duckduckgo.com/?q=${encodedText}` 
      });
      closeBubble();
      break;
    case 'maps':
      chrome.runtime.sendMessage({ action: 'openMaps', text: text });
      closeBubble();
      break;
    case 'translate':
      showTranslation(text);
      break;
    case 'cleanCopy':
      copyCleanText(text);
      break;
    case 'tts':
      speakText(text);
      closeBubble();
      break;
    case 'define':
      showDefinition(text);
      break;
    case 'saveNote':
      saveToNotes(text);
      break;
    case 'convert':
      showConversion(data);
      break;
  }
}

function closeBubble() {
  if (translationBubble) {
    translationBubble.remove();
    translationBubble = null;
  }
}

function showTranslation(text) {
  if (!translationBubble) return;
  
  const content = translationBubble.querySelector('.csp-bubble-content');
  const originalContent = content.innerHTML;
  content.innerHTML = '<div class="csp-loading">Translating...</div>';
  
  chrome.runtime.sendMessage(
    { action: "translate", text: text },
    (response) => {
      if (response && response.translation) {
        content.innerHTML = `
          <div class="csp-result glass-morphism">
            <div class="csp-result-text">${response.translation}</div>
            <button class="csp-close-btn">✕</button>
          </div>
        `;
        
        const closeBtn = content.querySelector('.csp-close-btn');
        closeBtn.addEventListener('click', closeBubble);
      } else {
        content.innerHTML = originalContent;
      }
    }
  );
}

function copyCleanText(text) {
  // Remove extra whitespace and formatting
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  navigator.clipboard.writeText(cleanText).then(() => {
    showNotification('✓ Copied clean text!');
    closeBubble();
  }).catch(err => {
    console.error('Copy failed:', err);
    showNotification('✗ Copy failed');
  });
}

function speakText(text) {
  // TTS is handled by background script
  chrome.runtime.sendMessage({ action: 'speak', text: text });
  showNotification('🔊 Speaking...');
}

function showDefinition(text) {
  if (!translationBubble) return;
  
  const content = translationBubble.querySelector('.csp-bubble-content');
  content.innerHTML = '<div class="csp-loading">Looking up definition...</div>';
  
  chrome.runtime.sendMessage(
    { action: "define", text: text },
    (response) => {
      if (response && response.definition) {
        content.innerHTML = `
          <div class="csp-result glass-morphism">
            <div class="csp-result-title">${response.word} <span class="csp-part-of-speech">(${response.partOfSpeech})</span></div>
            <div class="csp-result-text">${response.definition}</div>
            <button class="csp-close-btn">✕</button>
          </div>
        `;
        
        const closeBtn = content.querySelector('.csp-close-btn');
        closeBtn.addEventListener('click', closeBubble);
      } else {
        content.innerHTML = `
          <div class="csp-result glass-morphism">
            <div class="csp-result-text">Definition not found</div>
            <button class="csp-close-btn">✕</button>
          </div>
        `;
        const closeBtn = content.querySelector('.csp-close-btn');
        closeBtn.addEventListener('click', closeBubble);
      }
    }
  );
}

function saveToNotes(text) {
  chrome.runtime.sendMessage({ 
    action: 'saveNote', 
    text: text, 
    url: window.location.href 
  }, (response) => {
    if (response && response.success) {
      showNotification('💾 Saved to notes!');
      closeBubble();
    }
  });
}

function showConversion(conversion) {
  if (!translationBubble) return;
  
  const content = translationBubble.querySelector('.csp-bubble-content');
  content.innerHTML = `
    <div class="csp-result glass-morphism">
      <div class="csp-result-title">Unit Conversion</div>
      <div class="csp-result-text">${conversion}</div>
      <button class="csp-close-btn">✕</button>
    </div>
  `;
  
  const closeBtn = content.querySelector('.csp-close-btn');
  closeBtn.addEventListener('click', closeBubble);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'csp-notification glass-morphism';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "cleanCopy") {
    copyCleanText(request.text);
  }
  
  if (request.action === "define") {
    // This is handled inline in the bubble
  }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (translationBubble) {
    translationBubble.remove();
  }
});
