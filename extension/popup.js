
function setPlaybackSpeed(speed) {
  chrome.storage.local.set({ playbackSpeed: speed });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { speed });
  });
}

function resetPlaybackSpeed() {
  const speed = 1;
  setPlaybackSpeed(speed);
  document.getElementById('speedInput').value = speed;
}

function initializePopup() {
  const speedInput = document.getElementById('speedInput');
  const resetSpeedButton = document.getElementById('resetSpeedButton');
  const setSpeedButton = document.getElementById('setSpeedButton');

  chrome.storage.local.get('playbackSpeed', (result) => {
    const speed = result.playbackSpeed;
    if (speed) {
      speedInput.value = speed;
    }
  });

  speedInput.addEventListener('change', () => {
    const speed = parseFloat(speedInput.value);
    setPlaybackSpeed(speed);
  });

  speedInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      speedInput.blur(); // Unfocus the input field
    }
  });

  speedInput.addEventListener('blur', () => {
    const speed = parseFloat(speedInput.value);
    setPlaybackSpeed(speed);
  });

  resetSpeedButton.addEventListener('click', () => {
    resetPlaybackSpeed();
  });

  setSpeedButton.addEventListener('click', () => {
    const speed = parseFloat(speedInput.value);
    setPlaybackSpeed(speed);
  });
}

initializePopup();
  