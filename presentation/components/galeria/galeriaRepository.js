// galeriaRepository.js - Repositorio de datos para la galería
class GaleriaRepository {
  constructor(i18n) {
    this.i18n = i18n || window.i18n || {};
    // Mapea los IDs de DOM a las claves del JSON
    this.DOM_TO_JSON_KEY = {
      'primer-piso': 'planta-1',
      'segundo-piso': 'planta-2',
      'tercer-piso': 'planta-3',
      'cuarto-piso': 'planta-4'
    };
  }

  getPlantas() {
    return Object.keys(this.DOM_TO_JSON_KEY);
  }

  getImagenes(planta) {
    const jsonKey = this.DOM_TO_JSON_KEY[planta];
    const data = this.i18n.textos && this.i18n.textos[jsonKey];
    if (data && Array.isArray(data.imagenes)) {
      return data.imagenes.map(img => ({ src: img.src, alt: img.alt || '' }));
    }
    return [];
  }
}

window.GaleriaRepository = GaleriaRepository;
