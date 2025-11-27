import { connection } from '../conexion.js';

export default class Curso {
  constructor(id, nombre, descripcion, fecha_creacion, estado) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fecha_creacion = fecha_creacion;
    this.estado = estado;
  }

  // Crear un nuevo curso
  static async crear(nombre, descripcion = null, estado = 'En desarrollo') {
    try {
      const query = `
        INSERT INTO cursos (nombre, descripcion, estado)
        VALUES (?, ?, ?)
      `;
      const [result] = await connection.execute(query, [nombre, descripcion, estado]);
      
      return new Curso(
        result.insertId,
        nombre,
        descripcion,
        new Date(),
        estado
      );
    } catch (error) {
      throw new Error(`Error al crear el curso: ${error.message}`);
    }
  }

  // Obtener todos los cursos
  static async obtenerTodos() {
    try {
      const query = 'SELECT * FROM cursos ORDER BY nombre';
      const [rows] = await connection.execute(query);
      
      return rows.map(row => new Curso(
        row.curso_id,
        row.nombre,
        row.descripcion,
        row.fecha_creacion,
        row.estado
      ));
    } catch (error) {
      throw new Error(`Error al obtener los cursos: ${error.message}`);
    }
  }

  // Obtener curso por ID
  static async obtenerPorId(id) {
    try {
      const query = 'SELECT * FROM cursos WHERE curso_id = ?';
      const [rows] = await connection.execute(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      const row = rows[0];
      return new Curso(
        row.curso_id,
        row.nombre,
        row.descripcion,
        row.fecha_creacion,
        row.estado
      );
    } catch (error) {
      throw new Error(`Error al obtener el curso: ${error.message}`);
    }
  }

  // Actualizar un curso existente
  async actualizar() {
    try {
      const query = `
        UPDATE cursos 
        SET nombre = ?, descripcion = ?, estado = ?
        WHERE curso_id = ?
      `;
      
      await connection.execute(query, [
        this.nombre,
        this.descripcion,
        this.estado,
        this.id
      ]);
      
      return true;
    } catch (error) {
      throw new Error(`Error al actualizar el curso: ${error.message}`);
    }
  }

  // Eliminar un curso
  async eliminar() {
    try {
      const query = 'DELETE FROM cursos WHERE curso_id = ?';
      await connection.execute(query, [this.id]);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar el curso: ${error.message}`);
    }
  }

  // Cambiar el estado de un curso
  static async cambiarEstado(id, nuevoEstado) {
    try {
      const query = 'UPDATE cursos SET estado = ? WHERE curso_id = ?';
      await connection.execute(query, [nuevoEstado, id]);
      return true;
    } catch (error) {
      throw new Error(`Error al cambiar el estado del curso: ${error.message}`);
    }
  }

  // Buscar cursos por nombre o descripción
  static async buscar(termino) {
    try {
      const query = `
        SELECT * FROM cursos 
        WHERE nombre LIKE ? OR descripcion LIKE ?
        ORDER BY nombre
      `;
      const searchTerm = `%${termino}%`;
      const [rows] = await connection.execute(query, [searchTerm, searchTerm]);
      
      return rows.map(row => new Curso(
        row.curso_id,
        row.nombre,
        row.descripcion,
        row.fecha_creacion,
        row.estado
      ));
    } catch (error) {
      throw new Error(`Error al buscar cursos: ${error.message}`);
    }
  }

  // Obtener cursos por estado
  static async obtenerPorEstado(estado) {
    try {
      const query = 'SELECT * FROM cursos WHERE estado = ? ORDER BY nombre';
      const [rows] = await connection.execute(query, [estado]);
      
      return rows.map(row => new Curso(
        row.curso_id,
        row.nombre,
        row.descripcion,
        row.fecha_creacion,
        row.estado
      ));
    } catch (error) {
      throw new Error(`Error al obtener cursos por estado: ${error.message}`);
    }
  }

  // Obtener cantidad de alumnos inscritos en un curso
  static async obtenerCantidadAlumnos(id) {
    try {
      const query = 'SELECT COUNT(*) as total FROM inscripciones i JOIN secciones s ON i.id_seccion = s.seccion_id WHERE s.curso_id = ?;';
      const [rows] = await connection.execute(query, [id]);
      return rows[0].total;

    } catch (error) {
      throw new Error(`Error al obtener la cantidad de alumnos: ${error.message}`);
    }
  }

  // Obtener estadísticas de cursos
  static async obtenerEstadisticas() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_cursos,
          SUM(CASE WHEN estado = 'Activo' THEN 1 ELSE 0 END) as cursos_activos,
          SUM(CASE WHEN estado = 'En desarrollo' THEN 1 ELSE 0 END) as cursos_desarrollo,
          SUM(CASE WHEN estado = 'Suspendido' THEN 1 ELSE 0 END) as cursos_suspendidos
        FROM cursos
      `;
      
      const [rows] = await connection.execute(query);
      return rows[0];
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de cursos: ${error.message}`);
    }
  }
}
