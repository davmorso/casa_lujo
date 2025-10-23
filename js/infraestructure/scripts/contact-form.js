document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------- Referencias DOM
  const modal = document.getElementById('contact-modal');
  const openBtn = document.getElementById('open-contact-btn');
  const closeBtn = document.getElementById('contact-close');
  const cancelBtn = document.getElementById('contact-cancel');
  const form = document.getElementById('contact-form');
  const note = document.getElementById('contact-note');

  const inpNombre = document.getElementById('contact-nombre');
  const inpTelefono = document.getElementById('contact-telefono');
  const inpEmail = document.getElementById('contact-email');
  const inpEstructura = document.getElementById('contact-estructura');
  const inpExperiencia = document.getElementById('contact-experiencia');
  const inpAcepto = document.getElementById('contact-acepto');

  const submitBtn = document.getElementById('contact-submit');

  let labels = null;
  let lastFocused = null;

  // --------- Utilidades
  function normalizeBaseUrl(url) {
    if (!url) return '';
    return url.replace(/\/+$/, ''); // quita barras finales
  }

  function qsaWithin(container, selector) {
    return Array.prototype.slice.call(container.querySelectorAll(selector));
  }

  // Focus trap muy sencillo
  function enableFocusTrap() {
    if (!modal) return;
    const focusables = qsaWithin(
      modal,
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
    if (focusables.length === 0) return;

    function onKeyDown(e) {
      if (e.key !== 'Tab') return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) { // shift + tab
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else { // tab
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    modal.__trapHandler = onKeyDown;
    modal.addEventListener('keydown', onKeyDown);
  }

  function disableFocusTrap() {
    if (!modal || !modal.__trapHandler) return;
    modal.removeEventListener('keydown', modal.__trapHandler);
    delete modal.__trapHandler;
  }

  // --------- i18n / Etiquetas
  function applyLabels(i18nContact) {
    const l = i18nContact || labels || {
      titulo: 'Contactar',
      boton_abrir: 'Contactar interesado',
      labels: {
        nombre: 'Nombre',
        telefono: 'Teléfono',
        email: 'Email',
        estructura_compra: 'Estructura compra',
        experiencia: 'Experiencia',
        acepto: 'Acepto la política'
      },
      placeholders: { nombre: '', telefono: '', estructura_compra: '', experiencia: '' },
      botones: { enviar: 'Preparar correo', cancelar: 'Cancelar' },
      email: { recipientes: ['dmoraroca@gmail.com', 'mmora@canalip.com'] },
      nota_envio: 'Se abrirá tu cliente de correo.',
      errores: { requerido: 'Este campo es obligatorio', aceptar_politica: 'Debes aceptar la política de privacidad' }
    };

    const byId = (id) => document.getElementById(id);

  byId('contact-title') && (byId('contact-title').textContent = l.titulo);
  openBtn && (openBtn.textContent = l.boton_abrir);
  byId('label-nombre') && (byId('label-nombre').textContent = l.labels.nombre);
  byId('label-telefono') && (byId('label-telefono').textContent = l.labels.telefono);
  byId('label-email') && (byId('label-email').textContent = l.labels.email);
  byId('label-estructura') && (byId('label-estructura').textContent = l.labels.estructura_compra);
  byId('label-experiencia') && (byId('label-experiencia').textContent = l.labels.experiencia);
    // Enlace a política de privacidad según idioma
    if (byId('label-acepto')) {
      const lang = localStorage.getItem('site_lang') || 'es';
      let href = 'js/application/politica-privacidad.html';
      if (lang === 'ca') href = 'js/application/politica-privacidad-ca.html';
      else if (lang === 'en') href = 'js/application/politica-privacidad-en.html';
      else if (lang === 'fr') href = 'js/application/politica-privacidad-fr.html';
      else if (lang === 'ru') href = 'js/application/politica-privacidad-ru.html';
      else if (lang === 'zh') href = 'js/application/politica-privacidad-zh.html';
      // Usar la traducción de la etiqueta, reemplazando el texto por un enlace si es necesario
      let label = l.labels.acepto || '';
      // Buscar la palabra "política de privacidad" (o su traducción) y convertirla en enlace
      // Si la traducción contiene <a>, no hacer nada
      if (!/<a /i.test(label)) {
        // Buscar la palabra clave (en cada idioma)
        let keyword = '';
        if (lang === 'es') keyword = 'política de privacidad';
        else if (lang === 'ca') keyword = 'política de privacitat';
        else if (lang === 'en') keyword = 'privacy policy';
        else if (lang === 'fr') keyword = 'politique de confidentialité';
        else if (lang === 'ru') keyword = 'политику конфиденциальности';
        else if (lang === 'zh') keyword = '隐私政策';
        if (keyword && label.includes(keyword)) {
          label = label.replace(keyword, '<a href="' + href + '" target="_blank" rel="noopener" style="color:#3366cc;text-decoration:underline;">' + keyword + '</a>');
        }
      }
      byId('label-acepto').innerHTML = label;
    }
    cancelBtn && (cancelBtn.textContent = l.botones.cancelar);
    submitBtn && (submitBtn.textContent = l.botones.enviar);
    note && (note.textContent = l.nota_envio || '');

    if (inpNombre) inpNombre.placeholder = l.placeholders.nombre || '';
    if (inpTelefono) inpTelefono.placeholder = l.placeholders.telefono || '';
    if (inpEstructura) inpEstructura.placeholder = l.placeholders.estructura_compra || '';
    if (inpExperiencia) inpExperiencia.placeholder = l.placeholders.experiencia || '';
    labels = l;
  }

  // Escuchar i18nLoaded del lang-switcher
  document.addEventListener('i18nLoaded', (e) => {
    const i18n = e.detail?.i18n || {};
    const lang = e.detail?.lang || localStorage.getItem('site_lang') || 'es';
    console.log('[contact-form] i18nLoaded for', lang);
    if (i18n.contacto) applyLabels(i18n.contacto);
    else applyLabels(); // fallback
    // Si el modal está abierto, volver a aplicar etiquetas
    const modal = document.getElementById('contact-modal');
    if (modal && modal.style.display === 'flex') {
      if (i18n.contacto) applyLabels(i18n.contacto);
      else applyLabels();
    }
  });

  // Fallback: si no llega el evento en 300ms, cargar por localStorage
  setTimeout(() => {
    if (!labels) {
      const lang = localStorage.getItem('site_lang') || 'es';
      fetch(`./i18n/galeria.${lang}.json`)
        .then(r => (r.ok ? r.json() : null))
        .then(j => { applyLabels(j?.contacto || null); })
        .catch(() => applyLabels());
    }
  }, 300);

  // --------- Modal
  function openModal() {
  if (!modal) return;
  // Aplicar etiquetas del idioma actual SIEMPRE al abrir
  try {
    const lang = localStorage.getItem('site_lang') || 'es';
    fetch(`./i18n/galeria.${lang}.json`)
      .then(r => (r.ok ? r.json() : null))
      .then(j => { if (j && j.contacto) applyLabels(j.contacto); });
  } catch (e) {}
  // Limpiar todos los campos del formulario al abrir
  if (form) form.reset();
  if (inpNombre) inpNombre.value = '';
  if (inpTelefono) inpTelefono.value = '';
  if (inpEstructura) inpEstructura.value = '';
  if (inpExperiencia) inpExperiencia.value = '';
  if (inpAcepto) inpAcepto.checked = false;
  clearErrors();
  note && (note.textContent = '');
  lastFocused = document.activeElement;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  enableFocusTrap();
  setTimeout(() => inpNombre && inpNombre.focus(), 50);
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    disableFocusTrap();
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  // --------- Validación
  function setError(fieldName, message) {
    const el = document.querySelector(`.field-error[data-for="${fieldName}"]`);
    if (el) el.textContent = message || '';
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(e => (e.textContent = ''));
  }

  function validateAll() {
    clearErrors();
    const l = labels?.errores || { requerido: 'Este campo es obligatorio', aceptar_politica: 'Debes aceptar la política de privacidad' };
    let ok = true;

    const nombre = inpNombre?.value.trim() || '';
    let telefono = inpTelefono?.value.trim() || '';
    const estructura = inpEstructura?.value.trim() || '';
    const experiencia = inpExperiencia?.value.trim() || '';
    const acepta = !!inpAcepto?.checked;
    const email = document.getElementById('contact-email')?.value.trim() || '';

    // Validación de teléfono
    // Si empieza por +, acepta formato internacional
    // Si son 9 dígitos, añade +34
    // Si no cumple, error
    let telefonoValido = false;
    if (/^\+\d{7,15}$/.test(telefono)) {
      telefonoValido = true;
    } else if (/^\d{9}$/.test(telefono)) {
      telefono = '+34' + telefono;
      telefonoValido = true;
    }
    if (!telefonoValido) {
      setError('telefono', 'Teléfono inválido. Debe ser 9 dígitos (España) o formato internacional (+XX...).');
      ok = false;
    }

    // Validación de email (si existe campo)
    if (document.getElementById('contact-email')) {
      const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
      if (email && !emailRegex.test(email)) {
        setError('email', 'Email inválido.');
        ok = false;
      }
    }

    if (!nombre) { setError('nombre', l.requerido); ok = false; }
    if (!telefono) { setError('telefono', l.requerido); ok = false; }
    if (!estructura) { setError('estructura_compra', l.requerido); ok = false; }
    if (!experiencia) { setError('experiencia', l.requerido); ok = false; }
    if (!acepta) { setError('acepto', l.aceptar_politica || l.aceptar || 'Debes aceptar la política'); ok = false; }

    return ok;
  }

  // --------- Envío
  async function sendMailClient() {
    const l = labels || {};
    const payload = {
      nombre: inpNombre?.value.trim() || '',
      email: inpEmail?.value.trim() || '', // Added email to payload
      telefono: inpTelefono?.value.trim() || '',
      estructura: inpEstructura?.value.trim() || '',
      experiencia: inpExperiencia?.value.trim() || '',
      acepta: !!inpAcepto?.checked,
      asunto: (l.email && l.email.asunto_prefijo) ? l.email.asunto_prefijo : 'Interés'
    };

    const base = normalizeBaseUrl(window.BACKEND_URL) || 'http://192.168.1.41:8080';
    const url = `${base}/api/contact`;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('sending');
      }

    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Intenta parsear JSON sólo si viene JSON
      let data = null;
      const ct = r.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try { data = await r.json(); } catch {}
      }

      if (!r.ok) {
        const msg = (data && (data.message || data.error)) || `Error ${r.status}`;
        throw new Error(msg);
      }

      if (data && data.ok) {
        note && (note.textContent = l.nota_envio_success || 'Mensaje enviado correctamente.');
        closeModal();
      } else {
        throw new Error((data && (data.message || data.error)) || 'No se pudo procesar la solicitud.');
      }
    } catch (err) {
      const msg = String(err?.message || '').toLowerCase();
      const debugDiv = document.getElementById('debug-info');
      const debugLog = document.getElementById('debug-log');
      let debugMsg = '';
      if (msg.includes('mail_not_configured')) {
        debugMsg = 'No se pudo enviar el formulario: el servidor no está configurado para enviar correos.';
      } else if (msg.includes('network') || msg.includes('failed to fetch')) {
        debugMsg = 'No se pudo enviar el formulario por un error de red.';
      } else {
        debugMsg = 'No se pudo enviar el formulario. ' + (err?.message || '');
      }
      if (debugDiv && debugLog) {
        debugDiv.style.display = 'block';
        debugLog.textContent = debugMsg;
      } else {
        alert(debugMsg);
      }
    } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('sending');
        }
    }
  }

  // --------- Listeners
  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitBtn && submitBtn.disabled) return; // Evita reenvíos múltiples
    if (!validateAll()) return;
    sendMailClient();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && modal && modal.style.display === 'flex') closeModal();
  });

  // Debug
  console.log('[contact-form] init, site_lang=', localStorage.getItem('site_lang'));
});