import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Color} from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import {Pathfinding, PathfindingHelper} from "three-pathfinding";
import * as path from "path";
import {objectGroup} from "three/addons/nodes/core/UniformGroupNode";
import {func} from "three/addons/nodes/code/FunctionNode";

const scene = new THREE.Scene();
scene.background = new Color('grey');

// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const fov = 75 // field of view - how wide it is (how close to the camera)
const aspect = window.innerWidth / window.innerHeight
const near = 1.0
const far = 1000.0

// like a real camera
const perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far)

const left = -100
const right = 100
const top = 100
const bottom = -100

// not like a real camera
// nothing scales by distance - objects on the back and in the far appear of the same size
const orthographicCamera = new THREE.OrthographicCamera(left, right, top, bottom)

const camera = perspectiveCamera
camera.position.set(0, 5, 7) // 75, 20, 0

scene.add(perspectiveCamera)
scene.add(orthographicCamera)


// ambient + directional light makes scene more natural
// for all objects in the scene
// no direction
scene.add( new THREE.AmbientLight( 0xffffff, 0.4 ) );

// in specific direction
// points fron light's position to a target
// can cast shadows
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(-10, 2, -1);
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
// controls.minDistance = 20;
controls.minDistance = 3;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2; // how far we can rotate object (left click)
controls.update();

// const agentHeight = 2;
// const agentRadius = 1;

const agentHeight = 0.5;
const agentRadius = 0.15;

const agent = new THREE.Mesh(new THREE.CylinderGeometry(agentRadius, agentRadius, agentHeight),
                             new THREE.MeshPhongMaterial({color: 'green'}))
agent.position.y = agentHeight / 2
const agentGroup = new THREE.Group();
agentGroup.add(agent)
// agentGroup.position.z = 2
// agentGroup.position.x = 0
// agentGroup.position.y = 1

agentGroup.position.z = -1
agentGroup.position.x = 0
agentGroup.position.y = 0

scene.add(agentGroup)


const gltfloader = new GLTFLoader();
const urlGLB = 'glb/first_floor_w_two_stairs.glb';
const firstFloorGLB = 'glb/first_floor_separated.glb';
const secondFloorGLB = 'glb/second_floor_w_two_stairs_separately.glb';
const doorURL = 'glb/door.glb';
const door2URL = 'glb/door2.glb';
const door3URL = 'glb/door3.glb';
const urlNavmeshGLB = 'glb/coridor_w_second_floor_w_two_stairs_navmesh.gltf';

let firstFloor
gltfloader.load( firstFloorGLB, ( gltf ) => {
    console.log(gltf)
    firstFloor = gltf.scene.getObjectByName("Plane001");
    scene.add(firstFloor);
    firstFloor.material.opacity = 1;
    firstFloor.material.transparent = true;
}, undefined, ( error ) => {
    console.error( error );
} );

let secondFloor
gltfloader.load( secondFloorGLB, ( gltf ) => {
    console.log(gltf)
    secondFloor = gltf.scene.getObjectByName("Plane003");
    scene.add(secondFloor);
    secondFloor.material.opacity = 0.5;
    secondFloor.material.transparent = true;
}, undefined, ( error ) => {
    console.error( error );
} );

gltfloader.load( doorURL, ( gltf ) => {
    let door = gltf.scene
    scene.add( door);
}, undefined, ( error ) => {
    console.error( error );
} );

gltfloader.load( door2URL, ( gltf ) => {
    let door2 = gltf.scene
    scene.add( door2);
}, undefined, ( error ) => {
    console.error( error );
} );

gltfloader.load( door3URL, ( gltf ) => {
    let door2 = gltf.scene
    scene.add( door2);
}, undefined, ( error ) => {
    console.error( error );
} );

let door_coordinates = {
    "door1": new THREE.Vector3(-2.8050405761298927, 2.1136216852416756, -0.06086446907692),
    "door2": new THREE.Vector3(2.9064642030044134, 2.1136220260031022, -6.435141873951886),
    "door3": new THREE.Vector3(2.8842250480889082, 0.00648565998652928, -2.531122153463738)
}
let chosenDoor
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

