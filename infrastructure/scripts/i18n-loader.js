'use strict';

/*
	i18n-loader.js
	- Expone applyI18n / ensureCompleteI18n
	- Inicialmente carga galeria.es.json
	- Al recibir evento 'i18nLoaded' aplica la traducción (merge con ES si es necesario)
*/

function deepMerge(base, over) {
	if (!base) return over || {};
	if (!over) return base;
	const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
	for (const k of Object.keys(over)) {
		const bv = base[k], ov = over[k];
		if (bv && typeof bv === 'object' && !Array.isArray(bv) && ov && typeof ov === 'object' && !Array.isArray(ov)) {
			out[k] = deepMerge(bv, ov);
		} else {
			out[k] = ov;
		}
	}
	return out;
}

function replaceUlWithItems(container, items) {
	if (!container) return;
	container.innerHTML = '';
	(items || []).forEach(i => {
		const li = document.createElement('li');
		li.textContent = i;
		container.appendChild(li);
	});
}

function applyI18n(json = {}) {
		// Botones de navegación del modal (anterior/siguiente/planta)
		if (json.ui && json.ui.modal) {
			const btnAnterior = document.getElementById('anterior');
			const btnSiguiente = document.getElementById('siguiente');
			const btnPlantaAnterior = document.getElementById('planta-anterior');
			const btnPlantaSiguiente = document.getElementById('planta-siguiente');
			// Actualizar caption del modal si existe y hay traducción
			const caption = document.getElementById('caption');
			if (caption && json.ui && json.ui.modal && json.ui.modal.caption) {
				caption.textContent = json.ui.modal.caption;
			}
	if (btnSiguiente && json.ui.modal.siguiente) {
		// usar textContent para evitar insertar HTML y crear un span para la flecha
		btnSiguiente.textContent = json.ui.modal.siguiente;
		// añadir flecha visual si no existe ya (evitar duplicados)
		if (!btnSiguiente.querySelector('.btn-arrow')) {
			const span = document.createElement('span');
			span.className = 'btn-arrow';
			span.textContent = ' ▶';
			btnSiguiente.appendChild(span);
		}
	}
			if (btnPlantaAnterior && json.ui.modal.plantaAnterior) btnPlantaAnterior.textContent = json.ui.modal.plantaAnterior;
			if (btnPlantaSiguiente && json.ui.modal.plantaSiguiente) btnPlantaSiguiente.textContent = json.ui.modal.plantaSiguiente;
		}
		// Contact link (barra superior)
		if (json.ui && json.ui.links && json.ui.links.contacto_boton) {
			const contactLink = document.getElementById('contact-link');
			if (contactLink) contactLink.textContent = json.ui.links.contacto_boton;
		}
	try {
		// meta
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
			setMeta('meta[property="og:title"]', json.meta.og?.title);
			setMeta('meta[property="og:description"]', json.meta.og?.description);
			setMeta('meta[property="og:type"]', json.meta.og?.type);
			setMeta('meta[property="og:url"]', json.meta.og?.url);
			setMeta('meta[property="og:image"]', json.meta.og?.image);
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
			if (hdDesktop && json.header.title_desktop !== undefined) hdDesktop.textContent = json.header.title_desktop;
			if (hdMobile && json.header.title_mobile !== undefined) hdMobile.textContent = json.header.title_mobile;
			if (hdPrice && (json.header.price !== undefined)) hdPrice.textContent = json.header.price;
		}

		// descripción general
		const desc = document.getElementById('descripcion-text');
		if (desc && typeof json.descripcion === 'string') desc.innerHTML = json.descripcion;

		// características colocadas en #caracteristicas-section (entre descripción y primera planta en HTML)
		if (json.detalles && Array.isArray(json.detalles.caracteristicas)) {
			const carSec = document.getElementById('caracteristicas-section');
			if (carSec) {
				carSec.innerHTML = '';
				const hCar = document.createElement('h3');
				hCar.textContent = json.detalles.caracteristicas_titulo || json.detalles.caracteristicasTitulo || 'Características';
				carSec.appendChild(hCar);
				const ulCar = document.createElement('ul');
				replaceUlWithItems(ulCar, json.detalles.caracteristicas);
				carSec.appendChild(ulCar);
			}
		}

		// secciones de planta (.piso-seccion[data-texto])
		const textos = json.textos || {};
		document.querySelectorAll('.piso-seccion[data-texto]').forEach(sec => {
			const key = sec.getAttribute('data-texto');
			const data = textos[key];
			const textoCont = sec.querySelector('.piso-texto');
			const imgCont = sec.querySelector('.imagenes');

			if (!data) {
				sec.style.display = 'none';
				return;
			} else {
				sec.style.display = '';
			}

			if (textoCont) {
					textoCont.innerHTML = '';
					const h = document.createElement('h2');
					h.textContent = data.titulo || '';
					textoCont.appendChild(h);
					if (Array.isArray(data.puntos) && data.puntos.length) {
						const ul = document.createElement('ul');
						data.puntos.forEach(p => {
							const li = document.createElement('li');
							li.textContent = p;
							ul.appendChild(li);
						});
						textoCont.appendChild(ul);
					}
			}

			// Limpiar contenedor de imágenes, pero NO generar miniaturas aquí
			if (imgCont) {
				imgCont.innerHTML = '';
			}
		});

		// Disparar evento personalizado para notificar que el i18n ha sido aplicado
		document.dispatchEvent(new CustomEvent('i18nApplied'));

		// detalles (mantener sección en su sitio, reemplazar contenido interno)
		if (json.detalles) {
			const det = document.getElementById('detalles-section');
			if (det) {
				det.innerHTML = '';
				const h = document.createElement('h3');
				h.textContent = json.detalles.titulo || 'Detalles';
				det.appendChild(h);
				if (Array.isArray(json.detalles.puntos) && json.detalles.puntos.length) {
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

		// cookie banner
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
				if (fp) fp.textContent = json.ui.links.politica_privacidad;
			}
		}
		// Guardar el i18n globalmente para otros módulos (como galería)
		window.i18n = json;
	} catch (err) {
		console.warn('[i18n-loader] applyI18n error', err);
	}
}

async function ensureCompleteI18n(json = {}, lang = 'es') {
	try {
		// si el JSON ya tiene las claves principales aplicamos directo
		if (json && (json.descripcion || json.textos || json.detalles)) {
			applyI18n(json);
			return;
		}
		// fallback: cargar ES y mergear
		const resp = await fetch('./i18n/galeria.es.json', { cache: 'no-cache' });
		if (!resp.ok) {
			applyI18n(json);
			return;
		}
		const es = await resp.json();
		const merged = deepMerge(es, json || {});
		applyI18n(merged);
	} catch (err) {
		console.warn('[i18n-loader] ensureCompleteI18n error', err);
		applyI18n(json);
	}
}

/* inicial: cargar ES por defecto */
(async function init() {
	try {
		const res = await fetch('./i18n/galeria.es.json', { cache: 'no-cache' });
		if (res && res.ok) {
			const j = await res.json();
			applyI18n(j);
		}
	} catch (err) {
		console.warn('[i18n-loader] initial load failed', err);
	}
})();

/* escuchar cambiador de idioma */
document.addEventListener('i18nLoaded', (ev) => {
	const j = ev?.detail?.i18n || {};
	const lang = ev?.detail?.lang || 'es';
	ensureCompleteI18n(j, lang);
});

/* exponer para que lang-switcher pueda llamar directamente */
window.applyI18n = applyI18n;
window.ensureCompleteI18n = ensureCompleteI18n;
