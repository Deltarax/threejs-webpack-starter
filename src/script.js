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
const pyramidGeometry = new THREE.ConeGeometry( 7, 7, 4, 7 );
const pillarGeometry = new THREE.CylinderGeometry( .5, .5, 4, 8);
const pillarBaseGeometry = new THREE.BoxGeometry(1.2, .25, 1.2);


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
    rock08.position.y = -5.4
    
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

const pillarMat = new THREE.MeshStandardMaterial({color: 0xCDAA6D})
const pillarBaseMat = new THREE.MeshStandardMaterial({color: 0xCDAA6D})

// Mesh
const blackSphere = new THREE.Mesh(sphereGeometry,blackSphereMat)
const blackSphere01 = new THREE.Mesh(sphereGeometry,blackSphereMat)
const blackSphere02 = new THREE.Mesh(sphereGeometry,blackSphereMat)
const blackSphere03 = new THREE.Mesh(sphereGeometry,blackSphereMat)
const blackSphere04 = new THREE.Mesh(sphereGeometry,blackSphereMat)
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
const pyramid = new THREE.Mesh( pyramidGeometry, pyramidMaterial );
scene.add(plane)
scene.add(blackSphere)
scene.add(blackSphere01)
scene.add(blackSphere02)
scene.add(blackSphere03)
scene.add(blackSphere04)
blackSphere01.scale.set(.5, .5, .5)
blackSphere02.scale.set(.5, .5, .5)
blackSphere03.scale.set(.5, .5, .5)
blackSphere04.scale.set(.5, .5, .5)
blackSphere01.position.set(-1.5, 0, 0)
blackSphere02.position.set(1.5, 0, 0)
blackSphere03.position.set(0, .5, -1.5)
blackSphere04.position.set(0, -.5, 1.5)
scene.add(pyramid)
pyramid.scale.set(.4, .4, .4)
pyramid.rotation.y = Math.PI/4
pyramid.position.set(0, -.48, 12)
plane.position.y = -5

// Creating the pillars ---
{
const pillar01 = new THREE.Mesh(pillarGeometry,pillarMat)
scene.add(pillar01)
pillar01.scale.set(.2, .2, .2)
pillar01.position.set(6, -4.2, 12)
const pillarBot01 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarBot01)
pillarBot01.position.set(6, -4.95, 12)
const pillarTop01 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarTop01)
pillarTop01.position.set(6, -3.4, 12)
pillar01.scale.set(.4, .4, .4)
pillarBot01.scale.set(.4, .4, .4)
pillarTop01.scale.set(.4, .4, .4)

const pillar02 = new THREE.Mesh(pillarGeometry,pillarMat)
scene.add(pillar02)
pillar02.scale.set(.2, .2, .2)
pillar02.position.set(6, -4.2, 10)
const pillarBot02 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarBot02)
pillarBot02.position.set(6, -4.95, 10)
const pillarTop02 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarTop02)
pillarTop02.position.set(6, -3.4, 10)
pillar02.scale.set(.4, .4, .4)
pillarBot02.scale.set(.4, .4, .4)
pillarTop02.scale.set(.4, .4, .4)

const pillar03 = new THREE.Mesh(pillarGeometry,pillarMat)
scene.add(pillar03)
pillar03.scale.set(.2, .2, .2)
pillar03.position.set(6, -4.2, 8)
const pillarBot03 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarBot03)
pillarBot03.position.set(6, -4.95, 8)
const pillarTop03 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarTop03)
pillarTop03.position.set(6, -3.4, 8)
pillar03.scale.set(.4, .4, .4)
pillarBot03.scale.set(.4, .4, .4)
pillarTop03.scale.set(.4, .4, .4)

const pillar04 = new THREE.Mesh(pillarGeometry,pillarMat)
scene.add(pillar04)
pillar04.scale.set(.2, .2, .2)
pillar04.position.set(6, -4.2, 14)
const pillarBot04 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarBot04)
pillarBot04.position.set(6, -4.95, 14)
const pillarTop04 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarTop04)
pillarTop04.position.set(6, -3.4, 14)
pillar04.scale.set(.4, .4, .4)
pillarBot04.scale.set(.4, .4, .4)
pillarTop04.scale.set(.4, .4, .4)

