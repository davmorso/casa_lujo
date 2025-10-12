document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  // DOM IDs -> keys en i18n JSON
  const DOM_TO_JSON_KEY = {
    'primer-piso': 'planta-1',
    'segundo-piso': 'planta-2',
    'tercer-piso': 'planta-3',
    'cuarto-piso': 'planta-4'
  };

  // carga i18n (fallback a vacío si falla)
  let i18n = {};
  try {
    const resp = await fetch('./i18n/galeria.es.json', { cache: 'no-cache' });
    if (resp.ok) i18n = await resp.json();
  } catch (e) {
    console.warn('No se pudo cargar i18n/galeria.es.json:', e);
  }

  // Construye objeto "pisos" usando los arrays imgs de i18n.textos[planta-x].imagen
  const pisos = {};
  Object.keys(DOM_TO_JSON_KEY).forEach(domId => {
    const jsonKey = DOM_TO_JSON_KEY[domId];
    const data = i18n.textos && i18n.textos[jsonKey];
    if (data && Array.isArray(data.imagenes)) {
      pisos[domId] = data.imagenes.map(img => ({ src: img.src, alt: img.alt || '' }));
    } else {
      pisos[domId] = []; // vacío si no hay datos
    }
  });

  const plantas = Object.keys(pisos);

  // Variables para controlar estado
  let seccionActual = null;
  let imagenActualIndex = 0;

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

  // Rellena textos de botones desde i18n (si existen)
  const uiModal = i18n.ui && i18n.ui.modal ? i18n.ui.modal : {};
  if (btnPlantaAnterior && uiModal.plantaAnterior) btnPlantaAnterior.textContent = uiModal.plantaAnterior;
  if (btnPlantaSiguiente && uiModal.plantaSiguiente) btnPlantaSiguiente.textContent = uiModal.plantaSiguiente;
  if (btnAnterior && uiModal.anterior) btnAnterior.textContent = uiModal.anterior;
  if (btnSiguiente && uiModal.siguiente) btnSiguiente.textContent = uiModal.siguiente;
  if (cerrarBtn && uiModal.cerrar) cerrarBtn.textContent = uiModal.cerrar;

  const ofWord = (i18n.ui && i18n.ui.modal && i18n.ui.modal.of) ? i18n.ui.modal.of : 'de';

  // Función para crear las miniaturas en cada sección
  function cargarMiniaturas() {
    plantas.forEach((planta) => {
      const contenedor = document.querySelector(`#${planta} .imagenes`);
      if (!contenedor) return;
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
          mostrarImagen();
          if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
          }
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
    const imgs = pisos[seccionActual] || [];
    if (!imgs || imgs.length === 0) {
      cerrarModal();
      return;
    }

    if (imagenActualIndex < 0) imagenActualIndex = 0;
    if (imagenActualIndex >= imgs.length) imagenActualIndex = imgs.length - 1;

    const imgObj = imgs[imagenActualIndex];

    if (!imagenAmpliada) return;

    // romper transform anterior y cargar nueva src; esperar a onload para reset/centrado
    imagenAmpliada.onload = () => {
      // reset de zoom (escala 1, origen centrado)
      scale = 1;
      originX = 0;
      originY = 0;
      setTransform(); // aplicará transform (none si scale==1 por CSS)
      // NOTA: no abrimos el modal aquí para evitar apertura automática en refresh
      actualizarBotones();
    };

    // asignar src (disparará onload si existe)
    imagenAmpliada.src = imgObj.src;
    imagenAmpliada.alt = imgObj.alt || '';

    if (caption) {
      caption.textContent = `${imgObj.alt} (${imagenActualIndex + 1} ${ofWord} ${imgs.length})`;
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
      btnAnterior.style.display = ''; // mostrar
      btnAnterior.disabled = false;
    } else {
      // estamos en la primera imagen de la planta actual
      if (idxPlanta > 0) {
        // no estamos en la primera planta: ir a la última de la planta anterior
        btnAnterior.style.display = '';
        btnAnterior.disabled = false;
      } else {
        // primera planta, primera foto -> ocultar botón anterior
        btnAnterior.style.display = 'none';
      }
    }

    // botón "siguiente"
    if (!btnSiguiente) return;
    if (imagenActualIndex < imgs.length - 1) {
      // aún hay imágenes en la misma planta
      btnSiguiente.style.display = '';
      btnSiguiente.disabled = false;
    } else {
      // última imagen de la planta actual
      if (idxPlanta < plantas.length - 1) {
        // hay una siguiente planta -> mostrar botón para pasar a la siguiente planta
        btnSiguiente.style.display = '';
        btnSiguiente.disabled = false;
      } else {
        // estamos en la última planta y en su última imagen -> ocultar siguiente
        btnSiguiente.style.display = 'none';
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

  // Cargar miniaturas al inicio
  cargarMiniaturas();

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
