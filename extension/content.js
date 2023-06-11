
const playbackSpeedOverrides = {};

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
    // If there's an override for this video, use that instead
    if (playbackSpeedOverrides[video.src]) {
      setVideoPlaybackSpeed(video, playbackSpeedOverrides[video.src]);
    } else {
      setVideoPlaybackSpeed(video, speed);
    }
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

  document.addEventListener('keydown', (event) => {
    if (event.key === '`') {
      const hoveredVideo = document.querySelectorAll(':hover');
      // Check if the mouse is hovering over a video
      hoveredVideo.forEach((element) => {
        if (element.tagName === 'VIDEO') {
          if (playbackSpeedOverrides[element.src]) {
            delete playbackSpeedOverrides[element.src];
          } else {
            playbackSpeedOverrides[element.src] = 1;
          }
        }
      });
      updatePlaybackSpeed();
    }
  });

  observer.observe(document, { childList: true, subtree: true });

  chrome.runtime.onMessage.addListener((message) => {
    updatePlaybackSpeed();
  });
}

initialize();
  