
function setVideoPlaybackSpeed(video, speed) {
  video.playbackRate = speed;
}

function getVideoPlaybackSpeed(video) {
  return video.playbackRate;
}

function savePlaybackSpeed(speed) {
  chrome.storage.local.set({ playbackSpeed: speed });
}

function loadPlaybackSpeed(callback) {
  chrome.storage.local.get('playbackSpeed', (result) => {
    const speed = result.playbackSpeed;
    callback(speed);
  });
}

function setPlaybackSpeedForAllVideos(speed) {
  const videos = document.querySelectorAll('video');
  videos.forEach((video) => {
    setVideoPlaybackSpeed(video, speed);
  });
}

function initialize() {
  loadPlaybackSpeed((speed) => {
    if (speed) {
      setPlaybackSpeedForAllVideos(speed);
    }
  });

  const observer = new MutationObserver(() => {
    loadPlaybackSpeed((speed) => {
      if (speed) {
        setPlaybackSpeedForAllVideos(speed);
      }
    });
  });

  observer.observe(document, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener((message) => {
    const { speed } = message;
    if (speed) {
      setPlaybackSpeedForAllVideos(speed);
      savePlaybackSpeed(speed);
    }
  });
}

initialize();
  