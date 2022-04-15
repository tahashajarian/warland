import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as THREE from 'three'


export class Man {
  constructor(parrent, scene, mixers) {
    this.parrent = parrent;
    this.scene = scene;
    this.mixers = mixers;
    this.currentAction = 'idle'
    this.fadeDuration = 0.5
    this.init();
  }

  init() {
    this.loadingManager = new THREE.LoadingManager();
    const loader = new FBXLoader(this.loadingManager);
    this.animations = []
    loader.setPath('models/');
    loader.load('man.fbx', (fbx) => {
      this.character = fbx;
      fbx.scale.setScalar(0.02);
      const mixer = new THREE.AnimationMixer(fbx);
      // loader.load('idle2.fbx', (fbx_a) => {
      //   console.log(fbx_a)
      //   mixer.clipAction(fbx_a.animations[0]).play();
      //   this.mixers.push(mixer);
      // })
      const onLoad = (animName, anim) => {
        const clip = anim.animations[0];
        const action = mixer.clipAction(clip);

        this.animations[animName] = {
          // clip: clip,
          action: action,
        };
      };

      this.mixers.push(mixer);


      loader.load('walk.fbx', (a) => { onLoad('walk', a); });
      loader.load('run.fbx', (a) => { onLoad('run', a); });
      loader.load('idle.fbx', (a) => { onLoad('idle', a); });
      loader.load('idle2.fbx', (a) => { onLoad('idle2', a); });
      loader.load('reverse.fbx', (a) => { onLoad('reverse', a); });

      this.scene.add(fbx)
    })
    this.loadingManager.onLoad = () => {
      this.loaded = true;
      this.animations[this.currentAction].action.play();
    };
  }
  update(delta) {
    // if (this.loaded) {
    //   this.animations[this.currentAction].action.play()
    // }

    if (this.loaded) {

      if (this.parrent.movement.forward) {
        if (this.parrent.movement.shift) {
          this.playAnimation('run')
        } else {
          this.playAnimation('walk')
        }
      }
      if (!this.parrent.movement.forward) {
        this.playAnimation('idle')
      }

    }
  }

  playAnimation(animation) {
    if (animation === this.currentAction) return;
    const toPlay = this.animations[animation].action
    const current = this.animations[this.currentAction].action

    current.fadeOut(this.fadeDuration)
    toPlay.reset().fadeIn(this.fadeDuration).play();

    this.currentAction = animation
  }
}