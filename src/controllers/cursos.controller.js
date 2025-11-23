import Curso from '../bd/models/Curso.js';

const listarCursos = async (req, res) => {
  try {
    const cursos = await Curso.obtenerTodos();
    res.json(cursos);
  } catch (error) {
    console.error('Error al listar cursos:', error);
    res.status(500).json({ error: 'Error al obtener los cursos' });
  }
};


export const methods = {
  listarCursos
};