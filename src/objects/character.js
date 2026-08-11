import * as THREE from "three";
import { GAME_CONFIG } from "../config";

export class Character {
  constructor(parent, scene, mixers) {
    this.parent = parent;
    this.scene = scene;
    this.currentAction = "idle";
    this.fadeDuration = 0.2;
    this.rotateAngle = new THREE.Vector3(0, 1, 0);
    this.walkDirection = new THREE.Vector3();
    this.rotateQuarternion = new THREE.Quaternion();
    this.cameraTarget = new THREE.Vector3();

    this.runVelocity = GAME_CONFIG.runVelocity;
    this.walkVelocity = GAME_CONFIG.walkVelocity;
    this.gunRotateAxis = {
      "x": 0.91,
      "y": 3.14,
      "z": 0.21
    }
    this.gunPostitionAxis = {
      "x": -8.67,
      "y": 0,
      "z": 0
    }
    this._vector = new THREE.Vector3();
    this._rayOrigin = new THREE.Vector3();
    this._rayDirection = new THREE.Vector3();
    this._aimTarget = new THREE.Vector3();

    this.init();
    this.addAim();

  }

  init() {
    // this.rotaionGUI = this.parent.gui.addFolder('rotation')
    // this.positionGUI = this.parent.gui.addFolder('postion')
    // this.rotaionGUI.add(this.gunRotateAxis, 'x').min(-Math.PI).max(Math.PI).step(0.01).onChange((c) => {
    //   this.rotateGun()
    // })
    // this.rotaionGUI.add(this.gunRotateAxis, 'y').min(-Math.PI).max(Math.PI).step(0.01).onChange((c) => {
    //   this.rotateGun()
    // })
    // this.rotaionGUI.add(this.gunRotateAxis, 'z').min(-Math.PI).max(Math.PI).step(0.01).onChange((c) => {
    //   this.rotateGun()
    // })

    // this.positionGUI.add(this.gunPostitionAxis, 'x').min(-100).max(100).step(0.01).onChange((c) => {
    //   this.rotateGun()
    // })
    // this.positionGUI.add(this.gunPostitionAxis, 'y').min(-100).max(100).step(0.01).onChange((c) => {
    //   this.rotateGun()
    // })
    // this.positionGUI.add(this.gunPostitionAxis, 'z').min(-100).max(100).step(0.01).onChange((c) => {
    //   this.rotateGun()
    // })

    this.amiDistance = 15;
    this.raycaster = new THREE.Raycaster()
    this.animations = [];
    this.parent.fbxLoader.load("theboss.fbx", (model) => {
      this.character = model;
      this.character.traverse(c => {
        if (c.material && c.material.map) {
          c.material.map.encoding = THREE.LinearEncoding;
        }
      });
      this.character.scale.setScalar(0.02);
      this.mixer = new THREE.AnimationMixer(model);
      this.mixer.addEventListener('finished', () => {
        this.finishedCallback()
      });

      this.bones = {};
      this.character.traverse(c => {
        if (!c.skeleton) {
          return;
        }
        for (let b of c.skeleton.bones) {
          this.bones[b.name] = b;
        }
      });
      const onLoad = (animName, anim) => {
        const clip = anim.animations[0];
        const action = this.mixer.clipAction(clip);

        this.animations[animName] = {
          // clip: clip,
          action: action,
        };
      };

      const onLoadShtoGun = (gun) => {
        this.gun = gun
        // console.log(this.bones)
        // this.bones.mixamorigRightHandRing1.add(gun);
        this.bones.bossRightHandThumb1.add(gun);
        this.rotateGun()

        // this.bones.mixamorigRightHandIndex1.add(gun);
      }


      this.parent.fbxLoader.load("Rifle Walk.fbx", (a) => {
        onLoad("walk", a);
      });
      this.parent.fbxLoader.load("Rifle Run.fbx", (a) => {
        onLoad("run", a);
      });
      this.parent.fbxLoader.load("Rifle Idle.fbx", (a) => {
        onLoad("idle", a);
      });
      this.parent.fbxLoader.load("Backwards Rifle Walk.fbx", (a) => {
        onLoad("back", a);
      });
      this.parent.fbxLoader.load("Gunplay.fbx", (a) => {
        onLoad("shoot", a);
      });
      this.parent.fbxLoader.load("shotgun.fbx", (gun) => {
        onLoadShtoGun(gun);
      });

      // console.log(model)
      this.scene.add(model);
    });
    // this.parent.loadingManager.onLoad = () => {
    //   this.parent.loaded = true;
    //   this.animations[this.currentAction].action.play();
    // };
  }

