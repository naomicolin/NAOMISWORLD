// Import Three.js and necessary add-ons
import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js';

// Initialize scene, camera, renderer, and clockrenderer.setSize(window.innerWidth, window.innerHeight);


let scene, camera, renderer, clock;
let sceneContainer = document.querySelector("#scene-container2");

// Audio and listener setup
let listener, audioLoader;

// Animation mixers
let mixers = [];



function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Make background of the canvas transparent
    sceneContainer.appendChild(renderer.domElement);

    // Lighting
    const lightRight = new THREE.DirectionalLight(0xffffff, 4);
    lightRight.position.set(0, 0, 50);
    scene.add(lightRight);
    const lightLeft = new THREE.DirectionalLight(0xffffff, 3);
    lightLeft.position.set(0, 0, 20);
    scene.add(lightLeft);

    // Camera setup
    camera.position.z = 100;

    // Audio setup
    listener = new THREE.AudioListener();
    camera.add(listener);
    audioLoader = new THREE.AudioLoader();

    // Load models with their sounds and animations
    loadModelAndSound('/gltf/naomilogo.gltf', [-135, 25, 0], [17, 17, 17]);
   
    

   
 



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
        gltf.animations.forEach(clip => {
            mixer.clipAction(clip).play();
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
            }
        });
    }, undefined, function (error) {
        console.error('An error happened while loading the model:', error);
    });


    
}






















///////////COLOR CHANGING BACKGROUND//////////////////////
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const html = document.documentElement;
    
    // Set the initial background color to green
    body.style.backgroundColor = 'rgb(25, 187, 33)'; // RGB for #19bb21

    const maxScrollHeight = Math.max(body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight) - window.innerHeight;

    window.addEventListener('scroll', function() {
        const scrollFraction = window.scrollY / maxScrollHeight;
        body.style.backgroundColor = interpolateColor(scrollFraction);
    });
});


function interpolateColor(factor) {
    // Define the color stops between green and hot pink
    const colors = [
        [25, 187, 33],  // Green
        [65, 241, 7],
        [243, 142, 210],  //
        [231, 3, 157]   // Hot Pink
    ];
    const numColors = colors.length;
    const colorIndex = Math.floor(factor * (numColors - 1));
    const colorProgress = (factor * (numColors - 1)) - colorIndex;

    if (colorIndex === numColors - 1) {
        return `rgb(${colors[numColors - 1][0]}, ${colors[numColors - 1][1]}, ${colors[numColors - 1][2]})`;
    }

    const startColor = colors[colorIndex];
    const endColor = colors[colorIndex + 1];
    const r = Math.round(startColor[0] + colorProgress * (endColor[0] - startColor[0]));
    const g = Math.round(startColor[1] + colorProgress * (endColor[1] - startColor[1]));
    const b = Math.round(startColor[2] + colorProgress * (endColor[2] - startColor[2]));

    return `rgb(${r}, ${g}, ${b})`;
}



init();
