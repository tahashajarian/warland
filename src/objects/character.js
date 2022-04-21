import * as THREE from "three";

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

    this.runVelocity = 6;
    this.walkVelocity = 3;
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
      this.parent.fbxLoader.load("Rifle Side Left.fbx", (a) => {
        onLoad("left", a);
      });
      this.parent.fbxLoader.load("Rifle Side Right.fbx", (a) => {
        onLoad("right", a);
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
    // console.log(this.gunRotateAxis, this.gun.rotation)
    // console.log(this.gunPostitionAxis, this.gun.position)

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
    if (this.parent.loaded && this.currentAction !== 'shoot') {
      this.raycaster.set(new THREE.Vector3(this.character.position.x, 1, this.character.position.z), new THREE.Vector3(this.parent.camera.getWorldDirection(this.walkDirection).x, 0, this.parent.camera.getWorldDirection(this.walkDirection).z).normalize())
      const intersects = this.raycaster.intersectObjects(this.scene.children);

      // if (intersects[0] && intersects[0].distance)
        this.amiDistance = intersects[0].distance - 0.5
      // for (let i = 1; i < intersects.length; i++) {

      //   if (intersects[i].distance - 0.5 < this.amiDistance) {
      //     this.amiDistance = intersects[i].distance - 0.5
      //   }

      // }
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
        !this.parent.movement.back &&
        !this.parent.movement.right &&
        !this.parent.movement.left) {
        this.playAnimation("idle");
      }
      if (this.parent.movement.right) {
        this.playAnimation("right");
      }
      if (this.parent.movement.left) {
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
      setTimeout(() => {
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        for (let i = 0; i < intersects.length; i++) {
          if (intersects[i].object.status === 'alive') {
            const zombies = this.parent.enemies.zombies
            const id = intersects[i].object.myId
            const dead = zombies.find(zombie => zombie.myId === id);
            if (dead) {
              dead.status = 'dead'
              this.scene.remove(intersects[i].object)
            }
          }
        }
      }, 1500);
      toPlay.setLoop(THREE.LoopOnce, 1);
      toPlay.clampWhenFinished = true;
      this.parent.soundManagement.shoot();
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
      if (this.parent.movement.right) {
        this.walkDirection.applyAxisAngle(this.rotateAngle, Math.PI / 2);
        let moveX = this.walkDirection.x * velocity * delta;
        let moveZ = this.walkDirection.z * velocity * delta;
        this.character.position.x -= moveX / 4;
        this.character.position.z -= moveZ / 4;
        this.parent.camera.position.x -= moveX / 4;
        this.parent.camera.position.z -= moveZ / 4;
      }
      if (this.parent.movement.left) {
        this.walkDirection.applyAxisAngle(this.rotateAngle, Math.PI / 2);
        let moveX = this.walkDirection.x * velocity * delta;
        let moveZ = this.walkDirection.z * velocity * delta;
        this.character.position.x += moveX / 4;
        this.character.position.z += moveZ / 4;
        this.parent.camera.position.x += moveX / 4;
        this.parent.camera.position.z += moveZ / 4;
      }
      this.updateCameraTarget();
    }
  }

  updateCameraTarget(moveX, moveZ) {
    // update camera target
    this.cameraTarget.x = this.character.position.x;
    this.cameraTarget.y = this.character.position.y;
    this.cameraTarget.z = this.character.position.z;
    this.parent.controls.target = this.cameraTarget;
  }

  shoot() {
    if (this.parent.loaded) {

      // this.drawRaycastLine(this.raycaster)


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

    this.parent.textureLoader.load("images/aim.png", function (map) {
      material.map = map;
      material.needsUpdate = true;
    });
    this.aim = new THREE.Mesh(geo, material);
    this.aim.position.set(0, 2.1, 5)
    this.scene.add(this.aim)
  }

  drawRaycastLine(raycaster) {
    let material = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 2
    });
    let geometry = new THREE.Geometry();
    let startVec = new THREE.Vector3(
      raycaster.ray.origin.x,
      raycaster.ray.origin.y,
      raycaster.ray.origin.z);

    let endVec = new THREE.Vector3(
      raycaster.ray.direction.x,
      raycaster.ray.direction.y,
      raycaster.ray.direction.z);

    // could be any number
    endVec.multiplyScalar(5000);

    // get the point in the middle
    let midVec = new THREE.Vector3();
    midVec.lerpVectors(startVec, endVec, 0.5);

    geometry.vertices.push(startVec);
    geometry.vertices.push(midVec);
    geometry.vertices.push(endVec);

    // console.log('vec start', startVec);
    // console.log('vec mid', midVec);
    // console.log('vec end', endVec);

    let line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }

}
