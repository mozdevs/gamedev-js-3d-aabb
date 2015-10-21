Game.init = function () {
    this.knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.5, 0.1), this.materials.solid);
    this.knot.position.set(-3, 2, 1);
    this.knot.geometry.computeBoundingSphere();

    this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1), this.materials.solid);
    this.sphere.position.set(2, 2, 0);
    this.sphereShadow = Utils.createShadow(this.sphere, this.materials.shadow);

    // the object the user can control to check for collisions
    this.cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75),
        this.materials.solid);
    this.cube.position.set(2, 2, 1.74);
    this.cubeShadow = Utils.createShadow(this.cube, this.materials.shadow);

    // add objects to the scene
    this.scene.add(this.cube);
    this.scene.add(this.knot);
    this.scene.add(this.sphere);

    // add fake shadows to the scene
    this.scene.add(Utils.createShadow(this.knot, this.materials.shadow));
    this.scene.add(this.sphereShadow);
    this.scene.add(this.cubeShadow);

    this.controls = new THREE.TransformControls(
        this.camera, this.renderer.domElement);
    this.controls.space = 'world';
    this.controls.attach(this.cube);
    this.scene.add(this.controls);

    this.timestamp = 0;

    // setup physic world
    this.initPhysicalWorld();
};

Game.update = function (delta) {
    this.timestamp += delta;

    // move the cube body with mouse controls
    this.controls.update();
    this.cubeBody.position.copy(this.cube.position);
    // update the cube shadow
    Utils.updateShadow(this.cubeShadow, this.cube);

    // update knot mesh rotation
    this.knot.quaternion.copy(this.knotBody.quaternion);

    // reset materials
    this.sphere.material = this.materials.solid;
    this.knot.material = this.materials.solid;

    this.updatePhysics(delta);
};

Game.updatePhysics = function (delta) {
    this.world.step(delta);

    this.world.contacts.forEach(function (contact) {
        contact.bi.mesh.material = this.materials.colliding;
        contact.bj.mesh.material = this.materials.colliding;
        this.cube.material = this.materials.solid;
    }.bind(this));
};

Game.initPhysicalWorld = function () {
    this.world = new CANNON.World();

    // add physical bodies
    this.knotBody = this.addPhysicalBody(this.knot, {mass: 1});
    this.addPhysicalBody(this.sphere, {mass: 1});
    this.cubeBody = this.addPhysicalBody(this.cube, {mass: 1});

    // register for collide events
    this.cubeBody.addEventListener('collide', function (e) {
        console.log('Collision!');
    }.bind(this));

    // rotate the knot
    this.knotBody.angularVelocity.x = Math.PI / 4;
};

Game.addPhysicalBody = function (mesh, bodyOptions) {
    var shape;
    // create a Sphere shape for spheres and thorus knots,
    // a Box shape otherwise
    if (mesh.geometry.type === 'SphereGeometry' ||
    mesh.geometry.type === 'ThorusKnotGeometry') {
        mesh.geometry.computeBoundingSphere();
        shape = new CANNON.Sphere(mesh.geometry.boundingSphere.radius);
    }
    else {
        mesh.geometry.computeBoundingBox();
        var box = mesh.geometry.boundingBox;
        shape = new CANNON.Box(new CANNON.Vec3(
            (box.max.x - box.min.x) / 2,
            (box.max.y - box.min.y) / 2,
            (box.max.z - box.min.z) / 2
        ));
    }

    var body = new CANNON.Body(bodyOptions);
    body.addShape(shape);
    body.position.copy(mesh.position);
    body.computeAABB();
    // disable collision response so objects don't move when they collide
    // against each other
    body.collisionResponse = false;
    // keep a reference to the mesh so we can update its properties later
    body.mesh = mesh;

    this.world.addBody(body);
    return body;
};
