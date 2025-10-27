import IGalleryRepository from '../../../domain/repositories/IGaleriaRepository.js';
import GalleryRepository from './galleryRepository.js';
import GalleryUseCase from '../../../application/usecases/galeriaUseCase.js';
import GalleryView from './galleryView.js';



function mostrarDebugGaleria(i18n) {
  const repository = new GalleryRepository(i18n);
  const useCase = new GalleryUseCase(repository);
  let debug = document.getElementById('debug-info');
  if (!debug) {
    debug = document.createElement('div');
    debug.id = 'debug-info';
    debug.style = 'background:#fffbe6; color:#333; border:1px solid #ffe58f; padding:10px; margin:20px auto; max-width:700px;';
    document.body.insertBefore(debug, document.body.firstChild);
  }
  let log = '<b>Depuración galería:</b><br>';
  useCase.floors.forEach(floor => {
    const imgs = useCase.repository.getImages(floor);
    log += `Piso <b>${floor}</b>: ${imgs.length} imágenes<br>`;
    imgs.forEach(img => {
      log += `&nbsp;&nbsp;- <span style="color:blue">${img.src}</span><br>`;
    });
  });
  debug.innerHTML = log;
}

// Forzar depuración al cargar la página
window.addEventListener('DOMContentLoaded', function() {
  let i18n = window.i18n || {};
  mostrarDebugGaleria(i18n);
});


// Inicializar galería modular también en i18nApplied
function inicializarGaleriaModular(i18n) {
  const repository = new GalleryRepository(i18n);
  const useCase = new GalleryUseCase(repository);
  const view = new GalleryView(useCase);
  view.loadThumbnails();
  view.bindEvents();
  mostrarDebugGaleria(i18n);
}

document.addEventListener('i18nLoaded', function(e) {
  const i18n = (e.detail && e.detail.i18n) || window.i18n || {};
  inicializarGaleriaModular(i18n);
});

document.addEventListener('i18nApplied', function() {
  const i18n = window.i18n || {};
  inicializarGaleriaModular(i18n);
});
