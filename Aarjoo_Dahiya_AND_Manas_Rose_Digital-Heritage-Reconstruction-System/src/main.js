import "./style.css";

import * as THREE from "three";

import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js";

import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader.js";

import {
    RoomEnvironment
} from "three/examples/jsm/environments/RoomEnvironment.js";

import {
    CSS2DRenderer,
    CSS2DObject
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

import {
    monuments
} from "./monuments.js";

import {
    createProceduralMonument
} from "./proceduralHeritage.js";

import {
    ambientSoundscape
} from "./ambientAudio.js";


// =========================================================
// APPLICATION STATE
// =========================================================

let currentIndex = 0;

let currentFilter = "mp";

let currentMonument = null;

let currentModel = null;

let selectedHotspot = null;

let hotspotObjects = [];

let cameraAnimation = null;

let lightingAnimation = null;

let currentLighting = "day";

let autoRotate = false;

let autoTourTimer = null;

let autoTourIndex = 0;


// =========================================================
// DOM REFERENCES
// =========================================================

const monumentNav =
    document.getElementById(
        "monument-nav"
    );

const stageBackdrop =
    document.getElementById(
        "stage-backdrop"
    );

const stageCaption =
    document.getElementById(
        "stage-caption"
    );

const threeContainer =
    document.getElementById(
        "three-container"
    );

const monEra =
    document.getElementById(
        "mon-era"
    );

const monName =
    document.getElementById(
        "mon-name"
    );

const monTagline =
    document.getElementById(
        "mon-tagline"
    );

const factStrip =
    document.getElementById(
        "fact-strip"
    );

const hotspotPanel =
    document.getElementById(
        "hotspot-panel"
    );

const hotspotTitle =
    document.getElementById(
        "hotspot-title"
    );

const hotspotDescription =
    document.getElementById(
        "hotspot-description"
    );

const tourPanel =
    document.getElementById(
        "tour-panel"
    );

const tourList =
    document.getElementById(
        "tour-list"
    );

const modal =
    document.getElementById(
        "modal"
    );

const modalContent =
    document.getElementById(
        "modal-content"
    );

const ambientBtn =
    document.getElementById(
        "ambient-btn"
    );

const autoTourBtn =
    document.getElementById(
        "auto-tour-btn"
    );


// =========================================================
// THREE.JS SCENE
// =========================================================

const scene =
    new THREE.Scene();

const particleCount = 140;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 24;
    particlePositions[i + 1] = Math.random() * 14;
    particlePositions[i + 2] = (Math.random() - 0.5) * 24;
}

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
);

const particleMaterial = new THREE.PointsMaterial({
    size: 0.14,
    color: 0xecd599,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
});

const atmosphericParticles = new THREE.Points(
    particleGeometry,
    particleMaterial
);

scene.add(atmosphericParticles);


// =========================================================
// CAMERA
// =========================================================

const camera =
    new THREE.PerspectiveCamera(
        45,
        1,
        0.01,
        10000
    );


// =========================================================
// RENDERER
// =========================================================

const renderer =
    new THREE.WebGLRenderer({
        antialias:
            true,

        alpha:
            true
    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


renderer.toneMapping =
    THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
    1.05;


renderer.shadowMap.enabled =
    true;


renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


renderer.setClearColor(
    0x000000,
    0
);


// =========================================================
// ENVIRONMENT MAP (IBL for Photorealistic PBR Rendering)
// =========================================================

const pmremGenerator =
    new THREE.PMREMGenerator(
        renderer
    );

pmremGenerator.compileEquirectangularShader();

const neutralEnvironment =
    pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
    ).texture;

scene.environment =
    neutralEnvironment;


threeContainer.appendChild(
    renderer.domElement
);


// =========================================================
// CSS LABEL RENDERER
// =========================================================

const labelRenderer =
    new CSS2DRenderer();


labelRenderer.domElement.className =
    "absolute inset-0 pointer-events-none";


threeContainer.appendChild(
    labelRenderer.domElement
);


// =========================================================
// ORBIT CONTROLS
// =========================================================

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );


controls.enableDamping =
    true;


controls.dampingFactor =
    0.055;


controls.enableRotate =
    true;


controls.enableZoom =
    true;


controls.enablePan =
    true;


controls.autoRotate =
    false;


controls.autoRotateSpeed =
    0.65;


controls.screenSpacePanning =
    true;


controls.maxPolarAngle =
    Math.PI * 0.49;


controls.minDistance =
    2;


controls.maxDistance =
    10000;


// =========================================================
// LIGHTING
// =========================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        0.65
    );

scene.add(
    ambientLight
);


const sun =
    new THREE.DirectionalLight(
        0xffefd3,
        2.2
    );

sun.position.set(
    10,
    18,
    10
);

sun.castShadow =
    true;

scene.add(
    sun
);


const fillLight =
    new THREE.HemisphereLight(
        0xddeeff,
        0x5c4a39,
        0.45
    );

scene.add(
    fillLight
);


const moon =
    new THREE.DirectionalLight(
        0x718dc1,
        0
    );

moon.position.set(
    -10,
    16,
    -8
);

scene.add(
    moon
);


const nightAmbient =
    new THREE.AmbientLight(
        0x26385d,
        0
    );

scene.add(
    nightAmbient
);


// =========================================================
// WARM ARCHITECTURAL LIGHTS
// =========================================================

const architecturalLights =
    [];


for (
    let i = 0;
    i < 8;
    i++
) {

    const light =
        new THREE.PointLight(
            0xffc77b,
            0,
            100,
            2
        );


    architecturalLights.push(
        light
    );


    scene.add(
        light
    );

}


// =========================================================
// GROUND SHADOW (Smooth Radial Falloff)
// =========================================================

function createContactShadowTexture() {

    if (
        typeof document === "undefined"
    ) {

        return null;

    }

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        256;

    canvas.height =
        256;

    const ctx =
        canvas.getContext(
            "2d"
        );

    const gradient =
        ctx.createRadialGradient(
            128,
            128,
            10,
            128,
            128,
            128
        );

    gradient.addColorStop(
        0,
        "rgba(0, 0, 0, 0.70)"
    );

    gradient.addColorStop(
        0.25,
        "rgba(0, 0, 0, 0.45)"
    );

    gradient.addColorStop(
        0.65,
        "rgba(0, 0, 0, 0.12)"
    );

    gradient.addColorStop(
        1,
        "rgba(0, 0, 0, 0)"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        256,
        256
    );

    const texture =
        new THREE.CanvasTexture(
            canvas
        );

    texture.colorSpace =
        THREE.SRGBColorSpace;

    return texture;

}


const shadowPlane =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            1,
            1
        ),

        new THREE.MeshBasicMaterial({
            map:
                createContactShadowTexture(),

            transparent:
                true,

            opacity:
                0.85,

            depthWrite:
                false
        })

    );


shadowPlane.rotation.x =
    -Math.PI / 2;


shadowPlane.visible =
    false;


scene.add(
    shadowPlane
);


// =========================================================
// MODEL LOADER
// =========================================================

const gltfLoader =
    new GLTFLoader();


// =========================================================
// LIGHTING PRESETS
// =========================================================

const lightingModes = {

    day: {

        ambient:
            0.65,

        sun:
            2.2,

        moon:
            0,

        nightAmbient:
            0,

        warm:
            0,

        exposure:
            1.05

    },


    sunset: {

        ambient:
            0.45,

        sun:
            1.25,

        moon:
            0.15,

        nightAmbient:
            0.10,

        warm:
            5,

        exposure:
            1.00

    },


    night: {

        ambient:
            0.15,

        sun:
            0.05,

        moon:
            0.85,

        nightAmbient:
            0.55,

        warm:
            20,

        exposure:
            0.90

    },

    amber: {

        ambient:
            0.50,

        sun:
            1.6,

        moon:
            0.08,

        nightAmbient:
            0.15,

        warm:
            12,

        exposure:
            1.08

    }

};