function goByClick() {
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(clickMouse, camera)
    const found = raycaster.intersectObjects(scene.children) // all intersection points within the 3d scene
    console.log('intersection points: ', found)
    console.log('intersection object name: ', found[0].object.name, found[0].point)
    if (found.length > 0) {
        console.log('intersection points with scene objects are found!')
        let target = found[0].point
        findPathTo(target)
    }
}

function goByAddress() {
    console.log(event)
    let target
    let doorID = event.target.id
    switch(doorID) {
        case '1':
            target = door_coordinates.door1
            break;
        case '2':
            target = door_coordinates.door2
            break;
        case '3':
            target = door_coordinates.door3
            break;
        default:
            // clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1
            // clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
            // raycaster.setFromCamera(clickMouse, camera)
            // const found = raycaster.intersectObjects(scene.children)
            // target = found[0]
            break;
    }
    findPathTo(target)
}

const crossCubeGeometryHorizontal = new THREE.BoxGeometry(1, 0.1, 0.4);
const crossCubeGeometryVertical = new THREE.BoxGeometry(0.1, 1, 0.4);

const crossMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const crossLine1 = new THREE.Mesh(crossCubeGeometryHorizontal, crossMaterial);
const crossLine2 = new THREE.Mesh(crossCubeGeometryVertical, crossMaterial);

const cross = new THREE.Group();
cross.rotateX(Math.PI / 2);
cross.rotateZ(Math.PI / 4);

function createPathWithCubes(path) {
    const cubeSize = 0.1;
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    if (pathfindingHelper._pathLine) {
        scene.remove(pathfindingHelper._pathLine);
        pathfindingHelper._pathLine = null;
    }

    path.forEach(point => {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.copy(point);
        scene.add(cube);
    });
}


function findPathTo(target) {
    groupID = pathfinding.getGroup(ZONE, agentGroup.position)
    const closestNode = pathfinding.getClosestNode(agentGroup.position, ZONE, groupID)
    navpath = pathfinding.findPath(closestNode.centroid, target, ZONE, groupID)
    console.log('path',navpath)
    if (navpath) {
        pathfindingHelper.reset()
        pathfindingHelper.setPlayerPosition(agentGroup.position)
        pathfindingHelper.setTargetPosition(target)
        pathfindingHelper.setPath(navpath)

        cross.add(crossLine1);
        cross.add(crossLine2);
        scene.add(cross);
        cross.position.copy(target);
        pathfindingHelper._targetMarker.visible = false
        pathfindingHelper.targetMarker = cross;

        for (let i = 1; i < pathfindingHelper._pathMarker.children.length; i++) {
            pathfindingHelper._pathMarker.children[i].visible = false
        }

        pathfindingHelper._pathLineMaterial.color.r = 255
        pathfindingHelper._pathLineMaterial.color.g = 0
        pathfindingHelper._pathLineMaterial.color.b = 0

        console.log(pathfindingHelper)
    }
}

let goButton = document.querySelectorAll(".goButton")
goButton.forEach(button => {
    button.addEventListener('click', goByAddress)
});

function move(delta) {
    if (!navpath || navpath.length <= 0) return;

    let targetPosition = navpath[0];
    const distance = targetPosition.clone().sub(agentGroup.position)
    if (distance.lengthSq() > 0.5 * 0.05) {
        distance.normalize()
        agentGroup.position.add(distance.multiplyScalar(delta * 5));

        let direction = distance.clone().normalize();
        let angle = Math.atan2(direction.x, direction.z);
        agentGroup.rotation.y = angle;
    } else {
        navpath.shift();
    }

    if (agentGroup.position.y < 1) {
        secondFloor.material.opacity = 0.5;
        firstFloor.material.opacity = 1;
    } else {
        secondFloor.material.opacity = 1;
        firstFloor.material.opacity = 0.5;
    }
}

// function updateCamera() {
//     const offset = new THREE.Vector3(0, 5, -10); // Position behind the agent
//     const agentPosition = agentGroup.position.clone();
//     const cameraPosition = agentPosition.clone().add(offset);
//
//     camera.position.copy(cameraPosition);
//     camera.lookAt(agentGroup.position);
//
//     if (camera.position.y < agentGroup.position.y + agentHeight) {
//         camera.position.y = agentGroup.position.y + agentHeight;
//     }
// }

const clock = new THREE.Clock();
function animate() {
    move(clock.getDelta())
    // updateCamera()
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

animate();
window.addEventListener('click', goByClick)
