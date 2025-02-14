import * as THREE from 'three';
import VirtualScroll from 'virtual-scroll';

const container = document.getElementById('app');

const width = container.offsetWidth;
const height = container.offsetHeight;

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
camera.position.z = 1;

const scene = new THREE.Scene();

const texture = new THREE.Texture();

const loadingManager = new THREE.LoadingManager();
const imageLoader = new THREE.ImageLoader(loadingManager);

imageLoader.load(
  'https://upload.wikimedia.org/wikipedia/ru/4/4d/SpongeBob_SquarePants_characters_cast.png',
  (image) => {
    texture.image = image;
    texture.needsUpdate = true;
  }
);

const geometry = new THREE.PlaneGeometry(2, 1);
const material = new THREE.MeshBasicMaterial({
  map: texture,
});

const group = new THREE.Group();

for (let index = 0; index < 9; index++) {
  const plane = new THREE.Mesh(geometry, material);
  plane.position.z = -0.5;
  plane.position.x = index * 2.1;
  group.add(plane);
}

scene.add(group);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
container.appendChild(renderer.domElement);

const vs = new VirtualScroll({
  mouseMultiplier: 0.03,
});

let targetY = 0;
let currentY = 0;

vs.on((event) => {
  if (event.deltaY > 0) {
    targetY -= 2.1;
  } else {
    targetY += 2.1;
  }
  targetY = Math.max(-2.1 * (group.children.length - 1), targetY);
  targetY = Math.min(0, targetY);
});

function animate() {
  currentY += (targetY - currentY) * 0.1;

  group.position.x = currentY;

  renderer.render(scene, camera);
}
