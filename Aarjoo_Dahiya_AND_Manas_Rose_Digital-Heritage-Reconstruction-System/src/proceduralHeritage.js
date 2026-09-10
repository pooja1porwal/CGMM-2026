import * as THREE from "three";

/**
 * Procedural 3D Heritage Architectural Generator
 * Reconstructs detailed 3D architectural models for Madhya Pradesh & Indore heritage sites
 * using Three.js procedural geometries, materials, and architectural elements.
 */

function createProceduralTexture(type) {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (type === "stone") {
        ctx.fillStyle = "#888888";
        ctx.fillRect(0, 0, 256, 256);
        const img = ctx.getImageData(0, 0, 256, 256);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
            const n = (Math.random() - 0.5) * 55;
            const v = Math.min(255, Math.max(0, 128 + n));
            d[i] = v;
            d[i + 1] = v;
            d[i + 2] = v;
        }
        ctx.putImageData(img, 0, 0);
        ctx.strokeStyle = "rgba(40,40,40,0.25)";
        ctx.lineWidth = 2;
        for (let y = 16; y < 256; y += 32) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(256, y);
            ctx.stroke();
        }
    } else if (type === "sandstone") {
        ctx.fillStyle = "#999999";
        ctx.fillRect(0, 0, 256, 256);
        const img = ctx.getImageData(0, 0, 256, 256);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
            const n = (Math.random() - 0.5) * 45;
            const v = Math.min(255, Math.max(0, 128 + n));
            d[i] = v;
            d[i + 1] = v;
            d[i + 2] = v;
        }
        ctx.putImageData(img, 0, 0);
    } else if (type === "wood") {
        ctx.fillStyle = "#808080";
        ctx.fillRect(0, 0, 256, 256);
        for (let x = 0; x < 256; x += 3) {
            const val = 105 + Math.floor(Math.random() * 50);
            ctx.fillStyle = `rgb(${val},${val},${val})`;
            ctx.fillRect(x, 0, Math.random() * 2 + 1, 256);
        }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
}

function createMaterials() {
    const stoneTex = createProceduralTexture("stone");
    const sandstoneTex = createProceduralTexture("sandstone");
    const woodTex = createProceduralTexture("wood");

    return {
        basaltStone: new THREE.MeshStandardMaterial({
            color: 0x3a342f,
            roughness: 0.82,
            metalness: 0.05,
            bumpMap: stoneTex,
            bumpScale: 0.04
        }),
        malwaSandstone: new THREE.MeshStandardMaterial({
            color: 0xb57850,
            roughness: 0.78,
            metalness: 0.05,
            bumpMap: sandstoneTex,
            bumpScale: 0.035
        }),
        buffSandstone: new THREE.MeshStandardMaterial({
            color: 0xc8a87b,
            roughness: 0.76,
            metalness: 0.05,
            bumpMap: sandstoneTex,
            bumpScale: 0.03
        }),
        teakWood: new THREE.MeshStandardMaterial({
            color: 0x663c1e,
            roughness: 0.68,
            metalness: 0.05,
            bumpMap: woodTex,
            bumpScale: 0.03
        }),
        darkWood: new THREE.MeshStandardMaterial({
            color: 0x3d2312,
            roughness: 0.72,
            metalness: 0.02,
            bumpMap: woodTex,
            bumpScale: 0.03
        }),
        ivoryMarble: new THREE.MeshStandardMaterial({
            color: 0xf2ece1,
            roughness: 0.35,
            metalness: 0.08
        }),
        goldLeaf: new THREE.MeshStandardMaterial({
            color: 0xdab242,
            roughness: 0.22,
            metalness: 0.90
        }),
        copperRoof: new THREE.MeshStandardMaterial({
            color: 0x5a7d6e,
            roughness: 0.52,
            metalness: 0.40
        }),
        wroughtIron: new THREE.MeshStandardMaterial({
            color: 0x1f2224,
            roughness: 0.45,
            metalness: 0.75
        }),
        waterMirror: new THREE.MeshStandardMaterial({
            color: 0x18374d,
            roughness: 0.08,
            metalness: 0.90,
            transparent: true,
            opacity: 0.88
        }),
        lanternGlow: new THREE.MeshStandardMaterial({
            color: 0xffe6a3,
            emissive: 0xffa028,
            emissiveIntensity: 1.2,
            roughness: 0.2
        }),
        holkarSaffron: new THREE.MeshStandardMaterial({
            color: 0xff6600,
            roughness: 0.60,
            side: THREE.DoubleSide
        })
    };
}

