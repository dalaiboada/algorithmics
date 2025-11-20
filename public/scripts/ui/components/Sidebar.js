// Funcionalidad para cambiar de paneles
const $navItems = document.querySelectorAll('.nav-item');
const $panels = document.querySelectorAll('.panel');
const $pageTitle = document.querySelector('.page-title');

// Títulos para cada panel
const panelTitles = {
  'dashboard': 'Dashboard',
  'profile': 'Mi Perfil',
  'olympics': 'Gestión de Olimpiadas',
  'courses': 'Gestión de Cursos',
  'users': 'Gestión de Usuarios'
};

export default function Sidebar() {
  $navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();

      // Remover clase active de todos los items
      $navItems.forEach(nav => nav.classList.remove('active'));

      // Añadir clase active al item clickeado
      item.classList.add('active'); 

      // Ocultar todos los paneles
      $panels.forEach(panel => panel.classList.remove('active'));

      // Mostrar el panel correspondiente
      const $panelId = item.getAttribute('data-panel');
      document.getElementById($panelId).classList.add('active');

      // Actualizar el título de la página
      $pageTitle.textContent = panelTitles[$panelId];
    });
  });
}
