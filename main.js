import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {Color} from "three";
import registerRenderer from "three/addons/libs/lottie_canvas.module";

const scene = new THREE.Scene();
scene.background = new Color('grey');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width/height
    camera.updateProjectionMatrix();

})

const gltfloader = new GLTFLoader();
const urlGLB = 'glb/Telecom.glb';

gltfloader.load( urlGLB, function ( gltf ) {
    let object = gltf.scene
    scene.add( object);

}, undefined, function ( error ) {
    console.error( error );
} );

camera.lookAt(scene.position);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
