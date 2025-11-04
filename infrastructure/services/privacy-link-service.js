// PrivacyLinkService: Obtiene la URL de política de privacidad según entorno
// Cumple con SOLID: responsabilidad única, desacoplado, fácil de testear

class PrivacyLinkService {
  constructor({ basePath = '/casa_lujo', isLocal = null } = {}) {
    // Detecta si está en localhost automáticamente si no se indica
    this.isLocal = isLocal !== null ? isLocal : (window.location.hostname === 'localhost');
    this.basePath = basePath;
  }

  getPrivacyUrl(filename) {
    if (!filename) return '';
    // Siempre devolver solo el nombre del archivo, sin rutas ni prefijos
    return filename.replace(/^.*[\/]/, '');
  }
}

// Ejemplo de uso:
// const privacyService = new PrivacyLinkService();
// const url = privacyService.getPrivacyUrl('politica-privacidad-ca.html');
// ...

window.PrivacyLinkService = PrivacyLinkService;
export default PrivacyLinkService;
