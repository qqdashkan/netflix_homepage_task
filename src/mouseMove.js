import * as THREE from 'three';

export default class Mouse {
  constructor(options) {
    this.container = options.dom;
    this.group = new THREE.Group();
    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      1000
    );
    this.camera.position.set(0, 0, 2);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);
    this.container.appendChild(this.renderer.domElement);

    this.bufferTexture();
    this.handleMouseMove(e);
    this.handleResize();
    this.render(a);
  }
}
