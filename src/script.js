//NOTE - A lot of the starter code in this assignment and folder
// was taken from https://github.com/designcourse/threejs-webpack-starter
// https://threejs-journey.xyz/
// and this video tutorial: https://www.youtube.com/watch?v=pUgWfqWZWmM
// I do not take credit for the starter code!

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';
import * as dat from 'dat.gui'
import { Vector3 } from 'three';
import normalMap from '../static/textures/NormalMap.png'
import rock08path from '../static/textures/rock08.obj'

// Loading
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const sphereNormText = textureLoader.load(normalMap)
const pyramidNormText = textureLoader.load('/textures/brick2-normal.jpg')
const bgTexture = textureLoader.load(
    '/textures/cooldesert.jpg',
    () => {
        const rt = new THREE.WebGLCubeRenderTarget(bgTexture.image.height);
        rt.fromEquirectangularTexture(renderer, bgTexture);
        scene.background = rt.texture;
    }
);

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = bgTexture;

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const sphereGeometry = new THREE.SphereBufferGeometry(.7, 64, 64)
const planeGeometry = new THREE.BoxGeometry(50, .01, 50);
const pyramidGeometry = new THREE.ConeGeometry( 7, 7, 4 );


// LOADING OBJECTS
const objLoader = new OBJLoader();
var mtlLoader = new MTLLoader();
  objLoader.load('/textures/rock01.obj', (rock01) => {
    // rock01.color = new THREE.Color((0xCDAA6D))
    rock01.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            //  child.material.ambient.setHex(0xFF0000);
             child.material.color.setHex(0xCDAA6D);
            }
        } );
    rock01.position.x = -12
    rock01.position.y = -5.2
    rock01.position.z = -12
    rock01.scale.set(.5, .5, .5)
    scene.add(rock01);
  });
  objLoader.load(rock08path, (rock08) => {
    // rock01.color = new THREE.Color((0xCDAA6D))
    rock08.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            //  child.material.ambient.setHex(0xFF0000);
             child.material.color.setHex(0x363636);
            }
        } );
    // rock08.position.x = -12
    rock08.scale.set(1.2, 1.2, 1.2)
    rock08.position.y = -5.2
    
    // rock08.position.z = -12
    scene.add(rock08);
  });
    var aztecPyramid = undefined;
    mtlLoader.load('/textures/pyramid/May_Tower_1.mtl', function(materials){
        materials.preload();
        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('/textures/pyramid/May_Tower_1.obj', function(object){    
            aztecPyramid = object;
            // aztecPyramid.position.x = 12
            aztecPyramid.position.y = -5.2
            aztecPyramid.position.z = 12
            aztecPyramid.rotation.y = Math.PI
            // aztecPyramid.scale.set(.5, .5, .5)
            scene.add( aztecPyramid );
        });
    });



// Materials

const planeMaterial = new THREE.MeshStandardMaterial({color: 0xCDAA6D});
// const pyramidMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const pyramidMaterial = new THREE.MeshStandardMaterial();
// pyramidMaterial.metalness = 0.0
// pyramidMaterial.roughness = 1.0
pyramidMaterial.map = pyramidNormText;
pyramidMaterial.color = new THREE.Color(0xCDAA6D)
const blackSphereMat = new THREE.MeshStandardMaterial()
blackSphereMat.metalness = 1.0
blackSphereMat.roughness = 0.8
blackSphereMat.normalMap = sphereNormText;

blackSphereMat.color = new THREE.Color(0x292929)

// Mesh
const blackSphere = new THREE.Mesh(sphereGeometry,blackSphereMat)
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
const pyramid = new THREE.Mesh( pyramidGeometry, pyramidMaterial );
scene.add(plane)
scene.add(blackSphere)
scene.add(pyramid)
pyramid.scale.set(.4, .4, .4)
pyramid.rotation.y = Math.PI/4
pyramid.position.set(0, -.48, 12)
plane.position.y = -5


const dbPyramid = gui.addFolder('pyramid')
dbPyramid.add(pyramid.position, 'x').min(-6).max(3).step(0.01)
dbPyramid.add(pyramid.position, 'y').min(-10).max(3).step(0.01)
dbPyramid.add(pyramid.position, 'z').min(-3).max(3).step(0.01)
// dbPyramid.add(pyramid.data, 'height').min(0).max(10).step(0.01)
// dbPyramid.add(pyramid, 'radius').min(0).max(10).step(0.01)

// Lights

// Light 1
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
// scene.add(pointLight)

// Light 2
const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(-3.48, -3, -1.6)
pointLight2.intensity = .6
scene.add(pointLight2)

const light1 = gui.addFolder('Light 1')

light1.add(pointLight2.position, 'x').min(-6).max(3).step(0.01)
light1.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
light1.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)
light1.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

// const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1)
// scene.add(pointLightHelper)

// Light 3
const pointLight3 = new THREE.PointLight(0xD2AA6D, 2)
pointLight3.position.set(3, -3, 1.46)
pointLight3.intensity = 1.26
scene.add(pointLight3)

const light2 = gui.addFolder('Light 2')

light2.add(pointLight3.position, 'x').min(-6).max(3).step(0.01)
light2.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
light2.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)
light2.add(pointLight3, 'intensity').min(0).max(10).step(0.01)

const light2Color = {
    color: 0xD2AA6D
}

light2.addColor(light2Color, 'color')
    .onChange(() => {
        pointLight3.color.set(light2Color.color)
    })

// const pointLightHelper2 = new THREE.PointLightHelper(pointLight3, 1)
// scene.add(pointLightHelper2)

const sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
sunLight.position.set(0, 25, 25)
sunLight.target = pyramid
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight( 0x000000 );
scene.add(ambientLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const fov = 75;
const aspect = sizes.width / sizes.height;
const near = 0.1;
const far = 100;
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2

const controls = new OrbitControls(camera, canvas);
controls.target.set(0,0,0);
controls.update();
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)
}

const updateSphere = (event) => {
    blackSphere.position.y = window.scrollY * .001
}

window.addEventListener('scroll', updateSphere);

const clock = new THREE.Clock()

const tick = () =>
{

    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    blackSphere.rotation.y = .5 * elapsedTime
    // rock08.rotation.y = .5 * elapsedTime

    //Manual Sphere Rotation
    // sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    // sphere.rotation.x += .05 * (targetY - sphere.rotation.x)
    // sphere.position.z += -.05 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()