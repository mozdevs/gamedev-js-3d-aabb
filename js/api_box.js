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
    this.box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
        this.materials.solid);
    this.box.position.x = 0.5;
    this.box.position.z = 2;
    this.box.position.y = 1;
    this.boxShadow = Utils.createShadow(this.box, this.materials.shadow);
    this.boxBBox = new THREE.BoundingBoxHelper(this.box, 0x00ff00);
    this.boxBBox.update();
    this.boxBBox.visible = false;

    this.scene.add(this.box);
    this.scene.add(this.knot);
    this.scene.add(this.knotBBox);
    this.scene.add(this.sphere);
    this.scene.add(this.sphereBBox);
    // add fake shadows
    this.scene.add(Utils.createShadow(this.sphere, this.materials.shadow));
    this.scene.add(Utils.createShadow(this.knot, this.materials.shadow));
    this.scene.add(this.boxShadow);

    this.controls = new THREE.TransformControls(
        this.camera, this.renderer.domElement);
    this.controls.space = 'world';
    this.controls.attach(this.box);
    this.scene.add(this.controls);
};

Game.update = function (delta) {
    this.controls.update();

    this.knot.rotation.x += (Math.PI / 4) * delta;
    this.knotBBox.update();

    Utils.updateShadow(this.boxShadow, this.box);
    this.boxBBox.update(); // update the bbox to match the cube's position

    this.sphere.material =
        this.sphereBBox.box.isIntersectionBox(this.boxBBox.box)
        ? this.materials.colliding
        : this.materials.solid;

    this.knot.material = this.knotBBox.box.isIntersectionBox(this.boxBBox.box)
        ? this.materials.colliding
        : this.materials.solid;
};

Game.toggleDebug = function () {
    this.debug = !this.debug;
    this.knotBBox.visible = !!this.debug;
    this.sphereBBox.visible = !!this.debug;
    this.boxBBox.visible = !!this.debug;
};
