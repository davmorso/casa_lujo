// Interface para el caso de uso de envío de formulario de contacto
// Cumple con DDD y SOLID

class IEnviarFormularioContacto {
  /**
   * Ejecuta el envío del formulario
   * @param {Object} data
   * @returns {Promise<Object>} Resultado
   */
  async execute(data) { throw new Error('Not implemented'); }
}

module.exports = IEnviarFormularioContacto;
