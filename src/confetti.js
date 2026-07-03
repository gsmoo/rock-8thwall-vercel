AFRAME.registerComponent('confetti-loop', {
  init: function () {
    this.confettiGroup = null;
    this.isEmitting = false;
    this.emitTimer = 0;
    this.totalToEmit = 150;
    this.emitted = 0;
    this.emissionDuration = 0.2;

    this.nextPulse = () => {
      if (this.confettiGroup) {
        this.el.sceneEl.object3D.remove(this.confettiGroup);
        this.confettiGroup = null;
      }

      this.confettiGroup = new THREE.Group();
      this.el.sceneEl.object3D.add(this.confettiGroup);
      this.emitted = 0;
      this.emitTimer = 0;
      this.isEmitting = true;
    };

    this.nextPulse();
    this.interval = setInterval(this.nextPulse, 8000);
  },

  emitSingleParticle: function () {
    const emitter = this.el.object3D;
    const emitterPos = new THREE.Vector3();
    emitter.getWorldPosition(emitterPos);
    const emitterQuat = new THREE.Quaternion();
    emitter.getWorldQuaternion(emitterQuat);

    const colors = [0x913199, 0xecbf1b, 0x1fcfad, 0x1f7ccf];
    const geometry = new THREE.PlaneGeometry(0.35, 0.20);
    const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);

    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1,
      side: THREE.DoubleSide,
      roughness: 0,
      metalness: 0,
      transparent: true,
      opacity: 1.0
    });

    const particle = new THREE.Mesh(geometry, material);
    particle.position.copy(emitterPos);

    // Rotación aleatoria inicial
    particle.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    // Velocidad de rotación aleatoria inicial
    particle.userData.rotationSpeed = new THREE.Vector3(
      Math.random() * 2.3,
      Math.random() * 1.725,
      Math.random() * 0.8
    );

    // Dirección de lanzamiento con inclinación
    const angle = THREE.MathUtils.degToRad(60);
    const baseDir = new THREE.Vector3(0, Math.sin(angle), -Math.cos(angle));
    baseDir.x += (Math.random() - 0.5) * 0.4;
    baseDir.y += (Math.random() - 0.5) * 0.2;
    baseDir.z += (Math.random() - 0.5) * 0.4;

    const direction = baseDir.normalize().multiplyScalar((8.4 + Math.random() * 2.4) * 1.4);
    direction.applyQuaternion(emitterQuat);
    particle.userData.velocity = direction;
    particle.userData.age = 0;

    this.confettiGroup.add(particle);
  },

  tick: function (time, deltaTime) {
    const delta = deltaTime / 1000;
    const gravity = new THREE.Vector3(0, -4.5, 0); // caída 10% más suave
    const maxLifetime = 4.84; // +10% lifetime total
    const fadeDuration = maxLifetime * 0.25; // fade-out en el último 25%

    if (this.isEmitting) {
      this.emitTimer += delta;
      const rate = this.totalToEmit / this.emissionDuration;
      const targetCount = Math.floor(this.emitTimer * rate);

      while (this.emitted < targetCount && this.emitted < this.totalToEmit) {
        this.emitSingleParticle();
        this.emitted++;
      }

      if (this.emitTimer >= this.emissionDuration) {
        this.isEmitting = false;
      }
    }

    if (!this.confettiGroup) return;

    this.confettiGroup.children = this.confettiGroup.children.filter((p) => {
      // Movimiento
      p.userData.velocity.add(gravity.clone().multiplyScalar(delta));
      p.position.add(p.userData.velocity.clone().multiplyScalar(delta));

      // Desaceleración de rotación
      p.userData.rotationSpeed.multiplyScalar(0.995);

      // Aplicar rotación
      p.rotation.x += delta * p.userData.rotationSpeed.x;
      p.rotation.y += delta * p.userData.rotationSpeed.y;
      p.rotation.z += delta * p.userData.rotationSpeed.z;

      // Edad y fade-out suave en el último 25% de vida
      p.userData.age += delta;

      if (p.material && p.material.opacity !== undefined) {
        const timeLeft = maxLifetime - p.userData.age;
        if (timeLeft > fadeDuration) {
          p.material.opacity = 1.0;
        } else {
          const fadeRatio = 1 - (timeLeft / fadeDuration); // va de 0 a 1
          const eased = 1.0 - Math.pow(fadeRatio, 2); // ease-out
          p.material.opacity = Math.max(0, eased);
        }
      }

      return p.userData.age <= maxLifetime;
    });
  },

  remove: function () {
    clearInterval(this.interval);
    if (this.confettiGroup) {
      this.el.sceneEl.object3D.remove(this.confettiGroup);
    }
  }
});
