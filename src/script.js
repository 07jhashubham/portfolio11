import * as THREE from "three";
import GUI from "lil-gui";
import { float, log } from "three/examples/jsm/nodes/Nodes.js";
import gsap from "gsap/gsap-core";
/**
 * Debug
 */
const gui = new GUI();
gui.hide();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor");

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/gradients/3.jpg");
texture.colorSpace = THREE.SRGBColorSpace;
texture.magFilter = THREE.NearestFilter;
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Test cube
 */

const materail = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: texture,
});
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), materail);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), materail);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  materail
);

scene.add(mesh1, mesh2, mesh3);

// leight

const directionalLLight = new THREE.DirectionalLight("#ffffff", 3);
scene.add(directionalLLight);
directionalLLight.position.set(1, 1, 0);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

const objDis = 4;

mesh1.position.y = 0 * objDis;
mesh2.position.y = -1 * objDis;
mesh3.position.y = -2 * objDis;

const meshes = [mesh1, mesh2, mesh3];

let scrollY = window.scrollY;
let corrent = 0;
window.addEventListener("scroll", () => {
  scrollY = (window.scrollY / sizes.height) * objDis;

  let newCruuent = Math.round(window.scrollY / sizes.height);
  if (corrent != newCruuent) {
    corrent = newCruuent;
    gsap.to(meshes[newCruuent].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

const crusor = {};
crusor.x = 0;
crusor.y = 0;

window.addEventListener("mousemove", (event) => {
  crusor.x = event.clientX / sizes.width;
  crusor.y = event.clientY / sizes.height;
  // console.log(crusor.x, crusor.y);
});

// particel

const count = 2000;
const position = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  position[i * 3 + 0] = (Math.random() - 0.5) * 24;
  position[i * 3 + 1] = (Math.random() - 0.5) * 24;
  position[i * 3 + 2] = (Math.random() - 0.5) * 24;
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));

const materailPoint = new THREE.PointsMaterial({
  size: 0.003,
  color: parameters.materialColor,
  sizeAttenuation: true,
});

const points = new THREE.Points(geometry, materailPoint);
scene.add(points);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearAlpha(0);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previous = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delta = elapsedTime - previous;
  previous = elapsedTime;
  camera.position.y = -scrollY;

  const paralexX = -crusor.x;
  const paralexY = crusor.y;
  cameraGroup.position.x = paralexX - cameraGroup.position.x * 5 * delta;
  cameraGroup.position.y = paralexY - cameraGroup.position.y * 5 * delta;

  for (const mesh of meshes) {
    mesh.rotation.y += delta * 0.1;
    mesh.rotation.x += delta * 0.13;
  }
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
