// GalleryThumbnails.js
// Renderiza miniaturas y gestiona el click para abrir el modal
export default class GalleryThumbnails {
  constructor(images, onThumbnailClick) {
    this.images = images;
    this.onThumbnailClick = onThumbnailClick;
  }

  render(container) {
    container.innerHTML = '';
    this.images.forEach((imgObj, idx) => {
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.alt = imgObj.alt || '';
      img.className = 'miniatura';
      img.tabIndex = 0;
      img.addEventListener('click', () => this.onThumbnailClick(idx));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.onThumbnailClick(idx);
        }
      });
      container.appendChild(img);
    });
  }
}
