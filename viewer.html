<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>3D Viewer Core</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #f4f4f4; font-family: 'Segoe UI', sans-serif; }
        #panel { 
            position: absolute; top: 20px; left: 20px; 
            background: rgba(255,255,255,0.9); padding: 15px; 
            border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); 
            z-index: 10; width: 150px; border: 1px solid #ddd;
        }
        button { 
            display: block; width: 100%; margin: 8px 0; padding: 10px; 
            cursor: pointer; border: 1px solid #eee; border-radius: 6px; 
            background: white; transition: 0.2s; font-weight: 500;
        }
        button:hover { background: #007bff; color: white; }
        .hidden { display: none !important; }
        #status { position: absolute; bottom: 10px; right: 10px; font-size: 12px; color: #888; }
    </style>
</head>
<body>

<div id="panel">
    <button onclick="loadModel('Chair.glb')">Load Chair</button>
    <button onclick="loadModel('Missing.glb')">Test Fallback</button>
</div>
<div id="status"></div>

<script type="importmap">
    { "imports": { 
        "three": "https://unpkg.com/three@0.160.0/build/three.module.js", 
        "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/" 
    } }
</script>

<script type="module">
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    let scene, camera, renderer, controls, currentModel;
    const loader = new GLTFLoader();

    const params = new URLSearchParams(window.location.search);
    if (params.get('hideUI')) document.getElementById('panel').classList.add('hidden');

    init();
    loadModel(params.get('model') || 'Chair.glb');
    animate();

    function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf4f4f4);
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(3, 3, 5);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        document.body.appendChild(renderer.domElement);

        scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5));
        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(5, 10, 5);
        dirLight.castShadow = true;
        scene.add(dirLight);

        const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.ShadowMaterial({ opacity: 0.1 }));
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        scene.add(floor);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        window.addEventListener('resize', onWindowResize);
    }

    // This function runs if the .glb file is missing
    function generateFallback() {
        const group = new THREE.Group();
        const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });

        // Create a simple procedural "Table"
        const top = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1.5), material);
        top.position.y = 1;
        top.castShadow = true;
        group.add(top);

        const legGeo = new THREE.BoxGeometry(0.1, 1, 0.1);
        const positions = [[0.9, 0.5, 0.6], [-0.9, 0.5, 0.6], [0.9, 0.5, -0.6], [-0.9, 0.5, -0.6]];
        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeo, material);
            leg.position.set(...pos);
            leg.castShadow = true;
            group.add(leg);
        });

        return group;
    }

    window.loadModel = function(fileName) {
        if (currentModel) scene.remove(currentModel);
        document.getElementById('status').innerText = `Attempting to load: ${fileName}`;

        loader.load(`./models/${fileName}`, 
            (gltf) => {
                currentModel = gltf.scene;
                currentModel.traverse(c => { if (c.isMesh) c.castShadow = true; });
                scene.add(currentModel);
                document.getElementById('status').innerText = `Loaded: ${fileName}`;
            }, 
            undefined, 
            () => {
                console.warn("File not found. Generating procedural fallback.");
                currentModel = generateFallback();
                scene.add(currentModel);
                document.getElementById('status').innerText = `Generated Placeholder (File "${fileName}" not found)`;
            }
        );
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
</script>
</body>
</html>
