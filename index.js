(function() {
  'use strict';

  const global = {};
  const degreesToRadians = Math.PI / 180;
  const width = 640;
  const height = 480;

  class Clock {
    constructor() {
      this.time = new Date();
    }

    getTime() { return this.time; }

    update() { this.time = new Date(); }
  }

  class Svg {
    constructor(id) {
      this.svg = Svg.createSvgElement("svg");
      this.svg.setAttribute('width', width);
      this.svg.setAttribute('height', height);
      document.getElementById(id).appendChild(this.svg);
    }

    getSvg() { return this.svg; }

    static createSvgElement(name) {
      return document.createElementNS("http://www.w3.org/2000/svg", name);
    }
  }

  class Planet {
    constructor(x, y, r, color, increase, reach, waitTime) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.base = r;
      this.angle = 0;
      this.color = color;
      this.increase = increase; // in pixels per second
      this.reach = reach;
      this.waitTime = waitTime;
      this.lastUpdate = global.clock.getTime();
      this.representation = Svg.createSvgElement('circle');
      this.initiate();
    }

    initiate() {
      this.representation.setAttribute('cx', this.x)
      this.representation.setAttribute('cy', this.y)
      this.representation.setAttribute('r', this.r)
      this.representation.setAttribute('fill', this.color);
      global.svg.getSvg().appendChild(this.representation);
    }

    update() {
      const latestTime = global.clock.getTime();
      const elapsedTime = latestTime - this.lastUpdate;
      if (elapsedTime > this.waitTime) { // Make the movements discrete by waiting an interval
        // Translate the movement by pixelsPerFrame * framesPerSecond * elapsedTime
        const increase = this.increase * elapsedTime / 1000;
        this.angle = (this.angle + this.increase) % 360;
        this.r = this.base + (this.reach * (Math.sin(degreesToRadians * this.angle)));
        this.lastUpdate = latestTime;
      }
    }

    draw() {
      this.representation.setAttribute('r', this.r);
    }
  }

  /* Main part */

  global.clock = new Clock();
  global.svg = new Svg('svg');

  const galaxy = [
    new Planet(width * .25, height * .25, 40, 'brown', 10, 30, 100),
    new Planet(width * .75, height * .25, 60, 'orange', 20, 20, 200),
    new Planet(width * .5, height * .75, 80, 'red', 30, 10, 300),
  ];

  function main() {
    for (const planet of galaxy) {
      planet.update();
      planet.draw();
    }
    global.clock.update(); // Keep the clock managed by god
    requestAnimationFrame(main); // Keep things moving
  }

  main(); // Set it in motion
})();
