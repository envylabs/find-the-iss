/**
 * Video
 * Requests webcam permission, then displays the stream in a <video> element.
 */

const defaultConfig = {
  el: document.body,
  className: 'nv-video',
  id: 'nv-video',
  stream: {
    audio: false,
    video: {
      facingMode: 'environment',
    },
  },
};

/* Add <video> to page to view webcam */

const video = document.createElement('video');

const buildElement = (config) => {
  video.autoplay = 'auto';
  video.className = config.className;
  video.controls = false;
  video.crossOrigin = 'anonymous';
  video.id = config.id;
  video.muted = true;
  video.playsInline = true;    // Necessary for mobile
  video.preload = true;

  config.el.appendChild(video);
};

/* When video loads, make it fullscreen */

const resizeVideo = (e) => {
  return e.target.videoWidth;
};

/* Get webcam media stream */

const getMediaStream = (config) => {
  window.navigator.mediaDevices.getUserMedia(config.stream)
    .then((stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = e => resizeVideo(e);
      video.play();
    })
    .catch(error => console.log(error));
};


const init = (config = {}) => {
  const mergedConfig = Object.assign(defaultConfig, config);

  buildElement(mergedConfig);
  getMediaStream(mergedConfig);
};

export default { init };
