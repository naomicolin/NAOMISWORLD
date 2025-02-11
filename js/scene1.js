// Import Three.js and necessary add-ons
import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js';

// Initialize scene, camera, renderer, and clock
let scene, camera, renderer, clock;
let sceneContainer = document.querySelector("#scene-container1");

// Audio and listener setup
let listener, audioLoader;

// Animation mixers
let mixers = [];

function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 0, 50);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Make background of the canvas transparent
    sceneContainer.appendChild(renderer.domElement);

    // Lighting
    const lightRight = new THREE.DirectionalLight(0xffffff, 5);
    lightRight.position.set(0, 50, 30);
    scene.add(lightRight);
    const lightLeft = new THREE.DirectionalLight(0xffffff, 3);
    lightLeft.position.set(50, 0, 20);
    scene.add(lightLeft);

    // Camera setup
    camera.position.z = 10;

    // Audio setup
    listener = new THREE.AudioListener();
    camera.add(listener);
    audioLoader = new THREE.AudioLoader();

    // Load models with their sounds and animations
    loadModelAndSound('gltf/clicktvs.gltf', [28.5, -10, 0], [2, 2, 2]);
    

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    mixers.forEach(mixer => mixer.update(delta));
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

const loader = new GLTFLoader();

function loadModelAndSound(modelUrl, position, scale, soundUrl) {
    loader.load(modelUrl, function (gltf) {
        const model = gltf.scene;
        model.position.set(...position);
        model.scale.set(...scale);
        scene.add(model);

        const mixer = new THREE.AnimationMixer(model);
        let actions = gltf.animations.map(clip => {
            const action = mixer.clipAction(clip);
            action.loop = THREE.LoopOnce; // Play only once
            action.clampWhenFinished = true; // Stop at last frame
            action.paused = true; // Initially paused
            return action;
        });
        mixers.push(mixer);

        const sound = new THREE.Audio(listener);
        audioLoader.load(soundUrl, function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
        });

        renderer.domElement.addEventListener('click', function(event) {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(model, true);
            if (intersects.length > 0) {
                sound.play();
                actions.forEach(action => {
                    action.reset();
                    action.paused = false;
                    action.play();
                });
            }
        });
    }, undefined, function (error) {
        console.error('An error happened while loading the model:', error);
    });
}

init();