// =========================================================
// RESIZE
// =========================================================

function resizeViewer() {

    const width =
        threeContainer.clientWidth;


    const height =
        threeContainer.clientHeight;


    if (
        width <= 0 ||
        height <= 0
    ) {

        return;

    }


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height
    );


    labelRenderer.setSize(
        width,
        height
    );

}


window.addEventListener(
    "resize",
    resizeViewer
);


// =========================================================
// MONUMENT NAVIGATION
// =========================================================

// =========================================================
// MONUMENT NAVIGATION
// =========================================================

function renderNavigation() {

    monumentNav.innerHTML =
        "";


    // Region Filter Controls
    const filterContainer =
        document.createElement(
            "div"
        );

    filterContainer.className =
        "flex flex-col gap-2 mb-4 pb-3 border-b border-white/10";

    filterContainer.innerHTML = `
        <div class="text-[10px] tracking-widest text-[#8a6435] font-semibold uppercase px-1">
            Regional Focus
        </div>
        <div class="grid grid-cols-2 gap-1.5">
            <button
                type="button"
                id="filter-mp"
                class="px-2 py-1.5 text-[11px] font-semibold rounded border transition text-center ${
                    currentFilter === "mp"
                        ? "bg-[#c08a49] text-[#11181b] border-[#c08a49]"
                        : "bg-[#1b2327] text-[#ede8dc] border-white/10 hover:border-white/20"
                }"
            >
                🏛️ MP & Indore
            </button>
            <button
                type="button"
                id="filter-all"
                class="px-2 py-1.5 text-[11px] font-semibold rounded border transition text-center ${
                    currentFilter === "all"
                        ? "bg-[#c08a49] text-[#11181b] border-[#c08a49]"
                        : "bg-[#1b2327] text-[#ede8dc] border-white/10 hover:border-white/20"
                }"
            >
                🌐 All Sites
            </button>
        </div>
    `;

    monumentNav.appendChild(
        filterContainer
    );

    filterContainer
        .querySelector(
            "#filter-mp"
        )
        .addEventListener(
            "click",
            () => {

                currentFilter =
                    "mp";

                renderNavigation();

            }
        );

    filterContainer
        .querySelector(
            "#filter-all"
        )
        .addEventListener(
            "click",
            () => {

                currentFilter =
                    "all";

                renderNavigation();

            }
        );


    const visibleMonuments =
        monuments
            .map(
                (m, idx) => ({ ...m, originalIndex: idx })
            )
            .filter(
                m => currentFilter === "all" || m.isMP
            );


    visibleMonuments.forEach(
        monument => {

            const index =
                monument.originalIndex;

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "monument-plaque";


            if (
                index === currentIndex
            ) {

                button.classList.add(
                    "active"
                );

            }


            const tagBadge =
                monument.isIndore
                    ? '<span class="inline-block mt-1 text-[9px] font-bold text-[#e5c158] bg-[#e5c158]/10 px-1.5 py-0.5 rounded">Indore Royal Site</span>'
                    : monument.isMP
                        ? '<span class="inline-block mt-1 text-[9px] font-bold text-[#5e8c7c] bg-[#5e8c7c]/10 px-1.5 py-0.5 rounded">Madhya Pradesh</span>'
                        : '<span class="inline-block mt-1 text-[9px] font-bold text-[#8e8b83] bg-white/5 px-1.5 py-0.5 rounded">National Landmark</span>';


            button.innerHTML = `

                <span class="plaque-number">
                    ${String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    )}
                </span>

                <span class="plaque-name">
                    ${monument.name}
                </span>

                <span class="plaque-location">
                    ${monument.city} · ${monument.state}
                </span>

                ${tagBadge}

            `;


            button.addEventListener(
                "click",
                () => {

                    currentIndex =
                        index;


                    renderNavigation();


                    loadMonument(
                        monuments[index]
                    );

                }
            );


            monumentNav.appendChild(
                button
            );

        }
    );

}


// =========================================================
// HERO BACKGROUND
// =========================================================

function setBackdrop(
    monument
) {

    if (
        monument.heroImage &&
        monument.heroImage.trim() !== ""
    ) {

        stageBackdrop.style.backgroundImage =
            `url("${monument.heroImage}")`;

    } else {

        stageBackdrop.style.backgroundImage =
            "radial-gradient(circle at 50% 30%, #202b33 0%, #0d1215 80%)";

    }

    stageBackdrop.classList.remove(
        "lt-night",
        "lt-sunset"
    );

}


// =========================================================
// PROCEDURAL 3D MODEL LOADER
// =========================================================

function loadProceduralModel(
    id
) {

    stageCaption.textContent =
        "Reconstructing 3D architectural elements…";

    currentModel =
        createProceduralMonument(
            id
        );

    prepareModel(
        currentModel
    );

    scene.add(
        currentModel
    );

    return currentModel;

}


// =========================================================
// LOAD MONUMENT
// =========================================================

async function loadMonument(
    monument
) {

    currentMonument =
        monument;


    currentLighting =
        "day";


    autoRotate =
        false;


    controls.autoRotate =
        false;


    selectedHotspot =
        null;


    closeHotspot();


    closeTour();


    setBackdrop(
        monument
    );


    renderMonumentHeader(
        monument
    );


    clearCurrentModel();


    resizeViewer();


    stageCaption.textContent =
        "Preparing the experience…";


    try {

        let loaded =
            false;


        if (
            monument.model
        ) {

            try {

                console.log(
                    "Loading local monument GLB:",
                    monument.model
                );

                await loadLocalModel(
                    monument.model
                );

                loaded =
                    true;

            } catch (
                glbError
            ) {

                console.warn(
                    "GLB file not accessible, switching to procedural 3D reconstruction:",
                    monument.id,
                    glbError
                );

            }

        }


        if (
            !loaded
        ) {

            loadProceduralModel(
                monument.id
            );

        }


        console.log(
            "3D model active:",
            monument.name
        );


        createHotspots(
            monument
        );


        renderHistory(
            monument
        );


        renderGallery(
            monument
        );


        renderArchitecture(
            monument
        );


        renderPresentDay(
            monument
        );


        renderVisit(
            monument
        );


        renderTour(
            monument
        );


        applyLighting(
            "day"
        );


        resetCamera();


        stageCaption.textContent =
            "Explore the monument from every angle.";


        requestAnimationFrame(
            resizeViewer
        );

    } catch (
        error
    ) {

        console.error(
            "Error loading monument:",
            monument.name,
            error
        );


        stageCaption.textContent =
            "The monument experience could not be loaded.";

    }

}


// =========================================================
// HEADER
// =========================================================

function renderMonumentHeader(
    monument
) {

    monEra.textContent =
        monument.year;


    monName.textContent =
        monument.name;


    monTagline.textContent =
        monument.tagline;


    const facts = [

        {
            label:
                "Location",

            value:
                `${monument.city}, ${monument.region}`
        },


        {
            label:
                "Coordinates",

            value:
                monument.coordinates
        },


        {
            label:
                "Style",

            value:
                monument.style
        },


        {
            label:
                "Architect / Patron",

            value:
                monument.architect
        }

    ];


    factStrip.innerHTML =
        facts
            .map(
                fact => `

                    <div class="fact">

                        <span
                            class="fact-label"
                        >
                            ${fact.label}
                        </span>

                        <div
                            class="fact-value"
                        >
                            ${fact.value}
                        </div>

                    </div>

                `
            )
            .join(
                ""
            );

}


// =========================================================
// LOCAL MODEL LOADER
// =========================================================

