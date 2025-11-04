    // ...existing code...
    // Activar el modal de contacto al hacer clic en el botón 'AQUÍ'
    // Asegurar que el modal de contacto se abre siempre con un solo clic y los labels se actualizan
    setTimeout(() => {
      const btn = document.getElementById('contact-link-bar');
      if (btn) {
        btn.onclick = () => {
          if (typeof window.initContactModal === 'function') {
            window.initContactModal();
          } else {
            // fallback: importar y crear instancia si no existe
            import('../../application/usecases/ContactFormView.js').then(mod => {
              const i18n = window.i18n && typeof window.i18n.getCurrentI18n === 'function' ? window.i18n.getCurrentI18n() : null;
              const labels = i18n && i18n.contacto && i18n.contacto.labels ? i18n.contacto.labels : {};
              const botones = i18n && i18n.contacto && i18n.contacto.botones ? i18n.contacto.botones : {};
              window._contactFormViewInstance = new mod.default({ labels: { ...labels, botones }, modalId: 'contact-modal' });
              window._contactFormViewInstance.openModal();
            });
          }
        };
      }
      // Cambiar el texto del botón de la barra gris a 'Contactenos' según el JSON
      const btnBar = document.getElementById('contactenos-btn');
      if (btnBar && window._casaData && window._casaData.ui && window._casaData.ui.contactBar) {
        btnBar.textContent = window._casaData.ui.contactBar.text || 'Contactenos';
      }
    }, 300);
// house.js
// Clase Casa que gestiona las plantas y carga las fotos desde el JSON de idioma

import Gallery from '../gallery/gallery.js';

export default class Casa {
  constructor(config) {
    this.idioma = config.idioma || 'es';
    this.data = config.data; // El JSON de la casa por idioma
    this.container = config.container || document.body;
    this.floors = [];
    this._init();
  }

