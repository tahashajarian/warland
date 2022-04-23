import * as THREE from 'three'
import { randomNumber } from './random-between';


export default class ParticleSystem {
  constructor(parent) {
    this.parent = parent;
    this.init();
  }

  init() {
    this._particles = [];
    this.count = 100;
    // const particlesMaterial = new THREE.PointsMaterial()
    // const particleTexture = this.parent.textureLoader.load('textures/3.png')


    // particlesMaterial.size = 1
    // particlesMaterial.sizeAttenuation = true

    // particlesMaterial.color = new THREE.Color('#ff88cc')

    // particlesMaterial.transparent = true
    // particlesMaterial.alphaMap = particleTexture
    // // particlesMaterial.alphaTest = 0.01
    // // particlesMaterial.depthTest = false
    // particlesMaterial.depthWrite = false
    // particlesMaterial.blending = THREE.AdditiveBlending

    // particlesMaterial.vertexColors = true

    const material = new THREE.PointsMaterial({
      color: 0xff0000,
      // side: THREE.DoubleSide,
      // size: 1,
      // sizeAttenuation: true,
      // transparent: true,
      // alphaMap: particleTexture,
      blending: THREE.AdditiveBlending,
      // depthWrite: true,
      // vertexColors: true,
    });

    // material.alphaMap = particleTexture

    this.parent.textureLoader.load("textures/3.png", function (map) {

      material.alphaMap = map;
      material.map = map;

      material.needsUpdate = true;
    });



    this._geometry = new THREE.BufferGeometry();
    this._geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    this._geometry.setAttribute('color', new THREE.Float32BufferAttribute([], 3));

    this._points = new THREE.Points(this._geometry, material);
    this.parent.scene.add(this._points);

    this._UpdateGeometry();

  }

  update(delta, elapsedTime) {
    this._UpdateGeometry()
    this._UpdateParticles(elapsedTime)

    // if (this.particlesGeometry) {

    //   for (let i = 0; i < this.count; i++) {
    //     let i3 = i * 3

    //     const x = this.particlesGeometry.attributes.position.array[i3]
    //     this.particlesGeometry.attributes.position.array[i3 + 1] += Math.sin(elapsedTime + x)
    //   }
    //   this.particlesGeometry.attributes.position.needsUpdate = true
    // }

  }


  _UpdateParticles(timeElapsed) {
    for (let p of this._particles) {
      p.life -= 0.05;
      if (p.life <= -Math.PI / 2) p.life = -Math.PI / 2
    }

    this._particles = this._particles.filter(p => {
      return p.position.y >= 0;
    });

    for (let p of this._particles) {
      const velocity = Math.sin(p.life) > 0 ? Math.sin(p.life) * (Math.random() + 0.1) : Math.sin(p.life) * (Math.random())
      p.position.y += Math.sin(p.life) * 0.5;



      // p.position.add(p.velocity.clone().multiplyScalar(timeElapsed));

      // const drag = p.velocity.clone();
      // drag.multiplyScalar(timeElapsed * 0.1);
      // drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x));
      // drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y));
      // drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z));
      // p.velocity.sub(drag);
    }

    // this._particles.sort((a, b) => {
    //   const d1 = this._camera.position.distanceTo(a.position);
    //   const d2 = this._camera.position.distanceTo(b.position);

    //   if (d1 > d2) {
    //     return -1;
    //   }

    //   if (d1 < d2) {
    //     return 1;
    //   }

    //   return 0;
    // });
  }


  initParticleSystem(position_) {
    // this.particlesGeometry = new THREE.BufferGeometry()

    // const positions = new Float32Array(this.count * 3)
    // const colors = new Float32Array(this.count * 3)

    // for (let i = 0; i < this.count * 3; i++) {
    //   switch (i % 3) {
    //     case 0:
    //       positions[i] = (Math.random() - 0.5) + position.x
    //       colors[i] = 1

    //       break;
    //     case 1:
    //       positions[i] = (Math.random() - 0.5)
    //       colors[i] = 0


    //       break;
    //     case 2:
    //       positions[i] = (Math.random() - 0.5) + position.z
    //       colors[i] = 0

    //       break;

    //     default:
    //       break;
    //   }
    // }
    for (let i = 0; i < this.count; i++) {

      this._particles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) + position_.x,
          (Math.random() * 2 - 1) + 3,
          (Math.random() - 0.5) + position_.z),
        color: new THREE.Color('red'),
        life: randomNumber(Math.PI / 6, Math.PI / 2)
      });
    }

    // this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    // this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // const particles = new THREE.Points(this.particlesGeometry, particlesMaterial)
    // // particles.position = postion;
    // this.parent.scene.add(particles)


  }

  _UpdateGeometry() {
    const positions = [];
    const colors = []
    for (let p of this._particles) {
      positions.push(p.position.x, p.position.y, p.position.z);
      colors.push(p.color.r, p.color.g, p.color.b);
    }
    this._geometry.setAttribute(
      'position', new THREE.Float32BufferAttribute(positions, 3));
    this._geometry.setAttribute(
      'color', new THREE.Float32BufferAttribute(colors, 3));
    this._geometry.attributes.position.needsUpdate = true;

  }

}
