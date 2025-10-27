
import IGaleriaView from '../../../domain/viewmodels/IGaleriaView.js';

class GalleryView extends IGaleriaView {
  static updateModalButtonsI18n(i18n) {
    if (!i18n || !i18n.ui || !i18n.ui.modal) return;
    const btnAnterior = document.getElementById('anterior');
    const btnSiguiente = document.getElementById('siguiente');
    const btnPlantaAnterior = document.getElementById('planta-anterior');
    const btnPlantaSiguiente = document.getElementById('planta-siguiente');
    if (btnAnterior && i18n.ui.modal.anterior) {
      btnAnterior.textContent = i18n.ui.modal.anterior;
    }
    if (btnSiguiente && i18n.ui.modal.siguiente) {
      btnSiguiente.textContent = i18n.ui.modal.siguiente;
    }
    if (btnPlantaAnterior && i18n.ui.modal.plantaAnterior) {
      btnPlantaAnterior.textContent = i18n.ui.modal.plantaAnterior;
    }
    if (btnPlantaSiguiente && i18n.ui.modal.plantaSiguiente) {
      btnPlantaSiguiente.textContent = i18n.ui.modal.plantaSiguiente;
    }
  }

  constructor(useCase) {
    super();
    this.useCase = useCase;
    this.modal = document.getElementById('modal');
    this.imagenAmpliada = document.getElementById('imagen-ampliada');
    this.caption = document.getElementById('caption');
    this.cerrarBtn = document.getElementById('cerrar');
    this.btnAnterior = document.getElementById('anterior');
    this.btnSiguiente = document.getElementById('siguiente');
    this.btnPlantaAnterior = document.getElementById('planta-anterior');
    this.btnPlantaSiguiente = document.getElementById('planta-siguiente');
    this.seccionActual = this.useCase.floors[0];
    this.imagenActualIndex = 0;
  }

  loadThumbnails() {
    this.useCase.floors.forEach((floor) => {
      const contenedor = document.querySelector(`#${floor} .imagenes`);
      if (!contenedor) return;
      contenedor.innerHTML = '';
      this.useCase.repository.getImages(floor).forEach((imgObj, index) => {
        const img = document.createElement('img');
        img.src = imgObj.src;
        img.alt = imgObj.alt;
        img.tabIndex = 0;
        img.setAttribute('data-floor', floor);
        img.setAttribute('data-index', index);
        img.classList.add('miniatura');
        img.addEventListener('click', () => {
          this.useCase.selectFloor(floor);
          this.useCase.selectImage(index);
          this.seccionActual = floor;
          this.imagenActualIndex = index;
          this.showImage();
          this.openModal();
        });
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

  openModal() {
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  showImage() {
    const imgObj = this.useCase.currentImage();
    if (!imgObj) {
      this.closeModal();
      return;
    }
    this.imagenAmpliada.src = imgObj.src;
    this.imagenAmpliada.alt = imgObj.alt;
    const imgs = this.useCase.imagesOfFloor();
    this.caption.textContent = `${imgObj.alt} (${this.useCase.currentImageIndex + 1} de ${imgs.length})`;
    this.updateButtons();
  }

  updateButtons() {
    // Ocultar botón anterior si estamos en la foto 0 de la primera planta
    const isFirstFloor = this.useCase.floors.indexOf(this.useCase.currentFloor) === 0;
    const isFirstImage = this.useCase.currentImageIndex === 0;
    this.btnAnterior.style.display = (isFirstFloor && isFirstImage) ? 'none' : '';

    // Ocultar botón siguiente si estamos en la última foto de la azotea
    const isLastFloor = this.useCase.floors.indexOf(this.useCase.currentFloor) === this.useCase.floors.length - 1;
    const imgs = this.useCase.imagesOfFloor();
    const isLastImage = this.useCase.currentImageIndex === imgs.length - 1;
    this.btnSiguiente.style.display = (isLastFloor && isLastImage) ? 'none' : '';

    // Planta anterior/siguiente: solo deshabilitar si no hay planta
    this.btnPlantaAnterior.disabled = !this.useCase.canGoPreviousFloor();
    this.btnPlantaSiguiente.disabled = !this.useCase.canGoNextFloor();
  }

  bindEvents() {
    document.addEventListener('i18nLoaded', (e) => {
      GalleryView.updateModalButtonsI18n(e.detail && e.detail.i18n);
    });
    this.btnAnterior.addEventListener('click', () => {
      const isFirstImage = this.useCase.currentImageIndex === 0;
      const isFirstFloor = this.useCase.floors.indexOf(this.useCase.currentFloor) === 0;
      if (isFirstImage && !isFirstFloor) {
        // Ir a la última foto de la planta inferior
        const prevFloorIdx = this.useCase.floors.indexOf(this.useCase.currentFloor) - 1;
        const prevFloor = this.useCase.floors[prevFloorIdx];
        const imgs = this.useCase.repository.getImages(prevFloor);
        this.useCase.selectFloor(prevFloor);
        this.useCase.selectImage(imgs.length - 1);
      } else {
        this.useCase.goPrevious();
      }
      this.showImage();
    });
    this.btnSiguiente.addEventListener('click', () => {
      const imgs = this.useCase.imagesOfFloor();
      const isLastImage = this.useCase.currentImageIndex === imgs.length - 1;
      const isLastFloor = this.useCase.floors.indexOf(this.useCase.currentFloor) === this.useCase.floors.length - 1;
      if (isLastImage && !isLastFloor) {
        // Ir a la primera foto de la planta superior
        const nextFloorIdx = this.useCase.floors.indexOf(this.useCase.currentFloor) + 1;
        const nextFloor = this.useCase.floors[nextFloorIdx];
        this.useCase.selectFloor(nextFloor);
        this.useCase.selectImage(0);
      } else {
        this.useCase.goNext();
      }
      this.showImage();
    });
    this.btnPlantaAnterior.addEventListener('click', () => {
      this.useCase.goPreviousFloor();
      this.showImage();
    });
    this.btnPlantaSiguiente.addEventListener('click', () => {
      this.useCase.goNextFloor();
      this.showImage();
    });
    this.cerrarBtn.addEventListener('click', () => this.closeModal());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display === 'flex') {
        this.closeModal();
      }
    });
  }

  closeModal() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

export default GalleryView;
