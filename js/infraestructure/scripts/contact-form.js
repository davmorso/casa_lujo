document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const modal = document.getElementById('contact-modal');
  const openBtn = document.getElementById('open-contact-btn');
  const closeBtn = document.getElementById('contact-close');
  const cancelBtn = document.getElementById('contact-cancel');
  const form = document.getElementById('contact-form');
  const note = document.getElementById('contact-note');

  const inpNombre = document.getElementById('contact-nombre');
  const inpTelefono = document.getElementById('contact-telefono');
  const inpEstructura = document.getElementById('contact-estructura');
  const inpExperiencia = document.getElementById('contact-experiencia');
  const inpAcepto = document.getElementById('contact-acepto');

  let labels = null;

  // Apply labels when we receive i18n (from lang-switcher)
  function applyLabels(i18nContact) {
    const l = i18nContact || labels || {
      titulo: 'Contactar', boton_abrir:'Contactar interesado',
      labels:{nombre:'Nombre', telefono:'Teléfono', estructura_compra:'Estructura compra', experiencia:'Experiencia', acepto:'Acepto la política'},
      placeholders:{nombre:'', telefono:'', estructura_compra:'', experiencia:''},
      botones:{enviar:'Preparar correo', cancelar:'Cancelar'},
      email:{recipientes:['dmoraroca@gmail.com','mmora@canalip.com']}, nota_envio:'Se abrirá tu cliente de correo.'
    };

    document.getElementById('contact-title').textContent = l.titulo;
    openBtn.textContent = l.boton_abrir;
    document.getElementById('label-nombre').textContent = l.labels.nombre;
    document.getElementById('label-telefono').textContent = l.labels.telefono;
    document.getElementById('label-estructura').textContent = l.labels.estructura_compra;
    document.getElementById('label-experiencia').textContent = l.labels.experiencia;
    document.getElementById('label-acepto').textContent = l.labels.acepto;
    document.getElementById('contact-cancel').textContent = l.botones.cancelar;
    document.getElementById('contact-submit').textContent = l.botones.enviar;
    note.textContent = l.nota_envio || '';

    inpNombre.placeholder = l.placeholders.nombre || '';
    inpTelefono.placeholder = l.placeholders.telefono || '';
    inpEstructura.placeholder = l.placeholders.estructura_compra || '';
    inpExperiencia.placeholder = l.placeholders.experiencia || '';
    labels = l;
  }

  // Listen for i18nLoaded from lang-switcher
  document.addEventListener('i18nLoaded', (e) => {
    const i18n = e.detail?.i18n || {};
    const lang = e.detail?.lang || localStorage.getItem('site_lang') || 'es';
    console.log('[contact-form] i18nLoaded for', lang);
    if (i18n.contacto) applyLabels(i18n.contacto);
    else applyLabels(); // fallback
  });
 
  // fallback: if no event fired in 300ms, load based on localStorage (ensures labels available)
  setTimeout(() => {
    if (!labels) {
      const lang = localStorage.getItem('site_lang') || 'es';
      fetch(`./i18n/galeria.${lang}.json`).then(r => r.ok ? r.json() : null).then(j => {
        applyLabels(j?.contacto || null);
      }).catch(()=>applyLabels());
    }
  }, 300);
 
  // debug
  console.log('[contact-form] init, site_lang=', localStorage.getItem('site_lang'));

  function openModal() {
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden','false');
    setTimeout(() => inpNombre.focus(), 50);
  }
  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden','true');
  }

  function setError(fieldName, message) {
    const el = document.querySelector(`.field-error[data-for="${fieldName}"]`);
    if (el) el.textContent = message || '';
  }
  function clearErrors() { document.querySelectorAll('.field-error').forEach(e => e.textContent = ''); }

  function validateAll() {
    clearErrors();
    const l = labels?.errores || { requerido:'Este campo es obligatorio', aceptar_politica:'Debes aceptar la política de privacidad' };
    let ok = true;
    if (!inpNombre.value.trim()) { setError('nombre', l.requerido); ok = false; }
    if (!inpTelefono.value.trim()) { setError('telefono', l.requerido); ok = false; }
    if (!inpEstructura.value.trim()) { setError('estructura_compra', l.requerido); ok = false; }
    if (!inpExperiencia.value.trim()) { setError('experiencia', l.requerido); ok = false; }
    if (!inpAcepto.checked) { setError('acepto', l.aceptar_politica || l.aceptar || 'Debes aceptar la política'); ok = false; }
    return ok;
  }

  function sendMailClient() {
    const l = labels || {};
    const payload = {
      nombre: inpNombre.value.trim(),
      telefono: inpTelefono.value.trim(),
      estructura: inpEstructura.value.trim(),
      experiencia: inpExperiencia.value.trim(),
      acepta: !!inpAcepto.checked,
      asunto: (l.email && l.email.asunto_prefijo) ? l.email.asunto_prefijo : 'Interés'
    };

    debugger;

    // Intentar enviar al servidor via fetch
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json().catch(()=>({ok:false}))).then(result => {
      if (result && result.ok) {
        note.textContent = l.nota_envio_success || 'Mensaje enviado correctamente.';
        closeModal();
      } else if (result && result.error === 'mail_not_configured') {
          // Mostrar error al usuario si el servidor no está configurado
          alert('No se pudo enviar el formulario: el servidor no está configurado para enviar correos.');
      } else {
        // otro fallo -> fallback
          alert('No se pudo enviar el formulario: el servidor no está configurado para enviar correos.');
      }
    }).catch(() => {
      // si hay error de red, fallback a mailto
        // si hay error de red, mostrar error
        alert('No se pudo enviar el formulario por un error de red.');
    });
  }

  // Eliminado fallback a mailto: solo se usa envío por servidor

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    sendMailClient();
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && modal && modal.style.display === 'flex') closeModal();
  });

});