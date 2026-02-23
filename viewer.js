// === Three.js Setup ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,2,5);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,500); // fixed height for container
renderer.shadowMap.enabled = true;
document.getElementById('viewer-container').appendChild(renderer.domElement);

// Lights
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0,20,0);
scene.add(hemiLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5,10,5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

// Ground
const groundGeo = new THREE.PlaneGeometry(50,50);
const groundMat = new THREE.ShadowMaterial({opacity:0.3});
const ground = new THREE.Mesh(groundGeo, groundMat);
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

// Models array
const models = ['chair.glb','table.glb','sofa.glb','bed.glb'];

// Panel DOM
const panel = document.getElementById('panel');
const toggleBtn = document.getElementById('togglePanel');

// URL param for embedding single model
const urlParams = new URLSearchParams(window.location.search);
const modelParam = urlParams.get('model'); // e.g., "chair.glb"
const showPanel = !modelParam;

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

// Load model function
function loadModel(name){
    const path = `models/${name}`;
    loader.load(path, gltf=>{
        if(currentModel) scene.remove(currentModel);
        currentModel = gltf.scene;
        currentModel.traverse(c=>{if(c.isMesh){c.castShadow=true;c.receiveShadow=true;}});
        currentModel.position.set(0,0,0);
        scene.add(currentModel);
    }, undefined, error=>{
        console.error(`Failed to load ${name}, loading default model.`);
        if(name!=='default.glb') loadModel('default.glb');
    });
}

// Load requested or default
if(modelParam) loadModel(modelParam);
else loadModel('default.glb');

// Animate
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,500);
});