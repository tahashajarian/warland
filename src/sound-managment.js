import * as THREE from 'three'


export default class SoundMagnagment {
  constructor(camera, loadingManager) {
    this.camera = camera
    this.loadingManager = loadingManager
    this.init()
  }

  init() {
    this.soundes = {}
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);
    this.sound = new THREE.Audio(this.listener);
    this.audioLoader = new THREE.AudioLoader(this.loadingManager);
    this.audioLoader.setPath("sounds/");
    this.audioLoader.load('fire.mp3', (buffer) => {
      this.soundes['fire'] = buffer
      this.loaded = true
      this.sound.setBuffer(this.soundes.fire);
      this.sound.setVolume(0.1);
    });

  }

  shoot() {
    if (this.loaded) {
      if (this.sound.isPlaying) this.sound.stop()
      this.sound.play()
    }
  }

  playShot() {
    if (this.listener.context.state === 'suspended') {
      this.listener.context.resume().then(() => this.shoot())
      return
    }
    this.shoot()
  }

  unlock() {
    if (this.listener.context.state === 'suspended') {
      this.listener.context.resume()
    }
  }

}
