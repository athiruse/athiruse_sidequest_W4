/*
Week 4 — Example 5: Example 5: Blob Platformer (JSON + Classes)
Course: GBDA302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026

This file orchestrates everything:
- load JSON in preload()
- create WorldLevel from JSON
- create BlobPlayer
- update + draw each frame
- handle input events (jump, optional next level)

This matches the structure of the original blob sketch from Week 2 but moves
details into classes.
*/

let data; // raw JSON data
let levelIndex = 0;

let world; // WorldLevel instance (current level)
let player; // BlobPlayer instance

function preload() {
  // Load the level data from disk before setup runs.
  data = loadJSON("levels.json");
}

function setup() {
  // Create the player once (it will be respawned per level).
  player = new BlobPlayer();

  // Load the first level.
  loadLevel(0);

  // Simple shared style setup.
  noStroke();
  textFont("sans-serif");
  textSize(14);
}

function draw() {
  // 1) Draw the world (background + platforms)
  world.drawWorld();

  // 2) Update and draw the player on top of the world
  player.update(world.platforms);
  player.draw(world.theme.blob);

  // 3) HUD
  fill(0);
  text(world.name, 30, 18);
  text("Move: A/D or ←/→ • Jump: Space/W/↑ • Next: N", 30, 36);

  // 4) Special phrase for Level 2 using a loop
  if (levelIndex === 1) {
    push(); // save current styles

    const phrase = "get the blob to the other side";
    const repeats = 3; // same number of iterations as before
    const startX = 450; // keep your original x position
    const startY = 30; // starting y position
    const spacing = 25; // vertical spacing between repeated lines

    for (let i = 0; i < repeats; i++) {
      const alpha = 255 * (1 - i / repeats); // decreases each iteration
      fill(0, 100, 0, alpha); // dark green with fading opacity
      text(phrase, startX, startY + i * spacing);
    }

    pop(); // restore previous styles
  }

  if (levelIndex === 1) {
    push(); // save styles

    fill("#006400"); // dark green triangles
    noStroke();

    const triangleWidth = 40; // width of each triangle
    const triangleHeight = 30; // height of each triangle
    const yPos = height - 30; // base y-position (near bottom)

    // Loop to draw triangles across the canvas
    for (let x = 0; x < width; x += triangleWidth) {
      triangle(
        x,
        yPos, // bottom-left
        x + triangleWidth / 2,
        yPos - triangleHeight, // top
        x + triangleWidth,
        yPos, // bottom-right
      );
    }

    pop(); // restore styles
  }
}

function keyPressed() {
  // Jump keys
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.jump();
  }

  // Optional: cycle levels with N (as with the earlier examples)
  if (key === "n" || key === "N") {
    const next = (levelIndex + 1) % data.levels.length;
    loadLevel(next);
  }
}

/*
Load a level by index:
- create a WorldLevel instance from JSON
- resize canvas based on inferred geometry
- spawn player using level start + physics
*/
function loadLevel(i) {
  levelIndex = i;

  // Create the world object from the JSON level object.
  world = new WorldLevel(data.levels[levelIndex]);

  // Fit canvas to world geometry (or defaults if needed).
  const W = world.inferWidth(640);
  const H = world.inferHeight(360);
  resizeCanvas(W, H);

  // Apply level settings + respawn.
  player.spawnFromLevel(world);
}
