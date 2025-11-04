
// Interface para el repositorio de galería
// Cumple con DDD y SOLID

export default class IGalleryRepository {
  /**
   * Obtiene todas las imágenes de la galería
   * @returns {Promise<Array>} Array de imágenes
   */
  async getAllImages() { throw new Error('Not implemented'); }

  /**
   * Obtiene una imagen por ID
   * @param {string} id
   * @returns {Promise<Object>} Imagen
   */
  async getImageById(id) { throw new Error('Not implemented'); }
}
