import IGalleryRepository from '../../../domain/repositories/IGaleriaRepository.js';

export default class GalleryRepository extends IGalleryRepository {
  constructor(i18n) {
    super();
    this.i18n = i18n || window.i18n || {};
    this.DOM_TO_JSON_KEY = {
      'primer-piso': 'planta-1',
      'segundo-piso': 'planta-2',
      'tercer-piso': 'planta-3',
      'cuarto-piso': 'planta-4'
    };
  }

  getFloors() {
    return Object.keys(this.DOM_TO_JSON_KEY);
  }

  getImages(floor) {
    const jsonKey = this.DOM_TO_JSON_KEY[floor];
    const data = this.i18n.textos && this.i18n.textos[jsonKey];
    if (data && Array.isArray(data.imagenes)) {
      return data.imagenes.map(img => ({ src: img.src, alt: img.alt || '' }));
    }
    return [];
  }
}
