
import CookieService from './cookieService.js';
window.addEventListener('DOMContentLoaded', () => {
	const btnAceptar = document.getElementById('aceptar-cookies');
	const btnRechazar = document.getElementById('rechazar-cookies');
	if (btnAceptar) {
		btnAceptar.textContent = 'Aceptar cookies';
		btnAceptar.classList.add('btn-primary');
		btnAceptar.style.marginLeft = '15px';
		btnAceptar.onclick = () => CookieService.aceptar();
	}
	if (btnRechazar) {
		btnRechazar.textContent = 'Rechazar cookies';
		btnRechazar.classList.add('btn-secondary');
		btnRechazar.style.marginLeft = '30px';
		btnRechazar.style.marginRight = '10px';
		btnRechazar.onclick = () => CookieService.rechazar();
	}
	// Ocultar banner si ya se aceptaron/rechazaron
		if (CookieService.estado() !== null) {
			CookieService.ocultarBanner();
	}
});