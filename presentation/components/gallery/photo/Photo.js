// Photo.js
// Renderiza una sola miniatura y gestiona el click para abrir el navegador de galería
export default class Photo {
  constructor(imgObj, planta, onClick) {
    this.imgObj = imgObj;
    this.planta = planta;
    this.onClick = onClick;
  }

  render(container) {
    container.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'photo-thumbnail';
    const img = document.createElement('img');
    img.className = 'miniatura';
    img.src = this.imgObj.src;
    img.alt = this.imgObj.alt || '';
    img.tabIndex = 0;
    img.addEventListener('click', () => {
      this.onClick(this.imgObj, this.planta);
    });
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.onClick(this.imgObj, this.planta);
      }
    });
    div.appendChild(img);
    container.appendChild(div);
  }
}
