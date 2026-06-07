# Computer Graphics - Exercise 5 - WebGL Bowling Alley

## Group Members
- Rony Rabinovitz
- Daniel Danziger

## How to Run
1. Make sure Node.js is installed
2. Install dependencies (first time only):
   ```bash
   npm install
   ```
3. Start the local web server:
   ```bash
   node index.js
   ```
4. Open your browser and go to http://localhost:8000

## Controls
- **O** — Toggle orbit camera (drag to rotate, scroll to zoom)
- **1** — Bowler view
- **2** — Overhead view
- **3** — Pin-end view
- **4** — Side view

## Implementation Summary
This project implements the static HW05 bowling alley infrastructure using THREE.js:

- **Lane:** approach area, foul line, approach dots, lane arrows, gutters, and pin deck
- **Pins:** 10 regulation pins in triangular formation with `LatheGeometry`, white body, and red neck stripe
- **Ball:** static glossy sphere with three finger holes on the approach area
- **Camera & lighting:** bowler perspective, orbit controls, directional shadows, responsive resize
- **UI:** HTML/CSS placeholders for a future scorecard and controls panel (HW06)

## Additional Features (Bonus)
- **Ball return track** on the right side with a returned spare ball
- **Seating bench** behind the approach area
- **Overhead scoring monitor** above the lane
- **Lane bumpers** (raised guards along the gutters)
- **Procedural textures** — wood grain on the lane, carpet pattern on the approach
- **Camera presets** — keys 1–4 switch between bowler, overhead, pin-end, and side views

## Known Issues / Limitations
- Finger holes are simplified geometric shapes, not boolean cutouts from the ball mesh
- No physics, ball rolling, pin collisions, aiming, or scoring (reserved for HW06)

## External Assets
- THREE.js r128 loaded from CDN (cdnjs.cloudflare.com)
- OrbitControls vendored locally in `src/OrbitControls.js`

## Screenshots
Add submission screenshots here or in a `screenshots/` folder:
- Overall view of the bowling lane with pins
- Close-up of the pin formation
- Bowling ball on the approach area
- Camera controls demonstration

## Complete Instructions
Full assignment requirements and grading criteria: `bowling_exercise_instructions.html`
