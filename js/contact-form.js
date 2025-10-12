document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const modal = document.getElementById('contact-modal');
  const openBtn = document.getElementById('open-contact-btn');
  const closeBtn = document.getElementById('contact-close');
  const cancelBtn = document.getElementById('contact-cancel');
  const form = document.getElementById('contact-form');
  const note = document.getElementById('contact-note');

  // inputs
  const inpNombre = document.getElementById('contact-nombre');
  const inpTelefono = document.getElementById('contact-telefono');
  const inpEstructura = document.getElementById('contact-estructura');
  const inpExperiencia = document.getElementById('contact-experiencia');
  const inpAcepto = document.getElementById('contact-acepto');

  // labels (llenaremos desde i18n JSON)
  let labels = null;

  async function loadLabels() {
    try {
      const res = await fetch('./i18n/galeria.es.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('i18n not found');
      const j = await res.json();
      labels = j.contacto || null;
    } catch (e) {
      console.warn('No se pudo cargar i18n/contacto, usando textos por defecto.', e);
      labels = null;
    }
    applyLabels();
  }

  function applyLabels() {
    const l = labels || {
      titulo: 'Contactar',
      boton_abrir: 'Contactar interesado',
      labels: { nombre:'Nombre', telefono:'Teléfono', estructura_compra:'Estructura compra', experiencia:'Experiencia', acepto:'Acepto la política' },
      placeholders: { nombre:'', telefono:'', estructura_compra:'', experiencia:'' },
      botones: { enviar:'Preparar correo', cancelar:'Cancelar' },
      email: { recipientes:['dmoraroca@gmail.com','mmora@canalip.com'], asunto_prefijo:'Interés' },
      errores: { requerido:'Campo obligatorio', aceptar_politica:'Debes aceptar la política' },
      nota_envio: 'Se abrirá tu cliente de correo; revisa y pulsa enviar.'
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
  }

  // abrir / cerrar modal
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

  // util validación
  function setError(fieldName, message) {
    const el = document.querySelector(`.field-error[data-for="${fieldName}"]`);
    if (el) el.textContent = message || '';
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
  }

  function validateAll() {
    clearErrors();
    const l = labels ? labels.errores : { requerido:'Este campo es obligatorio', aceptar_politica:'Debes aceptar la política de privacidad' };
    let ok = true;
    if (!inpNombre.value.trim()) { setError('nombre', l.requerido); ok = false; }
    if (!inpTelefono.value.trim()) { setError('telefono', l.requerido); ok = false; }
    if (!inpEstructura.value.trim()) { setError('estructura_compra', l.requerido); ok = false; }
    if (!inpExperiencia.value.trim()) { setError('experiencia', l.requerido); ok = false; }
    if (!inpAcepto.checked) { setError('acepto', l.aceptar_politica); ok = false; }
    return ok;
  }

  // preparar mailto y abrir cliente
  function sendMailClient() {
    const l = labels || {};
    const recipients = (l.email && Array.isArray(l.email.recipientes)) ? l.email.recipientes.join(',') : 'dmoraroca@gmail.com,mmora@canalip.com';
    const subject = encodeURIComponent(`${(l.email && l.email.asunto_prefijo) ? l.email.asunto_prefijo : 'Interés'} - ${inpNombre.value.trim()}`);
    const bodyLines = [
      `${(l.labels && l.labels.nombre) ? l.labels.nombre : 'Nombre'}: ${inpNombre.value.trim()}`,
      `${(l.labels && l.labels.telefono) ? l.labels.telefono : 'Teléfono'}: ${inpTelefono.value.trim()}`,
      '',
      `${(l.labels && l.labels.estructura_compra) ? l.labels.estructura_compra : 'Estructura compra'}:`,
      inpEstructura.value.trim(),
      '',
      `${(l.labels && l.labels.experiencia) ? l.labels.experiencia : 'Experiencia'}:`,
      inpExperiencia.value.trim(),
      '',
      `Acepta política: ${inpAcepto.checked ? 'Sí' : 'No'}`
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:${recipients}?subject=${subject}&body=${body}`;
    // abrir cliente
    window.location.href = mailto;
  }

  // manejadores
  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    sendMailClient();
  });

  // cerrar con ESC
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && modal && modal.style.display === 'flex') closeModal();
  });

  // carga labels y aplica
  loadLabels();

});