// Content script for Context Search+ v2.0
// Created by ASHISH APPS

let translationBubble = null;
let settings = {};
const MAX_BUTTONS = 10;
const SELECTION_DELAY_MS = 180;
const AUTO_CLOSE_MS = 7000;
let bubbleAutoCloseTimer = null;
let lastSelectionSignature = '';

// Load settings
chrome.runtime.sendMessage({ action: "getSettings" }, (response) => {
  if (response && response.settings) {
    settings = response.settings;
  }
});

// Listen for text selection
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeBubble();
});
document.addEventListener('scroll', closeBubble, { passive: true });

function handleTextSelection(event) {
  if (!settings.useFloatingBubble || event.button !== 0) return;
  if (isInEditableElement(event.target)) return;

  setTimeout(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      closeBubble();
      return;
    }

    const selectedText = selection.toString().trim();
    if (selectedText.length < 2 || selectedText.length > 500) {
      closeBubble();
      return;
    }

    const selectionSignature = `${window.location.href}::${selectedText}`;
    if (selectionSignature === lastSelectionSignature && translationBubble) {
      return;
    }
    lastSelectionSignature = selectionSignature;

    const anchor = getSelectionAnchor(selection, event);

    // Detect context
    detectContext(selectedText).then(context => {
      createSmartBubble(anchor.x, anchor.y, selectedText, context);
    });
  }, SELECTION_DELAY_MS);
}

function isInEditableElement(target) {
  if (!target) return false;
  const node = target.nodeType === Node.TEXT_NODE ? target.parentElement : target;
  if (!node || typeof node.closest !== 'function') return false;
  return Boolean(node.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="textbox"]'));
}

function getSelectionAnchor(selection, event) {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  if (rect && rect.width > 0 && rect.height > 0) {
    return {
      x: rect.left + scrollX + (rect.width / 2),
      y: rect.top + scrollY
    };
  }

  return {
    x: event.pageX,
    y: event.pageY
  };
}

// Detect what type of content is selected
async function detectContext(text) {
  const trimmedText = text.trim();
  const context = {
    isAddress: false,
    isCode: false,
    hasUnit: false,
    unitConversion: null,
    isSingleWord: trimmedText.split(/\s+/).length === 1,
    isQuestion: /\?$/.test(trimmedText),
    isEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedText),
    isUrl: /^https?:\/\//i.test(trimmedText) || /^www\./i.test(trimmedText),
    isLongText: trimmedText.length > 140,
    hasCurrency: /(\$|€|£|¥|₹)\s?\d+/.test(trimmedText),
    preferredSearch: 'google'
  };

  // Check for address
  const addressPatterns = [
    /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|way)/i,
    /[\w\s]+,\s*[A-Z]{2}\s*\d{5}/,
    /\d+\s+[\w\s]+,\s*[\w\s]+,\s*[A-Z]{2}/i
  ];
  context.isAddress = addressPatterns.some(pattern => pattern.test(trimmedText));

  // Check for code
  const codePatterns = [
    /^\s*(const|let|var|function|class|def|public|private|import|require)\s+/i,
    /[{};()[\]]/,
    /=>/,
    /^\s*<[a-z]+.*>.*<\/[a-z]+>\s*$/i
  ];
  context.isCode = codePatterns.some(pattern => pattern.test(trimmedText)) && trimmedText.length > 10;

  // Check for units
  const unitRegex = /(\d+(?:\.\d+)?)\s*(kg|lbs|g|oz|km|miles|m|ft|cm|in|c|f)\b/i;
  if (unitRegex.test(trimmedText)) {
    context.hasUnit = true;
    // Get conversion
    const response = await chrome.runtime.sendMessage({ 
      action: "convertUnit", 
      text: trimmedText
    });
    context.unitConversion = response?.conversion || null;
  }

  if (context.isCode) {
    context.preferredSearch = 'github';
  } else if (context.isQuestion) {
    context.preferredSearch = 'reddit';
  } else if (context.hasCurrency || context.hasUnit) {
    context.preferredSearch = 'google';
  }

  if (context.isUrl) {
    context.isSingleWord = false;
  }

  return context;
}

