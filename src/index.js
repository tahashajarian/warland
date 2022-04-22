import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module";
import { Ground } from "./objects/ground";
import { Character } from "./objects/character";
import { Walls } from "./objects/walls";
import Controler from "./controler";
import SoundMagnagment from "./sound-managment";
import Enemy from "./objects/enemy";
import * as dat from 'dat.gui'
import { gsap } from 'gsap'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";




class World {
  constructor() {
    this.init();
  }

  init() {
    this.addLoadingManager()
    this.addRenderer();
    this.addScene();
    this.addOverlay()
    this.addCamera();
    this.addLight();
    this.addStats();
    this.addSound();
    this.mixers = [];
    this.gui = new dat.GUI()
    this.addControls();
    this.addEventHandler();
    this.addObjects();
    this.addSky();
    this.clock = new THREE.Clock();
    this.controler = new Controler(this);
    this.movement = this.controler.movement;
    this.score = 0;
    this.scoreElement = document.querySelector('#score')
    this.update();
  }

  addRenderer() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.canvas = document.querySelector("canvas.webgl");
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    // this.renderer.physicallyCorrectLights = true
    // this.renderer.outputEncoding = THREE.sRGBEncoding
    // this.renderer.toneMapping = THREE.ReinhardToneMapping
    // this.renderer.toneMappingExposure = 3
    // this.renderer.shadowMap.enabled = true
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  addScene() {
    this.scene = new THREE.Scene();
  }

  addCamera() {
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 7, -15);
    this.scene.add(this.camera);
  }

  addLight() {
    const directionalLight = new THREE.DirectionalLight("#ffffff", 0.8);
    // directionalLight.castShadow = true
    // directionalLight.shadow.camera.far = 15
    // directionalLight.shadow.mapSize.set(1024, 1024)
    // directionalLight.shadow.normalBias = 0.05
    directionalLight.position.set(0.25, 3, -2.25);
    const color = 0xffffff;
    const intensity = 0.8;
    const light = new THREE.AmbientLight(color, intensity);
    this.scene.add(directionalLight, light);
  }

  addStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }

  addControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    // this.controls.minDistance = 5;
    // this.controls.maxDistance = 15;
    this.controls.enablePan = false;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    // this.controls.minPolarAngle = 0.5;
    // this.controls.maxPolarAngle = Math.PI * 0.5 - 0.01;
  }


  addLoadingManager() {

    const loadingBarElement = document.querySelector('.loading-bar')
    const loadingBarElementHelp = document.querySelector('.help')
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onProgress = (itemUrl, itemsLoaded, itemsTotal) => {
      // Calculate the progress and update the loadingBarElement
      const progressRatio = itemsLoaded / itemsTotal
      loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
    this.loadingManager.onLoad = (e) => {
      console.log('loaded all asset')
      // Wait a little
      window.setTimeout(() => {

        this.loaded = true;
        this.character.start();
        // Animate overlay
        gsap.to(this.overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

        // Update loadingBarElement
        loadingBarElement.classList.add('ended')
        loadingBarElementHelp.classList.add('ended')
        loadingBarElement.style.transform = ''
      }, 500)
    }

    this.fbxLoader = new FBXLoader(this.loadingManager);
    this.fbxLoader.setPath("models/");
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
  }

  addSky() {
    this.scene.background = 0xffff99;
  }
  addOverlay() {
    const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
    this.overlayMaterial = new THREE.ShaderMaterial({
      // wireframe: true,
      transparent: true,
      uniforms:
      {
        uAlpha: { value: 1 }
      },
      vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
      fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
    })
    const overlay = new THREE.Mesh(overlayGeometry, this.overlayMaterial)
    this.scene.add(overlay)
  }

  addObjects() {
    this.ground = new Ground(this, this.scene);
    this.character = new Character(this, this.scene, this.mixers);
    this.wall = new Walls(this, this.scene);
    this.enemies = new Enemy(this, this.scene)

    setInterval(() => {
      if (!this.movement.pause) this.enemies.pawn();
    }, 5000);
  }

  addSound() {
    this.soundManagement = new SoundMagnagment(this.camera);
  }

  updateScore(score) {
    this.score += score
    this.scoreElement.innerHTML = Math.floor(this.score)
  }

  update() {
    if (!this.movement.pause) {

      this.controler.updateDisplay();
      const delta = this.clock.getDelta();
      this.controls.update();
      // const delta = clock.getDelta();
      this.renderer.render(this.scene, this.camera);
      this.stats.update();
      this.enemies.update(delta)
      this.character.update(delta);

      if (this.character.mixer) {
        this.character.mixer.update(delta);
      }

      this.processClick();
      window.requestAnimationFrame(() => this.update());
    }
  }

  addEventHandler() {
    window.addEventListener("resize", () => {
      // Update sizes
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    window.addEventListener('pointerup', (e) => {



      if (!this.clickRequest) {
        if (
          Math.abs(this.clickPosition.x - e.clientX) > 4 ||
          Math.abs(this.clickPosition.y - e.clientY) > 4
        ) {

        } else {
          this.clickRequest = true;
        }
      }
    });
    window.addEventListener('pointerdown', (e) => {
      this.clickPosition = { x: e.clientX, y: e.clientY }
    });
  }
  processClick() {
    if (this.clickRequest) {
      this.character.shoot();
      this.clickRequest = false
    }
  }
}

const world = new World();
