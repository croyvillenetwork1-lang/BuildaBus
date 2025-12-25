// This file contains:
// - Model presets
// - Operator presets
// - Route presets
// - 3D scene setup
// - Bus builder
// - UI bindings
// - PNG export

// ------------------------------
// MODEL PRESETS
// ------------------------------
const modelPresets = {
  "StreetDeck": { length: 4.8, height: 2.9, width: 1.3, doubleDeck: true },
  "StreetLite DF": { length: 3.6, height: 2.6, width: 1.3, doubleDeck: false },
  "Eclipse 2": { length: 4.1, height: 2.7, width: 1.3, doubleDeck: false },
  "Gemini 2": { length: 4.7, height: 3.0, width: 1.3, doubleDeck: true },
  "Enviro200 MMC": { length: 3.5, height: 2.6, width: 1.3, doubleDeck: false },
  "Enviro400 MMC": { length: 4.6, height: 3.0, width: 1.3, doubleDeck: true },
  "Enviro400 EV 2025": { length: 4.6, height: 3.05, width: 1.3, doubleDeck: true },
  "Enviro500": { length: 5.4, height: 3.2, width: 1.35, doubleDeck: true }
};

// ------------------------------
// OPERATOR PRESETS
// ------------------------------
const operatorPresets = {
  "First Bradford": { exterior: "#e4007f", accent: "#ffffff" },
  "Keighley Bus Company": { exterior: "#005baa", accent: "#ffffff" },
  "Metroline London": { exterior: "#d01b1b", accent: "#001b5e" },
  "Bee Network": { exterior: "#ffdd00", accent: "#000000" },
  "Arriva London": { exterior: "#e11b22", accent: "#ffffff" }
};

// ------------------------------
// ROUTE PRESETS
// ------------------------------
const routePresets = {
  "X11": "X11 Bradford",
  "72": "72 Bradford–Leeds",
  "25": "25 Oxford Circus",
  "390": "390 Victoria"
};

// ------------------------------
// 3D SETUP
// ------------------------------
const canvas = document.getElementById("threeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04060f);

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(5, 2, 7);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
scene.add(hemi);

const busGroup = new THREE.Group();
scene.add(busGroup);

// ------------------------------
// BUILD BUS
// ------------------------------
function buildBus(modelName) {
  while (busGroup.children.length) busGroup.remove(busGroup.children[0]);

  const preset = modelPresets[modelName];
  const bodyGeo = new THREE.BoxGeometry(preset.length, preset.height, preset.width);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1f6bff });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1.2;
  busGroup.add(body);
}

// ------------------------------
// UI BINDINGS
// ------------------------------
const busModelSelect = document.getElementById("busModel");
const liverySelect = document.getElementById("liveryPreset");
const routeSelect = document.getElementById("routePreset");
const destInput = document.getElementById("destText");
const exteriorColor = document.getElementById("exteriorColor");
const accentColor = document.getElementById("accentColor");

// Populate dropdowns
Object.keys(modelPresets).forEach(m => {
  const o = document.createElement("option");
  o.value = m;
  o.textContent = m;
  busModelSelect.appendChild(o);
});

Object.keys(operatorPresets).forEach(op => {
  const o = document.createElement("option");
  o.value = op;
  o.textContent = op;
  liverySelect.appendChild(o);
});

Object.keys(routePresets).forEach(r => {
  const o = document.createElement("option");
  o.value = r;
  o.textContent = r;
  routeSelect.appendChild(o);
});

// Events
busModelSelect.addEventListener("change", () => buildBus(busModelSelect.value));
liverySelect.addEventListener("change", () => {
  const p = operatorPresets[liverySelect.value];
  exteriorColor.value = p.exterior;
  accentColor.value = p.accent;
});
routeSelect.addEventListener("change", () => {
  destInput.value = routePresets[routeSelect.value];
});

// ------------------------------
// RENDER LOOP
// ------------------------------
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
