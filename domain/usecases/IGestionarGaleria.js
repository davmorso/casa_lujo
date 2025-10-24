// Interface para el caso de uso de gestión de galería
// Cumple con DDD y SOLID

class IGestionarGaleria {
  /**
   * Ejecuta la gestión de la galería (ejemplo: cargar imágenes)
   * @returns {Promise<Array>} Array de imágenes
   */
  async execute() { throw new Error('Not implemented'); }
}

module.exports = IGestionarGaleria;
