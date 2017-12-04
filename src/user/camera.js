/**
 * User Camera
 * Requests webcam permission, then displays the stream in a <video> element.
 */

const config = {
  audio: false,
  video: {
    facingMode: 'environment',
  },
};

/* Add <video> to page to view webcam */

const videoWrapper = document.createElement('div');
const video = document.createElement('video');

const buildElement = () => {
  videoWrapper.className = 'video-container';

  video.autoplay = 'auto';
  video.className = 'video';
  video.controls = false;
  video.crossOrigin = 'anonymous';
  video.id = 'video';
  video.muted = true;
  video.playsInline = true;    // Necessary for mobile
  video.preload = true;

  videoWrapper.appendChild(video);
  document.body.appendChild(videoWrapper);
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

const getMediaStream = () => {
  window.navigator.mediaDevices.getUserMedia(config)
    .then((stream) => {
      video.srcObject = stream;
      // video.onloadedmetadata = e => resizeVideo(e);
      video.play();
    })
    .catch(error => console.log(error));
};

const init = () => {
  buildElement();
  getMediaStream();
};

export default { init };
