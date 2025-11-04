import GalleryRepository from '../../presentation/components/_gallery/galleryRepository.js';
import IGalleryUseCase from '../../domain/usecases/IGalleryUseCase.js';

export default class GalleryUseCase extends IGalleryUseCase {
	constructor(repository) {
		super();
		this.repository = repository;
		this.floors = this.repository.getFloors();
		this.currentFloor = this.floors[0];
		this.currentImageIndex = 0;
	}

		selectFloor(floor) {
			this.currentFloor = floor;
			this.currentImageIndex = 0;
			this._emitChange();
		}

		selectImage(index) {
			this.currentImageIndex = index;
			this._emitChange();
		}

	currentImage() {
		const imgs = this.repository.getImages(this.currentFloor);
		if (!imgs || imgs.length === 0) return null;
		return imgs[this.currentImageIndex];
	}

	imagesOfFloor() {
		return this.repository.getImages(this.currentFloor);
	}

	canGoPrevious() {
		return this.currentImageIndex > 0;
	}

	canGoNext() {
		const imgs = this.repository.getImages(this.currentFloor);
		return this.currentImageIndex < imgs.length - 1;
	}

		goPrevious() {
			if (this.canGoPrevious()) {
				this.currentImageIndex--;
				this._emitChange();
			}
		}

		goNext() {
			if (this.canGoNext()) {
				this.currentImageIndex++;
				this._emitChange();
			}
		}

	canGoPreviousFloor() {
		return this.floors.indexOf(this.currentFloor) > 0;
	}

	canGoNextFloor() {
		return this.floors.indexOf(this.currentFloor) < this.floors.length - 1;
	}

		goPreviousFloor() {
			const idx = this.floors.indexOf(this.currentFloor);
			if (idx > 0) {
				this.currentFloor = this.floors[idx - 1];
				this.currentImageIndex = 0;
				this._emitChange();
			}
		}

		goNextFloor() {
			const idx = this.floors.indexOf(this.currentFloor);
			if (idx < this.floors.length - 1) {
				this.currentFloor = this.floors[idx + 1];
				this.currentImageIndex = 0;
				this._emitChange();
			}
		}
	// Event to notify view of changes
	_emitChange() {
		document.dispatchEvent(
			new CustomEvent('galleryChanged', {
				detail: {
					currentFloor: this.currentFloor,
					currentImageIndex: this.currentImageIndex,
					currentImage: this.currentImage(),
					images: this.imagesOfFloor(),
					floors: this.floors,
				},
			})
		);
	}
}
