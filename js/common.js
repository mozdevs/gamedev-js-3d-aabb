//
// Game singleton
//

var Game = {};

Game.run = function () {
    var WIDTH = 512;
    var HEIGHT = 512;

    this._previousElapsed = 0;

    // setup a WebGL renderer within an existing canvas
    var canvas = document.getElementById('demo');
    this.renderer = new THREE.WebGLRenderer({canvas: canvas});
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    this.renderer.setViewport(0, 0, WIDTH, HEIGHT);

    // create the scene
    this.scene = new THREE.Scene();

    // create an isometric camera
    this.camera = new THREE.OrthographicCamera(
        -5, 5, 5, -5, -1, 100);
    this.camera.position.z = 5;
    this.camera.position.y = 5;
    this.camera.position.x = 5;
    this.camera.lookAt(this.scene.position); // point at origin

    // create ground and axis / grid helpers
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(10, 10),
        new THREE.MeshBasicMaterial({color: 0xcccccc}));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01; // to avoid z-fighting with axis and shadows
    this.scene.add(ground);
    this.scene.add((new THREE.AxisHelper(8)));


    document.addEventListener('keyup', function (event) {
        if (event.keyCode === 27) { // listen for Esc Key
            event.preventDefault();
            this.toggleDebug();
        }
    }.bind(this));

    // start up game
    this.init();
    window.requestAnimationFrame(this.tick);
};

Game.tick = function (elapsed) {
    window.requestAnimationFrame(this.tick);

    // compute delta time in seconds -- also cap it
    var delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this._previousElapsed = elapsed;

    this.update(delta);
    this.renderer.render(this.scene, this.camera);
}.bind(Game);

// collection of materials used in the demos
Game.materials = {
    shadow: new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.5
    }),
    solid: new THREE.MeshNormalMaterial({}),
    colliding: new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.5
    }),
    dot: new THREE.MeshBasicMaterial({
        color: 0x0000ff
    })
};

// override these methods to create the demo
Game.init = function () {};
Game.update = function (delta) {};
Game.toggleDebug = function () {};

//
// Utils
//

var Utils =  {};

Utils.createShadow = function (mesh, material) {
    var params = mesh.geometry.parameters;
    var geo = mesh.geometry.type === 'BoxGeometry'
        ? new THREE.PlaneGeometry(params.width, params.depth)
        : new THREE.CircleGeometry(params.radius, 24);

    var shadow = new THREE.Mesh(geo, material);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.x = mesh.position.x;
    shadow.position.z = mesh.position.z;

    return shadow;
};

Utils.updateShadow = function (shadow, target) {
    shadow.position.x = target.position.x;
    shadow.position.z = target.position.z;
    shadow.visible = target.position.y >= 0;
};


//
// main
//

window.onload = function () {
    Game.run();
};