function loadLocalModel(
    path
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            gltfLoader.load(

                path,

                gltf => {

                    currentModel =
                        gltf.scene;


                    prepareModel(
                        currentModel
                    );


                    scene.add(
                        currentModel
                    );


                    resolve(
                        currentModel
                    );

                },

                progress => {

                    if (
                        progress.total
                    ) {

                        const percent =
                            (
                                progress.loaded /
                                progress.total
                            ) *
                            100;


                        stageCaption.textContent =
                            `Preparing the experience… ${percent.toFixed(0)}%`;

                    }

                },

                error => {

                    reject(
                        error
                    );

                }

            );

        }
    );

}


// =========================================================
// MODEL PREPARATION
// =========================================================

function prepareModel(
    model
) {

    model.position.set(
        0,
        0,
        0
    );


    model.rotation.set(
        0,
        0,
        0
    );


    model.scale.set(
        1,
        1,
        1
    );


    model.traverse(
        object => {

            if (
                object.isMesh
            ) {

                object.castShadow =
                    true;


                object.receiveShadow =
                    true;


                if (
                    object.material
                ) {

                    const materials =
                        Array.isArray(
                            object.material
                        )
                            ? object.material
                            : [
                                object.material
                            ];

                    materials.forEach(
                        material => {

                            material.envMapIntensity =
                                1.0;

                            material.depthWrite =
                                true;

                            if (
                                material.isMeshStandardMaterial &&
                                material.roughness !== undefined &&
                                material.roughness < 0.1 &&
                                material.metalness < 0.5
                            ) {

                                material.roughness =
                                    0.35;

                            }

                        }
                    );

                }

            }

        }
    );


    let box =
        new THREE.Box3()
            .setFromObject(
                model
            );


    const center =
        box.getCenter(
            new THREE.Vector3()
        );


    // Center horizontally

    model.position.x -=
        center.x;


    model.position.z -=
        center.z;


    // Put bottom on ground

    model.position.y -=
        box.min.y;


    // Measure again

    box =
        new THREE.Box3()
            .setFromObject(
                model
            );


    const size =
        box.getSize(
            new THREE.Vector3()
        );


    const maxSize =
        Math.max(
            size.x,
            size.y,
            size.z
        );


    // Scale into a predictable scene size

    const targetSize =
        12;


    if (
        maxSize > 0
    ) {

        const factor =
            targetSize /
            maxSize;


        model.scale.setScalar(
            factor
        );

    }


    // Recalculate final bounds

    box =
        new THREE.Box3()
            .setFromObject(
                model
            );


    const finalSize =
        box.getSize(
            new THREE.Vector3()
        );


    const finalMax =
        Math.max(
            finalSize.x,
            finalSize.y,
            finalSize.z
        );


    model.userData.size =
        finalSize;


    model.userData.maxSize =
        finalMax;


    model.userData.box =
        box;


    // Soft shadow underneath

    shadowPlane.scale.set(
        finalMax * 2.2,
        finalMax * 2.2,
        1
    );


    shadowPlane.position.set(
        0,
        0.005,
        0
    );


    shadowPlane.visible =
        true;


    // Position night lights around the monument

    architecturalLights.forEach(
        (
            light,
            index
        ) => {

            const angle =
                (
                    index /
                    architecturalLights.length
                ) *
                Math.PI *
                2;


            const radius =
                Math.max(
                    finalMax * 0.72,
                    3
                );


            light.position.set(

                Math.cos(
                    angle
                ) *
                radius,

                finalMax *
                (
                    index % 2 === 0
                        ? 0.25
                        : 0.55
                ),

                Math.sin(
                    angle
                ) *
                radius

            );


            light.distance =
                finalMax * 2.5;

        }
    );


    sun.shadow.camera.left =
        -finalMax * 2;


    sun.shadow.camera.right =
        finalMax * 2;


    sun.shadow.camera.top =
        finalMax * 2;


    sun.shadow.camera.bottom =
        -finalMax * 2;


    sun.shadow.camera.near =
        0.1;


    sun.shadow.camera.far =
        finalMax * 8;


    console.log(
        "Final model bounds:",
        finalSize
    );

}


// =========================================================
// CLEAR MODEL
// =========================================================

function clearCurrentModel() {

    hotspotObjects.forEach(
        item => {

            item.removeFromParent();

        }
    );


    hotspotObjects =
        [];


    if (
        currentModel
    ) {

        scene.remove(
            currentModel
        );


        currentModel.traverse(
            object => {

                if (
                    object.geometry
                ) {

                    object.geometry.dispose();

                }


                if (
                    object.material
                ) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(
                            material =>
                                disposeMaterial(
                                    material
                                )
                        );

                    } else {

                        disposeMaterial(
                            object.material
                        );

                    }

                }

            }
        );

    }


    currentModel =
        null;


    shadowPlane.visible =
        false;

}


function disposeMaterial(
    material
) {

    if (
        material.map
    ) {

        material.map.dispose();

    }


    if (
        material.normalMap
    ) {

        material.normalMap.dispose();

    }


    if (
        material.roughnessMap
    ) {

        material.roughnessMap.dispose();

    }


    if (
        material.metalnessMap
    ) {

        material.metalnessMap.dispose();

    }


    material.dispose();

}


// =========================================================
// CAMERA RESET
// =========================================================

function resetCamera() {

    if (
        !currentModel
    ) {

        return;

    }


    const maxSize =
        currentModel
            .userData
            .maxSize;


    const size =
        currentModel
            .userData
            .size;


    const distance =
        Math.max(
            maxSize * 1.45,
            8
        );


    camera.position.set(

        distance,

        distance *
            0.48,

        distance

    );


    controls.target.set(

        0,

        size.y *
            0.35,

        0

    );


    controls.minDistance =
        Math.max(
            maxSize * 0.28,
            2
        );


    controls.maxDistance =
        Math.max(
            maxSize * 5,
            35
        );


    controls.update();

}


document
    .getElementById(
        "reset-btn"
    )
    .addEventListener(
        "click",
        resetCamera
    );


// =========================================================
// AUTO ROTATE
// =========================================================

document
    .getElementById(
        "rotate-btn"
    )
    .addEventListener(
        "click",
        function () {

            autoRotate =
                !autoRotate;


            controls.autoRotate =
                autoRotate;


            this.textContent =
                autoRotate
                    ? "⏸ Stop"
                    : "⟳ Rotate";

        }
    );


// =========================================================
// HOTSPOTS
// =========================================================

function createHotspots(
    monument
) {

    if (
        !currentModel
    ) {

        return;

    }


    const size =
        currentModel
            .userData
            .size;


    monument.hotspots.forEach(
        hotspot => {

            const element =
                document.createElement(
                    "button"
                );


            element.type =
                "button";


            element.className =
                "pointer-events-auto relative";


            element.innerHTML = `

                <span
                    class="block h-4 w-4 rounded-full border-2 border-white bg-blue-400 shadow-[0_0_24px_rgba(70,160,255,.95)] transition hover:scale-125"
                ></span>

                <span
                    class="absolute left-6 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded border border-white/10 bg-[#101416]/90 px-3 py-2 text-[10px] text-white backdrop-blur-md md:block"
                >
                    ${hotspot.title}
                </span>

            `;


            element.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    selectedHotspot =
                        hotspot;


                    showHotspot(
                        hotspot
                    );


                    focusHotspot(
                        hotspot
                    );

                }
            );


            const label =
                new CSS2DObject(
                    element
                );


            label.position.set(

                hotspot.anchor[0] *
                    size.x *
                    0.5,

                hotspot.anchor[1] *
                    size.y,

                hotspot.anchor[2] *
                    size.z *
                    0.5

            );


            currentModel.add(
                label
            );


            hotspotObjects.push(
                label
            );

        }
    );

}


