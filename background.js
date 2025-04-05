// Check for time-based transitions every minute
chrome.alarms.create('timeCheck', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'timeCheck') {
    chrome.storage.sync.get(['autoTransition'], (items) => {
      if (items.autoTransition) {
        updateTimeBasedScene();
      }
    });
  }
});

function updateTimeBasedScene() {
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
  
  // Update all active tabs
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'updateScene',
        scene: scene
      }).catch(() => {
        // Ignore errors for tabs that can't receive messages
      });
    });
  });
}

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.set({
    sound: 'forest',
    volume: 50,
    leaves: true,
    butterflies: true,
    vines: true,
    scene: 'forest',
    autoTransition: true
  });
  
  // Start time-based transitions
  updateTimeBasedScene();
});
