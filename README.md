# Warland

Warland is a browser-based 3D zombie survival game built with Three.js. Move around the arena, aim with the camera, and stop zombies before they deplete your health.

## Setup

Requirements: Node.js 16 or newer and npm.

```bash
npm install
npm run dev
```

Create an optimized production build with:

```bash
npm run build
```

The generated site is written to `dist/`.

## Controls

- `W` / `S`: move forward and backward
- `A` / `D`: rotate the camera
- `Shift`: run
- Click or tap: fire
- Drag: orbit the camera
- `Escape`: pause or resume

On-screen movement and pause controls are available on touch devices.

## Project structure

- `src/index.js`: game lifecycle, rendering, loading, UI, and game state
- `src/config.js`: gameplay tuning values
- `src/controler.js`: keyboard and pointer input
- `src/objects/`: player, enemies, arena walls, and ground
- `src/particle-system.js`: reusable blood particle buffers
- `static/`: models, textures, and audio copied into the build
- `bundler/`: development and production Webpack configuration

## Gameplay configuration

Enemy limits, spawn timing, movement speeds, player health, damage, arena bounds, and frame-delta limits are centralized in `src/config.js`.

## Asset note

The FBX files dominate download size. A future asset pipeline should convert them to GLB and use Meshopt or Draco compression. That conversion requires validating animation tracks and skeleton bindings in a 3D authoring tool; replacing the files without that validation can break the character animations.
