// Interfaz para la vista de galería
// Cumple con SOLID

export default class IGaleriaView {
  /**
   * Carga las miniaturas en el DOM
   */
  loadThumbnails() { throw new Error('Not implemented'); }

  /**
   * Muestra la imagen ampliada
   */
  showImage() { throw new Error('Not implemented'); }

  /**
   * Actualiza los botones de navegación
   */
  updateButtons() { throw new Error('Not implemented'); }

  /**
   * Vincula los eventos del DOM
   */
  bindEvents() { throw new Error('Not implemented'); }

  /**
   * Cierra el modal de imagen
   */
  closeModal() { throw new Error('Not implemented'); }
}
