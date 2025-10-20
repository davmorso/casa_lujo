class CookieService {
  static aceptar() {
    localStorage.setItem('cookies_aceptadas', 'true');
  }
  static rechazar() {
    localStorage.setItem('cookies_aceptadas', 'false');
  }
  static estado() {
    return localStorage.getItem('cookies_aceptadas');
  }
}
