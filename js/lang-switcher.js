// Gestor de idioma: por defecto ES al recargar; selección temporal al clicar bandera (no se persiste)
document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT = 'es';
  const STORAGE_KEY = 'selectedLang';
  const btns = Array.from(document.querySelectorAll('.lang-btn'));

  function setActive(lang) {
    btns.forEach(b => {
      const is = b.dataset.lang === lang;
      b.classList.toggle('active-lang', is);
      b.setAttribute('aria-pressed', is ? 'true' : 'false');
    });
  }

  async function fetchI18n(lang) {
    const path = `./i18n/galeria.${lang}.json`;
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error('not found ' + path);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error('[lang-switcher] invalid JSON in', path, err);
      // log a truncated preview to help debugging
      console.log('[lang-switcher] response preview:', text.slice(0, 2000));
      // throw to let loadI18n fallback to DEFAULT
      throw err;
    }
  }

  function tryApply(json, lang) {
    try {
      if (window && typeof window.ensureCompleteI18n === 'function') {
        window.ensureCompleteI18n(json, lang);
        return true;
      } else if (window && typeof window.applyI18n === 'function') {
        window.applyI18n(json);
        return true;
      }
    } catch (e) { /* noop */ }
    return false;
  }

  async function loadI18n(lang) {
    try {
      console.log('[lang-switcher] load', lang);
      const json = await fetchI18n(lang);

      // keep a buffer so loader (if loaded later) can pick it up
      window.__i18n_buffer = { lang, i18n: json };

      // dispatch event first (loader may listen)
      document.dispatchEvent(new CustomEvent('i18nLoaded', { detail: { lang, i18n: json } }));

      // try immediate apply; if loader not yet available, poll a few times
      if (!tryApply(json, lang)) {
        let attempts = 0;
        const t = setInterval(() => {
          attempts++;
          if (tryApply(json, lang) || attempts > 20) clearInterval(t);
        }, 50);
      }

      setActive(lang);
      console.log('[lang-switcher] applied', lang);
      return json;
    } catch (err) {
      console.warn('[lang-switcher] load failed for', lang, err);
      if (lang !== DEFAULT) return loadI18n(DEFAULT);
      // fallback notify
      window.__i18n_buffer = { lang: DEFAULT, i18n: {} };
      document.dispatchEvent(new CustomEvent('i18nLoaded', { detail: { lang: DEFAULT, i18n: {} } }));
      setActive(DEFAULT);
      return {};
    }
  }

  // click handlers
  btns.forEach(b => {
    b.addEventListener('click', (ev) => {
      ev.preventDefault();
      const lang = b.dataset.lang;
      if (!lang) return console.warn('[lang-switcher] button missing data-lang');
      localStorage.setItem(STORAGE_KEY, lang);
      loadI18n(lang).catch(()=>{});
      // Opcional: actualizar historial para que el navegador atrás/adelante funcione
      history.pushState({lang: lang}, '', window.location.pathname + window.location.search);
    });
  });

  // Detectar cambios de historial (navegador atrás/adelante)
  window.addEventListener('popstate', () => {
    const lang = localStorage.getItem(STORAGE_KEY) || DEFAULT;
    if (btns.some(b => b.dataset.lang === lang)) {
      loadI18n(lang);
    }
  });

  // init: cargar idioma guardado o ES por defecto
  let lang = localStorage.getItem(STORAGE_KEY) || DEFAULT;
  if (!btns.some(b => b.dataset.lang === lang)) lang = DEFAULT;
  setActive(lang);
  loadI18n(lang).catch(()=>{});
});