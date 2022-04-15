export default class Controler {
  constructor() {
    this.movement = {
      shift: false,
      forward: false,
      left: false,
      right: false,
      back: false,
    }
    this.initDisplay();
    this.initListener()
    this.updateDisplay()
  }

  initDisplay() {
    // add keys to screen
    const keysContainer = document.createElement('div');
    Object.entries(this.movement).forEach((key) => {
      const elemet = document.createElement('span')
      elemet.innerText = key[0]
      elemet.id = key[0]
      elemet.style.position = 'absolute'
      if (key[0] === 'forward') {
        elemet.style.top = '-60px'
        elemet.style.left = '120px'
      }
      if (key[0] === 'back') {
        elemet.style.top = '20px'
        elemet.style.left = '130px'
      }
      if (key[0] === 'left') {
        elemet.style.top = '-20px'
        elemet.style.left = '85px'
      }
      if (key[0] === 'right') {
        elemet.style.top = '-20px'
        elemet.style.left = '190px'
      }

      if (key[0] === 'shift') {
        elemet.style.top = '-20px'
        elemet.style.left = '-20px'
      }

      elemet.style.padding = '10px'
      keysContainer.append(elemet)
    })
    keysContainer.style.position = 'fixed'
    keysContainer.style.bottom = '80px'
    keysContainer.style.left = '60px'
    keysContainer.style.color = 'white'
    keysContainer.style.fontSize = '24px'
    // keysContainer.style.position = 'fixed'
    // keysContainer.style.position = 'fixed'

    document.body.append(keysContainer)
  }

  initListener() {
    window.addEventListener('keydown', e => {
      const key = e.code;
      switch (key) {
        case 'KeyW':
          this.movement.forward = true
          break;
        case 'KeyA':
          this.movement.left = true
          break;
        case 'KeyS':
          this.movement.back = true
          break;
        case 'KeyD':
          this.movement.right = true
          break;
        case 'ShiftLeft':
          this.movement.shift = true
          break;

        default:
          break;
      }
    })
    window.addEventListener('keyup', e => {
      const key = e.code;
      switch (key) {
        case 'KeyW':
          this.movement.forward = false
          break;
        case 'KeyA':
          this.movement.left = false
          break;
        case 'KeyS':
          this.movement.back = false
          break;
        case 'KeyD':
          this.movement.right = false
          break;
        case 'ShiftLeft':
          this.movement.shift = false
          break;

        default:
          break;
      }
    })
  }
  updateDisplay() {
    // console.log(this.movement)
    Object.entries(this.movement).forEach((key) => {
      const el = document.getElementById(key[0]);
      if (el) {
        if (key[1]) {
          el.style.color = 'red'
        } else {
          el.style.color = 'white'
        }
      }
    })
  }
}