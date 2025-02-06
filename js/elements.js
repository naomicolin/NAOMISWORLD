// Import Three.js and necessary add-ons
import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js';
import { DragControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/DragControls.js';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';

// Initialize scene, camera, renderer, and sunglasses
let scene, camera, renderer, sunglasses;
let sceneContainer = document.querySelector("#scene-elementscontainer");
let controls;

// Animation mixers
let mixers = [];

// Draggable objects array
let draggableObjects = [];

// Audio and listener setup (initialized if needed)
let listener = new THREE.AudioListener();
let audioLoader = new THREE.AudioLoader();

function init() {
    scene = new THREE.Scene();
    sunglasses = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Make background of the canvas transparent
    sceneContainer.appendChild(renderer.domElement);

    // Setup orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    // Add listener to the camera
    camera.add(listener);

    // Lighting setup
    const lightRight = new THREE.DirectionalLight(0xffffff, 5);
    lightRight.position.set(0, 50, 30);
    scene.add(lightRight);
    const lightLeft = new THREE.DirectionalLight(0xffffff, 3);
    lightLeft.position.set(50, 0, 20);
    scene.add(lightLeft);

    // Load models
    loadModel('GLTF/PINKHEAD.gltf', [-180, -80, -10], [10, 10, 10]);

    loadModel('GLTF/CROC HEART SUNGLASSES.gltf', [180, -115, 20], [20, 20, 20]);
    loadModel('GLTF/HEART SUNGLASSES.gltf', [670, -50, 0], [16, 16, 16]);
    loadModel('GLTF/TAG UBAG.gltf', [-215, -130, 55], [17, 17, 17]);

    // Start the animation loop
    animate();
}

function loadModel(modelUrl, position, scale) {
    const loader = new GLTFLoader();
    loader.load(modelUrl, function (gltf) {
        const model = gltf.scene;
        model.position.set(...position);
        model.scale.set(...scale);
        scene.add(model);
        draggableObjects.push(model);

        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach(clip => {
            mixer.clipAction(clip).play();
        });
        mixers.push(mixer);

        if (draggableObjects.length === 1) { // Initialize drag controls after the first model is loaded
            initDragControls();
        }
    }, undefined, function (error) {
        console.error('An error happened while loading the model:', error);
    });
}

function initDragControls() {
    const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', event => {
        controls.enabled = false;  // Disable OrbitControls when dragging starts
        event.object.traverse(function (child) {
            if (child.isMesh) {
                child.material.opacity = 0.5;
            }
        });
    });
    dragControls.addEventListener('dragend', event => {
        controls.enabled = true;  // Re-enable OrbitControls when dragging ends
        event.object.traverse(function (child) {
            if (child.isMesh) {
                child.material.opacity = 1;
            }
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    const delta = sunglasses.getDelta();
    mixers.forEach(mixer => mixer.update(delta));
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
