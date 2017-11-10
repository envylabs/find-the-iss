/**
 * User Camera
 * Requests webcam permission, then displays the stream in a <video> element.
 */

const defaultConfig = {
  video: {
    el: document.body,
    className: 'nv-video',
    id: 'nv-video',
    wrapperClassName: 'nv-video-wrapper',
  },
  stream: {
    audio: false,
    video: {
      facingMode: 'environment',
    },
  },
};

/* Add <video> to page to view webcam */

const videoWrapper = document.createElement('div');
const video = document.createElement('video');

const buildElement = (config) => {
  videoWrapper.className = config.video.wrapperClassName;

  video.autoplay = 'auto';
  video.className = config.video.className;
  video.controls = false;
  video.crossOrigin = 'anonymous';
  video.id = config.video.id;
  video.muted = true;
  video.playsInline = true;    // Necessary for mobile
  video.preload = true;

  videoWrapper.appendChild(video);
  config.video.el.appendChild(videoWrapper);
};

/* TODO: When video loads, make it fullscreen */

const resizeVideo = (e) => {
  // const videoRatio = e.target.videoHeight / e.target.videoWidth;
  // const windowRatio = window.innerHeight / window.innerWidth;

  // console.log(e.target.videoWidth, e.target.videoHeight);

  // console.log(videoRatio, windowRatio);

  // return e.target.videoWidth;
};

/* Get webcam media stream */

const getMediaStream = (config) => {
  window.navigator.mediaDevices.getUserMedia(config.stream)
    .then((stream) => {
      video.srcObject = stream;
      // video.onloadedmetadata = e => resizeVideo(e);
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
