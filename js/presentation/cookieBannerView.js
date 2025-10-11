class CookieBannerView {
  constructor() {
    this.banner = document.getElementById('cookie-banner');
    this.aceptarBtn = document.getElementById('aceptar-cookies');
    this.rechazarBtn = document.getElementById('rechazar-cookies');
  }

  inicializar() {
    const estado = CookieService.estado();
    if (estado === 'true' || estado === 'false') {
      this.banner.style.display = 'none';
      return;
    }
    this.aceptarBtn.addEventListener('click', () => {
      CookieService.aceptar();
      this.banner.style.display = 'none';
    });
    this.rechazarBtn.addEventListener('click', () => {
      CookieService.rechazar();
      this.banner.style.display = 'none';
    });
  }
}