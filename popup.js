// Popup script for Context Search+ v2.0
// Created by ASHISH APPS

document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  setupEventListeners();
});

// Load statistics
function loadStats() {
  // Load saved notes count
  chrome.storage.local.get('notes', (data) => {
    const notes = data.notes || [];
    document.getElementById('savedNotes').textContent = notes.length;
  });
  
  // Load custom searches count
  chrome.storage.sync.get('settings', (data) => {
    const customSearches = data.settings?.customSearches || [];
    document.getElementById('customSearches').textContent = customSearches.length;
  });
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('openSettings').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}
