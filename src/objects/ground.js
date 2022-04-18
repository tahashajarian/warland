import * as THREE from 'three'

export class Ground {
  constructor(scene) {
    this.scene = scene
    this.init();

  }
  init() {


    const textureLoader = new THREE.TextureLoader();



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


    // for (let i = -4; i < 4; i++) {
    //   for (let j = -4; j < 4; j++) {
    //     const floorMaterial = new THREE.MeshStandardMaterial({
    //       roughness: 1,
    //       // color: 0xffffff,
    //       metalness: 0.5,
    //       bumpScale: 0.5
    //     });
    //     textureLoader.load("textures/ground/Diffuse.jpg", function (map) {
    //       map.wrapS = THREE.RepeatWrapping;
    //       map.wrapT = THREE.RepeatWrapping;
    //       map.anisotropy = 16;
    //       // map.repeat.set(1, 1);
    //       map.rotation = Math.random()
    //       // map.rotation = Math.PI / 4;
    //       map.center = new THREE.Vector2(0.5, 0.5);
    //       // // map.encoding = THREE.sRGBEncoding;
    //       floorMaterial.map = map;
    //       floorMaterial.needsUpdate = true;
    //     });
    //     const geo = new THREE.PlaneBufferGeometry(16, 16)
    //     const ground = new THREE.Mesh(geo, floorMaterial)
    //     ground.rotation.x = -Math.PI / 2;
    //     ground.position.x = j * 16 + 8
    //     ground.position.z = i * 16 + 8
    //     this.scene.add(ground)
    //   }
    // }

    const floorMaterial = new THREE.MeshStandardMaterial({
    });
    textureLoader.load("textures/ground/mud.jpg", function (map) {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set(8, 8);
      // map.rotation = Math.random()
      // map.rotation = Math.PI / 4;
      // map.center = new THREE.Vector2(0.5, 0.5);
      // map.encoding = THREE.sRGBEncoding;
      floorMaterial.map = map;
      floorMaterial.needsUpdate = true;
    });

    const ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), floorMaterial)
    ground.rotation.x = -Math.PI / 2;

    this.scene.add(ground)

  }
}