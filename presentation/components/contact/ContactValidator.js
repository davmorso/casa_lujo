// Interfaz para validadores
class IContactValidator {
  validate(contact, labels) {
    throw new Error('Not implemented');
  }
}

// Validador base, extensible
class ContactValidator extends IContactValidator {
  constructor(validators = []) {
    super();
    this.validators = validators;
  }
  validate(contact, labels) {
    let errors = {};
    for (const v of this.validators) {
      errors = { ...errors, ...v(contact, labels) };
    }
    return errors;
  }
}

// Ejemplo de validador simple
function requiredFieldsValidator(contact, labels) {
  const errors = {};
  if (!contact.nombre) errors.nombre = labels?.requerido || 'Campo obligatorio';
  if (!contact.telefono) errors.telefono = labels?.requerido || 'Campo obligatorio';
  if (!contact.email) errors.email = labels?.requerido || 'Campo obligatorio';
  if (!contact.estructura) errors.estructura_compra = labels?.requerido || 'Campo obligatorio';
  if (!contact.experiencia) errors.experiencia = labels?.requerido || 'Campo obligatorio';
  if (!contact.acepta) errors.acepto = labels?.aceptar_politica || 'Debes aceptar la política de privacidad';
  return errors;
}

export { IContactValidator, ContactValidator, requiredFieldsValidator };
