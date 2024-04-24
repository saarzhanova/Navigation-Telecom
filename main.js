import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Color} from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";

const scene = new THREE.Scene();
scene.background = new Color('grey');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2)

// ambient + directional light makes scene more natural
// for all objects in the scene
// no direction
scene.add( new THREE.AmbientLight( 0xffffff, 0.4 ) );

// in specific direction
// points fron light's position to a target
// can cast shadows
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 0, 1);
scene.add(light);

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

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = false; // true adds inertia (for smooth controlling)
controls.screenSpacePanning = true; // true - obj moves with mouse, false - only on the level of the camera
controls.minDistance = 10;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2; // how far we can rotate object (left click)
controls.update();

const gltfloader = new GLTFLoader();
const urlGLB = 'glb/Telecom.glb';

gltfloader.load( urlGLB, function ( gltf ) {
    let object = gltf.scene
    scene.add( object);
    console.log('Telecom 1 floor', object)

}, undefined, function ( error ) {
    console.error( error );
} );

gltfloader.load( 'glb/coridor1_navmesh.glb', function ( gltf ) {
    let object = gltf.scene
    scene.add( object);
    console.log('navmesh', object)

}, undefined, function ( error ) {
    console.error( error );
} );

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

animate();
