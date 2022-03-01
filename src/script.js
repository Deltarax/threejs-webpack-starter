//NOTE - A lot of the starter code in this assignment and folder
// was taken from https://github.com/designcourse/threejs-webpack-starter
// https://threejs-journey.xyz/
// and this video tutorial: https://www.youtube.com/watch?v=pUgWfqWZWmM
// I do not take credit for the starter code!

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Loading
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const normalTexture = textureLoader.load('/textures/NormalMap.png')
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
const sphereGeometry = new THREE.SphereBufferGeometry(.5, 64, 64)
const planeGeometry = new THREE.BoxGeometry(50, .01, 50);


// Materials

const planeMaterial = new THREE.MeshBasicMaterial({color: 0xCDAA6D});
const blackSphereMat = new THREE.MeshStandardMaterial()
blackSphereMat.metalness = 0.7
blackSphereMat.roughness = 0.2
blackSphereMat.normalMap = normalTexture;

blackSphereMat.color = new THREE.Color(0x292929)

// Mesh
const blackSphere = new THREE.Mesh(sphereGeometry,blackSphereMat)
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
scene.add(blackSphere)
plane.position.y = -5

// Lights

// Light 1
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// Light 2
const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(-1.9, 1, -1.6)
pointLight2.position.intensity = 10
scene.add(pointLight2)

const light1 = gui.addFolder('Light 1')

light1.add(pointLight2.position, 'x').min(-6).max(3).step(0.01)
light1.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
light1.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)
light1.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

// const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1)
// scene.add(pointLightHelper)

// Light 3
const pointLight3 = new THREE.PointLight(0x2dff, 2)
pointLight3.position.set(3, -2.84, -0.19)
pointLight3.position.intensity = 6.66
scene.add(pointLight3)

const light2 = gui.addFolder('Light 2')

light2.add(pointLight3.position, 'x').min(-6).max(3).step(0.01)
light2.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
light2.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)
light2.add(pointLight3, 'intensity').min(0).max(10).step(0.01)

const light2Color = {
    color: 0xff0000
}

light2.addColor(light2Color, 'color')
    .onChange(() => {
        pointLight3.color.set(light2Color.color)
    })

// const pointLightHelper2 = new THREE.PointLightHelper(pointLight3, 1)
// scene.add(pointLightHelper2)

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