// 1. RAJWADA PALACE (Indore)
export function buildRajwadaPalace() {
    const group = new THREE.Group();
    group.name = "RajwadaPalace";
    const mat = createMaterials();

    const plinthGeo = new THREE.BoxGeometry(14, 0.8, 12);
    const plinth = new THREE.Mesh(plinthGeo, mat.basaltStone);
    plinth.position.y = 0.4;
    group.add(plinth);

    const lowerWidth = 12;
    const lowerDepth = 10;
    const lowerHeight = 5.0;

    const lowerGeo = new THREE.BoxGeometry(lowerWidth, lowerHeight, lowerDepth);
    const lowerBuilding = new THREE.Mesh(lowerGeo, mat.basaltStone);
    lowerBuilding.position.y = 0.8 + lowerHeight / 2;
    group.add(lowerBuilding);

    for (let l = 1; l <= 3; l++) {
        const corniceGeo = new THREE.BoxGeometry(lowerWidth + 0.5, 0.25, lowerDepth + 0.5);
        const cornice = new THREE.Mesh(corniceGeo, mat.buffSandstone);
        cornice.position.y = 0.8 + l * 1.6;
        group.add(cornice);
    }

    const portalFrameGeo = new THREE.BoxGeometry(3.6, 4.4, 1.2);
    const portalFrame = new THREE.Mesh(portalFrameGeo, mat.buffSandstone);
    portalFrame.position.set(0, 2.6, lowerDepth / 2 + 0.5);
    group.add(portalFrame);

    const archPortalGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.3, 16, 1, false, 0, Math.PI);
    archPortalGeo.rotateZ(Math.PI / 2);
    archPortalGeo.rotateY(Math.PI / 2);
    const archPortal = new THREE.Mesh(archPortalGeo, mat.darkWood);
    archPortal.position.set(0, 3.4, lowerDepth / 2 + 0.5);
    group.add(archPortal);

    const doorGeo = new THREE.BoxGeometry(2.2, 3.2, 0.2);
    const door = new THREE.Mesh(doorGeo, mat.darkWood);
    door.position.set(0, 2.0, lowerDepth / 2 + 0.4);
    group.add(door);

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 2; c++) {
            const studGeo = new THREE.SphereGeometry(0.08, 8, 8);
            const stud = new THREE.Mesh(studGeo, mat.goldLeaf);
            stud.position.set(-0.6 + c * 1.2, 1.0 + r * 0.7, lowerDepth / 2 + 0.52);
            group.add(stud);
        }
    }

    const woodStoreyCount = 4;
    let currentY = 0.8 + lowerHeight;
    let currentW = 11.2;
    let currentD = 9.2;
    const storeyHeight = 1.6;

    for (let s = 1; s <= woodStoreyCount; s++) {
        currentW -= 0.6;
        currentD -= 0.6;

        const woodFloorGeo = new THREE.BoxGeometry(currentW, storeyHeight, currentD);
        const woodFloor = new THREE.Mesh(woodFloorGeo, mat.teakWood);
        woodFloor.position.set(0, currentY + storeyHeight / 2, 0);
        group.add(woodFloor);

        const eaveGeo = new THREE.BoxGeometry(currentW + 0.8, 0.18, currentD + 0.8);
        const eave = new THREE.Mesh(eaveGeo, mat.darkWood);
        eave.position.set(0, currentY + storeyHeight, 0);
        group.add(eave);

        const jharokhaPositions = [
            [-currentW * 0.3, currentY + 0.5, currentD / 2 + 0.35],
            [currentW * 0.3, currentY + 0.5, currentD / 2 + 0.35],
            [0, currentY + 0.5, currentD / 2 + 0.38],
            [-currentW / 2 - 0.35, currentY + 0.5, 0],
            [currentW / 2 + 0.35, currentY + 0.5, 0]
        ];

        jharokhaPositions.forEach(pos => {
            const jharokhaGroup = new THREE.Group();
            jharokhaGroup.position.set(pos[0], pos[1], pos[2]);

            const bracketGeo = new THREE.ConeGeometry(0.35, 0.45, 4);
            bracketGeo.rotateX(Math.PI);
            const bracket = new THREE.Mesh(bracketGeo, mat.darkWood);
            bracket.position.y = -0.22;
            jharokhaGroup.add(bracket);

            const balconyGeo = new THREE.BoxGeometry(0.8, 0.8, 0.5);
            const balcony = new THREE.Mesh(balconyGeo, mat.teakWood);
            jharokhaGroup.add(balcony);

            const canopyGeo = new THREE.ConeGeometry(0.65, 0.35, 4);
            canopyGeo.rotateY(Math.PI / 4);
            const canopy = new THREE.Mesh(canopyGeo, mat.copperRoof);
            canopy.position.y = 0.55;
            jharokhaGroup.add(canopy);

            group.add(jharokhaGroup);
        });

        currentY += storeyHeight;
    }

    const topPavilionGeo = new THREE.BoxGeometry(4.5, 1.4, 3.8);
    const topPavilion = new THREE.Mesh(topPavilionGeo, mat.teakWood);
    topPavilion.position.set(0, currentY + 0.7, 0);
    group.add(topPavilion);

    const topDomeGeo = new THREE.CylinderGeometry(1.6, 2.2, 0.9, 8);
    const topDome = new THREE.Mesh(topDomeGeo, mat.copperRoof);
    topDome.position.set(0, currentY + 1.8, 0);
    group.add(topDome);

    const staffGeo = new THREE.CylinderGeometry(0.04, 0.05, 2.8, 8);
    const staff = new THREE.Mesh(staffGeo, mat.goldLeaf);
    staff.position.set(0, currentY + 3.2, 0);
    group.add(staff);

    const flagShape = new THREE.Shape();
    flagShape.moveTo(0, 0);
    flagShape.lineTo(1.2, -0.4);
    flagShape.lineTo(0, -0.8);
    flagShape.closePath();
    const flagGeo = new THREE.ShapeGeometry(flagShape);
    const flag = new THREE.Mesh(flagGeo, mat.holkarSaffron);
    flag.position.set(0.05, currentY + 4.3, 0);
    group.add(flag);

    const lanternLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.3), mat.lanternGlow);
    lanternLeft.position.set(-2.2, 2.5, lowerDepth / 2 + 0.7);
    group.add(lanternLeft);

    const lanternRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.3), mat.lanternGlow);
    lanternRight.position.set(2.2, 2.5, lowerDepth / 2 + 0.7);
    group.add(lanternRight);

    return group;
}

