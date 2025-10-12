// Gestor de idioma: por defecto ES al recargar; selección temporal al clicar bandera (no se persiste)
document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT = 'es';
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
      loadI18n(lang).catch(()=>{});
    });
  });

  // asegurar que por defecto en F5 esté ES (no persistimos elección)
  try {
    localStorage.removeItem('site_lang');
    localStorage.removeItem('site_lang_user_locked');
  } catch (e) { /* noop */ }

  // init: cargar ES por defecto al cargar la página
  setActive(DEFAULT);
  loadI18n(DEFAULT).catch(()=>{});
});