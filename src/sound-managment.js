import * as THREE from 'three'


export default class SoundMagnagment {
  constructor(camera) {
    this.camera = camera
    this.init()
  }

  init() {
    this.soundes = {}
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);
    this.sound = new THREE.Audio(this.listener);
    this.audioLoader = new THREE.AudioLoader();
    this.audioLoader.setPath("sounds/");
    this.audioLoader.load('fire.mp3', (buffer) => {
      this.soundes['fire'] = buffer
      this.loaded = true
    });

  }

  shoot() {
    if (this.loaded) {
      this.sound.setBuffer(this.soundes.fire);
      this.sound.setVolume(1);
      this.sound.play()
    }
  }

}