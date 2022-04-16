import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";

export class Character {
  constructor(parrent, scene, mixers) {
    this.parrent = parrent;
    this.scene = scene;
    this.mixers = mixers;
    this.currentAction = "idle";
    this.fadeDuration = 0.2;
    this.rotateAngle = new THREE.Vector3(0, 1, 0);
    this.walkDirection = new THREE.Vector3();
    this.rotateQuarternion = new THREE.Quaternion();
    this.cameraTarget = new THREE.Vector3();

    this.runVelocity = 6;
    this.walkVelocity = 3;
    this.init();
  }

  init() {
    this.loadingManager = new THREE.LoadingManager();
    const loader = new FBXLoader(this.loadingManager);
    this.animations = [];
    loader.setPath("models/");
    loader.load("man.fbx", (fbx) => {
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

      loader.load("Rifle Walk.fbx", (a) => {
        onLoad("walk", a);
      });
      loader.load("Rifle Run.fbx", (a) => {
        onLoad("run", a);
      });
      loader.load("Rifle Idle.fbx", (a) => {
        onLoad("idle", a);
      });
      loader.load("idle2.fbx", (a) => {
        onLoad("idle2", a);
      });
      loader.load("Backwards Rifle Walk.fbx", (a) => {
        onLoad("back", a);
      });

      this.scene.add(fbx);
    });
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
          this.playAnimation("run");
        } else {
          this.playAnimation("walk");
        }
      }
      if (this.parrent.movement.back) {
        this.playAnimation("back");
      }

      if (!this.parrent.movement.forward && !this.parrent.movement.back) {
        this.playAnimation("idle");
      }
      if (this.parrent.movement.right) {
      }
      if (this.parrent.movement.left) {
        // // this.parrent.camera.position.x -= 0.1;
        // // this.parrent.camera.position.z += 0.1;
        // const matrix = new THREE.Matrix4();
        // matrix.makeRotationY((delta * Math.PI) / -4);
        // // Apply matrix like this to rotate the camera.
        // this.parrent.camera.position.applyMatrix4(matrix);
      }
      this.rotateCharacter(delta);
    }
  }

  playAnimation(animation) {
    if (animation === this.currentAction) return;

    // play animation
    const toPlay = this.animations[animation].action;
    const current = this.animations[this.currentAction].action;

    current.fadeOut(this.fadeDuration);
    toPlay.reset().fadeIn(this.fadeDuration).play();

    this.currentAction = animation;
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
      this.walkDirection.applyAxisAngle(this.rotateAngle, Math.PI);
      const velocity =
        this.currentAction == "run" ? this.runVelocity : this.walkVelocity;

      // move model & camera
      const moveX = this.walkDirection.x * velocity * delta;
      const moveZ = this.walkDirection.z * velocity * delta;
      if (this.parrent.movement.forward) {
        this.character.position.x -= moveX;
        this.character.position.z -= moveZ;
        this.parrent.camera.position.x -= moveX;
        this.parrent.camera.position.z -= moveZ;
      } else {
        this.character.position.x += moveX / 2;
        this.character.position.z += moveZ / 2;
        this.parrent.camera.position.x += moveX / 2;
        this.parrent.camera.position.z += moveZ / 2;
      }
      this.updateCameraTarget(moveX, moveZ);
    }
  }

  updateCameraTarget(moveX, moveZ) {
    // update camera target
    this.cameraTarget.x = this.character.position.x;
    this.cameraTarget.y = this.character.position.y;
    this.cameraTarget.z = this.character.position.z;
    this.parrent.controls.target = this.cameraTarget;
  }
}
