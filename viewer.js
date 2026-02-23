<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Viewer Core</title>
    <style>
        body { margin: 0; overflow: hidden; background-color: #f4f4f4; font-family: 'Segoe UI', sans-serif; }
        #panel { 
            position: absolute; top: 20px; left: 20px; 
            background: rgba(255,255,255,0.9); padding: 15px; 
            border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); 
            z-index: 10; width: 150px; border: 1px solid #ddd;
        }
        h3 { margin-top: 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        button { 
            display: block; width: 100%; margin: 8px 0; padding: 10px; 
            cursor: pointer; border: 1px solid #eee; border-radius: 6px; 
            background: white; transition: all 0.2s; font-weight: 500;
        }
        button:hover { background: #007bff; color: white; border-color: #007bff; }
        .hidden { display: none !important; }
        #loader { 
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            font-size: 12px; color: #999; pointer-events: none;
        }
    </style>
</head>
<body>

<div id="loader">Loading...</div>

<div id="panel">
    <h3>Products</h3>
    <button onclick="loadModel('Chair.glb')">Chair</button>
    <button onclick="loadModel('Table.glb')">Table</button>
    <button onclick="loadModel('Sofa.glb')">Sofa</button>
    <button onclick="loadModel('Bed.glb')">Bed</button>
</div>

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
    const modelPath = './models/';
    const defaultModel = 'default.glb';

    const params = new URLSearchParams(window.location.search);
    const modelToLoad = params.get('model') || defaultModel;
    if (params.get('hideUI')) document.getElementById('panel').classList.add('hidden');

    init();
    loadModel(modelToLoad);
    animate();

    function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf4f4f4);
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(3, 2, 5);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        document.body.appendChild(renderer.domElement);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
        scene.add(hemiLight);

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
        controls.autoRotate = true;

        window.addEventListener('resize', onWindowResize);
    }

    window.loadModel = function(fileName) {
        document.getElementById('loader').classList.remove('hidden');
        if (currentModel) scene.remove(currentModel);

        loader.load(`${modelPath}${fileName}`, (gltf) => {
            currentModel = gltf.scene;
            currentModel.traverse(child => {
                if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
            });
            scene.add(currentModel);
            document.getElementById('loader').classList.add('hidden');
        }, undefined, (error) => {
            console.error(`Failed to load ${fileName}, reverting to ${defaultModel}`);
            if (fileName !== defaultModel) loadModel(defaultModel);
        });
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