const pillar05 = new THREE.Mesh(pillarGeometry,pillarMat)
scene.add(pillar05)
pillar05.scale.set(.2, .2, .2)
pillar05.position.set(6, -4.2, 16)
const pillarBot05 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarBot05)
pillarBot05.position.set(6, -4.95, 16)
const pillarTop05 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarTop05)
pillarTop05.position.set(6, -3.4, 16)
pillar05.scale.set(.4, .4, .4)
pillarBot05.scale.set(.4, .4, .4)
pillarTop05.scale.set(.4, .4, .4)

const pillar06 = new THREE.Mesh(pillarGeometry,pillarMat)
scene.add(pillar06)
pillar06.scale.set(.2, .2, .2)
pillar06.position.set(-6, -4.2, 12)
const pillarBot06 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarBot06)
pillarBot06.position.set(-6, -4.95, 12)
const pillarTop06 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarTop06)
pillarTop06.position.set(-6, -3.4, 12)
pillar06.scale.set(.4, .4, .4)
pillarBot06.scale.set(.4, .4, .4)
pillarTop06.scale.set(.4, .4, .4)

const pillar07 = new THREE.Mesh(pillarGeometry,pillarMat)
scene.add(pillar07)
pillar07.scale.set(.2, .2, .2)
pillar07.position.set(-6, -4.2, 10)
const pillarBot07 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarBot07)
pillarBot07.position.set(-6, -4.95, 10)
const pillarTop07 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarTop07)
pillarTop07.position.set(-6, -3.4, 10)
pillar07.scale.set(.4, .4, .4)
pillarBot07.scale.set(.4, .4, .4)
pillarTop07.scale.set(.4, .4, .4)

const pillar08 = new THREE.Mesh(pillarGeometry,pillarMat)
scene.add(pillar08)
pillar08.scale.set(.2, .2, .2)
pillar08.position.set(-6, -4.2, 8)
const pillarBot08 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarBot08)
pillarBot08.position.set(-6, -4.95, 8)
const pillarTop08 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarTop08)
pillarTop08.position.set(-6, -3.4, 8)
pillar08.scale.set(.4, .4, .4)
pillarBot08.scale.set(.4, .4, .4)
pillarTop08.scale.set(.4, .4, .4)

const pillar09 = new THREE.Mesh(pillarGeometry,pillarMat)
scene.add(pillar09)
pillar09.scale.set(.2, .2, .2)
pillar09.position.set(-6, -4.2, 14)
const pillarBot09 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarBot09)
pillarBot09.position.set(-6, -4.95, 14)
const pillarTop09 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarTop09)
pillarTop09.position.set(-6, -3.4, 14)
pillar09.scale.set(.4, .4, .4)
pillarBot09.scale.set(.4, .4, .4)
pillarTop09.scale.set(.4, .4, .4)

const pillar10 = new THREE.Mesh(pillarGeometry,pillarMat)
scene.add(pillar10)
pillar10.scale.set(.2, .2, .2)
pillar10.position.set(-6, -4.2, 16)
const pillarBot10 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarBot10)
pillarBot10.position.set(-6, -4.95, 16)
const pillarTop10 = new THREE.Mesh(pillarBaseGeometry,pillarBaseMat)
scene.add(pillarTop10)
pillarTop10.position.set(-6, -3.4, 16)
pillar10.scale.set(.4, .4, .4)
pillarBot10.scale.set(.4, .4, .4)
pillarTop10.scale.set(.4, .4, .4)
}


const dbPyramid = gui.addFolder('pyramid')
dbPyramid.add(pyramid.position, 'x').min(-6).max(3).step(0.01)
dbPyramid.add(pyramid.position, 'y').min(-10).max(3).step(0.01)
dbPyramid.add(pyramid.position, 'z').min(-3).max(3).step(0.01)
// dbPyramid.add(pyramid.data, 'height').min(0).max(10).step(0.01)
// dbPyramid.add(pyramid, 'radius').min(0).max(10).step(0.01)

// Lights

{
// Light 1
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
// scene.add(pointLight)

// Light 2
const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(0, -1.65, 0)
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
pointLight3.position.set(0, -3, 0)
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
}


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
    blackSphere01.rotation.x = -.5 * elapsedTime
    blackSphere02.rotation.z = -.5 * elapsedTime
    blackSphere03.rotation.z = .5 * elapsedTime
    blackSphere04.rotation.x = .5 * elapsedTime
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