# 3D Representation of Telecom Paris Building

## Introduction
This project involves creating a 3D representation of the Telecom Paris building using Blender and embedding it into a web browser for visualization. The project explores orientation and wayfinding methodologies through academic research and potential applications in web development.

## Table of Contents
1. [Creating a 3D Model of the Building](#creating-a-3d-model-of-the-building)
   - [Using SVG File](#using-svg-file)
   - [Drawing in Blender](#drawing-in-blender)
   - [Creating Mesh](#creating-mesh)
     - [Using UPBGE](#using-upbge)
     - [Using Online NavMesh Generator](#using-online-navmesh-generator)
2. [Blender + Three.js](#blender--threejs)
   - [Why Three.js?](#why-threejs)
   - [Importing 3D Model from Blender to Three.js](#importing-3d-model-from-blender-to-threejs)
   - [Creating a 3D Scene](#creating-a-3d-scene)
   - [Importing Mesh Objects to Three.js](#importing-mesh-objects-to-threejs)
   - [Styling the Scene](#styling-the-scene)
3. [Conclusion](#conclusion)

## Creating a 3D Model of the Building

### Using SVG File
Blender takes files of SVG format for import. You can create your own svg file out of any image using converters to svg ot Photoshop.

### Drawing in Blender
- Blender allows the creation of 3D models using Mesh objects, which are three-dimensional geometric primitives.
- Default Blender contains ten mesh objects (standard primitives).

### Creating Mesh
To enable navigation on the platform, a navigation mesh (navmesh) corresponding to the 3D platform is needed.

#### Using UPBGE
1. **Introduction to UPBGE:**
   - [UPBGE](https://upbge.org/#/#intro) is a standalone game engine for Blender.
   - It provides tools to generate navmesh on 3D objects.

2. **Creating NavMesh:**
   - Upload or create a 3D mesh object in UPBGE and select it.
   - Navigate to the Scene section and adjust the Navigation Mesh settings.
   - Press “Build Navigation Mesh” to generate the navmesh.
   - Ensure the navmesh is visible and connected properly.

3. **Exporting:**
   - Export the navmesh and the level separately as .glb files using the glTF 2.0 exporter (File -> Export). Ensure to check Limit to “Selected Objects” in "Include" section on the right of the menu to export only the objects you have selected.

#### Using Online NavMesh Generator
- An online navmesh generator, such as one powered by recast-navigation-js, can be used for quick and efficient navmesh creation.
- This tool provides high-level APIs for creating navigation meshes and simulating crowds.
- Fast and easy to use.

## Blender + Three.js

### Why Three.js?
- Three.js is used to embed 3D graphics in a web browser using WebGL.
- It provides convenient abstractions to simplify and speed up the process.

### Creating a 3D Scene
1. **Setup:**
   - Create a Three.js scene, add a camera with orbit controls, and edit light sources.
   - Create a movable character (e.g., a cylinder).

2. **Dependencies:**
   - Edit pathfinding dependencies and load the .glb files into the scene using [GLTFLoader](https://threejs.org/docs/index.html?q=gltf#examples/en/loaders/GLTFLoader).

### Importing Mesh Objects to Three.js
1. **Loading Models:**
   - Load .glb files into the Three.js scene.
   - Check visibility (background and model color) and lighting settings if the model is not displayed.

2. **Adding NavMesh:**
   - Use the [three-pathfinding](https://www.npmjs.com/package/three-pathfinding) library to implement pathfinding.
   - Add the navmesh to the scene and visualize the path.

### Styling the Scene
1. **Lighting:**
   - Adjust lighting to display the correct colors.
2. **Changing Path Markers:**
   - The line indicating the path to the target is drawn with PathfindingHelper. As three-pathfinding uses Three mesh objects to visualize the path, it’s possible to define its properties.
   - To change the target marker, you can create a mesh object, hide the default target marker with `pathfindingHelper._targetMarker.visible = false`, and define define a new one `pathfindingHelper.targetMarker = newMesh`. Access all the path markers in `pathfindingHelper._pathMarker.children`. To define path line material use  `pathfindingHelper._pathLineMaterial`.
  
The project demonstrates the potential of combining Blender and Three.js for practical web-based wayfinding applications in complex indoor spaces.

---

To explore the live visualization, visit: [3D Visualization of Telecom Paris](https://saarzhanova.github.io/TelecomParis3DMap)

