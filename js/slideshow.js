let scene, camera, renderer, loader, currentModelIndex = 0;
const models = ['gltf/BLACKHEADSPIN.gltf', 'gltf/PINKHEAD.gltf', 'gltf/PINKHEAD.gltf']; // Replace with your model paths
const loadedModels = [];

init();
loadModels();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('slideshow-container').appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  scene.add(directionalLight);

  camera.position.z = 10;

  window.addEventListener('resize', onWindowResize, false);
}

function loadModels() {
  loader = new THREE.GLTFLoader();
  models.forEach((model, index) => {
    loader.load(model, (gltf) => {
      const loadedModel = gltf.scene;
      loadedModel.visible = index === currentModelIndex;
      scene.add(loadedModel);
      loadedModels.push(loadedModel);
    });
  });
  animate();
}

function showModel(index) {
  loadedModels.forEach((model, i) => {
    model.visible = i === index;
  });
}

function showNextModel() {
  currentModelIndex = (currentModelIndex + 1) % loadedModels.length;
  showModel(currentModelIndex);
}

function showPreviousModel() {
  currentModelIndex = (currentModelIndex - 1 + loadedModels.length) % loadedModels.length;
  showModel(currentModelIndex);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
