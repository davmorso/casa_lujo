// contact-ui.js
// Responsabilidad: gestionar el bloque de contacto y la barra de idioma

document.addEventListener('i18nLoaded', function(e) {
  var json = e.detail && e.detail.i18n;
  // Bloque de contacto
  var contactDiv = document.getElementById('contact-button-before-cookie');
  if (contactDiv && json && json.ui && json.ui.contact) {
    var contactText = json.ui.contact.text || '';
    var linkWord = json.ui.contact.linkWord || '';
    var html = contactText.replace(linkWord, '<a id="contact-link" class="contact-link" href="#contact-modal" style="text-decoration:underline; text-transform:uppercase;">'+linkWord+'</a>');
    contactDiv.innerHTML = html;
    var contactLink = document.getElementById('contact-link');
    if (contactLink) {
      contactLink.onclick = function(ev) {
        ev.preventDefault();
        if (typeof openModal === 'function') {
          openModal();
        } else {
          var modal = document.getElementById('contact-modal');
          if (modal) {
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
          }
        }
      };
    }
  }
  // Barra de idioma
  var contactBarLink = document.getElementById('contact-link-bar');
  if (contactBarLink && json && json.ui && json.ui.contactBar && json.ui.contactBar.text) {
    contactBarLink.textContent = json.ui.contactBar.text;
    contactBarLink.onclick = function(ev) {
      ev.preventDefault();
      if (typeof openModal === 'function') {
        openModal();
      } else {
        var modal = document.getElementById('contact-modal');
        if (modal) {
          modal.style.display = 'flex';
          modal.setAttribute('aria-hidden', 'false');
        }
      }
    };
  }
});
