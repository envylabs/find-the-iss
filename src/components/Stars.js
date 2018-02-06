import React from 'react';

export default class Stars extends React.Component {
  constructor(props) {
    super(props);

    this.handleResize = this.handleResize.bind(this);
    this.draw = this.draw.bind(this);
    this.tick = this.tick.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.context = this.canvas.getContext('2d');
    this.handleResize();
    window.addEventListener('resize', this.handleResize);

    this.tick();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.loop);
    window.removeEventListener('resize', this.handleResize);
  }

  draw() {
    this.context = this.canvas.getContext('2d');
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = '#fff';

    for (var i = 0, x = this.stars.length; i < x; i++) {
      var s = this.stars[i];

      this.context.beginPath();
      this.context.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
      this.context.fill();
    }
  }

  handleResize() {
    this.width = window.innerWidth * window.devicePixelRatio;
    this.height = window.innerHeight * window.devicePixelRatio;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.stars = [];

    for (var i = 0; i < this.canvas.width / 2; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random(),
        vx: Math.floor(Math.random() * 10) - 5,
        vy: Math.floor(Math.random() * 10) - 5
      });
    }
  }

  tick() {
    this.draw();
    this.update();
    this.loop = requestAnimationFrame(this.tick);
  }

  update() {
    for (var i = 0, x = this.stars.length; i < x; i++) {
      var s = this.stars[i];

      s.x += s.vx / 60;
      s.y += s.vy / 60;

      if (s.x < 0 || s.x > this.canvas.width) s.x = -s.x;
      if (s.y < 0 || s.y > this.canvas.height) s.y = -s.y;
    }
  }

  render() {
    return (
      <canvas
        ref={canvas => {
          this.canvas = canvas;
        }}
        style={{ display: 'block', left: 0, position: 'absolute', top: 0, width: '100%' }}
      />
    );
  }
}
