import * as THREE from "three";

export default class ParticleSystem {
  constructor(parent) {
    this.parent = parent;
    this.init();
  }

  init() {
    this._particles = [];
    this.count = 250;
    this.capacity = 12500;

    const material = new THREE.PointsMaterial({
      color: 0x5e0000,
      side: THREE.DoubleSide,
      size: 0.25,
    });

    this._geometry = new THREE.BufferGeometry();
    this._positions = new Float32Array(this.capacity * 3);
    this._positionAttribute = new THREE.BufferAttribute(this._positions, 3);
    this._positionAttribute.setUsage(THREE.DynamicDrawUsage);
    this._geometry.setAttribute("position", this._positionAttribute);
    this._geometry.setDrawRange(0, 0);

    this._points = new THREE.Points(this._geometry, material);
    this.parent.scene.add(this._points);

    this._updateGeometry();
  }

  update(delta) {
    this._updateParticles(delta);
    this._updateGeometry();
  }

  _updateParticles(delta) {
    for (let p of this._particles) {
      p.life -= delta;
      p.velocity.y -= 7 * delta;
      p.position.addScaledVector(p.velocity, delta);
    }

    this._particles = this._particles.filter((p) => {
      return p.life > 0 && p.position.y >= 0;
    });
  }

  initParticleSystem(position_) {
    const available = Math.max(0, this.capacity - this._particles.length);
    for (let i = 0; i < Math.min(this.count, available); i++) {
      this._particles.push({
        position: new THREE.Vector3(
          Math.random() - 0.5 + position_.x,
          Math.random() * 2 - 1 + 3,
          Math.random() - 0.5 + position_.z
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          2 + Math.random() * 4,
          (Math.random() - 0.5) * 2
        ),
        life: 1 + Math.random(),
      });
    }
  }

  _updateGeometry() {
    for (let index = 0; index < this._particles.length; index++) {
      const p = this._particles[index];
      const offset = index * 3;
      this._positions[offset] = p.position.x;
      this._positions[offset + 1] = p.position.y;
      this._positions[offset + 2] = p.position.z;
    }
    this._geometry.setDrawRange(0, this._particles.length);
    this._positionAttribute.needsUpdate = true;
  }
}
