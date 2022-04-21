import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils';
import { randomNumber } from '../random-between';



export default class Enemy {
  constructor(parent, scene) {
    this.scene = scene
    this.mixers = []
    this.zombies = []
    this.fadeDuration = 0.2
    this.parent = parent
    this.rotateAngle = new THREE.Vector3(0, 1, 0);
    this.init()
  }

  init() {
    this.planeMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 3), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0.01 }))
    this.loadingManager = new THREE.LoadingManager();
    const loader = new FBXLoader(this.loadingManager);
    this.animations = [];
    loader.setPath("models/");
    loader.load("zambia.fbx", (model) => {
      this.enemy = model;
      // this.enemy.traverse(c => {
      //   console.log('from enemy => ', c)

      //   if (c.material && c.material.map) {
      //     c.material.map.encoding = THREE.LinearEncoding;

      //   }
      // });
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


      // const onLoadShtoGun = (gun) => {
      //   console.log(this.bones)
      //   // this.bones.mixamorigRightHandRing1.add(gun);
      //   this.bones.mixamorigLeftHandThumb1.add(gun);
      //   // this.bones.mixamorigRightHandIndex1.add(gun);
      // }


      loader.load("walking-zambia.fbx", (anim) => {
        this.walkingClip = anim.animations[0];
      });

      loader.load("zombia-die.fbx", (anim) => {
        this.dieClip = anim.animations[0];
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
    this.loadingManager.onLoad = () => {
      this.loaded = true;
    };
  }

  update(delta) {
    if (this.loaded) {
      this.zombies.forEach(zombie => {
        zombie.mixer.update(delta)
        if (zombie.status === 'alive') {
          zombie.model.lookAt(this.parent.character.character.position);
          zombie.planeMesh.lookAt(this.parent.character.character.position);
          const angle = Math.atan2(
            this.parent.character.character.position.x - zombie.model.position.x,
            this.parent.character.character.position.z - zombie.model.position.z
          );
          zombie.model.position.x += Math.sin(angle) * .45 * delta;
          zombie.model.position.z += Math.cos(angle) * .45 * delta;
          zombie.planeMesh.position.x += Math.sin(angle) * .45 * delta;
          zombie.planeMesh.position.z += Math.cos(angle) * .45 * delta;
        } else if (zombie.status !== 'finish') {
          this.playAnimationDie(zombie)
        }
      })
    }
  }

  pawn() {
    if (this.loaded && this.zombies.length < 10) {
      const zombie = {}
      zombie.model = SkeletonUtils.clone(this.enemy);
      zombie.walkAnim = this.walkingClip.clone();
      zombie.dieAnim = this.dieClip.clone();
      zombie.mixer = new THREE.AnimationMixer(zombie.model);
      zombie.walkAction = zombie.mixer.clipAction(zombie.walkAnim);
      zombie.dieAction = zombie.mixer.clipAction(zombie.dieAnim);
      zombie.planeMesh = this.planeMesh.clone();
      zombie.planeMesh.status = 'alive'
      zombie.status = 'alive'
      zombie.planeMesh.myId = this.zombies.length
      zombie.model.myId = this.zombies.length
      zombie.walkAction.fadeIn(this.fadeDuration).play();
      if (Math.random() < 0.5) {
        const random = Math.random()
        const randombewen = randomNumber(-50, 50)
        zombie.model.position.x = random < 0.5 ? -50 : 50
        zombie.model.position.z = randombewen
        zombie.planeMesh.position.x = (random < 0.5 ? -49 : 50)
        zombie.planeMesh.position.z = randombewen
      } else {
        const random = Math.random()
        const randombewen = randomNumber(-50, 50)
        zombie.model.position.x = randombewen
        zombie.model.position.z = random < 0.5 ? -50 : 50

        zombie.planeMesh.position.x = randombewen
        zombie.planeMesh.position.z = random < 0.5 ? -50 : 50
      }
      zombie.model.scale.setScalar(0.0075);

      // console.log('pawn enemy => ', zombie.model)
      this.scene.add(zombie.model)
      this.scene.add(zombie.planeMesh)
      this.zombies.push(zombie)
    }
  }


  playAnimationDie(zobmie) {
    // console.log('zobmie to die ', zobmie)
    zobmie.walkAction.fadeOut(this.fadeDuration);
    zobmie.dieAction.setLoop(THREE.LoopOnce, 1);

    zobmie.dieAction.clampWhenFinished = true;
    zobmie.dieAction.reset().fadeIn(this.fadeDuration).play();
    zobmie.status = 'finish'
    zobmie.mixer.addEventListener('finished', () => {
      this.finishedCallback(zobmie.model)
    });
  }

  finishedCallback(zombieModel) {
    // console.log('zombie model => ', zombieModel)
    zombieModel.clear()
  }

}