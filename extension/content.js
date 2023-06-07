
function setVideoPlaybackSpeed(video, speed) {
  video.playbackRate = speed;
}

function getVideoPlaybackSpeed(video) {
  return video.playbackRate;
}

function loadPlaybackSpeed(callback) {
  if (chrome.runtime?.id) {
    chrome.storage.local.get('playbackSpeed', (result) => {
      const speed = result.playbackSpeed;
      callback(speed);
    });
  } else {
    callback(null);
  }
}

function setPlaybackSpeedForAllVideos(speed) {
  const videos = document.querySelectorAll('video');
  videos.forEach((video) => {
    setVideoPlaybackSpeed(video, speed);
  });
}

function updatePlaybackSpeed(){
  loadPlaybackSpeed((speed) => {
    if (speed) {
      setPlaybackSpeedForAllVideos(speed);
    }
  });
}

function initialize() {
  updatePlaybackSpeed();

  const observer = new MutationObserver(() => {
    updatePlaybackSpeed();
  });

  observer.observe(document, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener((message) => {
    loadPlaybackSpeed((speed) => {
      if (speed) {
        setPlaybackSpeedForAllVideos(speed);
      }
    });
  });
}

initialize();
  