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
    this.planeMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 8, 3), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0.01 }))
    this.animations = [];
    // this.parent.fbxLoader.setPath("");
    this.parent.fbxLoader.load("zambia.fbx", (model) => {
      this.enemy = model;
      this.parent.fbxLoader.load("walking-zambia.fbx", (anim) => {
        this.walkingClip = anim.animations[0];
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
          zombie.model.position.x += Math.sin(angle) * .45 * delta;
          zombie.model.position.z += Math.cos(angle) * .45 * delta;
          zombie.planeMesh.position.x += Math.sin(angle) * .45 * delta;
          zombie.planeMesh.position.z += Math.cos(angle) * .45 * delta;
        } else if (zombie.status !== 'finish') {
          this.playAnimationDie(zombie, index)
        }
      })
    }
  }

  pawn() {
    if (this.parent.loaded && this.zombies.length < this.maxZomies) {
      const zombie = {}
      this.enemyCount += 1
      zombie.model = SkeletonUtils.clone(this.enemy);
      zombie.walkAnim = this.walkingClip.clone();
      zombie.dieAnim = this.dieClip.clone();
      zombie.mixer = new THREE.AnimationMixer(zombie.model);
      zombie.walkAction = zombie.mixer.clipAction(zombie.walkAnim);
      zombie.dieAction = zombie.mixer.clipAction(zombie.dieAnim);
      zombie.planeMesh = this.planeMesh.clone();
      zombie.planeMesh.status = 'alive'
      zombie.status = 'alive'
      zombie.planeMesh.myId = this.enemyCount
      zombie.myId = this.enemyCount
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


  playAnimationDie(zobmie, index) {
    // console.log('zobmie to die ', zobmie)
    zobmie.walkAction.fadeOut(this.fadeDuration);
    zobmie.dieAction.setLoop(THREE.LoopOnce, 1);

    zobmie.dieAction.clampWhenFinished = true;
    zobmie.dieAction.reset().fadeIn(this.fadeDuration).play();
    zobmie.status = 'finish'
    zobmie.mixer.addEventListener('finished', () => {
      this.finishedCallback(zobmie.model, index)
    });
  }

  finishedCallback(zombieModel, index) {
    // console.log('zombie model => ', zombieModel)
    // this.zombies.splice(index, 1)
    this.scene.remove(zombieModel)
    this.maxZomies += 1
  }

}