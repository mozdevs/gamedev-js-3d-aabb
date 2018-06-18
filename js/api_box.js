Game.init = function () {
    this.debug = false;

    this.knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.5, 0.1), this.materials.solid);
    this.knot.position.x = -3;
    this.knot.position.z = 1;
    this.knot.position.y = 2;
    this.knotBoxHelper = new THREE.BoxHelper(this.knot, 0x00ff00);
    this.knotBoxHelper.update();
    this.knotBBox = new THREE.Box3();
    this.knotBBox.setFromObject(this.knotBoxHelper);
    this.knotBoxHelper.visible = false;

    this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1), this.materials.solid);
    this.sphere.position.x = 2;
    this.sphere.position.y = 2;
    this.sphereBoxHelper = new THREE.BoxHelper(this.sphere, 0x00ff00);
    this.sphereBoxHelper.update();
    this.sphereBBox = new THREE.Box3();
    this.sphereBBox.setFromObject(this.sphereBoxHelper);
    this.sphereBoxHelper.visible = false;

    // the object the user can control to check for collisions
    this.cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.5),
        this.materials.solid);
    this.cube.position.set(0.5, 1, 2);
    this.cubeShadow = Utils.createShadow(this.cube, this.materials.shadow);
    this.cubeBoxHelper = new THREE.BoxHelper(this.cube, 0x00ff00);
    this.cubeBoxHelper.update();
    this.cubeBBox = new THREE.Box3();
    this.cubeBBox.setFromObject(this.cubeBoxHelper);
    this.cubeBoxHelper.visible = false;

    this.scene.add(this.cube);
    this.scene.add(this.cubeBoxHelper);
    this.scene.add(this.knot);
    this.scene.add(this.knotBoxHelper);
    this.scene.add(this.sphere);
    this.scene.add(this.sphereBoxHelper);
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
    this.knotBoxHelper.update();
    this.knotBBox.setFromObject(this.knotBoxHelper);

    Utils.updateShadow(this.cubeShadow, this.cube);
    this.cubeBoxHelper.update(); // update the BoxHelper to match the cube's position
    this.cubeBBox.setFromObject(this.cubeBoxHelper);

    this.sphere.material =
        this.sphereBBox.intersectsBox(this.cubeBBox)
        ? this.materials.colliding
        : this.materials.solid;

    this.knot.material = this.knotBBox.intersectsBox(this.cubeBBox)
        ? this.materials.colliding
        : this.materials.solid;
};

Game.toggleDebug = function () {
    this.debug = !this.debug;
    this.knotBoxHelper.visible = !!this.debug;
    this.sphereBoxHelper.visible = !!this.debug;
    this.cubeBoxHelper.visible = !!this.debug;
};
