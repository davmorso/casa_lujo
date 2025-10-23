class GaleriaView {
  // Actualiza los textos de los botones del modal según el i18n cargado
  static actualizarBotonesI18n(i18n) {
    if (!i18n || !i18n.ui || !i18n.ui.modal) return;
    const btnAnterior = document.getElementById('anterior');
    const btnSiguiente = document.getElementById('siguiente');
    const btnPlantaAnterior = document.getElementById('planta-anterior');
    const btnPlantaSiguiente = document.getElementById('planta-siguiente');
    if (btnAnterior && i18n.ui.modal.anterior) btnAnterior.textContent = i18n.ui.modal.anterior;
    if (btnSiguiente && i18n.ui.modal.siguiente) btnSiguiente.textContent = i18n.ui.modal.siguiente;
    if (btnPlantaAnterior && i18n.ui.modal.plantaAnterior) btnPlantaAnterior.textContent = i18n.ui.modal.plantaAnterior;
    if (btnPlantaSiguiente && i18n.ui.modal.plantaSiguiente) btnPlantaSiguiente.textContent = i18n.ui.modal.plantaSiguiente;
  }
  constructor(useCase) {
    this.useCase = useCase;
    // DOM
    this.modal = document.getElementById('modal');
    this.imagenAmpliada = document.getElementById('imagen-ampliada');
    this.caption = document.getElementById('caption');
    this.cerrarBtn = document.getElementById('cerrar');
    this.btnAnterior = document.getElementById('anterior');
    this.btnSiguiente = document.getElementById('siguiente');
    this.btnPlantaAnterior = document.getElementById('planta-anterior');
    this.btnPlantaSiguiente = document.getElementById('planta-siguiente');
  }

  cargarMiniaturas() {
    this.useCase.plantas.forEach((planta) => {
      const contenedor = document.querySelector(`#${planta} .imagenes`);
      if (!contenedor) return;
      this.useCase.repository.getImagenes(planta).forEach((imgObj, index) => {
        const img = document.createElement('img');
        img.src = imgObj.src;
        img.alt = imgObj.alt;
        img.tabIndex = 0;
        img.setAttribute('data-planta', planta);
        img.setAttribute('data-index', index);
        img.classList.add('miniatura');

        img.addEventListener('click', () => this.abrirModal(planta, index));
        img.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            img.click();
          }
        });

        contenedor.appendChild(img);
      });
    });
  }

  abrirModal(planta, index) {
    this.useCase.seleccionarPlanta(planta);
    this.useCase.seleccionarImagen(index);
    this.mostrarImagen();
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  mostrarImagen() {
    const imgObj = this.useCase.imagenActual();
    if (!imgObj) {
      this.cerrarModal();
      return;
    }
    this.imagenAmpliada.src = imgObj.src;
    this.imagenAmpliada.alt = imgObj.alt;
    const imgs = this.useCase.imagenesDePlanta();
    // Detectar idioma actual
    let lang = document.documentElement.lang || 'es';
    if (window.__i18n_buffer && window.__i18n_buffer.lang) lang = window.__i18n_buffer.lang;
    // Traducir el caption usando el alt de la imagen actual
    this.caption.textContent = `${imgObj.alt} (${this.useCase.imagenActualIndex + 1} de ${imgs.length})`;
    this.actualizarBotones();
  }

  actualizarBotones() {
    this.btnAnterior.disabled = !this.useCase.puedeIrAnterior();
    this.btnSiguiente.disabled = !this.useCase.puedeIrSiguiente();
    this.btnPlantaAnterior.disabled = !this.useCase.puedeIrPlantaAnterior();
    this.btnPlantaSiguiente.disabled = !this.useCase.puedeIrPlantaSiguiente();
  }

  conectarEventos() {
    // Escuchar cambio de idioma para actualizar los textos de los botones del modal
    document.addEventListener('i18nLoaded', function(e) {
      GaleriaView.actualizarBotonesI18n(e.detail && e.detail.i18n);
    });
    this.btnAnterior.addEventListener('click', () => {
      this.useCase.irAnterior();
      this.mostrarImagen();
    });

    this.btnSiguiente.addEventListener('click', () => {
      this.useCase.irSiguiente();
      this.mostrarImagen();
    });

    this.btnPlantaAnterior.addEventListener('click', () => {
      this.useCase.irPlantaAnterior();
      this.mostrarImagen();
    });

    this.btnPlantaSiguiente.addEventListener('click', () => {
      this.useCase.irPlantaSiguiente();
      this.mostrarImagen();
    });

    this.cerrarBtn.addEventListener('click', () => this.cerrarModal());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display === 'flex') {
        this.cerrarModal();
      }
    });
  }

  cerrarModal() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}