// =========================================================
// SHOW HOTSPOT
// =========================================================

function showHotspot(
    hotspot
) {

    hotspotTitle.textContent =
        hotspot.title;


    hotspotDescription.textContent =
        hotspot.description;


    hotspotPanel.classList.remove(
        "hidden"
    );

}


// =========================================================
// CLOSE HOTSPOT
// =========================================================

function closeHotspot() {

    hotspotPanel.classList.add(
        "hidden"
    );

}


document
    .getElementById(
        "close-hotspot"
    )
    .addEventListener(
        "click",
        closeHotspot
    );


// =========================================================
// FOCUS HOTSPOT
// =========================================================

function focusHotspot(
    hotspot
) {

    if (
        !currentModel
    ) {

        return;

    }


    const size =
        currentModel
            .userData
            .size;


    const target =
        new THREE.Vector3(

            hotspot.anchor[0] *
                size.x *
                0.5,

            hotspot.anchor[1] *
                size.y,

            hotspot.anchor[2] *
                size.z *
                0.5

        );


    const direction =
        new THREE.Vector3(

            hotspot.anchor[0],

            hotspot.anchor[1],

            hotspot.anchor[2]

        );


    if (
        direction.length() <
        0.01
    ) {

        direction.set(
            0,
            0,
            1
        );

    }


    direction.normalize();


    const distance =
        Math.max(
            currentModel
                .userData
                .maxSize *
                0.68,
            6
        );


    const destination =
        target
            .clone()
            .add(
                direction.multiplyScalar(
                    distance
                )
            );


    cameraAnimation = {

        start:
            performance.now(),

        duration:
            850,

        fromPosition:
            camera.position.clone(),

        toPosition:
            destination,

        fromTarget:
            controls.target.clone(),

        toTarget:
            target.clone()

    };

}


document
    .getElementById(
        "hotspot-focus"
    )
    .addEventListener(
        "click",
        () => {

            if (
                selectedHotspot
            ) {

                focusHotspot(
                    selectedHotspot
                );

            }

        }
    );


// =========================================================
// AUDIO
// =========================================================

function speak(
    text
) {

    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Audio narration is not supported by this browser."
        );

        return;

    }


    speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(
            text
        );


    utterance.rate =
        0.9;


    utterance.pitch =
        1;


    speechSynthesis.speak(
        utterance
    );

}


document
    .getElementById(
        "hotspot-speak"
    )
    .addEventListener(
        "click",
        () => {

            if (
                selectedHotspot
            ) {

                speak(
                    `${selectedHotspot.title}. ${selectedHotspot.description}`
                );

            }

        }
    );


document
    .getElementById(
        "audio-btn"
    )
    .addEventListener(
        "click",
        () => {

            if (
                selectedHotspot
            ) {

                speak(
                    `${selectedHotspot.title}. ${selectedHotspot.description}`
                );

                return;

            }


            if (
                currentMonument
            ) {

                speak(
                    `${currentMonument.name}. ${currentMonument.introduction}`
                );

            }

        }
    );


// =========================================================
// TOUR
// =========================================================

function renderTour(
    monument
) {

    tourList.innerHTML =
        "";


    monument.tour.forEach(
        (
            stop,
            index
        ) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "tour-stop";


            button.innerHTML = `

                <span
                    class="heritage-mono mr-2 text-[9px] text-[#8a6435]"
                >
                    ${String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    )}
                </span>

                ${stop.title}

            `;


            button.addEventListener(
                "click",
                () => {

                    const hotspot =
                        monument.hotspots[
                            stop.hotspot
                        ];


                    if (
                        hotspot
                    ) {

                        selectedHotspot =
                            hotspot;


                        showHotspot(
                            hotspot
                        );


                        focusHotspot(
                            hotspot
                        );

                    }

                }
            );


            tourList.appendChild(
                button
            );

        }
    );

}


document
    .getElementById(
        "tour-btn"
    )
    .addEventListener(
        "click",
        () => {

            tourPanel.classList.remove(
                "hidden"
            );

        }
    );


document
    .getElementById(
        "close-tour"
    )
    .addEventListener(
        "click",
        closeTour
    );


document
    .getElementById(
        "bottom-tour"
    )
    .addEventListener(
        "click",
        () => {

            tourPanel.classList.remove(
                "hidden"
            );


            document
                .getElementById(
                    "hero-stage"
                )
                .scrollIntoView({
                    behavior:
                        "smooth"
                });

        }
    );


function stopAutoTour() {

    if (
        autoTourTimer
    ) {

        clearTimeout(
            autoTourTimer
        );

        autoTourTimer =
            null;

    }

    if (
        autoTourBtn
    ) {

        autoTourBtn.innerHTML =
            "▶ Auto Play Tour";

    }

}


function startAutoTour() {

    if (
        !currentMonument ||
        !currentMonument.tour ||
        currentMonument.tour.length === 0
    ) {

        return;

    }

    if (
        autoTourTimer
    ) {

        stopAutoTour();

        return;

    }

    if (
        autoTourBtn
    ) {

        autoTourBtn.innerHTML =
            "⏹ Pause Tour";

    }

    autoTourIndex =
        0;

    runAutoTourStep();

}


function runAutoTourStep() {

    if (
        !currentMonument ||
        !currentMonument.tour ||
        autoTourIndex >= currentMonument.tour.length
    ) {

        stopAutoTour();

        stageCaption.textContent =
            "Virtual tour complete. Explore freely or replay.";

        return;

    }

    const stop =
        currentMonument.tour[
            autoTourIndex
        ];

    const hotspot =
        currentMonument.hotspots[
            stop.hotspot
        ];

    if (
        hotspot
    ) {

        selectedHotspot =
            hotspot;

        showHotspot(
            hotspot
        );

        focusHotspot(
            hotspot
        );

        speak(
            `${stop.title}. ${hotspot.description}`
        );

    }

    autoTourIndex++;

    autoTourTimer =
        setTimeout(
            runAutoTourStep,
            7500
        );

}


if (
    autoTourBtn
) {

    autoTourBtn.addEventListener(
        "click",
        () => {

            startAutoTour();

        }
    );

}


if (
    ambientBtn
) {

    ambientBtn.addEventListener(
        "click",
        () => {

            const isPlaying =
                ambientSoundscape.toggle();

            if (
                isPlaying
            ) {

                ambientBtn.textContent =
                    "🎵 Ambient ON";

                ambientBtn.style.background =
                    "rgba(192, 138, 73, 0.25)";

                ambientBtn.style.borderColor =
                    "#c08a49";

                ambientBtn.style.color =
                    "#ede8dc";

            } else {

                ambientBtn.textContent =
                    "🎵 Ambient";

                ambientBtn.style.background =
                    "";

                ambientBtn.style.borderColor =
                    "";

                ambientBtn.style.color =
                    "";

            }

        }
    );

}


function closeTour() {

    stopAutoTour();

    tourPanel.classList.add(
        "hidden"
    );

}


// =========================================================
// GALLERY
// =========================================================

