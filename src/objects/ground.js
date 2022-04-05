import * as THREE from 'three'

export class Ground {
  constructor(scene) {
    this.scene = scene
    this.init();

  }
  init() {


    const textureLoader = new THREE.TextureLoader();

    const floorMaterial = new THREE.MeshStandardMaterial({
      roughness: 1,
      // color: 0xffffff,
      metalness: 0.5,
      bumpScale: 0.5
    });


    // textureLoader.load("textures/ground/hardwood2_diffuse.jpg", function (map) {
    //   map.wrapS = THREE.RepeatWrapping;
    //   map.wrapT = THREE.RepeatWrapping;
    //   map.anisotropy = 4;
    //   map.repeat.set(32, 64);
    //   map.encoding = THREE.sRGBEncoding;
    //   floorMaterial.map = map;
    //   floorMaterial.needsUpdate = true;
    // });
    // textureLoader.load("textures/ground/hardwood2_bump.jpg", function (map) {
    //   map.wrapS = THREE.RepeatWrapping;
    //   map.wrapT = THREE.RepeatWrapping;
    //   map.anisotropy = 4;
    //   map.repeat.set(32, 64);
    //   floorMaterial.bumpMap = map;
    //   floorMaterial.needsUpdate = true;
    // });
    // textureLoader.load("textures/ground/hardwood2_roughness.jpg", function (map) {
    //   map.wrapS = THREE.RepeatWrapping;
    //   map.wrapT = THREE.RepeatWrapping;
    //   map.anisotropy = 4;
    //   map.repeat.set(32, 64);
    //   floorMaterial.roughnessMap = map;
    //   floorMaterial.needsUpdate = true;
    // });

    textureLoader.load("textures/ground/dust.jpg", function (map) {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set(16, 16);
      // map.encoding = THREE.sRGBEncoding;
      floorMaterial.map = map;
      floorMaterial.needsUpdate = true;
    });

    // textureLoader.load("textures/ground/Roughness.jpg", function (map) {
    //   map.wrapS = THREE.RepeatWrapping;
    //   map.wrapT = THREE.RepeatWrapping;
    //   map.anisotropy = 4;
    //   map.repeat.set(8, 8);
    //   floorMaterial.roughnessMap = map;
    //   floorMaterial.needsUpdate = true;
    // });

    // textureLoader.load("textures/ground/Gloss.jpg", function (map) {
    //   map.wrapS = THREE.RepeatWrapping;
    //   map.wrapT = THREE.RepeatWrapping;
    //   map.anisotropy = 4;
    //   map.repeat.set(8, 8);
    //   floorMaterial.bumpMap = map;
    //   floorMaterial.needsUpdate = true;
    // });


    // textureLoader.load("textures/ground/Displacement.jpg", function (map) {
    //   map.wrapS = THREE.RepeatWrapping;
    //   map.wrapT = THREE.RepeatWrapping;
    //   map.anisotropy = 4;
    //   map.repeat.set(8, 8);
    //   floorMaterial.displacementMap = map;
    //   floorMaterial.needsUpdate = true;
    // });


    // textureLoader.load("textures/ground/Normal.jpg", function (map) {
    //   map.wrapS = THREE.RepeatWrapping;
    //   map.wrapT = THREE.RepeatWrapping;
    //   map.anisotropy = 4;
    //   map.repeat.set(8, 8);
    //   floorMaterial.normalMap = map;
    //   floorMaterial.needsUpdate = true;
    // });

    // textureLoader.load("textures/ground/AO.jpg", function (map) {
    //   map.wrapS = THREE.RepeatWrapping;
    //   map.wrapT = THREE.RepeatWrapping;
    //   map.anisotropy = 4;
    //   map.repeat.set(8, 8);
    //   floorMaterial.aoMap = map;
    //   floorMaterial.needsUpdate = true;
    // });


    const geo = new THREE.PlaneBufferGeometry(100, 100, 1, 1)
    this.ground = new THREE.Mesh(geo, floorMaterial)
    this.ground.rotation.x = -Math.PI / 2;
    // this.ground.receiveShadow = true;
    this.scene.add(this.ground)
  }
}