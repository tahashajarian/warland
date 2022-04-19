import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils';



export default class Enemy {
  constructor(scene) {
    this.scene = scene
    this.mixers = []
    this.zombies = []
    this.fadeDuration = 0.2
    this.init()
  }

  init() {
    this.loadingManager = new THREE.LoadingManager();
    const loader = new FBXLoader(this.loadingManager);
    this.animations = [];
    loader.setPath("models/");
    loader.load("zambia.fbx", (model) => {
      this.enemy = model;
      // this.mixer = new THREE.AnimationMixer(model);
      // this.mixer.addEventListener('finished', () => {
      //   this.finishedCallback()
      // });

      // this.bones = {};
      // this.character.traverse(c => {
      //   if (!c.skeleton) {
      //     return;
      //   }
      //   for (let b of c.skeleton.bones) {
      //     this.bones[b.name] = b;
      //   }
      // });
      const onLoad = (anim) => {
        this.walkingClip = anim.animations[0];
        this.loaded = true
      };

      // const onLoadShtoGun = (gun) => {
      //   console.log(this.bones)
      //   // this.bones.mixamorigRightHandRing1.add(gun);
      //   this.bones.mixamorigLeftHandThumb1.add(gun);
      //   // this.bones.mixamorigRightHandIndex1.add(gun);
      // }


      loader.load("walking-zambia.fbx", (a) => {
        onLoad(a);
      });
      // loader.load("Rifle Run.fbx", (a) => {
      //   onLoad("run", a);
      // });
      // loader.load("Rifle Idle.fbx", (a) => {
      //   onLoad("idle", a);
      // });
      // loader.load("Backwards Rifle Walk.fbx", (a) => {
      //   onLoad("back", a);
      // });
      // loader.load("Rifle Side Left.fbx", (a) => {
      //   onLoad("left", a);
      // });
      // loader.load("Rifle Side Right.fbx", (a) => {
      //   onLoad("right", a);
      // });
      // loader.load("Gunplay.fbx", (a) => {
      //   onLoad("shoot", a);
      // });
      // loader.load("shotgun.fbx", (gun) => {
      //   onLoadShtoGun(gun);
      // });

      //   console.log(model)
      //   this.scene.add(model);
    });
    // this.loadingManager.onLoad = () => {
    //   this.loaded = true;
    //   this.animations[this.currentAction].action.play();
    // };
  }

  update(delta) {
    if (this.loaded) {
      this.zombies.forEach(zombie => {
        zombie.mixer.update(delta)
      })
    }
  }

  pawn() {
    if (this.loaded && this.zombies.length < 1) {
      const zombie = {}
      zombie.model = SkeletonUtils.clone(this.enemy);
      zombie.anim = this.walkingClip.clone();
      zombie.mixer = new THREE.AnimationMixer(zombie.model);
      zombie.action = zombie.mixer.clipAction(zombie.anim);
      zombie.action.fadeIn(this.fadeDuration).play();
      zombie.model.position.x = Math.random() * (100) - 50
      zombie.model.position.z = Math.random() * (100) - 50
      zombie.model.scale.setScalar(0.0075);

      // console.log('pawn enemy => ', zombie.model)
      this.scene.add(zombie.model)
      this.zombies.push(zombie)
    }
  }

}