function renderGallery(
    monument
) {

    document.getElementById(
        "panel-gallery"
    ).innerHTML = `

        <div class="gallery-intro">

            <div class="section-kicker">
                ARCHITECTURAL ARCHIVES & PHOTOGRAPHY
            </div>

            <h3 class="heritage-serif mt-2 text-3xl font-bold">
                Authentic Perspectives of ${monument.name}
            </h3>

            <p class="mt-2 max-w-3xl text-xs leading-6 text-[#9e9b92]">
                High-resolution photographic documentation and archival views revealing architectural scale, ornamentation, craftsmanship, and real-world setting.
            </p>

        </div>


        <div class="gallery-grid">

            ${monument.gallery
                .map(
                    (
                        image,
                        index
                    ) => {
                        const imgUrl =
                            image.url ||
                            image.file;
                        const title =
                            image.title ||
                            monument.name;
                        const desc =
                            image.description ||
                            image.caption ||
                            "";

                        return `

                        <figure
                            class="gallery-card ${
                                index === 0
                                    ? "featured"
                                    : ""
                            }"
                            data-gallery-idx="${index}"
                            style="cursor: pointer;"
                            title="Click to view full size"
                        >

                            <img
                                src="${imgUrl}"
                                alt="${title} — ${monument.name}"
                                loading="lazy"
                            >

                            <figcaption
                                class="gallery-caption"
                            >

                                <h4>
                                    ${title}
                                </h4>

                                <p>
                                    ${desc}
                                </p>

                            </figcaption>

                        </figure>

                    `;
                    }
                )
                .join(
                    ""
                )}

        </div>

    `;


    document
        .querySelectorAll(
            "#panel-gallery .gallery-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        const idx =
                            parseInt(
                                card.getAttribute(
                                    "data-gallery-idx"
                                ) ||
                                "0",
                                10
                            );

                        const item =
                            monument.gallery[
                                idx
                            ];

                        if (
                            !item
                        ) {

                            return;

                        }

                        const src =
                            item.url ||
                            item.file;

                        const title =
                            item.title ||
                            monument.name;

                        const desc =
                            item.description ||
                            item.caption ||
                            "";

                        openModal(`
                            <div class="max-w-4xl mx-auto p-4 flex flex-col items-center">
                                <img src="${src}" alt="${title}" class="max-h-[70vh] w-auto max-w-full object-contain rounded border border-white/20 shadow-2xl" />
                                <div class="mt-4 text-center">
                                    <h3 class="heritage-serif text-2xl font-bold text-[#c08a49]">${title}</h3>
                                    <p class="mt-2 text-sm text-[#b9b3a4] max-w-2xl leading-relaxed">${desc}</p>
                                </div>
                            </div>
                        `);

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "#panel-gallery img"
        )
        .forEach(
            image => {

                image.addEventListener(
                    "error",
                    () => {

                        image.style.display =
                            "none";

                    },
                    {
                        once:
                            true
                    }
                );

            }
        );

}


// =========================================================
// HISTORY
// =========================================================

function renderHistory(
    monument
) {

    const h =
        monument.history;


    document.getElementById(
        "panel-history"
    ).innerHTML = `

        <div class="history-layout">

            <article class="history-copy">

                <div class="section-kicker">
                    ESSENTIAL HISTORY
                </div>


                <p class="mt-5">
                    <strong>When:</strong>
                    ${h.when}
                </p>


                <p>
                    <strong>Where:</strong>
                    ${h.where}
                </p>


                <p>
                    <strong>Who:</strong>
                    ${h.who}
                </p>


                <p>
                    <strong>How:</strong>
                    ${h.how}
                </p>


                <p>
                    <strong>Why:</strong>
                    ${h.why}
                </p>


                <div class="history-story">
                    ${h.story}
                </div>


                <div class="mt-6 border-l-2 border-[#c08a49] pl-4">

                    <div
                        class="heritage-mono text-[9px] tracking-[0.15em] text-[#c08a49]"
                    >
                        WHY IT MATTERS
                    </div>

                    <p class="!mb-0 mt-2">
                        ${h.significance}
                    </p>

                </div>

            </article>


            <aside class="history-facts">

                <div class="history-fact">

                    <div class="history-fact-label">
                        ARCHITECTURAL CHARACTER
                    </div>

                    <div class="history-fact-value">
                        ${monument.architecture}
                    </div>

                </div>


                <div class="history-fact">

                    <div class="history-fact-label">
                        REAL-WORLD SETTING
                    </div>

                    <div class="history-fact-value">
                        ${monument.environment}
                    </div>

                </div>

            </aside>

        </div>

    `;

}


// =========================================================
// ARCHITECTURE
// =========================================================

function renderArchitecture(
    monument
) {

    document.getElementById(
        "panel-architecture"
    ).innerHTML = `

        <div>

            <div class="section-kicker">
                ARCHITECTURAL EXPLORER
            </div>

            <h3 class="heritage-serif mt-2 text-3xl font-bold">
                Understand the structure
            </h3>

            <p class="mt-2 text-xs leading-6 text-[#9e9b92]">
                Select a feature to focus the interactive monument
                directly on that architectural element.
            </p>

        </div>


        <div class="architecture-grid mt-6">

            ${monument.hotspots
                .map(
                    (
                        hotspot,
                        index
                    ) => `

                        <button
                            class="architecture-card"
                            data-hotspot-index="${index}"
                        >

                            <div class="architecture-number">
                                FEATURE
                                ${String(
                                    index + 1
                                ).padStart(
                                    2,
                                    "0"
                                )}
                            </div>

                            <div class="architecture-title">
                                ${hotspot.title}
                            </div>

                            <div class="architecture-description">
                                ${hotspot.description}
                            </div>

                        </button>

                    `
                )
                .join(
                    ""
                )}

        </div>

    `;


    document
        .querySelectorAll(
            "#panel-architecture [data-hotspot-index]"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                card.dataset
                                    .hotspotIndex
                            );


                        const hotspot =
                            monument.hotspots[
                                index
                            ];


                        selectedHotspot =
                            hotspot;


                        showHotspot(
                            hotspot
                        );


                        focusHotspot(
                            hotspot
                        );


                        document
                            .getElementById(
                                "hero-stage"
                            )
                            .scrollIntoView({
                                behavior:
                                    "smooth"
                            });

                    }
                );

            }
        );

}


// =========================================================
// PRESENT DAY
// =========================================================

function renderPresentDay(
    monument
) {

    document.getElementById(
        "panel-present"
    ).innerHTML = `

        <div class="section-kicker">
            PRESENT DAY
        </div>


        <h3 class="heritage-serif mt-2 text-3xl font-bold">
            The monument today
        </h3>


        <div class="status-card mt-6">

            <div class="status-label">
                CURRENT SITUATION
            </div>

            <p>
                ${monument.presentDay}
            </p>

        </div>


        <div class="environment-card">

            <span class="environment-dot"></span>

            <div>

                <div class="environment-title">
                    REAL-WORLD ENVIRONMENT
                </div>

                <p>
                    ${monument.environment}
                </p>

            </div>

        </div>


        <div class="environment-card">

            <span class="environment-dot"></span>

            <div>

                <div class="environment-title">
                    DIGITAL PRESERVATION
                </div>

                <p>
                    ${monument.preservation}
                </p>

            </div>

        </div>

    `;

}


// =========================================================
// VISIT
// =========================================================

function renderVisit(
    monument
) {

    document.getElementById(
        "panel-visit"
    ).innerHTML = `

        <div class="section-kicker">
            VIRTUAL VISIT
        </div>


        <h3 class="heritage-serif mt-2 text-3xl font-bold">
            Experience the site
        </h3>


        <p class="visit-intro mt-3">
            ${monument.visitorExperience}
        </p>


        <div class="visit-grid">

            <div class="visit-card">

                <div class="visit-number">
                    01
                </div>

                <div class="visit-title">
                    Arrival
                </div>

                <div class="visit-text">
                    Begin at the natural visitor approach
                    and understand how the monument sits
                    within its environment.
                </div>

            </div>


            <div class="visit-card">

                <div class="visit-number">
                    02
                </div>

                <div class="visit-title">
                    Explore
                </div>

                <div class="visit-text">
                    Rotate, zoom and inspect the monument
                    from multiple viewpoints.
                </div>

            </div>


            <div class="visit-card">

                <div class="visit-number">
                    03
                </div>

                <div class="visit-title">
                    Discover
                </div>

                <div class="visit-text">
                    Use the architectural guide and
                    virtual tour to understand the site.
                </div>

            </div>

        </div>

    `;

}


