export default class CookieService {
  static aceptar() {
    localStorage.setItem('cookies_aceptadas', 'true');
    CookieService.ocultarBanner();
  }
  static rechazar() {
    localStorage.setItem('cookies_aceptadas', 'false');
    CookieService.ocultarBanner();
  }
  static estado() {
    return localStorage.getItem('cookies_aceptadas');
  }
  static ocultarBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.style.display = 'none';
  }
}
