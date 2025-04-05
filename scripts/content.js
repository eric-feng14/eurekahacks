// Create container for nature elements
const natureContainer = document.createElement('div');
natureContainer.id = 'nature-view-container';
document.body.appendChild(natureContainer);

// Create audio element for ambient sounds
const audioElement = document.createElement('audio');
audioElement.id = 'nature-view-audio';
audioElement.loop = true;
document.body.appendChild(audioElement);

// Initialize settings
let settings = {
  sound: 'forest',
  volume: 50,
  leaves: true,
  butterflies: true,
  vines: true,
  scene: 'forest'
};

// Load settings from storage
chrome.storage.sync.get(settings, (items) => {
  settings = items;
  initializeNatureView();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'updateSound':
      settings.sound = request.sound;
      updateSound();
      break;
    case 'updateVolume':
      settings.volume = request.volume;
      updateVolume();
      break;
    case 'updateVisuals':
      updateVisualElements();
      break;
    case 'updateScene':
      settings.scene = request.scene;
      updateScene();
      break;
    case 'toggleFocusMode':
      toggleFocusMode(request.active);
      break;
  }
});

function initializeNatureView() {
  updateSound();
  updateVolume();
  updateVisualElements();
  updateScene();
}

function updateSound() {
  if (settings.sound === 'none') {
    audioElement.pause();
    return;
  }
  
  audioElement.src = chrome.runtime.getURL(`assets/sounds/${settings.sound}.mp3`);
  audioElement.play();
}

function updateVolume() {
  audioElement.volume = settings.volume / 100;
}

function updateVisualElements() {
  // Clear existing elements
  natureContainer.innerHTML = '';
  
  if (settings.leaves) {
    createLeaves();
  }
  
  if (settings.butterflies) {
    createButterflies();
  }
  
  if (settings.vines) {
    createVines();
  }
}

function updateScene() {
  // Remove any existing time-based classes
  natureContainer.classList.remove('morning', 'afternoon', 'sunset', 'night');
  
  // Set the background image
  natureContainer.style.backgroundImage = `url(${chrome.runtime.getURL(`assets/images/${settings.scene}.jpg`)})`;
  
  // Add time-based class if applicable
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    natureContainer.classList.add('morning');
  } else if (hour >= 12 && hour < 17) {
    natureContainer.classList.add('afternoon');
  } else if (hour >= 17 && hour < 20) {
    natureContainer.classList.add('sunset');
  } else {
    natureContainer.classList.add('night');
  }
}

// Visual element creation functions
function createLeaves() {
  for (let i = 0; i < 10; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'nature-leaf';
    leaf.style.left = `${Math.random() * 100}%`;
    leaf.style.animationDuration = `${5 + Math.random() * 5}s`;
    leaf.style.animationDelay = `${Math.random() * 5}s`;
    natureContainer.appendChild(leaf);
  }
}

function createButterflies() {
  for (let i = 0; i < 5; i++) {
    const butterfly = document.createElement('div');
    butterfly.className = 'nature-butterfly';
    butterfly.style.left = `${Math.random() * 100}%`;
    butterfly.style.top = `${Math.random() * 100}%`;
    butterfly.style.animationDuration = `${10 + Math.random() * 10}s`;
    butterfly.style.animationDelay = `${Math.random() * 5}s`;
    natureContainer.appendChild(butterfly);
  }
}

function createVines() {
  const vineContainer = document.createElement('div');
  vineContainer.className = 'nature-vines';
  
  for (let i = 0; i < 3; i++) {
    const vine = document.createElement('div');
    vine.className = 'nature-vine';
    vine.style.left = `${30 + i * 20}%`;
    vine.style.animationDelay = `${i * 2}s`;
    vineContainer.appendChild(vine);
  }
  
  natureContainer.appendChild(vineContainer);
}

// Create focus mode overlay
function createFocusOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'nature-focus-overlay';
  document.body.appendChild(overlay);
  return overlay;
}

// Toggle focus mode
function toggleFocusMode(active) {
  let overlay = document.querySelector('.nature-focus-overlay');
  
  if (active && !overlay) {
    overlay = createFocusOverlay();
  }
  
  if (overlay) {
    if (active) {
      overlay.classList.add('active');
    } else {
      overlay.classList.remove('active');
    }
  }
}

// Add styles for nature elements
const styles = document.createElement('style');
styles.textContent = `
  #nature-view-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-size: cover;
    background-position: center;
    pointer-events: none;
  }

  .nature-leaf {
    position: absolute;
    width: 20px;
    height: 20px;
    background: url(${chrome.runtime.getURL('assets/images/leaf.png')}) no-repeat;
    background-size: contain;
    animation: falling linear infinite;
  }

  .nature-butterfly {
    position: absolute;
    width: 30px;
    height: 30px;
    background: url(${chrome.runtime.getURL('assets/images/butterfly.png')}) no-repeat;
    background-size: contain;
    animation: floating linear infinite;
  }

  .nature-vines {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 200px;
  }

  .nature-vine {
    position: absolute;
    bottom: 0;
    width: 20px;
    height: 0;
    background: url(${chrome.runtime.getURL('assets/images/vine.png')}) repeat-y;
    background-size: contain;
    animation: growing 5s ease-out forwards;
  }

  @keyframes falling {
    0% {
      transform: translateY(-100px) rotate(0deg);
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
    }
  }

  @keyframes floating {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      transform: translate(50px, -50px) rotate(15deg);
    }
    50% {
      transform: translate(100px, 0) rotate(0deg);
    }
    75% {
      transform: translate(50px, 50px) rotate(-15deg);
    }
  }

  @keyframes growing {
    0% {
      height: 0;
    }
    100% {
      height: 200px;
    }
  }
`;

document.head.appendChild(styles); 