// =========================================================
// TABS
// =========================================================

document
    .querySelectorAll(
        ".tab-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".tab-button"
                        )
                        .forEach(
                            tab => {

                                tab.classList.remove(
                                    "active"
                                );

                            }
                        );


                    document
                        .querySelectorAll(
                            ".content-panel"
                        )
                        .forEach(
                            panel => {

                                panel.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    document
                        .getElementById(
                            `panel-${button.dataset.tab}`
                        )
                        .classList.add(
                            "active"
                        );

                }
            );

        }
    );


// =========================================================
// LIGHTING
// =========================================================

const lightingButton =
    document.getElementById(
        "lighting-btn"
    );


lightingButton.addEventListener(
    "click",
    () => {

        const nextMode =
            currentLighting === "day"
                ? "sunset"
                : currentLighting === "sunset"
                    ? "night"
                    : currentLighting === "night"
                        ? "amber"
                        : "day";


        transitionLighting(
            nextMode
        );

    }
);


function applyLighting(
    mode
) {

    const preset =
        lightingModes[
            mode
        ];


    currentLighting =
        mode;


    ambientLight.intensity =
        preset.ambient;


    sun.intensity =
        preset.sun;


    moon.intensity =
        preset.moon;


    nightAmbient.intensity =
        preset.nightAmbient;


    architecturalLights.forEach(
        light => {

            light.intensity =
                preset.warm;

        }
    );


    renderer.toneMappingExposure =
        preset.exposure;


    lightingButton.textContent =
        mode === "day"
            ? "🌅 Sunset"
            : mode === "sunset"
                ? "🌙 Night"
                : mode === "night"
                    ? "✨ Amber"
                    : "☀️ Day";

    stageBackdrop.classList.toggle(
        "lt-night",
        mode === "night"
    );

    stageBackdrop.classList.toggle(
        "lt-sunset",
        mode === "sunset"
    );

}


function transitionLighting(
    mode
) {

    lightingAnimation = {

        start:
            performance.now(),

        duration:
            1000,

        from: {

            ambient:
                ambientLight.intensity,

            sun:
                sun.intensity,

            moon:
                moon.intensity,

            nightAmbient:
                nightAmbient.intensity,

            warm:
                architecturalLights[0]
                    .intensity,

            exposure:
                renderer.toneMappingExposure

        },

        to:
            lightingModes[
                mode
            ],

        mode:
            mode

    };


    lightingButton.textContent =
        mode === "day"
            ? "🌅 Sunset"
            : mode === "sunset"
                ? "🌙 Night"
                : mode === "night"
                    ? "✨ Amber"
                    : "☀️ Day";

}


function updateLighting(
    now
) {

    if (
        !lightingAnimation
    ) {

        return;

    }


    const progress =
        Math.min(

            (
                now -
                lightingAnimation.start
            ) /
            lightingAnimation.duration,

            1

        );


    const eased =
        progress *
        progress *
        (3 - 2 * progress);


    const from =
        lightingAnimation.from;


    const to =
        lightingAnimation.to;


    ambientLight.intensity =
        THREE.MathUtils.lerp(
            from.ambient,
            to.ambient,
            eased
        );


    sun.intensity =
        THREE.MathUtils.lerp(
            from.sun,
            to.sun,
            eased
        );


    moon.intensity =
        THREE.MathUtils.lerp(
            from.moon,
            to.moon,
            eased
        );


    nightAmbient.intensity =
        THREE.MathUtils.lerp(
            from.nightAmbient,
            to.nightAmbient,
            eased
        );


    architecturalLights.forEach(
        light => {

            light.intensity =
                THREE.MathUtils.lerp(
                    from.warm,
                    to.warm,
                    eased
                );

        }
    );


    renderer.toneMappingExposure =
        THREE.MathUtils.lerp(
            from.exposure,
            to.exposure,
            eased
        );


    if (
        progress >=
        1
    ) {

        currentLighting =
            lightingAnimation.mode;


        lightingAnimation =
            null;

    }

}


// =========================================================
// MODAL
// =========================================================

function openModal(
    html
) {

    modalContent.innerHTML =
        html;


    modal.classList.remove(
        "hidden"
    );

}


function closeModal() {

    modal.classList.add(
        "hidden"
    );

}


document
    .getElementById(
        "modal-close"
    )
    .addEventListener(
        "click",
        closeModal
    );


modal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modal
        ) {

            closeModal();

        }

    }
);


// =========================================================
// PRESERVATION MODAL
// =========================================================

function openPreservationModal() {

    if (
        !currentMonument
    ) {

        return;

    }


    openModal(`

        <div class="modal-kicker">
            HERITAGE CONSERVATION & RESTORATION
        </div>


        <h2 class="heritage-serif text-3xl font-bold">
            Preserving Central India & Indore's Legacy
        </h2>


        <p class="mt-4 text-sm text-[#b9b3a4]">
            Central India possesses a unique composite heritage of stone carving, Maratha timber joinery, and medieval lake hydraulics. Modern digital 3D reconstruction ensures these monuments endure for future generations.
        </p>


        <div class="grid gap-3 md:grid-cols-3 mt-7">

            <div class="border border-white/10 bg-white/[0.025] p-5">

                <div class="text-2xl">
                    🏛️
                </div>

                <h3 class="mt-3 font-bold text-white">
                    Timber & Stone Restoration
                </h3>

                <p class="mt-2 text-xs text-[#b9b3a4]">
                    Rajwada's historic seven-storey composite structure survived three major fires. Digital 3D recording preserves traditional Malwa wood joinery and basalt loadbearing systems.
                </p>

            </div>


            <div class="border border-white/10 bg-white/[0.025] p-5">

                <div class="text-2xl">
                    🌊
                </div>

                <h3 class="mt-3 font-bold text-white">
                    Riverfront & Lake Hydrology
                </h3>

                <p class="mt-2 text-xs text-[#b9b3a4]">
                    Krishnapura Chhatris on the Kahn River and Jahaz Mahal between Mandu's twin lakes require careful water table management and river revitalization against damp and erosion.
                </p>

            </div>


            <div class="border border-white/10 bg-white/[0.025] p-5">

                <div class="text-2xl">
                    📐
                </div>

                <h3 class="mt-3 font-bold text-white">
                    Photogrammetric Archiving
                </h3>

                <p class="mt-2 text-xs text-[#b9b3a4]">
                    High-density 3D scanning and WebGL digital twin representations allow scholars and visitors worldwide to experience India's living monuments without physical degradation.
                </p>

            </div>

        </div>


        <div class="mt-6 pt-4 border-t border-white/10">

            <h4 class="text-xs font-bold uppercase text-[#c08a49]">
                Site Specific Conservation Note: ${currentMonument.name}
            </h4>

            <p class="mt-1 text-xs text-[#b9b3a4]">
                ${currentMonument.preservation}
            </p>

        </div>

    `);

}


document
    .getElementById(
        "preservation-home-btn"
    )
    .addEventListener(
        "click",
        openPreservationModal
    );


document
    .getElementById(
        "bottom-preserve"
    )
    .addEventListener(
        "click",
        openPreservationModal
    );


// =========================================================
// HISTORICAL TIMELINE & COMPARATIVE VIEWER
// =========================================================

