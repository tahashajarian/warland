import * as THREE from 'three';

export class Walls {
  constructor(scene) {
    this.scene = scene;
    this.init();
  }

  init() {
    // console.log('im working mother fucker')
    const wall1 = wall([0, 10, 50], Math.PI)
    const wall2 = wall([50, 10, 0], -Math.PI / 2)
    const wall3 = wall([0, 10, -50], 0)
    const wall4 = wall([-50, 10, 0], Math.PI / 2)
    this.scene.add(wall1, wall2, wall3, wall4);
  }
}



const wall = (position, rotation) => {
  const wallMat = new THREE.MeshStandardMaterial({
    // roughness: 0.7,
    color: 0x888888,
    // bumpScale: 0.002,
    // metalness: 0.2
  });
  const textureLoader = new THREE.TextureLoader();

  textureLoader.load("textures/ground/brick_diffuse.jpg", function (map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(8, 2);
    map.encoding = THREE.sRGBEncoding;
    wallMat.map = map;

    wallMat.needsUpdate = true;
  });
  // textureLoader.load("/textures/ground/brick_bump.jpg", function (map) {
  //   map.wrapS = THREE.RepeatWrapping;
  //   map.wrapT = THREE.RepeatWrapping;
  //   map.anisotropy = 4;
  //   map.repeat.set(6, 2);
  //   wallMat.bumpMap = map;
  //   wallMat.needsUpdate = true;
  // });

  // textureLoader.load("/textures/ground/brick_roughness.jpg", function (map) {
  //   map.wrapS = THREE.RepeatWrapping;
  //   map.wrapT = THREE.RepeatWrapping;
  //   map.anisotropy = 4;
  //   map.repeat.set(6, 2);
  //   wallMat.roughnessMap = map;
  //   wallMat.needsUpdate = true;
  // });

  const geo = new THREE.PlaneBufferGeometry(100, 20);
  const wall = new THREE.Mesh(geo, wallMat);
  wall.position.set(...position);
  wall.rotation.y = rotation;
  return wall
}