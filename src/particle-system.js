import * as THREE from "three";
import { randomNumber } from "./random-between";

export default class ParticleSystem {
  constructor(parent) {
    this.parent = parent;
    this.init();
  }

  init() {
    this._particles = [];
    this.count = 1000;

    const material = new THREE.PointsMaterial({
      color: 0x5e0000,
      side: THREE.DoubleSide,
      size: 0.25,
    });

    this._geometry = new THREE.BufferGeometry();
    this._geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([], 3)
    );
    this._geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute([], 3)
    );

    this._points = new THREE.Points(this._geometry, material);
    this.parent.scene.add(this._points);

    this._UpdateGeometry();
  }

  update(delta, elapsedTime) {
    this._UpdateGeometry();
    this._UpdateParticles(elapsedTime);
  }

  _UpdateParticles(timeElapsed) {
    for (let p of this._particles) {
      p.life -= 0.05;
      if (p.life <= -Math.PI / 2) p.life = -Math.PI / 2;
    }

    this._particles = this._particles.filter((p) => {
      return p.position.y >= 0;
    });

    for (let p of this._particles) {
      const velocity =
        Math.sin(p.life) > 0
          ? Math.sin(p.life) * (Math.random() + 0.1)
          : Math.sin(p.life) * Math.random();
      p.position.y += Math.sin(p.life) * 0.5;
    }
  }

  initParticleSystem(position_) {
    for (let i = 0; i < this.count; i++) {
      this._particles.push({
        position: new THREE.Vector3(
          Math.random() - 0.5 + position_.x,
          Math.random() * 2 - 1 + 3,
          Math.random() - 0.5 + position_.z
        ),
        color: new THREE.Color(0x5e0000),
        life: randomNumber(Math.PI / 6, Math.PI / 2),
      });
    }
  }

  _UpdateGeometry() {
    const positions = [];
    const colors = [];
    for (let p of this._particles) {
      positions.push(p.position.x, p.position.y, p.position.z);
      colors.push(p.color.r, p.color.g, p.color.b);
    }
    this._geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    this._geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    this._geometry.attributes.position.needsUpdate = true;
  }
}
