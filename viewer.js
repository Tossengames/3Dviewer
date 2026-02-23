// === THREE.js Scene Setup ===
const container = document.getElementById('viewer-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf8f8f8);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0,2,5);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Lights
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
hemiLight.position.set(0,20,0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5,10,5);
dirLight.castShadow = true;
scene.add(dirLight);

// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50,50),
    new THREE.ShadowMaterial({opacity:0.4})
);
ground.rotation.x = -Math.PI/2;
ground.receiveShadow = true;
scene.add(ground);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

// Loader
const loader = new THREE.GLTFLoader();
let currentModel = null;

// Models array for demo panel
const models = ['chair.glb','table.glb','sofa.glb','bed.glb'];

// Panel DOM
const panel = document.getElementById('panel');
const toggleBtn = document.getElementById('togglePanel');

// URL param for embedding single model
const urlParams = new URLSearchParams(window.location.search);
const modelParam = urlParams.get('model'); // e.g., "chair.glb"
const showPanel = !modelParam; // only show panel if no model param

if(showPanel){
    toggleBtn.style.display = 'block';
    models.forEach(name=>{
        const btn = document.createElement('button');
        btn.textContent = name.replace('.glb','');
        btn.onclick = ()=>loadModel(name);
        panel.appendChild(btn);
    });
}

toggleBtn.onclick = ()=> panel.style.display = panel.style.display==='none' ? 'block' : 'none';

// Function to load a model
function loadModel(name){
    const path = `models/${name}`;
    loader.load(path, gltf=>{
        if(currentModel) scene.remove(currentModel);
        currentModel = gltf.scene;
        currentModel.traverse(c=>{
            if(c.isMesh){ c.castShadow=true; c.receiveShadow=true; }
        });
        currentModel.position.set(0,0,0);
        scene.add(currentModel);
    }, undefined, error=>{
        console.error(`Failed to load ${name}, loading default model.`);
        if(name!=='default.glb') loadModel('default.glb');
    });
}

// Load requested model or default
if(modelParam) loadModel(modelParam);
else loadModel('default.glb');

// Animate
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', ()=>{
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});