// 2. LAL BAGH PALACE (Indore)
export function buildLalBaghPalace() {
    const group = new THREE.Group();
    group.name = "LalBaghPalace";
    const mat = createMaterials();

    const estatePlinthGeo = new THREE.BoxGeometry(22, 0.4, 18);
    const estatePlinth = new THREE.Mesh(estatePlinthGeo, mat.buffSandstone);
    estatePlinth.position.y = 0.2;
    group.add(estatePlinth);

    const terraceGeo = new THREE.BoxGeometry(16, 0.6, 10);
    const terrace = new THREE.Mesh(terraceGeo, mat.ivoryMarble);
    terrace.position.set(0, 0.7, -1);
    group.add(terrace);

    const mainBlockGeo = new THREE.BoxGeometry(14, 4.8, 8);
    const mainBlock = new THREE.Mesh(mainBlockGeo, mat.ivoryMarble);
    mainBlock.position.set(0, 3.4, -1);
    group.add(mainBlock);

    const roofGeo = new THREE.BoxGeometry(14.4, 1.4, 8.4);
    const roof = new THREE.Mesh(roofGeo, mat.copperRoof);
    roof.position.set(0, 6.4, -1);
    group.add(roof);

    const balustradeGeo = new THREE.BoxGeometry(14.2, 0.45, 8.2);
    const balustrade = new THREE.Mesh(balustradeGeo, mat.ivoryMarble);
    balustrade.position.set(0, 5.9, -1);
    group.add(balustrade);

    const porticoGeo = new THREE.BoxGeometry(6.4, 0.4, 3.2);
    const porticoRoof = new THREE.Mesh(porticoGeo, mat.ivoryMarble);
    porticoRoof.position.set(0, 3.5, 3.6);
    group.add(porticoRoof);

    for (let c = -2.5; c <= 2.5; c += 1.0) {
        const colGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.0, 16);
        const col = new THREE.Mesh(colGeo, mat.ivoryMarble);
        col.position.set(c, 2.0, 5.0);
        group.add(col);

        const capGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5);
        const cap = new THREE.Mesh(capGeo, mat.goldLeaf);
        cap.position.set(c, 3.4, 5.0);
        group.add(cap);
    }

    const pedimentShape = new THREE.Shape();
    pedimentShape.moveTo(-3.2, 0);
    pedimentShape.lineTo(0, 1.5);
    pedimentShape.lineTo(3.2, 0);
    pedimentShape.closePath();

    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.08, bevelThickness: 0.08 };
    const pedimentGeo = new THREE.ExtrudeGeometry(pedimentShape, extrudeSettings);
    const pediment = new THREE.Mesh(pedimentGeo, mat.ivoryMarble);
    pediment.position.set(0, 5.8, 3.0);
    group.add(pediment);

    const crestGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
    crestGeo.rotateX(Math.PI / 2);
    const crest = new THREE.Mesh(crestGeo, mat.goldLeaf);
    crest.position.set(0, 6.4, 3.6);
    group.add(crest);

    for (let floor = 0; floor < 2; floor++) {
        const yPos = 2.0 + floor * 2.2;
        const windowXs = [-5.5, -4.0, 4.0, 5.5];

        windowXs.forEach(x => {
            const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.15), mat.buffSandstone);
            winFrame.position.set(x, yPos, 3.05);
            group.add(winFrame);

            const winPediment = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.4, 3), mat.ivoryMarble);
            winPediment.position.set(x, yPos + 0.9, 3.1);
            group.add(winPediment);
        });
    }

    const gateZ = 7.5;
    [-2.8, -1.2, 1.2, 2.8].forEach(x => {
        const pillarGeo = new THREE.BoxGeometry(0.7, 2.8, 0.7);
        const pillar = new THREE.Mesh(pillarGeo, mat.buffSandstone);
        pillar.position.set(x, 1.6, gateZ);
        group.add(pillar);

        const finialGeo = new THREE.SphereGeometry(0.24, 12, 12);
        const finial = new THREE.Mesh(finialGeo, mat.goldLeaf);
        finial.position.set(x, 3.2, gateZ);
        group.add(finial);
    });

    const leftGate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.08), mat.wroughtIron);
    leftGate.position.set(-0.6, 1.4, gateZ);
    group.add(leftGate);

    const rightGate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.08), mat.wroughtIron);
    rightGate.position.set(0.6, 1.4, gateZ);
    group.add(rightGate);

    const gateCrest = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 8, 16), mat.goldLeaf);
    gateCrest.position.set(0, 1.6, gateZ + 0.05);
    group.add(gateCrest);

    const fountainPoolGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.35, 24);
    const fountainPool = new THREE.Mesh(fountainPoolGeo, mat.ivoryMarble);
    fountainPool.position.set(0, 0.5, 4.8);
    group.add(fountainPool);

    const fountainWater = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.65, 0.3, 24), mat.waterMirror);
    fountainWater.position.set(0, 0.55, 4.8);
    group.add(fountainWater);

    return group;
}