function renderCompareAndTimelineModal() {

    let activeModalTab =
        "timeline";

    let compId1 =
        "rajwada-palace";

    let compId2 =
        "lal-bagh-palace";


    const sortedTimeline = [
        { id: "sanchi-stupa", name: "Sanchi Stupa", year: "c. 250 BCE", era: "Ancient India (Mauryan)", loc: "Raisen · MP", desc: "Ashokan hemispherical stone stupa with four carved torana gateways." },
        { id: "qutub-minar", name: "Qutub Minar", year: "1192–93 CE", era: "12th Century (Delhi Sultanate)", loc: "Delhi", desc: "72.5m tapering fluted sandstone victory tower and Quwwat-ul-Islam complex." },
        { id: "jahaz-mahal", name: "Jahaz Mahal", year: "c. 1436–69 CE", era: "15th Century (Malwa Sultanate)", loc: "Mandu · MP", desc: "110m floating ship palace flanked by Kapur and Munj lakes with open pavilions." },
        { id: "charminar", name: "Charminar", year: "1591 CE", era: "16th Century (Qutb Shahi)", loc: "Hyderabad · Telangana", desc: "Four monumental arches and four grand minarets anchoring the Old City." },
        { id: "rajwada-palace", name: "Rajwada Palace", year: "1747 CE", era: "18th Century (Holkar Maratha)", loc: "Indore · MP", desc: "7-storey royal palace: lower 3 floors in basalt stone, upper 4 in teakwood jharokhas." },
        { id: "krishnapura-chhatris", name: "Krishnapura Chhatris", year: "c. 1849 CE", era: "19th Century (Holkar Maratha)", loc: "Indore · MP", desc: "Maratha stone royal cenotaphs with Nagara shikharas on the Kahn river ghats." },
        { id: "lal-bagh-palace", name: "Lal Bagh Palace", year: "1886–1921 CE", era: "Late 19th / Early 20th c.", loc: "Indore · MP", desc: "28-acre neoclassical palace with European porticos and Versailles-style gates." },
        { id: "gateway-of-india", name: "Gateway of India", year: "1924 CE", era: "20th Century (Indo-Saracenic)", loc: "Mumbai · Maharashtra", desc: "Yellow basalt waterfront triumphal arch overlooking Mumbai Harbour." },
        { id: "lotus-temple", name: "Lotus Temple", year: "1986 CE", era: "Late 20th Century", loc: "New Delhi", desc: "Biomimetic marble flower design with 27 free-standing petals for all faiths." }
    ];


    function getModalHtml() {

        const m1 =
            monuments.find(m => m.id === compId1) || monuments[0];

        const m2 =
            monuments.find(m => m.id === compId2) || monuments[1];


        return `
            <div class="modal-kicker">
                CENTRAL INDIA & NATIONAL HERITAGE
            </div>

            <h2 class="heritage-serif text-3xl font-bold">
                Historical Timeline & Comparison
            </h2>

            <p class="mt-3 text-sm text-[#b9b3a4]">
                Trace the evolution of Madhya Pradesh's architectural wonders across two millennia, from ancient Buddhist stone stupas to Maratha royal palaces.
            </p>

            <!-- Modal Nav Tabs -->
            <div class="flex gap-3 border-b border-white/10 mt-6 pb-3">
                <button
                    id="modal-tab-timeline"
                    class="px-4 py-2 rounded text-xs font-bold transition ${
                        activeModalTab === "timeline"
                            ? "bg-[#c08a49] text-[#11181b]"
                            : "bg-[#1b2327] text-[#ede8dc] hover:bg-white/10"
                    }"
                >
                    📜 Chronological Timeline
                </button>
                <button
                    id="modal-tab-compare"
                    class="px-4 py-2 rounded text-xs font-bold transition ${
                        activeModalTab === "compare"
                            ? "bg-[#c08a49] text-[#11181b]"
                            : "bg-[#1b2327] text-[#ede8dc] hover:bg-white/10"
                    }"
                >
                    ⚖️ Side-by-Side Comparison
                </button>
            </div>

            ${activeModalTab === "timeline" ? `
                <!-- TIMELINE VIEW -->
                <div class="mt-6 space-y-4 max-h-[56vh] overflow-y-auto pr-2">
                    ${sortedTimeline.map(item => {
                        const isMpItem = item.loc.includes("MP");
                        const isIndoreItem = item.loc.includes("Indore");
                        return `
                            <div class="relative pl-7 pb-4 border-l-2 ${isMpItem ? 'border-[#c08a49]' : 'border-white/20'}">
                                <div class="absolute -left-[9px] top-0.5 h-4 w-4 rounded-full border-2 border-[#151c20] ${
                                    isIndoreItem ? 'bg-[#e5c158]' : isMpItem ? 'bg-[#c08a49]' : 'bg-[#5e8c7c]'
                                }"></div>

                                <div class="flex flex-wrap items-center justify-between gap-2">
                                    <div class="flex items-center gap-2">
                                        <span class="heritage-mono text-xs font-bold text-[#c08a49]">${item.year}</span>
                                        <span class="text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                                            isIndoreItem ? 'bg-[#e5c158]/20 text-[#e5c158]' : isMpItem ? 'bg-[#5e8c7c]/20 text-[#5e8c7c]' : 'bg-white/10 text-[#b9b3a4]'
                                        }">${item.loc}</span>
                                    </div>
                                    <button
                                        data-jump-id="${item.id}"
                                        class="timeline-jump-btn text-[11px] font-semibold text-[#c08a49] hover:underline"
                                    >
                                        Explore in 3D →
                                    </button>
                                </div>

                                <h4 class="text-base font-bold text-white mt-1">
                                    ${item.name}
                                    <span class="text-xs font-normal text-[#8e8b83]">· ${item.era}</span>
                                </h4>

                                <p class="text-xs text-[#b9b3a4] mt-1">
                                    ${item.desc}
                                </p>
                            </div>
                        `;
                    }).join("")}
                </div>
            ` : `
                <!-- SIDE-BY-SIDE COMPARATOR -->
                <div class="mt-6">
                    <div class="grid grid-cols-2 gap-4 pb-4">
                        <div>
                            <label class="block text-[10px] uppercase text-[#8e8b83] font-bold mb-1">Monument A</label>
                            <select id="compare-select-1" class="w-full bg-[#1b2327] border border-white/20 rounded px-3 py-2 text-xs text-white">
                                ${monuments.map(m => `<option value="${m.id}" ${m.id === m1.id ? 'selected' : ''}>${m.name} (${m.city})</option>`).join("")}
                            </select>
                        </div>
                        <div>
                            <label class="block text-[10px] uppercase text-[#8e8b83] font-bold mb-1">Monument B</label>
                            <select id="compare-select-2" class="w-full bg-[#1b2327] border border-white/20 rounded px-3 py-2 text-xs text-white">
                                ${monuments.map(m => `<option value="${m.id}" ${m.id === m2.id ? 'selected' : ''}>${m.name} (${m.city})</option>`).join("")}
                            </select>
                        </div>
                    </div>

                    <div class="border border-white/10 overflow-hidden text-xs">
                        <div class="grid grid-cols-3 bg-white/5 font-bold border-b border-white/10 p-3">
                            <div>Comparative Aspect</div>
                            <div class="text-[#c08a49] font-bold">${m1.name}</div>
                            <div class="text-[#5e8c7c] font-bold">${m2.name}</div>
                        </div>

                        <div class="grid grid-cols-3 border-b border-white/10 p-3">
                            <div class="text-[#8e8b83] font-semibold">Location & State</div>
                            <div>${m1.city}, ${m1.state}</div>
                            <div>${m2.city}, ${m2.state}</div>
                        </div>

                        <div class="grid grid-cols-3 border-b border-white/10 p-3">
                            <div class="text-[#8e8b83] font-semibold">Era & Timeline</div>
                            <div>${m1.year} <br><span class="text-[10px] text-[#8e8b83]">${m1.era}</span></div>
                            <div>${m2.year} <br><span class="text-[10px] text-[#8e8b83]">${m2.era}</span></div>
                        </div>

                        <div class="grid grid-cols-3 border-b border-white/10 p-3">
                            <div class="text-[#8e8b83] font-semibold">Architectural Style</div>
                            <div>${m1.style}</div>
                            <div>${m2.style}</div>
                        </div>

                        <div class="grid grid-cols-3 border-b border-white/10 p-3">
                            <div class="text-[#8e8b83] font-semibold">Architect / Dynasty</div>
                            <div>${m1.architect}</div>
                            <div>${m2.architect}</div>
                        </div>

                        <div class="grid grid-cols-3 border-b border-white/10 p-3">
                            <div class="text-[#8e8b83] font-semibold">Coordinates</div>
                            <div class="heritage-mono text-[10px]">${m1.coordinates}</div>
                            <div class="heritage-mono text-[10px]">${m2.coordinates}</div>
                        </div>

                        <div class="grid grid-cols-3 p-3">
                            <div class="text-[#8e8b83] font-semibold">Primary Significance</div>
                            <div class="text-[11px] text-[#b9b3a4]">${m1.tagline}</div>
                            <div class="text-[11px] text-[#b9b3a4]">${m2.tagline}</div>
                        </div>
                    </div>
                </div>
            `}
        `;

    }


    function updateModalView() {

        openModal(
            getModalHtml()
        );


        const tabTimeline =
            document.getElementById(
                "modal-tab-timeline"
            );

        const tabCompare =
            document.getElementById(
                "modal-tab-compare"
            );


        if (
            tabTimeline
        ) {

            tabTimeline.addEventListener(
                "click",
                () => {

                    activeModalTab =
                        "timeline";

                    updateModalView();

                }
            );

        }


        if (
            tabCompare
        ) {

            tabCompare.addEventListener(
                "click",
                () => {

                    activeModalTab =
                        "compare";

                    updateModalView();

                }
            );

        }


        const sel1 =
            document.getElementById(
                "compare-select-1"
            );

        const sel2 =
            document.getElementById(
                "compare-select-2"
            );


        if (
            sel1
        ) {

            sel1.addEventListener(
                "change",
                event => {

                    compId1 =
                        event.target.value;

                    updateModalView();

                }
            );

        }


        if (
            sel2
        ) {

            sel2.addEventListener(
                "change",
                event => {

                    compId2 =
                        event.target.value;

                    updateModalView();

                }
            );

        }


        document
            .querySelectorAll(
                ".timeline-jump-btn"
            )
            .forEach(
                btn => {

                    btn.addEventListener(
                        "click",
                        event => {

                            const targetId =
                                event.target.dataset.jumpId;

                            const foundIdx =
                                monuments.findIndex(
                                    m => m.id === targetId
                                );

                            if (
                                foundIdx >= 0
                            ) {

                                currentIndex =
                                    foundIdx;

                                renderNavigation();

                                loadMonument(
                                    monuments[foundIdx]
                                );

                                closeModal();

                            }

                        }
                    );

                }
            );

    }


    updateModalView();

}


