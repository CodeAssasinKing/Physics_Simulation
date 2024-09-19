// Matter.js module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies;

// Create an engine
const engine = Engine.create();

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

// Create a ground and a wall
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 50, window.innerWidth, 60, { isStatic: true });
const leftWall = Bodies.rectangle(0, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true });
const rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true });

// Create a projectile
const projectile = Bodies.circle(200, 200, 20, {
    restitution: 0.8  // Makes it bouncy
});

// Add all bodies to the world
World.add(engine.world, [ground, leftWall, rightWall, projectile]);

// Run the engine and the renderer
Engine.run(engine);
Render.run(render);