// 3. KRISHNAPURA CHHATRIS (Indore)
export function buildKrishnapuraChhatris() {
    const group = new THREE.Group();
    group.name = "KrishnapuraChhatris";
    const mat = createMaterials();

    const riverGeo = new THREE.BoxGeometry(24, 0.3, 8);
    const river = new THREE.Mesh(riverGeo, mat.waterMirror);
    river.position.set(0, 0.15, 6.0);
    group.add(river);

    for (let step = 0; step < 5; step++) {
        const stepWidth = 20 - step * 0.4;
        const stepGeo = new THREE.BoxGeometry(stepWidth, 0.3, 0.8);
        const stepMesh = new THREE.Mesh(stepGeo, mat.basaltStone);
        stepMesh.position.set(0, 0.3 + step * 0.3, 3.8 - step * 0.8);
        group.add(stepMesh);
    }

    const platformGeo = new THREE.BoxGeometry(16, 1.2, 7);
    const platform = new THREE.Mesh(platformGeo, mat.buffSandstone);
    platform.position.set(0, 1.8, -0.6);
    group.add(platform);

    const railFront = new THREE.Mesh(new THREE.BoxGeometry(15.8, 0.5, 0.25), mat.malwaSandstone);
    railFront.position.set(0, 2.65, 2.7);
    group.add(railFront);

    const chhatriConfigs = [
        { x: 0, scale: 1.0 },
        { x: -5.0, scale: 0.82 },
        { x: 5.0, scale: 0.82 }
    ];

    chhatriConfigs.forEach(cfg => {
        const chhatriGroup = new THREE.Group();
        chhatriGroup.position.set(cfg.x, 2.4, -0.6);
        chhatriGroup.scale.setScalar(cfg.scale);

        const baseGeo = new THREE.BoxGeometry(3.6, 0.6, 3.6);
        const base = new THREE.Mesh(baseGeo, mat.malwaSandstone);
        chhatriGroup.add(base);

        const pillarRadius = 0.16;
        const pillarHeight = 2.6;
        const colOffsets = [
            [-1.3, -1.3], [0, -1.3], [1.3, -1.3],
            [-1.3, 1.3],  [0, 1.3],  [1.3, 1.3],
            [-1.3, 0],               [1.3, 0]
        ];

        colOffsets.forEach(([cx, cz]) => {
            const pillarGeo = new THREE.CylinderGeometry(pillarRadius, pillarRadius * 1.2, pillarHeight, 8);
            const pillar = new THREE.Mesh(pillarGeo, mat.buffSandstone);
            pillar.position.set(cx, 1.6, cz);
            chhatriGroup.add(pillar);

            const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.22, 0.45), mat.malwaSandstone);
            bracket.position.set(cx, 2.95, cz);
            chhatriGroup.add(bracket);
        });

        const lintelGeo = new THREE.BoxGeometry(3.4, 0.35, 3.4);
        const lintel = new THREE.Mesh(lintelGeo, mat.malwaSandstone);
        lintel.position.set(0, 3.2, 0);
        chhatriGroup.add(lintel);

        const eaveGeo = new THREE.BoxGeometry(4.2, 0.2, 4.2);
        const eave = new THREE.Mesh(eaveGeo, mat.buffSandstone);
        eave.position.set(0, 3.45, 0);
        chhatriGroup.add(eave);

        const shikharaGeo = new THREE.ConeGeometry(1.6, 3.8, 12);
        const shikhara = new THREE.Mesh(shikharaGeo, mat.malwaSandstone);
        shikhara.position.set(0, 5.4, 0);
        chhatriGroup.add(shikhara);

        const amalakaGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.35, 16);
        const amalaka = new THREE.Mesh(amalakaGeo, mat.buffSandstone);
        amalaka.position.set(0, 7.3, 0);
        chhatriGroup.add(amalaka);

        const kalashGeo = new THREE.ConeGeometry(0.35, 0.85, 8);
        const kalash = new THREE.Mesh(kalashGeo, mat.goldLeaf);
        kalash.position.set(0, 7.85, 0);
        chhatriGroup.add(kalash);

        const padukaGeo = new THREE.BoxGeometry(0.6, 0.15, 0.8);
        const paduka = new THREE.Mesh(padukaGeo, mat.ivoryMarble);
        paduka.position.set(0, 0.4, 0);
        chhatriGroup.add(paduka);

        group.add(chhatriGroup);
    });

    [-6.5, 6.5].forEach(x => {
        const elephantGeo = new THREE.BoxGeometry(0.9, 0.9, 1.4);
        const elephant = new THREE.Mesh(elephantGeo, mat.basaltStone);
        elephant.position.set(x, 1.8, 2.5);
        group.add(elephant);
    });

    return group;
}

