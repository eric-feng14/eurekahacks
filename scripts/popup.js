document.addEventListener('DOMContentLoaded', () => {
  // Initialize settings from storage
  chrome.storage.sync.get({
    sound: 'forest',
    volume: 50,
    leaves: true,
    butterflies: true,
    vines: true,
    scene: 'forest',
    autoTransition: true
  }, (items) => {
    document.getElementById('soundSelect').value = items.sound;
    document.getElementById('volumeSlider').value = items.volume;
    document.getElementById('enableLeaves').checked = items.leaves;
    document.getElementById('enableButterflies').checked = items.butterflies;
    document.getElementById('enableVines').checked = items.vines;
    document.getElementById('sceneSelect').value = items.scene;
    document.getElementById('autoTransition').checked = items.autoTransition;
  });

  // Sound settings
  document.getElementById('soundSelect').addEventListener('change', (e) => {
    chrome.storage.sync.set({ sound: e.target.value });
    updateBackgroundSound(e.target.value);
  });

  document.getElementById('volumeSlider').addEventListener('input', (e) => {
    chrome.storage.sync.set({ volume: e.target.value });
    updateVolume(e.target.value);
  });

  // Visual elements
  ['enableLeaves', 'enableButterflies', 'enableVines'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      const setting = id.replace('enable', '').toLowerCase();
      chrome.storage.sync.set({ [setting]: e.target.checked });
      updateVisualElements();
    });
  });

  // Scene settings
  document.getElementById('sceneSelect').addEventListener('change', (e) => {
    chrome.storage.sync.set({ scene: e.target.value });
    updateBackgroundScene(e.target.value);
  });

  document.getElementById('autoTransition').addEventListener('change', (e) => {
    chrome.storage.sync.set({ autoTransition: e.target.checked });
    if (e.target.checked) {
      setupTimeBasedTransitions();
    }
  });

  // Focus mode
  let focusTimer = null;
  let timeLeft = 25 * 60; // 25 minutes in seconds
  let focusModeActive = false;

  document.getElementById('startFocus').addEventListener('click', () => {
    const timerDiv = document.getElementById('timer');
    const timeDisplay = document.getElementById('timeDisplay');
    const startButton = document.getElementById('startFocus');
    
    if (focusTimer === null) {
      // Start focus mode
      focusModeActive = true;
      timerDiv.classList.remove('hidden');
      startButton.textContent = 'End Focus Session';
      toggleFocusMode(true);
      
      focusTimer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
          clearInterval(focusTimer);
          focusTimer = null;
          focusModeActive = false;
          alert('Focus session completed!');
          timerDiv.classList.add('hidden');
          startButton.textContent = 'Start Focus Session';
          toggleFocusMode(false);
          timeLeft = 25 * 60;
        }
      }, 1000);
    } else {
      // End focus mode
      clearInterval(focusTimer);
      focusTimer = null;
      focusModeActive = false;
      timerDiv.classList.add('hidden');
      startButton.textContent = 'Start Focus Session';
      toggleFocusMode(false);
      timeLeft = 25 * 60;
      timeDisplay.textContent = '25:00';
    }
  });

  document.getElementById('resetTimer').addEventListener('click', () => {
    if (focusTimer !== null) {
      clearInterval(focusTimer);
      focusTimer = null;
    }
    timeLeft = 25 * 60;
    document.getElementById('timeDisplay').textContent = '25:00';
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('startFocus').textContent = 'Start Focus Session';
    focusModeActive = false;
    toggleFocusMode(false);
  });
});

// Helper functions to update the background
function updateBackgroundSound(sound) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'updateSound',
      sound: sound
    });
  });
}

function updateVolume(volume) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'updateVolume',
      volume: volume
    });
  });
}

function updateVisualElements() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'updateVisuals'
    });
  });
}

function updateBackgroundScene(scene) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'updateScene',
      scene: scene
    });
  });
}

function toggleFocusMode(active) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'toggleFocusMode',
      active: active
    });
  });
}

function setupTimeBasedTransitions() {
  const hour = new Date().getHours();
  let scene = 'forest';
  
  if (hour >= 5 && hour < 12) {
    scene = 'morning';
  } else if (hour >= 12 && hour < 17) {
    scene = 'afternoon';
  } else if (hour >= 17 && hour < 20) {
    scene = 'sunset';
  } else {
    scene = 'night';
  }
  
  updateBackgroundScene(scene);
} 