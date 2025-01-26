import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function getPoint() {
  var u = Math.random();
  var v = Math.random();
  var theta = u * 2.0 * Math.PI;
  var phi = Math.acos(2.0 * v - 1.0);
  var r = Math.cbrt(Math.random());
  var sinTheta = Math.sin(theta);
  var cosTheta = Math.cos(theta);
  var sinPhi = Math.sin(phi);
  var cosPhi = Math.cos(phi);
  var x = r * sinPhi * cosTheta;
  var y = r * sinPhi * sinTheta;
  var z = r * cosPhi;
  return { x: x, y: y, z: z };
}

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.0007);

    this.points = [];
    this.mouseX = 0;
    this.mouseY = 0;

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);

    this.container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      3000,
    );

    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.handleEventMouseMove();
    this.onDocumentMouseMove();
  }

  handleEventMouseMove() {
    document.addEventListener(
      "mousemove",
      (event) => this.onDocumentMouseMove(event),
      false,
    );
  }

  onDocumentMouseMove(event) {
    this.mouseX = (event.clientX - this.width / 2) * 0.0001;
    this.mouseY = (event.clientY - this.height / 2) * 0.0001;
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/ice.png");

    const shaderPoint = THREE.ShaderLib.points;
    const uniforms = THREE.UniformsUtils.clone(shaderPoint.uniforms);
    uniforms.map.value = texture;
    uniforms.size.value = 0.01;
    uniforms.scale.value = this.height / 2;
    uniforms.glo;

    this.material = new THREE.PointsMaterial({
      sizeAttenuation: true,
      alphaTest: 0.5,
      size: uniforms.size.value,
      map: uniforms.map.value,
      depthWrite: false,

      transparent: true,
    });

    this.geometry = new THREE.BufferGeometry();

    for (let i = 0; i < 10000; i++) {
      let p = getPoint();

      this.points.push(4 * p.x, 4 * p.y, 4 * p.z);
    }

    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.points, 3),
    );

    this.plane = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  render() {
    this.camera.position.x +=
      (this.mouseX * 10 - this.camera.position.x) * 0.05;
    this.camera.position.y +=
      (-this.mouseY * 10 - this.camera.position.y) * 0.05;

    this.camera.lookAt(this.scene.position);

    this.controls.update();
    this.scene.rotation.y += 0.0005;
    this.scene.rotation.x += 0.0005;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
