class GaleriaUseCase {
  constructor(repository) {
    this.repository = repository;
    this.plantas = this.repository.getPlantas();
    this.seccionActual = this.plantas[0];
    this.imagenActualIndex = 0;
  }

  seleccionarPlanta(planta) {
    this.seccionActual = planta;
    this.imagenActualIndex = 0;
  }

  seleccionarImagen(index) {
    this.imagenActualIndex = index;
  }

  imagenActual() {
    const imgs = this.repository.getImagenes(this.seccionActual);
    if (!imgs || imgs.length === 0) return null;
    return imgs[this.imagenActualIndex];
  }

  imagenesDePlanta() {
    return this.repository.getImagenes(this.seccionActual);
  }

  puedeIrAnterior() {
    return this.imagenActualIndex > 0;
  }

  puedeIrSiguiente() {
    const imgs = this.repository.getImagenes(this.seccionActual);
    return this.imagenActualIndex < imgs.length - 1;
  }

  irAnterior() {
    if (this.puedeIrAnterior()) this.imagenActualIndex--;
  }

  irSiguiente() {
    if (this.puedeIrSiguiente()) this.imagenActualIndex++;
  }

  puedeIrPlantaAnterior() {
    return this.plantas.indexOf(this.seccionActual) > 0;
  }

  puedeIrPlantaSiguiente() {
    return this.plantas.indexOf(this.seccionActual) < this.plantas.length - 1;
  }

  irPlantaAnterior() {
    const idx = this.plantas.indexOf(this.seccionActual);
    if (idx > 0) {
      this.seccionActual = this.plantas[idx - 1];
      this.imagenActualIndex = 0;
    }
  }

  irPlantaSiguiente() {
    const idx = this.plantas.indexOf(this.seccionActual);
    if (idx < this.plantas.length - 1) {
      this.seccionActual = this.plantas[idx + 1];
      this.imagenActualIndex = 0;
    }
  }
}