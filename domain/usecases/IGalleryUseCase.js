// Interfaz para el caso de uso de galería
// Cumple con SOLID

export default class IGalleryUseCase {
  /**
   * Selecciona el piso actual
   * @param {string} floor
   */
  selectFloor(floor) { throw new Error('Not implemented'); }

  /**
   * Selecciona la imagen actual
   * @param {number} index
   */
  selectImage(index) { throw new Error('Not implemented'); }

  /**
   * Devuelve la imagen actual
   * @returns {Object|null}
   */
  currentImage() { throw new Error('Not implemented'); }

  /**
   * Devuelve las imágenes del piso actual
   * @returns {Array}
   */
  imagesOfFloor() { throw new Error('Not implemented'); }

  /**
   * Navegación y utilidades
   */
  canGoPrevious() { throw new Error('Not implemented'); }
  canGoNext() { throw new Error('Not implemented'); }
  goPrevious() { throw new Error('Not implemented'); }
  goNext() { throw new Error('Not implemented'); }
  canGoPreviousFloor() { throw new Error('Not implemented'); }
  canGoNextFloor() { throw new Error('Not implemented'); }
  goPreviousFloor() { throw new Error('Not implemented'); }
  goNextFloor() { throw new Error('Not implemented'); }
}
