import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Ground } from "./objects/ground";
import { Character } from "./objects/character";
import { Walls } from "./objects/walls";
import Controler from "./controler";
import SoundMagnagment from "./sound-managment";
import Enemy from "./objects/enemy";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import ParticleSystem from "./particle-system";
import { GAME_CONFIG } from "./config";




class World {
  constructor() {
    this.init();
  }

  init() {
    this.state = 'loading';
    this.health = GAME_CONFIG.playerHealth;
    this.addLoadingManager()
    this.addRenderer();
    this.addScene();
    this.addOverlay()
    this.addCamera();
    this.addLight();
    this.addSound();
    this.mixers = [];
    this.addControls();
    this.addEventHandler();
    this.addObjects();
    this.addSky();
    this.clock = new THREE.Clock();
    this.controler = new Controler(this);
    this.particleSystem = new ParticleSystem(this)
    this.movement = this.controler.movement;
    this.score = 0;
    this.scoreElement = document.querySelector('#score')
    this.healthElement = document.querySelector('#health')
    this.statusElement = document.querySelector('#status')
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
    const { x, y, z } = GAME_CONFIG.cameraPosition;
    this.camera.position.set(x, y, z);
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

  addControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.target.set(0, GAME_CONFIG.cameraTargetHeight, 0);
    this.controls.enableDamping = true;
    this.controls.minDistance = GAME_CONFIG.cameraMinDistance;
    this.controls.maxDistance = GAME_CONFIG.cameraMaxDistance;
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
    this.loadingManager.onLoad = () => {
      // Wait a little
      window.setTimeout(() => {

        this.loaded = true;
        this.state = 'playing';
        this.character.start();
        this.overlayFadeStart = performance.now() + 1000;

        // Update loadingBarElement
        loadingBarElement.classList.add('ended')
        loadingBarElementHelp.classList.add('ended')
        loadingBarElement.style.transform = ''
        const arrows = document.getElementsByClassName('buttons');
        const scoreorad = document.querySelector('.score-board')
        if (scoreorad) scoreorad.style.display = 'block'
        if (arrows) {
          for (let i = 0; i < arrows.length; i++) {
            const element = arrows[i];
            element.style.display = 'block'
          }
        }
      }, 500)
    }
    this.loadingManager.onError = (url) => {
      this.state = 'error';
      loadingBarElementHelp.classList.add('error')
      loadingBarElementHelp.textContent = `Unable to load ${url}. Please refresh and try again.`
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
      if (this.state === 'playing') this.enemies.spawn();
    }, GAME_CONFIG.enemySpawnIntervalMs);
  }

  addSound() {
    this.soundManagement = new SoundMagnagment(this.camera, this.loadingManager);
  }

  updateScore(score) {
    this.score += score
    this.scoreElement.innerHTML = Math.floor(this.score)
  }

  damagePlayer(amount) {
    if (this.state !== 'playing') return
    this.health = Math.max(0, this.health - amount)
    this.healthElement.textContent = this.health
    if (this.health === 0) {
      this.state = 'gameOver'
      this.movement.pause = true
      this.statusElement.textContent = 'Game over — refresh to restart'
      this.statusElement.hidden = false
    }
  }

  setPaused(paused) {
    if (this.state === 'gameOver' || this.state === 'loading') return
    this.movement.pause = paused
    this.state = paused ? 'paused' : 'playing'
    this.statusElement.textContent = paused ? 'Paused' : ''
    this.statusElement.hidden = !paused
    this.clock.getDelta()
  }

  update() {
    window.requestAnimationFrame(() => this.update());
    const rawDelta = this.clock.getDelta();
    const delta = Math.min(rawDelta, GAME_CONFIG.maxDelta);
    if (this.state === 'playing') {
      this.controler.updateDisplay();
      const elapsedTime = this.clock.getElapsedTime()
      this.enemies.update(delta)
      this.character.update(delta);
      this.particleSystem.update(delta, elapsedTime)

      if (this.character.mixer) {
        this.character.mixer.update(delta);
      }

      this.processClick();
    }
    if (this.overlayFadeStart) {
      const progress = Math.min(1, (performance.now() - this.overlayFadeStart) / 3000)
      if (progress >= 0) this.overlayMaterial.uniforms.uAlpha.value = 1 - progress
      if (progress === 1) this.overlayFadeStart = null
    }
    this.controls.enabled = this.state === 'playing'
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
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


      if (!this.clickRequest && this.state === 'playing') {
        if (performance.now() - this.clickDownTime > 500) return
        if (
          Math.abs(this.clickPosition.x - e.clientX) > 2 ||
          Math.abs(this.clickPosition.y - e.clientY) > 2
        ) {

        } else {
          this.clickRequest = true;
        }
      }
    });
    window.addEventListener('pointerdown', (e) => {
      this.clickDownTime = performance.now()
      this.clickPosition = { x: e.clientX, y: e.clientY }
    });
    document.addEventListener('contextmenu', event => event.preventDefault());

  }
  processClick() {
    if (this.clickRequest) {
      this.character.shoot();
      this.clickRequest = false
    }
  }
}

const world = new World();
