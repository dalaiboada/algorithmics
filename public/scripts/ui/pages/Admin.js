import Sidebar from "../components/Sidebar.js";
import LogoutModal from "../components/LogoutModal.js";

// Función para cargar los cursos
const cargarCursos = async () => {
  try {
    const response = await fetch('/api/cursos', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Error al cargar los cursos');
    }
    
    const cursos = await response.json();
    console.log('Cursos cargados:', cursos);
    
    // Actualizar la tabla con los cursos
    actualizarTablaCursos(cursos);

    return cursos;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Función para actualizar la tabla de cursos
const actualizarTablaCursos = (cursos) => {
  const tbody = document.querySelector('#courses table tbody');
  if (!tbody) return;

  // Limpiar la tabla
  tbody.innerHTML = '';

  // Llenar la tabla con los cursos
  cursos.forEach(curso => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${curso.nombre}</td>
      <td>${curso.estado || 'Sin asignar'}</td>
      <td>${curso.fecha_creacion || '0'}</td>
      <td>
        <span class="badge ${obtenerClaseEstado(curso.estado)}">
          ${curso.estado}
        </span>
      </td>
      <td>
        <button class="btn btn-primary" 
            style="padding: 0.5rem 1rem; font-size: 0.875rem;"
            data-curso-id="${curso.id}">
          Ver
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

// Función auxiliar para obtener la clase CSS según el estado
const obtenerClaseEstado = (estado) => {
  const estados = {
    'Activo': 'badge-success',
    'En desarrollo': 'badge-warning',
    'Suspendido': 'badge-error'
  };
  return estados[estado] || 'badge-secondary';
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  Sidebar();
  LogoutModal();
  const $cursosLink = document.querySelector('.sidebar-nav [data-panel="courses"]');
  
  if ($cursosLink) {
    $cursosLink.addEventListener('click', (e) => {
      e.preventDefault();
      cargarCursos();
    });
  }
});

