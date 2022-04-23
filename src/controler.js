export default class Controler {
  constructor(parent) {
    this.parent = parent
    this.movement = {
      shift: false,
      forward: false,
      left: false,
      right: false,
      back: false,
      pause: false,
    };
    this.initDisplay();
    this.initListener();
    this.updateDisplay();
  }

  initDisplay() {
    // add keys to screen
    const keysContainer = document.createElement("div");
    Object.entries(this.movement).forEach((key) => {
      const elemet = document.createElement("span");
      elemet.innerText = key[0];
      elemet.id = key[0];
      elemet.style.position = "fixed";

      elemet.ontouchstart = (e) => {
        e.stopPropagation()
        if (key[0] !== 'pause') {

          this.movement.forward = false;
          this.movement.back = false;
          this.movement.right = false;
          this.movement.left = false
          this.movement[key[0]] = true;
        }
      };
      elemet.onpointerdown = (e) => {
        if (key[0] !== 'pause') {

          e.stopPropagation()
          this.movement.forward = false;
          this.movement.back = false;
          this.movement.right = false;
          this.movement.left = false
          this.movement[key[0]] = true;
        }
      };
      elemet.onpointerup = (e) => {
        e.stopPropagation()
        if (key[0] === 'pause') {
          if (this.movement.pause) {
            this.movement.pause = false;
            this.parent.update()
          } else {
            this.movement.pause = true;
          }
          this.updateDisplay();
        } else {


          this.movement.forward = false;
          this.movement.back = false;
          this.movement.right = false;
          this.movement.left = false;
          this.movement[key[0]] = false;
        }
      };
      elemet.ontouchend = () => {
        e.stopPropagation()
        if (key[0] === 'pause') {
          if (this.movement.pause) {
            this.movement.pause = false;
            this.parent.update()
          } else {
            this.movement.pause = true;
          }
          this.updateDisplay();
        } else {


          this.movement.forward = false;
          this.movement.back = false;
          this.movement.right = false;
          this.movement.left = false;
          this.movement[key[0]] = false;
        }
      };

      if (key[0] === "forward") {
        elemet.style.bottom = "50px";
        elemet.style.left = "30px";
        elemet.className = 'buttons'

      }
      if (key[0] === "back") {
        elemet.style.bottom = "10px";
        elemet.style.left = "40px";
        elemet.className = 'buttons'

      }
      if (key[0] === "left") {
        elemet.style.top = "-20px";
        elemet.style.left = "85px";
        elemet.style.display = 'none'

      }
      if (key[0] === "right") {
        elemet.style.top = "-20px";
        elemet.style.left = "190px";
        elemet.style.display = 'none'

      }

      if (key[0] === "shift") {
        elemet.style.top = "-20px";
        elemet.style.left = "-20px";
        elemet.style.display = 'none'
      }

      if (key[0] === "pause") {
        elemet.style.bottom = "30px";
        elemet.style.right = "10px";
        elemet.className = 'buttons'
      }

      elemet.style.padding = "10px";
      keysContainer.append(elemet);
    });
    keysContainer.style.position = "fixed";
    keysContainer.style.bottom = "0px";
    keysContainer.style.left = "0px";
    keysContainer.style.color = "white";
    keysContainer.style.fontSize = "24px";
    keysContainer.style.userSelect = "none";
    // keysContainer.style.position = 'fixed'
    // keysContainer.style.position = 'fixed'

    document.body.append(keysContainer);
  }

  initListener() {
    window.addEventListener("keydown", (e) => {
      const key = e.code;
      switch (key) {
        case "KeyW":
          this.movement.forward = true;
          // this.movement.left = false;
          // this.movement.back = false;
          // this.movement.right = false;
          break;
        case "KeyA":
          this.movement.left = true;
          // this.movement.forward = false;
          // this.movement.back = false;
          // this.movement.right = false;
          break;
        case "KeyS":
          this.movement.back = true;
          // this.movement.left = false;
          // this.movement.forward = false;
          // this.movement.right = false;
          break;
        case "KeyD":
          this.movement.right = true;
          // this.movement.left = false;
          // this.movement.forward = false;
          // this.movement.back = false;
          break;
        case "ShiftLeft":
          this.movement.shift = true;
          break;

        default:
          break;
      }
    });
    window.addEventListener("keyup", (e) => {
      const key = e.code;
      switch (key) {
        case "KeyW":
          this.movement.forward = false;
          break;
        case "KeyA":
          this.movement.left = false;
          break;
        case "KeyS":
          this.movement.back = false;
          break;
        case "KeyD":
          this.movement.right = false;
          break;
        case "ShiftLeft":
          this.movement.shift = false;
          break;

        case "Escape":
          if (this.movement.pause) {
            this.movement.pause = false;
            this.parent.update()
          } else {
            this.movement.pause = true;
          }
          this.updateDisplay();
          break;

        default:
          break;
      }
    });
  }
  updateDisplay() {
    // console.log(this.movement)
    Object.entries(this.movement).forEach((key) => {
      const el = document.getElementById(key[0]);
      if (el) {
        if (key[1]) {
          el.style.color = "red";
        } else {
          el.style.color = "white";
        }
      }
    });
  }
}