  _init() {
    if (!this.data || !this.data.textos) return;

    // Mostrar descripción antes de todo

    if (this.data.descripcion) {
      const descripcionDiv = document.createElement('section');
      descripcionDiv.id = 'descripcion-casa';
      descripcionDiv.style.maxWidth = '900px';
      descripcionDiv.style.margin = '32px auto 0 auto';
      descripcionDiv.innerHTML = `<div style="font-size:1.18rem;color:#333;line-height:1.7;">${this.data.descripcion}</div>`;
      this.container.appendChild(descripcionDiv);
    }

    // Mostrar características justo después de la descripción, usando data.caracteristicas
    if (this.data.caracteristicas && Array.isArray(this.data.caracteristicas.puntos)) {
      const caracteristicasDiv = document.createElement('section');
      caracteristicasDiv.id = 'caracteristicas';
      caracteristicasDiv.style.maxWidth = '900px';
      caracteristicasDiv.style.margin = '18px auto 0 auto';
      const tituloCaracteristicas = this.data.caracteristicas.titulo || 'Características';
      caracteristicasDiv.innerHTML = `
        <h2 style="font-size:2rem;color:#222;margin-bottom:12px;">${tituloCaracteristicas}</h2>
        <ul style="font-size:1.18rem;color:#333;line-height:1.7;margin-left:18px;">
          ${this.data.caracteristicas.puntos.map(c => `<li>${c}</li>`).join('')}
        </ul>
      `;
      this.container.appendChild(caracteristicasDiv);
    }

    // Mostrar todas las plantas en orden y guardarlas en this.floors
    const ordenPlantas = ['planta-1', 'planta-2', 'planta-3', 'planta-4'];
    this.floors = [];
    ordenPlantas.forEach((plantaKey, idx) => {
      const planta = this.data.textos[plantaKey];
      if (planta) {
        // Aseguramos que cada elemento de floors es un objeto planta completo
        const objPlanta = {
          titulo: planta.titulo || '',
          imagenes: Array.isArray(planta.imagenes) ? planta.imagenes : [],
          puntos: Array.isArray(planta.puntos) ? planta.puntos : [],
          idx,
          // Puedes añadir más propiedades si las necesitas
        };
        this.floors.push(objPlanta);
        this._renderFloor(objPlanta, idx);
      }
      // Después de la cuarta planta, mostrar detalles y características (intercambiados)
      if (plantaKey === 'planta-4') {
        // Bloque de detalles adicionales primero
        if (this.data.detalles && Array.isArray(this.data.detalles.puntos)) {
          const detallesDiv = document.createElement('section');
          detallesDiv.id = 'detalles-adicionales';
          detallesDiv.style.maxWidth = '900px';
          detallesDiv.style.margin = '32px auto 0 auto';
          detallesDiv.style.padding = '24px 18px 18px 18px';
          detallesDiv.style.background = '#f7f7f7';
          detallesDiv.style.borderRadius = '18px';
          detallesDiv.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)';
          detallesDiv.innerHTML = `
            <h2 style="font-size:2rem;color:#222;margin-bottom:12px;">${this.data.detalles.titulo || 'Detalles adicionales'}</h2>
            <ul style="font-size:1.18rem;color:#333;line-height:1.7;margin-left:18px;">
              ${this.data.detalles.puntos.map(d => `<li>${d}</li>`).join('')}
            </ul>
          `;
          this.container.appendChild(detallesDiv);

          // Mostrar texto de contacto después de detalles adicionales
          if (this.data.ui && this.data.ui.contact && this.data.ui.contact.text) {
            const contactoDiv = document.createElement('div');
            contactoDiv.id = 'contacto-info';
            contactoDiv.style.maxWidth = '900px';
            contactoDiv.style.margin = '48px auto 48px auto';
            contactoDiv.style.textAlign = 'center';
            contactoDiv.innerHTML = `<div style="font-size:1.22rem;color:#222;line-height:1.7;">${this.data.ui.contact.text}</div>`;
            this.container.appendChild(contactoDiv);
          }
        }
      }
    });
  }

  _renderFloor(floor, idx) {
  // Crear el contenedor de la planta
  const floorDiv = document.createElement('div');
  floorDiv.className = 'floor-block';
  floorDiv.style.maxWidth = '900px';
  floorDiv.style.margin = '32px auto';

  // Título en la primera línea
  const tituloDiv = document.createElement('div');
  tituloDiv.innerHTML = `<h2 class="floor-title">${floor.titulo || ''}</h2>`;
  floorDiv.appendChild(tituloDiv);

  // Puntos descriptivos más indentados
  const puntosDiv = document.createElement('div');
  puntosDiv.style.paddingLeft = '32px';
  puntosDiv.innerHTML = `<ul class="floor-points">${(floor.puntos || []).map(p => `<li>${p}</li>`).join('')}</ul>`;
  floorDiv.appendChild(puntosDiv);

  // Galería de imágenes debajo de los puntos
  const galleryDiv = document.createElement('div');
  galleryDiv.className = 'floor-gallery';
  galleryDiv.style.marginTop = '18px';
  galleryDiv.innerHTML = `<div id="gallery-container-${idx}" class="gallery"></div>`;
  floorDiv.appendChild(galleryDiv);

  this.container.appendChild(floorDiv);
  // Cargar la galería de fotos de la planta
  const galleryInstance = new Gallery(`gallery-container-${idx}`, floor.imagenes || []);

  // Añadir evento para abrir el modal robusto al hacer clic en cualquier imagen
  const galleryContainer = document.getElementById(`gallery-container-${idx}`);
  if (galleryContainer) {
    galleryContainer.querySelectorAll('img').forEach((img, imgIdx) => {
      img.addEventListener('click', () => {
        if (!window._galleryModalInstance) {
          import('../gallery/gallery-modal/GalleryModal.js').then(mod => {
            window._galleryModalInstance = new mod.default();
            window._galleryModalInstance.open(this.floors, idx);
          });
        } else {
          window._galleryModalInstance.open(this.floors, idx);
        }
      });
    });
  }
  }
}
