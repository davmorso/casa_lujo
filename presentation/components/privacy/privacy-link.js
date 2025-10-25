// Servicio utilitario para sanitizar y gestionar enlaces de política de privacidad
window.PrivacyLinkService = class {
	// Obtiene la URL de la política según entorno
	getPrivacyUrl(fileName) {
		if (window.location.hostname === 'localhost' && window.location.port === '8080') {
			return '/' + fileName;
		} else {
			return '/casa_lujo/' + fileName;
		}
	}

	// Sanitiza el label del checkbox de política en el modal
	getSanitizedPrivacyLabel(label, url) {
		// Reemplaza el href y permite solo atributos seguros
		let safe = String(label || '').replace(/href="[^"]+"/, 'href="' + url + '"');
		safe = safe.replace(/<a\s+([^>]*)>/gi, function(match, attrs) {
			const allowed = attrs.match(/(href|target|rel|style)="[^"]*"/g) || [];
			return '<a ' + allowed.join(' ') + '>';
		}).replace(/<\/a>/gi, '</a>');
		return safe;
	}

	// Sanitiza el texto del enlace de política en el footer
	getSanitizedPrivacyText(text) {
		return String(text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
};