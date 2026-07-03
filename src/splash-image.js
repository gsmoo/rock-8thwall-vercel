const splashImageComponent = {
  schema: {
    disableWorldTracking: {type: 'bool', default: false},
    requestGyro: {type: 'bool', default: false},
  },

  init() {
    const splashimage = document.getElementById('splashimage');
    const start = document.getElementById('start');

    // Validación básica
    if (!splashimage || !start) {
      console.warn('❌ Faltan elementos #splashimage o #start en el DOM.');
      return;
    }

    // Mostrar el botón de inicio
    start.style.display = 'block';

    const addXRWeb = () => {
      // Configura 3DoF si se solicita
      if (this.data.requestGyro && this.data.disableWorldTracking) {
        XR8.addCameraPipelineModule({
          name: 'request-gyro',
          requiredPermissions: () => [XR8.XrPermissions.permissions().DEVICE_ORIENTATION],
        });
      }

      // Configurar el sistema XR
      this.el.sceneEl.setAttribute(
        'xrweb',
        `allowedDevices: any; disableWorldTracking: ${this.data.disableWorldTracking}`
      );

      // Ocultar pantalla de splash
      splashimage.classList.add('hidden');
    };

    // Ejecutar al hacer click en el botón
    start.onclick = addXRWeb;
  },
};

export { splashImageComponent };
