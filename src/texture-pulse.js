AFRAME.registerComponent('texture-pulse', {
  init: function () {
    this.scene = this.el.sceneEl.object3D;
    this.activeParticles = [];
    this.emitParticle = this.emitParticle.bind(this);
    this.emitInterval = setInterval(this.emitParticle, 2000);
  },

  emitParticle: function () {
    const textureIDs = ['#tx1', '#tx2', '#tx3', '#tx4'];
    const chosenID = textureIDs[Math.floor(Math.random() * textureIDs.length)];
    const textureEl = document.querySelector(chosenID);

    const texture = new THREE.Texture(textureEl);
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = true;
    texture.needsUpdate = true;

    const emissiveTex = texture.clone();
    emissiveTex.encoding = THREE.sRGBEncoding;
    emissiveTex.needsUpdate = true;

    const scale = this.el.object3D.scale;
    const width = 2.5 * scale.x;
    const height = 2.5 * scale.y;

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      emissiveMap: emissiveTex,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 1.2,
      roughness: 1,
      metalness: 0,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(geometry, material);

    const startPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(startPos);
    plane.position.copy(startPos);

    // Dirección local 0 0 1 (contraria a antes)
    const localDir = new THREE.Vector3(0, 0, 1);
    const emitterQuat = this.el.object3D.getWorldQuaternion(new THREE.Quaternion());
    const worldDir = localDir.applyQuaternion(emitterQuat).normalize();

    const randomOffset = Math.random() * 2 * Math.PI;
    plane.userData = {
      lifetime: 0,
      offset: randomOffset,
      velocity: worldDir.multiplyScalar(10)
    };

    this.scene.add(plane);
    this.activeParticles.push(plane);
  },

  tick: function (time, deltaTime) {
    const delta = deltaTime / 1000;
    const toRemove = [];

    this.activeParticles.forEach((p) => {
      p.userData.lifetime += delta;

      // Movimiento recto
      p.position.add(p.userData.velocity.clone().multiplyScalar(delta));

      // Contoneo horizontal (shake en X)
      p.position.x += Math.sin(p.userData.offset + p.userData.lifetime * 5) * 0.05;

      // Disolución
      if (p.userData.lifetime >= 1.5) {
        this.scene.remove(p);
        toRemove.push(p);
      } else {
        p.material.opacity = 1 - p.userData.lifetime / 1.5;
      }
    });

    this.activeParticles = this.activeParticles.filter(p => !toRemove.includes(p));
  },

  remove: function () {
    clearInterval(this.emitInterval);
    this.activeParticles.forEach(p => this.scene.remove(p));
    this.activeParticles = [];
  }
});
