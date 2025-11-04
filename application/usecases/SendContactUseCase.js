// Caso de uso: Enviar contacto
import ISendContactForm from '../../domain/usecases/ISendContactForm.js';

class SendContactUseCase extends ISendContactForm {
  constructor({ backendUrl }) {
    super();
    this.backendUrl = backendUrl;
  }
  async execute(contact) {
    const url = `${this.backendUrl}/api/contact`;
    const payload = { ...contact };
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    let data = null;
    const ct = r.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      try { data = await r.json(); } catch {}
    }
    if (!r.ok) {
      const msg = (data && (data.message || data.error)) || `Error ${r.status}`;
      throw new Error(msg);
    }
    return data;
  }
}

export default SendContactUseCase;