  rotateGun() {


    this.gun.rotation.set(
      this.gunRotateAxis.x,
      this.gunRotateAxis.y,
      this.gunRotateAxis.z
    )

    this.gun.position.x = this.gunPostitionAxis.x
    this.gun.position.y = this.gunPostitionAxis.y
    this.gun.position.z = this.gunPostitionAxis.z

    this.gun.scale.setScalar(0.8);

    // this.gun.lookAt(this.aim.position)

  }


  start() {
    this.animations[this.currentAction].action.play();
  }

  update(delta) {
    if (this.parent.loaded && this.currentAction === 'shoot') {
      const shootAction = this.animations.shoot.action
      if (!this.shotSoundPlayed && shootAction.time >= GAME_CONFIG.shotSoundDelayMs / 1000) {
        this.parent.soundManagement.playShot()
        this.shotSoundPlayed = true
      }
      if (!this.shotResolved && shootAction.time >= GAME_CONFIG.shotFireDelayMs / 1000) {
        this.resolveShot()
      }
      return
    }
    if (this.parent.loaded && this.currentAction !== 'shoot') {
      this._rayOrigin.set(this.character.position.x, 1, this.character.position.z)
      this.parent.camera.getWorldDirection(this._rayDirection)
      this._rayDirection.y = 0
      this._rayDirection.normalize()
      this.raycaster.set(this._rayOrigin, this._rayDirection)
      const targets = [...this.parent.wall.meshes, ...this.parent.enemies.zombies.map(zombie => zombie.planeMesh)]
      const intersects = this.raycaster.intersectObjects(targets);
      const isTargetingZombie = intersects[0] && intersects[0].object.status === 'alive'
      this.aim.material.color.setHex(isTargetingZombie ? 0xff3030 : 0xffffff)

      if (intersects && intersects[0] && intersects[0].distance) {
        this.amiDistance = Math.max(1, intersects[0].distance - 0.5)
      } else {
        this.amiDistance = 15
      }

      this.rotateAndMoveAim(delta);
      if (this.parent.movement.forward) {
        if (this.parent.movement.shift) {
          this.playAnimation("run");
        } else {
          this.playAnimation("walk");
        }
      }
      if (this.parent.movement.back) {
        this.playAnimation("back");
      }

      if (
        !this.parent.movement.forward &&
        !this.parent.movement.back
      ) {
        this.playAnimation("idle");
      }
      if (this.parent.movement.right) {
        this.rotateCamera(true, delta)
      }
      if (this.parent.movement.left) {
        this.rotateCamera(false, delta)
      }
      this.rotateCharacter(delta);
    }
  }

  playAnimation(animation) {
    if (animation === this.currentAction) return;
    const toPlay = this.animations[animation].action;
    const current = this.animations[this.currentAction].action;
    if (animation === 'shoot') {
      this.pendingShotRay = this.raycaster.ray.clone()
      this.shotSoundPlayed = false
      this.shotResolved = false
      toPlay.setLoop(THREE.LoopOnce, 1);
      toPlay.clampWhenFinished = true;
    }
    current.fadeOut(this.fadeDuration);
    toPlay.reset().fadeIn(this.fadeDuration).play();
    this.currentAction = animation;
  }

  resolveShot() {
    this.shotResolved = true
    const shotRaycaster = new THREE.Raycaster(
      this.pendingShotRay.origin,
      this.pendingShotRay.direction
    )
    const enemyTargets = this.parent.enemies.zombies
      .filter(zombie => zombie.status === 'alive')
      .map(zombie => zombie.planeMesh)
    const [hit] = shotRaycaster.intersectObjects([
      ...this.parent.wall.meshes,
      ...enemyTargets,
    ])
    if (!hit || hit.object.status !== 'alive') return

    const dead = this.parent.enemies.zombies.find(
      zombie => zombie.myId === hit.object.myId
    )
    if (dead) {
      dead.status = 'dead'
      this.scene.remove(hit.object)
      this.parent.updateScore(hit.distance)
    }
  }