// 4. JAHAZ MAHAL (Mandu, Dhar District, Madhya Pradesh)
export function buildJahazMahal() {
    const group = new THREE.Group();
    group.name = "JahazMahal";
    const mat = createMaterials();

    const kapurLakeGeo = new THREE.BoxGeometry(24, 0.3, 7);
    const kapurLake = new THREE.Mesh(kapurLakeGeo, mat.waterMirror);
    kapurLake.position.set(0, 0.15, 5.8);
    group.add(kapurLake);

    const munjLakeGeo = new THREE.BoxGeometry(24, 0.3, 7);
    const munjLake = new THREE.Mesh(munjLakeGeo, mat.waterMirror);
    munjLake.position.set(0, 0.15, -5.8);
    group.add(munjLake);

    const causewayGeo = new THREE.BoxGeometry(20, 0.7, 5.0);
    const causeway = new THREE.Mesh(causewayGeo, mat.malwaSandstone);
    causeway.position.set(0, 0.45, 0);
    group.add(causeway);

    const groundFloorGeo = new THREE.BoxGeometry(18, 2.4, 4.0);
    const groundFloor = new THREE.Mesh(groundFloorGeo, mat.malwaSandstone);
    groundFloor.position.set(0, 2.0, 0);
    group.add(groundFloor);

    for (let x = -7.5; x <= 7.5; x += 2.5) {
        [1.85, -1.85].forEach(z => {
            const archPillar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.2, 0.4), mat.buffSandstone);
            archPillar.position.set(x, 1.9, z);
            group.add(archPillar);

            const archHead = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.7, 4), mat.buffSandstone);
            archHead.position.set(x + 1.25, 2.6, z);
            group.add(archHead);
        });
    }

    const midCorniceGeo = new THREE.BoxGeometry(18.6, 0.3, 4.6);
    const midCornice = new THREE.Mesh(midCorniceGeo, mat.buffSandstone);
    midCornice.position.set(0, 3.3, 0);
    group.add(midCornice);

    const upperFloorGeo = new THREE.BoxGeometry(16.5, 2.0, 3.6);
    const upperFloor = new THREE.Mesh(upperFloorGeo, mat.malwaSandstone);
    upperFloor.position.set(0, 4.4, 0);
    group.add(upperFloor);

    const terraceGeo = new THREE.BoxGeometry(17, 0.3, 4.0);
    const terrace = new THREE.Mesh(terraceGeo, mat.buffSandstone);
    terrace.position.set(0, 5.5, 0);
    group.add(terrace);

    const poolRingGeo = new THREE.TorusGeometry(1.2, 0.25, 8, 24);
    poolRingGeo.rotateX(Math.PI / 2);
    const poolRing = new THREE.Mesh(poolRingGeo, mat.buffSandstone);
    poolRing.position.set(-4.5, 5.75, 0);
    group.add(poolRing);

    const poolWater = new THREE.Mesh(new THREE.CircleGeometry(1.2, 24), mat.waterMirror);
    poolWater.rotateX(-Math.PI / 2);
    poolWater.position.set(-4.5, 5.8, 0);
    group.add(poolWater);

    const chhatriPositions = [
        { x: -7.0, z: 0, domeR: 1.1 },
        { x: 0.0,  z: 0, domeR: 1.4 },
        { x: 7.0,  z: 0, domeR: 1.1 }
    ];

    chhatriPositions.forEach(pos => {
        const pavilionGroup = new THREE.Group();
        pavilionGroup.position.set(pos.x, 5.6, pos.z);

        [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]].forEach(([px, pz]) => {
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.4, 8), mat.buffSandstone);
            pillar.position.set(px, 0.7, pz);
            pavilionGroup.add(pillar);
        });

        const domeGeo = new THREE.SphereGeometry(pos.domeR, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
        const dome = new THREE.Mesh(domeGeo, mat.buffSandstone);
        dome.position.set(0, 1.4, 0);
        pavilionGroup.add(dome);

        const finial = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 6), mat.goldLeaf);
        finial.position.set(0, 1.4 + pos.domeR, 0);
        pavilionGroup.add(finial);

        group.add(pavilionGroup);
    });

    const aqueductGeo = new THREE.BoxGeometry(0.4, 0.3, 3.2);
    const aqueduct = new THREE.Mesh(aqueductGeo, mat.buffSandstone);
    aqueduct.position.set(3.5, 3.4, 2.0);
    group.add(aqueduct);

    return group;
}

// MASTER PROCEDURAL FACTORY
export function createProceduralMonument(id) {
    let modelGroup;

    switch (id) {
        case "rajwada-palace":
            modelGroup = buildRajwadaPalace();
            break;
        case "lal-bagh-palace":
            modelGroup = buildLalBaghPalace();
            break;
        case "krishnapura-chhatris":
            modelGroup = buildKrishnapuraChhatris();
            break;
        case "jahaz-mahal":
            modelGroup = buildJahazMahal();
            break;
        default:
            modelGroup = buildRajwadaPalace();
            break;
    }

    modelGroup.traverse(obj => {
        if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });

    return modelGroup;
}
