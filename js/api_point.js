Game.init = function () {
    this.debug = false;

    var dotGeo = new THREE.SphereGeometry(0.05);

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

    this.point = new THREE.Mesh(dotGeo, this.materials.dot);
    this.point.position.x = 0.5;
    this.point.position.z = 2;
    this.point.position.y = 1;
    this.pointShadow = Utils.createShadow(this.point, this.materials.shadow);

    this.scene.add(this.point);
    this.scene.add(this.knot);
    this.scene.add(this.knotBoxHelper);
    this.scene.add(this.sphere);
    this.scene.add(this.sphereBoxHelper);
    // add fake shadows
    this.scene.add(Utils.createShadow(this.sphere, this.materials.shadow));
    this.scene.add(Utils.createShadow(this.knot, this.materials.shadow));
    this.scene.add(this.pointShadow);

    this.controls = new THREE.TransformControls(
        this.camera, this.renderer.domElement);
    this.controls.space = 'world';
    this.controls.attach(this.point);
    this.scene.add(this.controls);
};

Game.update = function (delta) {
    this.controls.update();
    
    this.knot.rotation.x += (Math.PI / 4) * delta;
    this.knotBoxHelper.update();
    this.knotBBox.setFromObject(this.knotBoxHelper);

    Utils.updateShadow(this.pointShadow, this.point);

    this.sphere.material =
        this.sphereBBox.containsPoint(this.point.position)
        ? this.materials.colliding
        : this.materials.solid;

    this.knot.material = this.knotBBox.containsPoint(this.point.position)
        ? this.materials.colliding
        : this.materials.solid;
};

Game.toggleDebug = function () {
    this.debug = !this.debug;
    this.knotBoxHelper.visible = !!this.debug;
    this.sphereBoxHelper.visible = !!this.debug;
};
