// Eliminar archivo galeriaUseCase.js
// GaleriaUseCase: lógica de negocio y navegación de la galería
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
		this._emitChange();
	}

	seleccionarImagen(index) {
		this.imagenActualIndex = index;
		this._emitChange();
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
		return imgs && this.imagenActualIndex < imgs.length - 1;
	}

	irAnterior() {
		if (this.puedeIrAnterior()) {
			this.imagenActualIndex--;
			this._emitChange();
		}
	}

	irSiguiente() {
		if (this.puedeIrSiguiente()) {
			this.imagenActualIndex++;
			this._emitChange();
		}
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
			this._emitChange();
		}
	}

	irPlantaSiguiente() {
		const idx = this.plantas.indexOf(this.seccionActual);
		if (idx < this.plantas.length - 1) {
			this.seccionActual = this.plantas[idx + 1];
			this.imagenActualIndex = 0;
			this._emitChange();
		}
	}

	// Evento para notificar cambios a la vista
	_emitChange() {
		document.dispatchEvent(
			new CustomEvent('galeriaChanged', {
				detail: {
					seccionActual: this.seccionActual,
					imagenActualIndex: this.imagenActualIndex,
					imagenActual: this.imagenActual(),
					imagenes: this.imagenesDePlanta(),
					plantas: this.plantas,
				},
			})
		);
	}
}

window.GaleriaUseCase = GaleriaUseCase;
