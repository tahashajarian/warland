import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";

export class Character {
  constructor(parrent, scene, mixers) {
    this.parrent = parrent;
    this.scene = scene;
    this.currentAction = "idle";
    this.fadeDuration = 0.2;
    this.rotateAngle = new THREE.Vector3(0, 1, 0);
    this.walkDirection = new THREE.Vector3();
    this.rotateQuarternion = new THREE.Quaternion();
    this.cameraTarget = new THREE.Vector3();

    this.runVelocity = 6;
    this.walkVelocity = 3;
    this.init();
    this.addAim();
  }

  init() {
    this.amiDistance = 15;
    this.loadingManager = new THREE.LoadingManager();
    const loader = new FBXLoader(this.loadingManager);
    this.animations = [];
    loader.setPath("models/");
    loader.load("theboss.fbx", (model) => {
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
        console.log(this.bones)
        // this.bones.mixamorigRightHandRing1.add(gun);
        this.bones.bossLeftHandThumb3.add(gun);
        // this.bones.mixamorigRightHandIndex1.add(gun);
      }


      loader.load("Rifle Walk.fbx", (a) => {
        onLoad("walk", a);
      });
      loader.load("Rifle Run.fbx", (a) => {
        onLoad("run", a);
      });
      loader.load("Rifle Idle.fbx", (a) => {
        onLoad("idle", a);
      });
      loader.load("Backwards Rifle Walk.fbx", (a) => {
        onLoad("back", a);
      });
      loader.load("Rifle Side Left.fbx", (a) => {
        onLoad("left", a);
      });
      loader.load("Rifle Side Right.fbx", (a) => {
        onLoad("right", a);
      });
      loader.load("Gunplay.fbx", (a) => {
        onLoad("shoot", a);
      });
      loader.load("shotgun.fbx", (gun) => {
        onLoadShtoGun(gun);
      });

      console.log(model)
      this.scene.add(model);
    });
    this.loadingManager.onLoad = () => {
      this.loaded = true;
      this.animations[this.currentAction].action.play();
    };
  }
  update(delta) {
    if (this.loaded && this.currentAction !== 'shoot') {
      this.rotateAndMoveAim(delta);
      if (this.parrent.movement.forward) {
        if (this.parrent.movement.shift) {
          this.playAnimation("run");
        } else {
          this.playAnimation("walk");
        }
      }
      if (this.parrent.movement.back) {
        this.playAnimation("back");
      }

      if (
        !this.parrent.movement.forward &&
        !this.parrent.movement.back &&
        !this.parrent.movement.right &&
        !this.parrent.movement.left) {
        this.playAnimation("idle");
      }
      if (this.parrent.movement.right) {
        this.playAnimation("right");
      }
      if (this.parrent.movement.left) {
        this.playAnimation("left");
      }
      this.rotateCharacter(delta);
    }
  }

  playAnimation(animation) {
    if (animation === this.currentAction) return;
    const toPlay = this.animations[animation].action;
    const current = this.animations[this.currentAction].action;
    if (animation === 'shoot') {
      toPlay.setLoop(THREE.LoopOnce, 1);
      toPlay.clampWhenFinished = true;
      this.parrent.soundManagement.shoot();
    }
    current.fadeOut(this.fadeDuration);
    toPlay.reset().fadeIn(this.fadeDuration).play();
    this.currentAction = animation;
  }

  rotateAndMoveAim(delta) {
    this.aim.lookAt(new THREE.Vector3(this.character.position.x, 2, this.character.position.z))
    // this.aim.position.set(this.character.position.x, 2.5, this.character.position.z + 10)
    const y = this.character.rotation.y
    if (this.character.rotation.x < 0) {
      this.aim.position.x = Math.sin(Math.abs(y - Math.PI / 2) + Math.PI / 2) * this.amiDistance + this.character.position.x - 2;
      this.aim.position.z = Math.cos(Math.abs(y - Math.PI / 2) + Math.PI / 2) * this.amiDistance + this.character.position.z;
    } else {
      this.aim.position.x = Math.sin(y) * this.amiDistance + this.character.position.x + 2;
      this.aim.position.z = Math.cos(y) * this.amiDistance + this.character.position.z;
    }
  }

  rotateCharacter(delta) {
    // console.log(this.character.position)
    // if (this.currentAction === 'idle') return;
    const angleYCameraDirection = Math.atan2(
      this.parrent.camera.position.x - this.character.position.x,
      this.parrent.camera.position.z - this.character.position.z
    );
    this.rotateQuarternion.setFromAxisAngle(
      this.rotateAngle,
      angleYCameraDirection + Math.PI
    );
    this.character.quaternion.rotateTowards(this.rotateQuarternion, 0.2);

    if (this.currentAction !== "idle") {
      this.parrent.camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      // this.walkDirection.applyAxisAngle(this.rotateAngle, Math.PI);
      const velocity =
        this.currentAction == "run" ? this.runVelocity : this.walkVelocity;

      // move model & camera
      if (this.parrent.movement.forward) {
        this.walkDirection.applyAxisAngle(this.rotateAngle, Math.PI);
        let moveX = this.walkDirection.x * velocity * delta;
        let moveZ = this.walkDirection.z * velocity * delta;
        this.character.position.x -= moveX;
        this.character.position.z -= moveZ;
        this.parrent.camera.position.x -= moveX;
        this.parrent.camera.position.z -= moveZ;
      }
      if (this.parrent.movement.back) {
        this.walkDirection.applyAxisAngle(this.rotateAngle, -Math.PI);
        let moveX = this.walkDirection.x * velocity * delta;
        let moveZ = this.walkDirection.z * velocity * delta;
        this.character.position.x += moveX / 2;
        this.character.position.z += moveZ / 2;
        this.parrent.camera.position.x += moveX / 2;
        this.parrent.camera.position.z += moveZ / 2;
      }
      if (this.parrent.movement.right) {
        this.walkDirection.applyAxisAngle(this.rotateAngle, Math.PI / 2);
        let moveX = this.walkDirection.x * velocity * delta;
        let moveZ = this.walkDirection.z * velocity * delta;
        this.character.position.x -= moveX / 4;
        this.character.position.z -= moveZ / 4;
        this.parrent.camera.position.x -= moveX / 4;
        this.parrent.camera.position.z -= moveZ / 4;
      }
      if (this.parrent.movement.left) {
        this.walkDirection.applyAxisAngle(this.rotateAngle, Math.PI / 2);
        let moveX = this.walkDirection.x * velocity * delta;
        let moveZ = this.walkDirection.z * velocity * delta;
        this.character.position.x += moveX / 4;
        this.character.position.z += moveZ / 4;
        this.parrent.camera.position.x += moveX / 4;
        this.parrent.camera.position.z += moveZ / 4;
      }
      this.updateCameraTarget();
    }
  }

  updateCameraTarget(moveX, moveZ) {
    // update camera target
    this.cameraTarget.x = this.character.position.x;
    this.cameraTarget.y = this.character.position.y;
    this.cameraTarget.z = this.character.position.z;
    this.parrent.controls.target = this.cameraTarget;
  }

  shoot() {
    if (this.loaded) {
      this.playAnimation("shoot");
    }
  }

  finishedCallback() {
    setTimeout(() => {
      this.playAnimation("idle");
    }, 200);
  }


  addAim() {
    const geo = new THREE.PlaneBufferGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      side: THREE.DoubleSide
    })
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/images/aim.png", function (map) {
      material.map = map;
      material.needsUpdate = true;
    });
    this.aim = new THREE.Mesh(geo, material);
    this.aim.position.set(0, 2.5, 5)
    this.scene.add(this.aim)
  }

}
