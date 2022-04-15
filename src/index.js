import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Ground } from './objects/ground';
import { Man } from './objects/man';
import { Walls } from './objects/walls';
import Controler from './controler';


class World {
  constructor() {
    this.init();
  }

  init() {
    this.addRenderer();
    this.addScene()
    this.addCamera()
    this.addLight()
    this.addStats();
    this.mixers = [];
    this.addControls();
    this.addEventHandler()
    this.addObjects()
    this.addSky()
    this.clock = new THREE.Clock()
    this.controler = new Controler()
    this.update();
  }

  addRenderer() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    this.canvas = document.querySelector('canvas.webgl')
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    // this.renderer.physicallyCorrectLights = true
    // this.renderer.outputEncoding = THREE.sRGBEncoding
    // this.renderer.toneMapping = THREE.ReinhardToneMapping
    // this.renderer.toneMappingExposure = 3
    // this.renderer.shadowMap.enabled = true
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  addScene() {
    this.scene = new THREE.Scene();
  }

  addCamera() {
    this.camera = new THREE.PerspectiveCamera(20, this.sizes.width / this.sizes.height, 0.1, 1000)
    this.camera.position.set(0, 5, -40)
    this.scene.add(this.camera)
  }



  addLight() {
    const directionalLight = new THREE.DirectionalLight('#ffffff', 0.8)
    // directionalLight.castShadow = true
    // directionalLight.shadow.camera.far = 15
    // directionalLight.shadow.mapSize.set(1024, 1024)
    // directionalLight.shadow.normalBias = 0.05
    directionalLight.position.set(0.25, 3, - 2.25)
    const color = 0xFFFFFF;
    const intensity = 0.8;
    const light = new THREE.AmbientLight(color, intensity);
    this.scene.add(directionalLight, light);
  }


  addStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }

  addControls() {
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.controls.enableDamping = true;
    // this.controls.minDistance = 5;
    // this.controls.maxDistance = 15;
    this.controls.enablePan = false;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    // this.controls.minPolarAngle = 0.5;
    // this.controls.maxPolarAngle = Math.PI * 0.5 - 0.01;
  }


  addSky() {
    this.scene.background = 0xffff99;

  }

  addObjects() {
    this.ground = new Ground(this.scene);
    this.man = new Man(this.scene, this.mixers)
    this.wall = new Walls(this.scene)

  }

  update() {
    this.controls.update()
    // const delta = clock.getDelta();
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(() => this.update())
    this.stats.update();
    const delta = this.clock.getDelta();
    this.man.update(delta);
    this.controler.updateDisplay();

    for (let i = 0; i < this.mixers.length; i++) {
      const mixer = this.mixers[i];
      mixer.update(delta);
    }
  }

  addEventHandler() {
    window.addEventListener('resize', () => {
      // Update sizes
      this.sizes.width = window.innerWidth
      this.sizes.height = window.innerHeight

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  }

}

const world = new World();
