// Carga dinámicamente i18n/galeria.es.json y rellena secciones con data-texto
'use strict';

(async function () {
  try {
    const res = await fetch('./i18n/galeria.es.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('No se pudo cargar i18n');
    const json = await res.json();

    // meta general
    if (json.meta) {
      if (json.meta.title) document.title = json.meta.title;
      const setMeta = (selector, value, attr = 'content') => {
        if (!value) return;
        const el = document.querySelector(selector);
        if (el) el.setAttribute(attr, value);
      };
      setMeta('meta[name="description"]', json.meta.description);
      setMeta('meta[name="keywords"]', json.meta.keywords);
      setMeta('meta[name="author"]', json.meta.author);
      // OpenGraph
      setMeta('meta[property="og:title"]', json.meta.og?.title);
      setMeta('meta[property="og:description"]', json.meta.og?.description);
      setMeta('meta[property="og:type"]', json.meta.og?.type);
      setMeta('meta[property="og:url"]', json.meta.og?.url);
      setMeta('meta[property="og:image"]', json.meta.og?.image);
      // Twitter
      setMeta('meta[name="twitter:card"]', json.meta.twitter?.card);
      setMeta('meta[name="twitter:title"]', json.meta.twitter?.title);
      setMeta('meta[name="twitter:description"]', json.meta.twitter?.description);
      setMeta('meta[name="twitter:image"]', json.meta.twitter?.image);
    }     

    // header
    if (json.header) {
      const hdDesktop = document.getElementById('header-title-desktop');
      const hdMobile = document.getElementById('header-title-mobile');
      const hdPrice = document.getElementById('header-price');
      if (hdDesktop && json.header.title_desktop) hdDesktop.textContent = json.header.title_desktop;
      if (hdMobile && json.header.title_mobile) hdMobile.textContent = json.header.title_mobile;
      if (hdPrice && (json.header.price || json.header.price === '')) hdPrice.textContent = json.header.price;
    }

    // descripción general (si existe)
    const desc = document.getElementById('descripcion-text');
    if (desc && json.descripcion) desc.innerHTML = json.descripcion;

    // características (colocadas entre descripción y primera planta)
    if (json.detalles && Array.isArray(json.detalles.caracteristicas) && json.detalles.caracteristicas.length) {
      const carSec = document.getElementById('caracteristicas-section');
      if (carSec) {
        carSec.innerHTML = '';
        const hCar = document.createElement('h3');
        hCar.textContent = json.detalles.caracteristicas_titulo || 'Características';
        carSec.appendChild(hCar);
        const ulCar = document.createElement('ul');
        json.detalles.caracteristicas.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          ulCar.appendChild(li);
        });
        carSec.appendChild(ulCar);
      }
    }

    // rellenar cada sección con data-texto = key en json.textos
    const textos = (json.textos) || {};
    document.querySelectorAll('.piso-seccion[data-texto]').forEach(sec => {
      const key = sec.getAttribute('data-texto');
      const data = textos[key];
      const textoCont = sec.querySelector('.piso-texto');
      // NO tocar el contenedor .imagenes aquí — lo maneja js/galeria.js
      if (!data) {
        sec.style.display = 'none';
        return;
      }
      sec.style.display = '';

      // titulo y puntos
      if (textoCont) {
        textoCont.innerHTML = '';
        const h = document.createElement('h2');
        h.textContent = data.titulo || '';
        textoCont.appendChild(h);

        if (Array.isArray(data.puntos) && data.puntos.length) {
          const ul = document.createElement('ul');
          data.puntos.forEach(p => {
            const li = document.createElement('li');
            li.innerHTML = p;
            ul.appendChild(li);
          });
          textoCont.appendChild(ul);
        }
      }

      // dejar .imagenes intacto para que galeria.js sea el único que monte miniaturas
    });

    // detalles
    if (json.detalles) {
      const det = document.getElementById('detalles-section');
      if (det) {
        det.innerHTML = '';
        const h = document.createElement('h3');
        h.textContent = json.detalles.titulo || 'Detalles';
        det.appendChild(h);
        if (Array.isArray(json.detalles.puntos)) {
          const ul = document.createElement('ul');
          json.detalles.puntos.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p;
            ul.appendChild(li);
          });
          det.appendChild(ul);
        }
      }
    }

    // contacto
    if (json.contacto) {
      const c = document.getElementById('contacto-section');
      if (c) {
        c.innerHTML = '';
        const p = document.createElement('p');
        p.textContent = json.contacto.texto || '';
        c.appendChild(p);
        if (json.contacto.telefono) {
          const tel = document.createElement('p');
          tel.innerHTML = `<a href="tel:${json.contacto.telefono}" style="font-weight:bold;">${json.contacto.telefono}</a>`;
          c.appendChild(tel);
        }
      }
    }

    // cookie banner texts
    if (json.ui && json.ui.cookieBanner) {
      const banner = document.getElementById('cookie-banner');
      if (banner) {
        const span = banner.querySelector('span');
        if (span) span.textContent = json.ui.cookieBanner.texto || span.textContent;
        const aceptar = document.getElementById('aceptar-cookies');
        const rechazar = document.getElementById('rechazar-cookies');
        if (aceptar) aceptar.textContent = json.ui.cookieBanner.aceptar || aceptar.textContent;
        if (rechazar) rechazar.textContent = json.ui.cookieBanner.rechazar || rechazar.textContent;
      }
    }

    // footer
    if (json.ui && json.ui.footer) {
      const footerP = document.getElementById('footer-copy');
      if (footerP) footerP.textContent = json.ui.footer;
      if (json.ui.links && json.ui.links.politica_privacidad) {
        const fp = document.getElementById('footer-privacy');
        if (fp) {
          fp.textContent = json.ui.links.politica_privacidad;
        }
      }
    }

  } catch (err) {
    console.warn('Carga i18n fallida:', err);
  }
})();