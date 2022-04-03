import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from 'three'


export class Man {
  constructor(scene, mixers) {
    this.scene = scene;
    this.mixers = mixers;
    this.init();
  }

  init() {
    const loader = new FBXLoader();
    loader.setPath('models/');
    loader.load('man.fbx', (fbx) => {
      console.log(fbx)
      fbx.scale.setScalar(0.02);
      fbx.position.y = 0.45

      loader.load('run.fbx', (fbx_a) => {
        console.log(fbx_a)
        const mixer = new THREE.AnimationMixer(fbx);
        mixer.clipAction(fbx_a.animations[0]).play();
        this.mixers.push(mixer);
        // console.log('this => ', this)

      })
      // fbx.traverse(c => {
      //   c.castShadow = true;
      // });
      this.scene.add(fbx)
    })
  }
}