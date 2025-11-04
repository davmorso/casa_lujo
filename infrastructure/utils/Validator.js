// Centralized Validator class for contact form
class Validator {
  static validateRequired(value, label) {
    if (!value) throw new Error(label || 'Campo obligatorio');
  }

  static validateEmail(value, label) {
    if (!value) throw new Error(label || 'Campo obligatorio');
    // Simple email regex
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(value)) throw new Error(label || 'Email inválido');
  }

  // Add more validation methods as needed
}

export default Validator;
