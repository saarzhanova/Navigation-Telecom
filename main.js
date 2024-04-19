import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {Color} from "three";

const scene = new THREE.Scene();
scene.background = new Color('grey');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 5);

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
