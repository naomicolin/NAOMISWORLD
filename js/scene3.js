// Import Three.js and necessary add-ons
import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js';

// Initialize scene, camera, renderer, and clockrenderer.setSize(window.innerWidth, window.innerHeight);


let scene, camera, renderer;
let sceneContainer = document.querySelector("#scene-container3");

function init() {
    
    // Create a new scene
    scene = new THREE.Scene();

    // Set up the camera
    camera = new THREE.PerspectiveCamera(
        75,
        sceneContainer.clientWidth / sceneContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 100;

    // Set up the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
    sceneContainer.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Load the GLTF model
    const loader = new GLTFLoader();
    loader.load(
        'gltf/naomilogo.gltf',
        (gltf) => {
            const model = gltf.scene;
            scene.add(model);
            animate();
        },
        undefined,
        (error) => {
            console.error('An error occurred while loading the model:', error);
        }
    );

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    const sceneContainer = document.querySelector('#scene-container2');
    camera.aspect = sceneContainer.clientWidth / sceneContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(sceneContainer.clientWidth, sceneContainer.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Initialize the scene
init();
