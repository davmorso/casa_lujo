// Implementación concreta del caso de uso usando la interfaz y el repositorio
const IEnviarFormularioContacto = require('../../domain/usecases/IEnviarFormularioContacto');
const IContactRepository = require('../../domain/repositories/IContactRepository');

class EnviarFormularioContacto extends IEnviarFormularioContacto {
  /**
   * @param {IContactRepository} contactRepository
   */
  constructor(contactRepository) {
    super();
    this.contactRepository = contactRepository;
  }

  /**
   * Ejecuta el envío del formulario
   * @param {Object} data
   * @returns {Promise<Object>} Resultado
   */
  async execute(data) {
    // Aquí se delega la lógica al repositorio
    return await this.contactRepository.sendContactForm(data);
  }
}

module.exports = EnviarFormularioContacto;
