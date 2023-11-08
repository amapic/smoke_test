import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MeshStandardMaterial,
  Mesh,
  Color,
  SphereBufferGeometry,
  HemisphereLight,
  DirectionalLight,
  DirectionalLightHelper,
  ShaderMaterial
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
let container, scene, camera, renderer, controls;

function init() {
  container = document.querySelector("#container");
  scene = new Scene();
  scene.background = new Color("skyblue");

  createCamera();
  createLights();
  createRenderer();
  createGeometries();
  createControls();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  const aspect = container.clientWidth / container.clientHeight;
  camera = new PerspectiveCamera(35, aspect, 0.1, 1000);
  camera.position.set(2, 1, 5);
}

function createLights() {
  const directionalLight = new DirectionalLight(0xffffff, 5);
  directionalLight.position.set(5, 5, 10);

  const directionalLightHelper = new DirectionalLightHelper(
    directionalLight,
    5
  );

  const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 3);
  scene.add(directionalLight, directionalLightHelper, hemisphereLight);
}

function createRenderer() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function createMaterials() {
  //const material = new MeshStandardMaterial({ wireframe: true });
  const material = new ShaderMaterial({
    fragmentShader: fragmentShader,
    vertexShader: vertexShader
  });

  return material;
}

function createGeometries() {
  const geometry = new SphereBufferGeometry(1, 30, 30);
  const material = createMaterials();

  const mesh = new Mesh(geometry, material);
  scene.add(mesh);
}

function createControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

function update() {}

function render() {
  renderer.render(scene, camera);
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener("resize", onWindowResize, false);
