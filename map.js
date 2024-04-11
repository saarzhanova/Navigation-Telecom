import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let loader = new THREE.ObjectLoader();
loader.load('#', function(mesh) {
    scene.add(mesh);
});

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

animate();