function createSmartBubble(x, y, text, context) {
  const bubble = document.createElement('div');
  bubble.className = 'context-search-plus-bubble glass-morphism';
  
  let buttons = [];

  const pushButton = (button, score = 0) => {
    buttons.push({ ...button, score });
  };

  // Context-aware buttons
  if (context.isAddress && settings.enableMaps) {
    pushButton({
      icon: '📍',
      action: 'maps',
      title: 'Open in Maps',
      class: 'csp-maps'
    }, 120);
  }

  if (context.isCode && settings.enableGitHub) {
    pushButton({
      icon: '💻',
      action: 'github',
      title: 'Find on GitHub',
      class: 'csp-github'
    }, 115);
  }

  if (context.hasUnit && context.unitConversion && settings.enableUnitConverter) {
    pushButton({
      icon: '⚖️',
      action: 'convert',
      title: `Convert: ${context.unitConversion}`,
      class: 'csp-convert',
      data: context.unitConversion
    }, 110);
  }

  if (context.isUrl) {
    pushButton({
      icon: '🌍',
      action: 'openUrl',
      title: 'Open Link',
      class: 'csp-open-url'
    }, 108);
  }

  if (context.isEmail) {
    pushButton({
      icon: '✉️',
      action: 'email',
      title: 'Compose Email',
      class: 'csp-email'
    }, 108);
  }

  // Standard search buttons
  if (settings.enableYouTube) {
    pushButton({
      icon: '🎥',
      action: 'youtube',
      title: 'Search YouTube',
      class: 'csp-youtube'
    }, context.isLongText ? 20 : 55);
  }

  if (settings.enableReddit) {
    pushButton({
      icon: '💬',
      action: 'reddit',
      title: 'Check Reddit',
      class: 'csp-reddit'
    }, context.preferredSearch === 'reddit' ? 100 : 60);
  }

  if (!context.isCode && settings.enableGitHub && !buttons.some(b => b.action === 'github')) {
    pushButton({
      icon: '💻',
      action: 'github',
      title: 'Find on GitHub',
      class: 'csp-github'
    }, context.preferredSearch === 'github' ? 100 : 45);
  }

  if (settings.enableGoogle) {
    pushButton({
      icon: '🔍',
      action: 'google',
      title: 'Search Google',
      class: 'csp-google'
    }, context.preferredSearch === 'google' ? 98 : 70);
  }

  if (settings.enableDuckDuckGo) {
    pushButton({
      icon: '🦆',
      action: 'duckduckgo',
      title: 'DuckDuckGo (Privacy)',
      class: 'csp-duckduckgo'
    }, 68);
  }

  // Utility buttons
  if (settings.enableTranslate) {
    pushButton({
      icon: '🌐',
      action: 'translate',
      title: 'Translate',
      class: 'csp-translate'
    }, context.isLongText ? 65 : 40);
  }

  if (settings.enableCleanCopy) {
    pushButton({
      icon: '📋',
      action: 'cleanCopy',
      title: 'Clean Copy',
      class: 'csp-clean-copy'
    }, 72);
  }

  if (settings.enableTTS) {
    pushButton({
      icon: '🔊',
      action: 'tts',
      title: 'Say It (TTS)',
      class: 'csp-tts'
    }, context.isLongText ? 78 : 48);
  }

  if (context.isSingleWord && settings.enableDefine) {
    pushButton({
      icon: '📖',
      action: 'define',
      title: 'Define',
      class: 'csp-define'
    }, 90);
  }

  if (settings.enableSaveNote) {
    pushButton({
      icon: '💾',
      action: 'saveNote',
      title: 'Save to Notes',
      class: 'csp-save-note'
    }, 66);
  }

  if (settings.customSearches && settings.customSearches.length > 0) {
    settings.customSearches
      .map((custom, index) => ({ custom, index }))
      .slice(0, 3)
      .forEach(({ custom, index }) => {
        if (!custom?.url || !custom?.name) return;
        pushButton({
          icon: custom.icon || '🔗',
          action: 'customSearch',
          title: custom.name,
          class: 'csp-custom-search',
          data: String(index)
        }, 50);
      });
  }

  buttons = buttons
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_BUTTONS);

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
  
  // Position the bubble (centered on selection, clamped to viewport)
  bubble.style.position = 'absolute';
  bubble.style.zIndex = '999999';

  document.body.appendChild(bubble);

  const bubbleRect = bubble.getBoundingClientRect();
  const left = Math.max(
    window.scrollX + 12,
    Math.min(
      x - (bubbleRect.width / 2),
      window.scrollX + window.innerWidth - bubbleRect.width - 12
    )
  );
  const top = Math.max(
    window.scrollY + 12,
    y - bubbleRect.height - 14
  );

  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;

  translationBubble = bubble;
  resetBubbleAutoClose();
  
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

function resetBubbleAutoClose() {
  clearTimeout(bubbleAutoCloseTimer);
  bubbleAutoCloseTimer = setTimeout(() => {
    closeBubble();
  }, AUTO_CLOSE_MS);
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
    case 'openUrl': {
      const normalizedUrl = /^https?:\/\//i.test(text) ? text : `https://${text}`;
      window.open(normalizedUrl, '_blank');
      closeBubble();
      break;
    }
    case 'email':
      window.open(`mailto:${text}`, '_blank');
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
    case 'customSearch': {
      const custom = settings.customSearches?.[Number(data)];
      if (custom?.url) {
        const encoded = encodeURIComponent(text);
        window.open(custom.url.replace('%s', encoded), '_blank');
      }
      closeBubble();
      break;
    }
  }
}

function closeBubble() {
  clearTimeout(bubbleAutoCloseTimer);
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
  // Remove extra whitespace, "read more" artifacts, and noisy ad labels.
  const cleanText = text
    .replace(/\s*read more\.?\s*$/i, '')
    .replace(/\s*show more\.?\s*$/i, '')
    .replace(/\b(advertisement|sponsored)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
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
