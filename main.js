import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Color} from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import {Pathfinding, PathfindingHelper} from "three-pathfinding";
import * as path from "path";

const scene = new THREE.Scene();
scene.background = new Color('grey');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 7)

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
controls.minDistance = 3;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2; // how far we can rotate object (left click)
controls.update();

const agentHeight = 0.5;
const agentRadius = 0.15;
const agent = new THREE.Mesh(new THREE.CylinderGeometry(agentRadius, agentRadius, agentHeight),
    new THREE.MeshPhongMaterial({color: 'green'}))
agent.position.y = agentHeight / 2
const agentGroup = new THREE.Group();
agentGroup.add(agent)
agentGroup.position.z = -1
agentGroup.position.x = 0
agentGroup.position.y = 0
scene.add(agentGroup)

const gltfloader = new GLTFLoader();
const urlGLB = 'glb/plane.glb';
const urlNavmeshGLB = 'glb/navmesh.glb';

gltfloader.load( urlGLB, ( gltf ) => {
    let object = gltf.scene
    scene.add( object);

}, undefined, ( error ) => {
    console.error( error );
} );

////////////////////////////////////////////////////////// pathfinding
const pathfinding = new Pathfinding()
const ZONE = 'level1'
let navmesh;
let groupID
let navpath
const pathfindingHelper = new PathfindingHelper()

gltfloader.load( urlNavmeshGLB,  ( gltf ) => {
    let object = gltf.scene
    // scene.add( object);
    console.log('navmesh', object)
    object.traverse( (node) => {
        if (!navmesh && node.isObject3D && node.children && node.children.length > 0) {
            // navmesh = node
            navmesh = node.children[0]
            // scene.add( navmesh);
            pathfinding.setZoneData(ZONE, Pathfinding.createZone(navmesh.geometry))
        }
    })
}, undefined,  ( error ) => {
    console.error( error );
} );

scene.add(pathfindingHelper)
// console.log('scene children', scene.children)
const raycaster = new THREE.Raycaster()
const clickMouse = new THREE.Vector2()
window.addEventListener('click', event => {
    // comment
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(clickMouse, camera)
    const found = raycaster.intersectObjects(scene.children) // all intersection points within the 3d scene
    console.log(found)
    if (found.length > 0) {
        console.log('intersection points with scene objects are found!')
        let target = found[0].point
        groupID = pathfinding.getGroup(ZONE, agentGroup.position)
        const closestNode = pathfinding.getClosestNode(agentGroup.position, ZONE, groupID)
        navpath = pathfinding.findPath(closestNode.centroid, target, ZONE, groupID)
        console.log('path',navpath)
        if (navpath) {
            console.log('Path found! Updating pathfinding helper')
            pathfindingHelper.reset()
            pathfindingHelper.setPlayerPosition(agentGroup.position)
            pathfindingHelper.setTargetPosition(target)
            pathfindingHelper.setPath(navpath)
        }
    }
})

// animation
function move(delta) {
    if (!navpath || navpath.length <= 0) return;

    let targetPosition = navpath[0];
    const distance = targetPosition.clone().sub(agentGroup.position)
    if (distance.lengthSq() > 0.5 * 0.05) {
        distance.normalize()
        agentGroup.position.add(distance.multiplyScalar(delta * 5));
    } else {
        navpath.shift();
    }
}

const clock = new THREE.Clock();
function animate() {
    move(clock.getDelta())
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

animate();
