Game.init = function () {
    this.debug = false;

    this.knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.5, 0.1), this.materials.solid);
    this.knot.position.x = -3;
    this.knot.position.z = 1;
    this.knot.position.y = 2;
    this.knotBBox = new THREE.BoundingBoxHelper(this.knot, 0x00ff00);
    this.knotBBox.update();
    this.knotBBox.visible = false;

    this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1), this.materials.solid);
    this.sphere.position.x = 2;
    this.sphere.position.y = 2;
    this.sphereBBox = new THREE.BoundingBoxHelper(this.sphere, 0x00ff00);
    this.sphereBBox.update();
    this.sphereBBox.visible = false;

    // the object the user can control to check for collisions
    this.cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.5),
        this.materials.solid);
    this.cube.position.set(0.5, 1, 2);
    this.cubeShadow = Utils.createShadow(this.cube, this.materials.shadow);
    this.cubeBBox = new THREE.BoundingBoxHelper(this.cube, 0x00ff00);
    this.cubeBBox.update();
    this.cubeBBox.visible = false;

    this.scene.add(this.cube);
    this.scene.add(this.cubeBBox);
    this.scene.add(this.knot);
    this.scene.add(this.knotBBox);
    this.scene.add(this.sphere);
    this.scene.add(this.sphereBBox);
    // add fake shadows
    this.scene.add(Utils.createShadow(this.sphere, this.materials.shadow));
    this.scene.add(Utils.createShadow(this.knot, this.materials.shadow));
    this.scene.add(this.cubeShadow);

    this.controls = new THREE.TransformControls(
        this.camera, this.renderer.domElement);
    this.controls.space = 'world';
    this.controls.attach(this.cube);
    this.scene.add(this.controls);
};

Game.update = function (delta) {
    this.controls.update();

    this.knot.rotation.x += (Math.PI / 4) * delta;
    this.knotBBox.update();

    Utils.updateShadow(this.cubeShadow, this.cube);
    this.cubeBBox.update(); // update the bbox to match the cube's position

    this.sphere.material =
        this.sphereBBox.box.intersectsBox(this.cubeBBox.box)
        ? this.materials.colliding
        : this.materials.solid;

    this.knot.material = this.knotBBox.box.intersectsBox(this.cubeBBox.box)
        ? this.materials.colliding
        : this.materials.solid;
};

Game.toggleDebug = function () {
    this.debug = !this.debug;
    this.knotBBox.visible = !!this.debug;
    this.sphereBBox.visible = !!this.debug;
    this.cubeBBox.visible = !!this.debug;
};
