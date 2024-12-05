import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Selectors
const container = document.querySelector(".planet");
const nav = document.querySelector(".menu");
const openBtn = document.querySelector(".open");
const closeBtn = document.querySelector(".close");
const overlay = document.querySelector(".overlay");
const namedom = document.querySelector(".name");
const desc = document.querySelector(".desc");
const dis = document.querySelector(".distance h2");
const trv = document.querySelector(".travel-time h2");

// Planets Data
const planets = [
    {
        name: "Moon",
        obj: "./assets/planets/the_moon.glb",
        description: "See our planet as you’ve never seen it before. A perfect relaxing trip away to help regain perspective and come back refreshed. While you’re there, take in some history by visiting the Luna 2 and Apollo 11 landing sites.",
        distance: "384,400 km",
        travel: "3 days",
        center: true
    },
    {
        name: "Mars",
        obj: "./assets/planets/mars (2).glb",
        description: "Don’t forget to pack your hiking boots. You’ll need them to tackle Olympus Mons, the tallest planetary mountain in our solar system. It’s two and a half times the size of Everest!",
        distance: "225 mil. km",
        travel: "9 months",
        center: true
    },
    {
        name: "Venus",
        obj: "./assets/planets/planet_venus.glb",
        description: "Venus has a thick atmosphere that traps heat and creates an incredibly hot surface. It's a destination for those who enjoy a challenge!",
        distance: "42 mil. km",
        travel: "3 months",
        center: false
    },
    {
        name: "Pluto",
        obj: "./assets/planets/pluto.glb",
        description: "Far from the sun, Pluto offers a unique, icy environment and an unforgettable experience of isolation and beauty.",
        distance: "5.9 bil. km",
        travel: "9 years",
        center: true
    }
];

// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x222222, 0.5);
scene.add(ambientLight);

// GLTF Loader
const loader = new GLTFLoader();
let currentObj;

function loadPlanet(planet) {
    // Remove the current object before loading a new one
    if (currentObj) {
        scene.remove(currentObj);
        currentObj = null;
    }

    loader.load(
        planet.obj,
        (glb) => {
            camera.position.z = 2;
            currentObj = glb.scene;
            scene.add(currentObj);

            // Adjust camera position for specific planets
            if (!planet.center) {
                camera.position.z = -1000
            } else if (planet.name == "Mars") {
                camera.position.z = 5
            } else {
                camera.position.z = 2
            }
            console.log(camera.position)
        },
        undefined,
        (error) => console.error('Error loading GLTF model:', error)
    );
}

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;

// To rotate the planet automatically
let lastInteractionTime = Date.now();
const idleRotationSpeed = 0.005;  // Adjust the speed of rotation

// Animation
function animate() {
    controls.update();
    
    // Check if the user has interacted with the scene
    if (Date.now() - lastInteractionTime > 1000) {  // If no interaction in the last second
        if (currentObj) {
            currentObj.rotation.y += idleRotationSpeed;  // Rotate planet automatically
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// Detect user interaction
container.addEventListener("mousedown", () => lastInteractionTime = Date.now());
container.addEventListener("touchstart", () => lastInteractionTime = Date.now());

// Resize Handling
const resizeObserver = new ResizeObserver(() => {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
});
resizeObserver.observe(container);

// Display Planet Info
function displayPlanetInfo(name) {
    for (const planet of planets) {
        if (planet.name === name) {
            namedom.textContent = planet.name;
            desc.textContent = planet.description;
            dis.textContent = planet.distance;
            trv.textContent = planet.travel;

            // Reset animations
            namedom.style.animation = "none";
            desc.style.animation = "none";
            document.querySelector(".divider").style.animation = "none";
            document.querySelector(".stats").style.animation = "none";

            // Restart animations
            setTimeout(() => {
                namedom.style.animation = "motion 1s forwards";
                desc.style.animation = "motion .5s forwards .3s";
                document.querySelector(".divider").style.animation = "motion .5s forwards .6s";
                document.querySelector(".stats").style.animation = "motion .5s forwards .9s";
            }, 0);

            loadPlanet(planet);
            break;
        }
    }
}

// Default Planet Display
displayPlanetInfo("Moon");

// Navigation Controls
openBtn.onclick = () => {
    nav.classList.toggle("menuOpen");
    overlay.classList.toggle("hide");
};
closeBtn.onclick = () => {
    nav.classList.toggle("menuOpen");
    overlay.classList.toggle("hide");
};

// Planet Button Click
document.querySelectorAll(".btn").forEach(btn => {
    btn.onclick = (e) => {
        const planet = e.target.dataset.id;
        displayPlanetInfo(planet);
    };
});
