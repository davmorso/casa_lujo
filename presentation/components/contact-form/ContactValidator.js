
import Validator from '../../../infrastructure/utils/Validator.js';

class ContactValidator {
  static validate(contact, labels = {}) {
    try {
  Validator.validateRequired(contact.nombre, labels?.requerido || 'Campo obligatorio');
  Validator.validateRequired(contact.telefono, labels?.requerido || 'Campo obligatorio');
  Validator.validateEmail(contact.email, labels?.email_invalido || 'Email inválido');
  Validator.validateRequired(contact.estructura, labels?.requerido || 'Campo obligatorio');
  Validator.validateRequired(contact.experiencia, labels?.requerido || 'Campo obligatorio');
  Validator.validateRequired(contact.acepta, labels?.aceptar_politica || 'Debes aceptar la política de privacidad');
      // Add more validations as needed
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default ContactValidator;
