// FloorDescription.js
// Renderiza el título y la descripción de la planta
export default class FloorDescription {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  render(container) {
    container.querySelector('.floor-title').textContent = this.title;
    container.querySelector('.floor-text').innerHTML = this.description;
  }
}
