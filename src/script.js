import "./style.css";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { animate } from "popmotion";
// import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Axes Helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () =>
  animate({
    from: 0,
    to: 1,
    onUpdate: (latest) => (canvas.style.opacity = latest),
  });
const textureLoader = new THREE.TextureLoader(loadingManager);
const matcapRedTexture = textureLoader.load("textures/matcaps/red.png");
const matcapBlueTexture = textureLoader.load("textures/matcaps/blue.png");
const matcapYellowTexture = textureLoader.load("textures/matcaps/yellow.png");
const matcapGreenTexture = textureLoader.load("textures/matcaps/7.png");

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader();
fontLoader.load("fonts/Bebas Neue_Regular.typeface.json", (font) => {
  console.log(font);
  const textGeometry = new THREE.TextBufferGeometry("SYNERGY '22", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 16,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 8,
  });
  textGeometry.center();
  const textMaterial = new THREE.MeshMatcapMaterial();
  textMaterial.matcap = matcapGreenTexture;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

/**
 * Object
 */
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const cubeMaterials = [
  matcapRedTexture,
  matcapBlueTexture,
  matcapYellowTexture,
  matcapGreenTexture,
].map((texture) => new THREE.MeshMatcapMaterial({ matcap: texture }));
const cubes = [];

// from https://karthikkaranth.me/blog/generating-random-points-in-a-sphere/
const getPoint = (radius, offset) => {
  radius = radius * radius * radius;
  offset = offset * offset * offset;
  const u = Math.random();
  const v = Math.random();
  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const r = Math.cbrt(Math.random() * radius + offset);
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const x = r * sinPhi * cosTheta;
  const y = r * sinPhi * sinTheta;
  const z = r * cosPhi;
  return [x, y, z];
};

for (let i = 0; i < 300; i++) {
  const cube = new THREE.Mesh(
    cubeGeometry,
    cubeMaterials[i % cubeMaterials.length]
  );

  cube.position.set(...getPoint(10, 2));

  cubes.push(cube);
  scene.add(cube);

  cube.rotation.x = Math.random() * Math.PI * 0.5;
  cube.rotation.y = Math.random() * Math.PI * 0.5;

  const scale = Math.random() * 0.3 + 0.2;
  cube.scale.set(scale, scale, scale);
}

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
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 2.5;
camera.position.y = -0.5;
camera.position.z = 10;
scene.add(camera);

// Controls
const controls = new TrackballControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setClearColor(0x000000, 0); // the default
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();
  const velocity = clock.getDelta() * 0.1;
  for (let i = 0; i < cubes.length; i++) {
    cubes[i].rotation.y += velocity * ((i % 10) / 10);
    cubes[i].rotation.z += velocity;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
  // console.log(camera.position);
};

tick();
