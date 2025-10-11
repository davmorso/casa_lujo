document.addEventListener('DOMContentLoaded', () => {
  const repo = new PisoRepository();
  const galeriaUseCase = new GaleriaUseCase(repo);
  const galeriaView = new GaleriaView(galeriaUseCase);
  galeriaView.cargarMiniaturas();
  galeriaView.conectarEventos();

  const cookies = new CookieBannerView();
  cookies.inicializar();
});