// =========================================================
// SOURCES
// =========================================================

document
    .getElementById(
        "sources-home-btn"
    )
    .addEventListener(
        "click",
        () => {

            openModal(`

                <div class="modal-kicker">
                    RESEARCH & ATTRIBUTION
                </div>

                <h2>
                    HeritageX Sources
                </h2>

                <p class="mt-5">
                    Historical information and reference
                    photography should retain appropriate
                    source and attribution information.
                </p>


                <div class="mt-6">

                    ${monuments
                        .map(
                            monument => `

                            <div
                                class="border-b border-white/10 py-4"
                            >

                                <div class="font-bold">
                                    ${monument.name}
                                </div>

                                <div class="mt-2 text-xs text-[#88857d]">
                                    ${monument.sources.join(
                                        " · "
                                    )}
                                </div>

                            </div>

                            `
                        )
                        .join(
                            ""
                        )}

                </div>

            `);

        }
    );


// =========================================================
// COMPARE
// =========================================================

document
    .getElementById(
        "compare-home-btn"
    )
    .addEventListener(
        "click",
        renderCompareAndTimelineModal
    );


// =========================================================
// QUIZ
// =========================================================

document
    .getElementById(
        "bottom-quiz"
    )
    .addEventListener(
        "click",
        startQuiz
    );


function startQuiz() {

    if (
        !currentMonument
    ) {

        return;

    }


    runQuiz(
        0,
        0
    );

}


function runQuiz(
    index,
    score
) {

    const quiz =
        currentMonument.quiz;


    if (
        index >=
        quiz.length
    ) {

        openModal(`

            <div class="modal-kicker">
                KNOWLEDGE CHECK
            </div>

            <h2>
                Quiz Complete
            </h2>

            <div
                class="mt-8 border border-[#c08a49]/20 bg-[#c08a49]/5 p-8 text-center"
            >

                <div class="text-5xl font-black text-[#c08a49]">
                    ${score}/${quiz.length}
                </div>

                <div class="mt-2 text-sm text-[#99958c]">
                    ${currentMonument.name}
                </div>

            </div>

        `);

        return;

    }


    const question =
        quiz[index];


    openModal(`

        <div class="modal-kicker">
            KNOWLEDGE CHECK
        </div>

        <h2>
            Question
            ${index + 1}
            /
            ${quiz.length}
        </h2>


        <div class="mt-7 text-lg font-semibold">
            ${question.question}
        </div>


        <div class="mt-5">

            ${question.options
                .map(
                    (
                        option,
                        optionIndex
                    ) => `

                    <button
                        class="quiz-option"
                        data-option="${optionIndex}"
                    >
                        ${option}
                    </button>

                    `
                )
                .join(
                    ""
                )}

        </div>

    `);


    document
        .querySelectorAll(
            ".quiz-option"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const answer =
                            Number(
                                button.dataset
                                    .option
                            );


                        const newScore =
                            score +
                            (
                                answer ===
                                question.answer
                                    ? 1
                                    : 0
                            );


                        runQuiz(
                            index + 1,
                            newScore
                        );

                    }
                );

            }
        );

}


// =========================================================
// FULLSCREEN
// =========================================================

document
    .getElementById(
        "fullscreen-btn"
    )
    .addEventListener(
        "click",
        async () => {

            try {

                if (
                    !document.fullscreenElement
                ) {

                    await document
                        .documentElement
                        .requestFullscreen();

                } else {

                    await document.exitFullscreen();

                }

            } catch (
                error
            ) {

                console.error(
                    error
                );

            }

        }
    );


// =========================================================
// CAMERA ANIMATION
// =========================================================

function updateCameraAnimation(
    now
) {

    if (
        !cameraAnimation
    ) {

        return;

    }


    const progress =
        Math.min(

            (
                now -
                cameraAnimation.start
            ) /
            cameraAnimation.duration,

            1

        );


    const eased =
        progress *
        progress *
        (3 - 2 * progress);


    camera.position.lerpVectors(

        cameraAnimation.fromPosition,

        cameraAnimation.toPosition,

        eased

    );


    controls.target.lerpVectors(

        cameraAnimation.fromTarget,

        cameraAnimation.toTarget,

        eased

    );


    controls.update();


    if (
        progress >=
        1
    ) {

        cameraAnimation =
            null;

    }

}


// =========================================================
// MAIN LOOP
// =========================================================

function animate(
    now = performance.now()
) {

    requestAnimationFrame(
        animate
    );


    if (
        atmosphericParticles
    ) {

        atmosphericParticles.rotation.y =
            now * 0.00003;

    }


    updateLighting(
        now
    );


    updateCameraAnimation(
        now
    );


    controls.update();


    renderer.render(
        scene,
        camera
    );


    labelRenderer.render(
        scene,
        camera
    );

}


// =========================================================
// START APPLICATION
// =========================================================

renderNavigation();

resizeViewer();

loadMonument(
    monuments[0]
);

animate();