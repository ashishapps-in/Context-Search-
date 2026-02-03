// Options page script for Context Search+ v2.0
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

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadNotes();
  setupEventListeners();
});

// Load settings from storage
function loadSettings() {
  chrome.storage.sync.get('settings', (data) => {
    const settings = data.settings || DEFAULT_SETTINGS;
    
    // Set all toggles
    Object.keys(settings).forEach(key => {
      const element = document.getElementById(key);
      if (element && element.type === 'checkbox') {
        element.checked = settings[key];
      }
    });
    
    // Load custom searches
    if (settings.customSearches) {
      renderCustomSearches(settings.customSearches);
    }
  });
}

// Save settings to storage
function saveSettings() {
  const settings = {};
  
  // Get all toggle states
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  toggles.forEach(toggle => {
    settings[toggle.id] = toggle.checked;
  });
  
  // Get custom searches
  chrome.storage.sync.get('settings', (data) => {
    settings.customSearches = data.settings?.customSearches || [];
    
    chrome.storage.sync.set({ settings: settings }, () => {
      showNotification('✓ Settings saved!');
    });
  });
}

// Reset to default settings
function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    chrome.storage.sync.set({ settings: DEFAULT_SETTINGS }, () => {
      loadSettings();
      showNotification('✓ Reset to defaults!');
    });
  }
}

// Render custom search list
function renderCustomSearches(searches) {
  const list = document.getElementById('customSearchList');
  
  if (!searches || searches.length === 0) {
    list.innerHTML = '<li style="padding: 20px; text-align: center; color: #999;">No custom searches added yet</li>';
    return;
  }
  
  list.innerHTML = searches.map((search, index) => `
    <li class="custom-search-item">
      <span style="font-size: 24px;">${search.icon || '🔗'}</span>
      <div class="info">
        <div class="name">${search.name}</div>
        <div class="url">${search.url}</div>
      </div>
      <button class="delete-btn" data-index="${index}">Delete</button>
    </li>
  `).join('');
  
  // Add delete handlers
  list.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteCustomSearch(parseInt(btn.dataset.index)));
  });
}

// Add custom search
function addCustomSearch() {
  const name = document.getElementById('customName').value.trim();
  const icon = document.getElementById('customIcon').value.trim();
  const url = document.getElementById('customUrl').value.trim();
  
  if (!name || !url) {
    alert('Please fill in at least the name and URL fields');
    return;
  }
  
  if (!url.includes('%s')) {
    alert('URL must contain %s where the selected text should be inserted');
    return;
  }
  
  chrome.storage.sync.get('settings', (data) => {
    const settings = data.settings || DEFAULT_SETTINGS;
    settings.customSearches = settings.customSearches || [];
    
    settings.customSearches.push({
      name: name,
      icon: icon || '🔗',
      url: url
    });
    
    chrome.storage.sync.set({ settings: settings }, () => {
      renderCustomSearches(settings.customSearches);
      document.getElementById('customName').value = '';
      document.getElementById('customIcon').value = '';
      document.getElementById('customUrl').value = '';
      showNotification('✓ Custom search added!');
    });
  });
}

// Delete custom search
function deleteCustomSearch(index) {
  if (confirm('Delete this custom search?')) {
    chrome.storage.sync.get('settings', (data) => {
      const settings = data.settings || DEFAULT_SETTINGS;
      settings.customSearches.splice(index, 1);
      
      chrome.storage.sync.set({ settings: settings }, () => {
        renderCustomSearches(settings.customSearches);
        showNotification('✓ Custom search deleted!');
      });
    });
  }
}

// Load saved notes
function loadNotes() {
  chrome.storage.local.get('notes', (data) => {
    const notes = data.notes || [];
    renderNotes(notes);
  });
}

// Render notes
function renderNotes(notes) {
  const viewer = document.getElementById('notesViewer');
  
  if (!notes || notes.length === 0) {
    viewer.innerHTML = '<div class="empty-state">No notes saved yet</div>';
    return;
  }
  
  viewer.innerHTML = notes.map((note, index) => {
    const date = new Date(note.timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    
    return `
      <div class="note-item">
        <div class="note-text">${note.text}</div>
        <div class="note-meta">
          <span>${formattedDate}</span>
          <a href="${note.url}" class="note-link" target="_blank">Open source</a>
        </div>
      </div>
    `;
  }).join('');
}

// Clear all notes
function clearNotes() {
  if (confirm('Are you sure you want to delete all saved notes?')) {
    chrome.storage.local.set({ notes: [] }, () => {
      loadNotes();
      showNotification('✓ All notes cleared!');
    });
  }
}

// Show notification
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
  document.getElementById('resetBtn').addEventListener('click', resetSettings);
  document.getElementById('addCustomBtn').addEventListener('click', addCustomSearch);
  document.getElementById('clearNotesBtn').addEventListener('click', clearNotes);
  
  // Auto-save on toggle change
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  toggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      // Small delay before auto-saving
      setTimeout(saveSettings, 300);
    });
  });
}
