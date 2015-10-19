Game.init = function () {
    this.debug = false;

    this.knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.5, 0.1), this.materials.solid);
    this.knot.position.set(-3, 2, 1);
    this.knotBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

    this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1), this.materials.solid);
    this.sphere.position.set(2, 2, 0);
    // No need to call this:
    // this.sphere.geometry.computeBoundingSphere();
    // because it is done automatically by Three.js since it is needed for
    // frustrum culling
    this.sphereBBox = new THREE.Sphere(
        this.sphere.position,
        this.sphere.geometry.boundingSphere.radius);
    this.sphereShadow = Utils.createShadow(this.sphere, this.materials.shadow);

    this.point = new THREE.Mesh(
        new THREE.SphereGeometry(0.05), this.materials.dot);
    this.point.position.set(0.5, 2, 1);
    this.pointShadow = Utils.createShadow(this.point, this.materials.shadow);

    // add objects to the scene
    this.scene.add(this.point);
    this.scene.add(this.knot);
    this.scene.add(this.sphere);

    // add fake shadows to the scene
    this.scene.add(Utils.createShadow(this.knot, this.materials.shadow));
    this.scene.add(this.sphereShadow);
    this.scene.add(this.pointShadow);

    this.controls = new THREE.TransformControls(
        this.camera, this.renderer.domElement);
    this.controls.space = 'world';
    this.controls.attach(this.point);
    this.scene.add(this.controls);

    this.timestamp = 0;
};

Game.update = function (delta) {
    this.timestamp += delta;

    this.controls.update();

    // rotate the knot
    this.knot.rotation.x += (Math.PI / 4) * delta;
    this.knotBBox.setFromObject(this.knot); // re-calculate AABB

    // change sphere size
    var scale = 0.25 + Math.abs(Math.sin(this.timestamp));
    this.sphere.scale.set(scale, scale, scale);
    // re-calculate bounding sphere
    this.sphereBBox.radius = this.sphere.geometry.boundingSphere.radius * scale;
    // update shadow size
    Utils.updateShadow(this.sphereShadow, this.sphere);

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
    this.knotBBox.visible = !!this.debug;
    this.sphereBBox.visible = !!this.debug;
};
