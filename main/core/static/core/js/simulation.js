// Matter.js module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Events = Matter.Events;

// Create an engine
const engine = Engine.create();
engine.world.gravity.y = 1;  // Default gravity for Earth

// Create a renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// Create ground, walls, and projectile
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 50, window.innerWidth, 60, { isStatic: true });
const leftWall = Bodies.rectangle(0, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true });
const rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true });
let projectile = Bodies.circle(200, window.innerHeight - 200, 20, {
    restitution: 0.8  // Bouncy effect
});

World.add(engine.world, [ground, leftWall, rightWall, projectile]);

// Variables for controlling the projectile launch
let launchAngle = 45;  // in degrees
let launchForce = 0.05; // force
let windSpeed = 0;      // m/s (horizontal force)
let dragCoefficient = 0.001;  // air resistance coefficient

// Debounce function to limit the frequency of updates
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Launch button event listener
document.getElementById('launch').addEventListener('click', () => {
    // Convert angle to radians
    const angleRadians = (Math.PI / 180) * launchAngle;
    
    // Calculate the force vector based on the angle and force
    const forceVector = {
        x: launchForce * Math.cos(angleRadians),
        y: -launchForce * Math.sin(angleRadians) // Negative to go upward
    };
    
    // Apply the force to the projectile
    Body.applyForce(projectile, projectile.position, forceVector);
});

// Update angle, force, and wind speed values in real-time (debounced to prevent freezing)
document.getElementById('angle').addEventListener('input', debounce((event) => {
    launchAngle = parseInt(event.target.value);
    document.getElementById('angleDisplay').innerText = launchAngle;
}, 200));

document.getElementById('force').addEventListener('input', debounce((event) => {
    launchForce = parseFloat(event.target.value);
    document.getElementById('forceDisplay').innerText = launchForce;
}, 200));

document.getElementById('wind').addEventListener('input', debounce((event) => {
    windSpeed = parseFloat(event.target.value);
    document.getElementById('windDisplay').innerText = windSpeed;
}, 200));

// Gravity buttons event listeners (debounced)
document.getElementById('earth').addEventListener('click', () => {
    engine.world.gravity.y = 1; // Earth's gravity
});

document.getElementById('moon').addEventListener('click', () => {
    engine.world.gravity.y = 0.16; // Moon's gravity (about 1/6th of Earth's)
});

document.getElementById('mars').addEventListener('click', () => {
    engine.world.gravity.y = 0.38; // Mars' gravity (about 1/3rd of Earth's)
});

// Reset the projectile after it stops
Events.on(engine, 'afterUpdate', function() {
    // Apply wind resistance (force applied horizontally)
    if (projectile.position.y < window.innerHeight) {
        Body.applyForce(projectile, projectile.position, { x: windSpeed * 0.001, y: 0 });
    }

    // Apply drag (air resistance) proportional to velocity
    const velocity = projectile.velocity;
    const dragForce = {
        x: -dragCoefficient * velocity.x * Math.abs(velocity.x),
        y: -dragCoefficient * velocity.y * Math.abs(velocity.y)
    };
    Body.applyForce(projectile, projectile.position, dragForce);
    
    // Reset position if projectile goes off-screen
    if (projectile.position.y > window.innerHeight || projectile.position.x > window.innerWidth || projectile.position.x < 0) {
        Body.setPosition(projectile, { x: 200, y: window.innerHeight - 200 });
        Body.setVelocity(projectile, { x: 0, y: 0 });
        Body.setAngularVelocity(projectile, 0); // Stop rotation
    }
});

// Run the engine and renderer
Engine.run(engine);
Render.run(render);