  rotateAndMoveAim(delta) {
    this._aimTarget.set(this.character.position.x, 2, this.character.position.z)
    this.aim.lookAt(this._aimTarget)
    // this.aim.position.set(this.character.position.x, 2.5, this.character.position.z + 10)
    const y = this.character.rotation.y
    if (this.character.rotation.x < 0) {
      this.aim.position.x = Math.sin(Math.abs(y - Math.PI / 2) + Math.PI / 2) * this.amiDistance + this.character.position.x;
      this.aim.position.z = Math.cos(Math.abs(y - Math.PI / 2) + Math.PI / 2) * this.amiDistance + this.character.position.z;
    } else {
      this.aim.position.x = Math.sin(y) * this.amiDistance + this.character.position.x;
      this.aim.position.z = Math.cos(y) * this.amiDistance + this.character.position.z;
    }
  }

  rotateCharacter(delta) {
    // console.log(this.character.position)
    // if (this.currentAction === 'idle') return;
    const angleYCameraDirection = Math.atan2(
      this.parent.camera.position.x - this.character.position.x,
      this.parent.camera.position.z - this.character.position.z
    );
    this.rotateQuarternion.setFromAxisAngle(
      this.rotateAngle,
      angleYCameraDirection + Math.PI
    );
    this.character.quaternion.rotateTowards(this.rotateQuarternion, 0.2);

    if (this.currentAction !== "idle") {
      this.parent.camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      // this.walkDirection.applyAxisAngle(this.rotateAngle, Math.PI);
      const velocity =
        this.currentAction == "run" ? this.runVelocity : this.walkVelocity;

      // move model & camera
      if (this.parent.movement.forward) {
        this.walkDirection.applyAxisAngle(this.rotateAngle, Math.PI);
        let moveX = this.walkDirection.x * velocity * delta;
        let moveZ = this.walkDirection.z * velocity * delta;
        this.character.position.x -= moveX;
        this.character.position.z -= moveZ;
        this.parent.camera.position.x -= moveX;
        this.parent.camera.position.z -= moveZ;
      }
      if (this.parent.movement.back) {
        this.walkDirection.applyAxisAngle(this.rotateAngle, -Math.PI);
        let moveX = this.walkDirection.x * velocity * delta;
        let moveZ = this.walkDirection.z * velocity * delta;
        this.character.position.x += moveX / 2;
        this.character.position.z += moveZ / 2;
        this.parent.camera.position.x += moveX / 2;
        this.parent.camera.position.z += moveZ / 2;
      }

      const halfSize = GAME_CONFIG.arenaHalfSize
      const clampedX = THREE.MathUtils.clamp(this.character.position.x, -halfSize, halfSize)
      const clampedZ = THREE.MathUtils.clamp(this.character.position.z, -halfSize, halfSize)
      this.parent.camera.position.x += clampedX - this.character.position.x
      this.parent.camera.position.z += clampedZ - this.character.position.z
      this.character.position.x = clampedX
      this.character.position.z = clampedZ

      this.updateCameraTarget();
    }
  }


  rotateCamera(right, delta) {
    this._vector.setFromMatrixColumn(this.parent.camera.matrix, 0);

    this.parent.camera.position.addScaledVector(this._vector, (right ? -1 : 1) * 12 * delta);

  }

  updateCameraTarget(moveX, moveZ) {
    // update camera target
    this.cameraTarget.x = this.character.position.x;
    this.cameraTarget.y = this.character.position.y + GAME_CONFIG.cameraTargetHeight;
    this.cameraTarget.z = this.character.position.z;
    this.parent.controls.target = this.cameraTarget;
  }

  shoot() {
    if (this.parent.loaded) {
      this.parent.soundManagement.unlock();
      this.playAnimation("shoot");
    }
  }

  finishedCallback() {
    this.playAnimation("idle");
  }


  addAim() {
    const geo = new THREE.PlaneBufferGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      side: THREE.DoubleSide
    })

    this.parent.textureLoader.load("textures/aim.png", function (map) {
      material.map = map;
      material.needsUpdate = true;
    });
    this.aim = new THREE.Mesh(geo, material);
    this.aim.position.set(0, 2.1, 5)
    this.scene.add(this.aim)
  }

}
