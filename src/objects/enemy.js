import * as THREE from 'three'
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
    this.enemyCount = 0;
    this.maxZomies = 50
    this.init()
  }

  init() {
    this.planeMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 3), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.02 }))
    this.animations = [];
    // this.parent.fbxLoader.setPath("");
    this.parent.fbxLoader.load("zambia.fbx", (model) => {
      this.enemy = model;
      this.parent.fbxLoader.load("walking-zambia.fbx", (anim) => {
        this.walkingClip = anim.animations[0];
      });
      this.parent.fbxLoader.load("Zombie Punching.fbx", (anim) => {
        this.punchClip = anim.animations[0];
      });
      this.parent.fbxLoader.load("zombia-die.fbx", (anim) => {
        this.dieClip = anim.animations[0];
      });
    });

  }

  update(delta) {
    if (this.parent.loaded) {
      this.zombies.forEach((zombie, index) => {
        zombie.mixer.update(delta)
        if (zombie.status === 'alive') {
          zombie.model.lookAt(this.parent.character.character.position);
          zombie.planeMesh.lookAt(this.parent.character.character.position);
          const angle = Math.atan2(
            this.parent.character.character.position.x - zombie.model.position.x,
            this.parent.character.character.position.z - zombie.model.position.z
          );
          if (zombie.model.position.distanceTo(this.parent.character.character.position) > 2.5) {
            this.playAnimation('walkAction', zombie)
            zombie.model.position.x += Math.sin(angle) * .45 * delta;
            zombie.model.position.z += Math.cos(angle) * .45 * delta;
            zombie.planeMesh.position.x += Math.sin(angle) * .45 * delta;
            zombie.planeMesh.position.z += Math.cos(angle) * .45 * delta;
          } else {
            this.playAnimation('punchAction', zombie)
          }
        } else if (zombie.status !== 'finish') {
          this.parent.particleSystem.initParticleSystem(zombie.model.position)
          this.playAnimation('dieAction', zombie)
        }
      })
    }
  }

  pawn() {
    if (this.parent.loaded && this.zombies.length < this.maxZomies) {
      const zombie = {}
      this.enemyCount += 1
      zombie.model = SkeletonUtils.clone(this.enemy);
      const walkAnim = this.walkingClip;
      const dieAnim = this.dieClip;
      const punchAnim = this.punchClip;
      zombie.mixer = new THREE.AnimationMixer(zombie.model);
      zombie.walkAction = zombie.mixer.clipAction(walkAnim);
      zombie.dieAction = zombie.mixer.clipAction(dieAnim);
      zombie.punchAction = zombie.mixer.clipAction(punchAnim);
      zombie.planeMesh = this.planeMesh.clone();
      zombie.planeMesh.status = 'alive'
      zombie.status = 'alive'
      zombie.planeMesh.myId = this.enemyCount
      zombie.myId = this.enemyCount
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


  playAnimation(animationName, zombie) {
    if (zombie.currentAction === animationName) return;
    const current = zombie[zombie.currentAction];
    if (current) {
      current.fadeOut(this.fadeDuration);
    }
    if (animationName === 'dieAction') {
      zombie[animationName].setLoop(THREE.LoopOnce, 1);
      zombie[animationName].clampWhenFinished = true;
      zombie.mixer.addEventListener('finished', () => {
        this.finishedCallback(zombie.model)
      });
      zombie.status = 'finish'
    }
    zombie[animationName].reset().fadeIn(this.fadeDuration).play();
    zombie.currentAction = animationName;
  }



  finishedCallback(zombieModel) {
    // console.log('zombie model => ', zombieModel)
    // this.zombies.splice(index, 1)
    this.scene.remove(zombieModel)
    this.maxZomies += 1
  }

}