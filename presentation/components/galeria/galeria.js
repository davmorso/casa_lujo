document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  // DOM IDs -> keys en i18n JSON
  const DOM_TO_JSON_KEY = {
    'primer-piso': 'planta-1',
    'segundo-piso': 'planta-2',
    'tercer-piso': 'planta-3',
    'cuarto-piso': 'planta-4'
  };

  // Variables globales para galería
  let i18n = {};
  let pisos = {};
  let plantas = [];
  let seccionActual = null;
  let imagenActualIndex = 0;

  // Exponer variables y función globalmente para integración con otros scripts
  window.seccionActual = seccionActual;
  window.imagenActualIndex = imagenActualIndex;
  window.mostrarImagen = mostrarImagen;
  window.pisos = pisos;

  // Exponer variables y función globalmente para integración con otros scripts
  window.seccionActual = null;
  window.imagenActualIndex = 0;
  window.mostrarImagen = mostrarImagen;

  // Función para construir/reconstruir la galería desde i18n
  function buildGallery(newI18n) {
    i18n = newI18n || {};
    // Guardar posición actual antes de reconstruir
    const prevSeccion = seccionActual;
    const prevIndex = imagenActualIndex;
    pisos = {};
    Object.keys(DOM_TO_JSON_KEY).forEach(domId => {
      const jsonKey = DOM_TO_JSON_KEY[domId];
      const data = i18n.textos && i18n.textos[jsonKey];
      if (data && Array.isArray(data.imagenes)) {
        pisos[domId] = data.imagenes.map(img => ({ src: img.src, alt: img.alt || '' }));
      } else {
        pisos[domId] = [];
      }
    });
    window.pisos = pisos;
    plantas = Object.keys(pisos);
    // Restaurar posición si existe y es válida
    // Si las variables globales han sido actualizadas por un click en miniatura, respétalas
    let restoreSeccion = window.seccionActual || prevSeccion;
    let restoreIndex = typeof window.imagenActualIndex === 'number' ? window.imagenActualIndex : prevIndex;
    if (restoreSeccion && pisos[restoreSeccion] && restoreIndex >= 0 && restoreIndex < pisos[restoreSeccion].length) {
      seccionActual = restoreSeccion;
      imagenActualIndex = restoreIndex;
    } else {
      seccionActual = plantas[0] || null;
      imagenActualIndex = 0;
    }
    window.seccionActual = seccionActual;
    window.imagenActualIndex = imagenActualIndex;
    cargarMiniaturas(true);
    mostrarImagen();
    actualizarBotones();
    actualizarBotonesI18n();
  }

  // Cargar i18n inicial según idioma guardado
  async function loadInitialI18n() {
    let lang = 'es';
    // Prioridad: window.__i18n_buffer.lang > localStorage > html lang
    // Preferir buffer global si existe (lang + i18n objeto)
    if (window.__i18n_buffer && window.__i18n_buffer.lang) {
      lang = window.__i18n_buffer.lang;
      // si además ya trae el JSON, usarlo directamente
      if (window.__i18n_buffer.i18n) {
        buildGallery(window.__i18n_buffer.i18n);
        return;
      }
    } else if (localStorage.getItem('selectedLang')) {
      // lang-switcher usa 'selectedLang' como clave en localStorage
      lang = localStorage.getItem('selectedLang');
    } else if (document.documentElement.lang) {
      lang = document.documentElement.lang;
    }
    try {
      const resp = await fetch(`./i18n/galeria.${lang}.json`, { cache: 'no-cache' });
      if (resp.ok) {
        const json = await resp.json();
        buildGallery(json);
      } else {
        // fallback a español si no existe el archivo
        const respEs = await fetch('./i18n/galeria.es.json', { cache: 'no-cache' });
        if (respEs.ok) {
          const jsonEs = await respEs.json();
          buildGallery(jsonEs);
        } else {
          buildGallery({});
        }
      }
    } catch (e) {
      console.warn(`No se pudo cargar i18n/galeria.${lang}.json:`, e);
      buildGallery({});
    }
  }

  // ...variables ahora globales...

  // Zoom / transform defaults (si el módulo de zoom no está presente, evitamos errores)
  // Estos valores son usados por mostrarImagen() y clampTransform()
  let scale = 1;
  let originX = 0;
  let originY = 0;

  // setTransform: aplica transform a la imagen ampliada o hace no-op si no existe
  function setTransform() {
    if (!imagenAmpliada) return;
    if (scale > 1) {
      imagenAmpliada.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
    } else {
      imagenAmpliada.style.transform = 'none';
    }
  }

  // Referencias DOM
  const modal = document.getElementById('modal');
  const imagenAmpliada = document.getElementById('imagen-ampliada');
  const caption = document.getElementById('caption');
  const cerrarBtn = document.getElementById('cerrar');
  const btnAnterior = document.getElementById('anterior');
  const btnSiguiente = document.getElementById('siguiente');
  const btnPlantaAnterior = document.getElementById('planta-anterior');
  const btnPlantaSiguiente = document.getElementById('planta-siguiente');

  // Función para actualizar textos de botones desde i18n
  function actualizarBotonesI18n() {
    const uiModal = i18n.ui && i18n.ui.modal ? i18n.ui.modal : {};
    if (btnPlantaAnterior && uiModal.plantaAnterior) btnPlantaAnterior.textContent = uiModal.plantaAnterior;
    if (btnPlantaSiguiente && uiModal.plantaSiguiente) btnPlantaSiguiente.textContent = uiModal.plantaSiguiente;
    if (btnAnterior && uiModal.anterior) btnAnterior.textContent = uiModal.anterior;
    if (btnSiguiente && uiModal.siguiente) btnSiguiente.textContent = uiModal.siguiente;
    if (cerrarBtn && uiModal.cerrar) cerrarBtn.textContent = uiModal.cerrar;
  }

  function getOfWord() {
    return (i18n.ui && i18n.ui.modal && i18n.ui.modal.of) ? i18n.ui.modal.of : 'de';
  }

  // Función para crear las miniaturas en cada sección
  function cargarMiniaturas(limpiar = false) {
    plantas.forEach((planta) => {
      const contenedor = document.querySelector(`#${planta} .imagenes`);
      if (!contenedor) return;
      if (limpiar) contenedor.innerHTML = '';
      pisos[planta].forEach((imgObj, index) => {
        const img = document.createElement('img');
        img.src = imgObj.src;
        img.alt = imgObj.alt;
        img.tabIndex = 0;
        img.setAttribute('data-planta', planta);
        img.setAttribute('data-index', index);
        img.classList.add('miniatura');

        img.addEventListener('click', () => {
          seccionActual = planta;
          imagenActualIndex = index;
          window.seccionActual = planta;
          window.imagenActualIndex = index;
          mostrarImagen();
          abrirModal();
        });

        img.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            img.click();
          }
        });

        contenedor.appendChild(img);
      });
    });
  }

  // asegurar modal oculto al inicio (evita que aparezca al refrescar)
  if (modal) {
    modal.style.display = 'none';
  }
  document.body.style.overflow = '';

  // Mostrar la imagen actual en el modal (actualizado para centrar/reset)
  function mostrarImagen() {
    // Usar variables globales si existen
    const plantaKey = window.seccionActual || seccionActual;
    const imgIdx = typeof window.imagenActualIndex === 'number' ? window.imagenActualIndex : imagenActualIndex;
    const imgs = pisos[plantaKey] || [];
    if (!imgs || imgs.length === 0) {
      cerrarModal();
      return;
    }

    let idx = imgIdx;
    if (idx < 0) idx = 0;
    if (idx >= imgs.length) idx = imgs.length - 1;

    const imgObj = imgs[idx];

    if (!imagenAmpliada) return;

    imagenAmpliada.onload = () => {
      scale = 1;
      originX = 0;
      originY = 0;
      setTransform();
      actualizarBotones();
    };

    imagenAmpliada.src = imgObj.src;
    imagenAmpliada.alt = imgObj.alt || '';

    if (caption) {
      let captionText = imgObj.alt || '';
      try {
        const jsonKey = DOM_TO_JSON_KEY[plantaKey];
        if (i18n && i18n.textos && jsonKey && i18n.textos[jsonKey] && Array.isArray(i18n.textos[jsonKey].imagenes)) {
          const jsonImg = i18n.textos[jsonKey].imagenes[idx];
          if (jsonImg && (jsonImg.alt || jsonImg.caption)) {
            captionText = jsonImg.alt || jsonImg.caption || captionText;
          }
        }
      } catch (e) {
        console.warn('Error leyendo caption desde i18n:', e);
      }
      caption.textContent = `${captionText} (${idx + 1} ${getOfWord()} ${imgs.length})`;
    }
  }

  // clampTransform: no permitir translate cuando no hay zoom (mantener centrado)
  function clampTransform() {
    if (!imagenAmpliada) return;
    if (scale <= 1) {
      // centrado: quitamos desplazamientos para evitar que la imagen aparezca "cortada"
      originX = 0;
      originY = 0;
      return;
    }

    // comportamiento previo para limits cuando hay zoom
    const rect = imagenAmpliada.getBoundingClientRect();
    const dispW = rect.width;
    const dispH = rect.height;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (dispW <= vw) {
      originX = 0;
    } else {
      // limitar dentro de viewport
      originX = Math.min(0, Math.max(originX, vw - dispW));
    }
    if (dispH <= vh) {
      originY = 0;
    } else {
      originY = Math.min(0, Math.max(originY, vh - dispH));
    }
  }

  // Actualiza el estado habilitado/visible de botones
  function actualizarBotones() {
    if (!seccionActual) return;

    const imgs = pisos[seccionActual] || [];
    const idxPlanta = plantas.indexOf(seccionActual);

    // botón "anterior"
    if (!btnAnterior) return; // seguridad
    if (imagenActualIndex > 0) {
      btnAnterior.style.display = '';
      btnAnterior.disabled = false;
    } else {
      if (idxPlanta > 0) {
        btnAnterior.style.display = '';
        btnAnterior.disabled = false;
      } else {
        btnAnterior.style.display = 'none';
      }
    }

    // botón "siguiente"
    if (!btnSiguiente) return;
    if (imagenActualIndex < imgs.length - 1) {
      btnSiguiente.style.display = '';
      btnSiguiente.disabled = false;
    } else {
      if (idxPlanta < plantas.length - 1) {
        btnSiguiente.style.display = '';
        btnSiguiente.disabled = false;
      } else {
        btnSiguiente.style.display = 'none';
      }
    }

    // botón "Bajar piso" (planta-anterior)
    if (btnPlantaAnterior) {
      if (idxPlanta <= 0) {
        btnPlantaAnterior.style.display = 'none';
        btnPlantaAnterior.disabled = true;
      } else {
        btnPlantaAnterior.style.display = '';
        btnPlantaAnterior.disabled = false;
      }
    }

    // botón "Subir piso" (planta-siguiente)
    if (btnPlantaSiguiente) {
      if (idxPlanta >= plantas.length - 1) {
        btnPlantaSiguiente.style.display = 'none';
        btnPlantaSiguiente.disabled = true;
      } else {
        btnPlantaSiguiente.style.display = '';
        btnPlantaSiguiente.disabled = false;
      }
    }
  }

  // Navegar entre imágenes dentro de la misma planta / entre plantas
  if (btnAnterior) {
    btnAnterior.addEventListener('click', () => {
      if (!seccionActual) return;
      // si no es la primera imagen de la planta, retroceder
      if (imagenActualIndex > 0) {
        imagenActualIndex--;
        window.imagenActualIndex = imagenActualIndex;
        mostrarImagen();
        return;
      }
      // si es la primera imagen de la planta, intentar cambiar a la planta anterior
      const idxPlanta = plantas.indexOf(seccionActual);
      if (idxPlanta > 0) {
        const prevPlanta = plantas[idxPlanta - 1];
        const prevImgs = pisos[prevPlanta] || [];
        seccionActual = prevPlanta;
        imagenActualIndex = Math.max(0, prevImgs.length - 1); // última imagen de la planta anterior
        window.seccionActual = seccionActual;
        window.imagenActualIndex = imagenActualIndex;
        mostrarImagen();
      }
      // si idxPlanta === 0 => primera planta y primera foto -> no hacer nada (botón está oculto)
    });
  }

  if (btnSiguiente) {
    btnSiguiente.addEventListener('click', () => {
      if (!seccionActual) return;
      const imgs = pisos[seccionActual] || [];
      // si no es la última imagen de la planta, avanzar
      if (imagenActualIndex < imgs.length - 1) {
        imagenActualIndex++;
        window.imagenActualIndex = imagenActualIndex;
        mostrarImagen();
        return;
      }
      // si es la última imagen de la planta, intentar pasar a la siguiente planta
      const idxPlanta = plantas.indexOf(seccionActual);
      if (idxPlanta < plantas.length - 1) {
        const nextPlanta = plantas[idxPlanta + 1];
        const nextImgs = pisos[nextPlanta] || [];
        seccionActual = nextPlanta;
        imagenActualIndex = 0; // primera imagen de la siguiente planta
        window.seccionActual = seccionActual;
        window.imagenActualIndex = imagenActualIndex;
        mostrarImagen();
      }
      // si idxPlanta es la última planta -> no hacer nada (botón estará oculto)
    });
  }

  // Navegación por plantas (botones "Planta anterior" / "Planta siguiente")
  if (btnPlantaAnterior) {
    btnPlantaAnterior.addEventListener('click', () => {
      if (!seccionActual) return;
      const idxPlanta = plantas.indexOf(seccionActual);
      if (idxPlanta > 0) {
        seccionActual = plantas[idxPlanta - 1];
        imagenActualIndex = 0; // posicionar en la PRIMERA foto de la planta anterior
        window.seccionActual = seccionActual;
        window.imagenActualIndex = imagenActualIndex;
        mostrarImagen();
        if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
      }
    });
  }

  if (btnPlantaSiguiente) {
    btnPlantaSiguiente.addEventListener('click', () => {
      if (!seccionActual) return;
      const idxPlanta = plantas.indexOf(seccionActual);
      if (idxPlanta < plantas.length - 1) {
        seccionActual = plantas[idxPlanta + 1];
        imagenActualIndex = 0; // posicionar en la PRIMERA foto de la planta siguiente
        window.seccionActual = seccionActual;
        window.imagenActualIndex = imagenActualIndex;
        mostrarImagen();
        if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
      }
    });
  }

  // Cerrar modal
  if (cerrarBtn) cerrarBtn.addEventListener('click', cerrarModal);
  function cerrarModal() {
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Cerrar modal con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      cerrarModal();
    }
  });

  // Cargar i18n inicial y miniaturas
  await loadInitialI18n();

  // Escuchar evento de i18n aplicado para recargar galería/miniaturas
  document.addEventListener('i18nApplied', function() {
    // Usar el i18n global si está disponible
    if (window.i18n) {
      buildGallery(window.i18n);
    } else if (typeof window.getCurrentI18n === 'function') {
      buildGallery(window.getCurrentI18n());
    } else {
      // fallback: intentar reconstruir con el último i18n usado
      buildGallery(i18n);
    }
  });

  const banner = document.getElementById('cookie-banner');
  const aceptarBtn = document.getElementById('aceptar-cookies');
  const rechazarBtn = document.getElementById('rechazar-cookies');

  if (banner && aceptarBtn && rechazarBtn) {
    const cookiesAceptadas = localStorage.getItem('cookies_aceptadas');

    if (cookiesAceptadas === 'true' || cookiesAceptadas === 'false') {
      banner.style.display = 'none';
    }

    aceptarBtn.addEventListener('click', function () {
      localStorage.setItem('cookies_aceptadas', 'true');
      banner.style.display = 'none';
      // Aquí puedes activar scripts de análisis si los usas (ej. Google Analytics)
    });

    rechazarBtn.addEventListener('click', function () {
      localStorage.setItem('cookies_aceptadas', 'false');
      banner.style.display = 'none';
      // Aquí podrías bloquear scripts si los estuvieras usando
    });
  }

  // Forzar controles visibles y adaptar layout según ancho
  function ajustarControlesModal() {
    if (!modal) return;
    // añadir clase para forzar visibilidad
    modal.classList.add('controls-visible');

    // en móvil mover caption fuera de la imagen (añade clase caption-below)
    if (window.innerWidth <= 600) {
      if (caption) caption.classList.add('caption-below');
      // opcional: desplazar el caption al final del modal para que quede bajo la imagen
      if (imagenAmpliada && caption && caption.parentNode !== modal) {
        // si caption está dentro del modal (posición absoluta), lo dejamos; el CSS .caption-below lo mostrará como estático
        // no movemos DOM salvo que quieras realmente reubicarlo:
      }
    } else {
      if (caption) caption.classList.remove('caption-below');
    }
  }

  // Llamar cuando se abre el modal
  function abrirModal() {
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // asegurar botones visibles y actualizados
    ajustarControlesModal();
    actualizarBotones();
  }

  // Si tienes un handler que abre, sustituir modal.style.display='flex' por abrirModal()
  // Ejemplo: en el click de thumbnail:
  // thumb.addEventListener('click', () => {
  //   seccionActual = planta;
  //   imagenActualIndex = index;
  //   mostrarImagen();
  //   abrirModal();
  // });

  // También ajustar al cambiar tamaño de ventana mientras modal abierto
  window.addEventListener('resize', () => {
    if (modal && modal.style.display === 'flex') ajustarControlesModal();
  });
});
  