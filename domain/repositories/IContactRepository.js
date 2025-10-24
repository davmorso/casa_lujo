// Interface para el repositorio de contacto
// Cumple con DDD y SOLID

class IContactRepository {
  /**
   * Envía el formulario de contacto
   * @param {Object} data
   * @returns {Promise<Object>} Resultado
   */
  async sendContactForm(data) { throw new Error('Not implemented'); }
}

module.exports = IContactRepository;
