import { connection } from '../conexion.js';

export default class User {
  constructor(id, nombre, apellido, email, clave, habilitado, rol_id, nombre_rol) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.clave = clave;
    this.habilitado = habilitado;
    this.rol_id = rol_id;
    this.rol_nombre = nombre_rol;
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  // Método estático para crear un nuevo usuario
  static async crear(nombre, apellido, email, clave, rol_id) {
    try {
      const query = `
        INSERT INTO usuarios (nombre, apellido, email, clave, rol_id) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await connection.execute(query, [nombre, apellido, email, clave, rol_id]);
      
      return new User(result.insertId, nombre, apellido, email, clave, true, rol_id);
    } 
    catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  // Método estático para obtener todos los usuarios
  static async obtenerTodos() {
    try {
      const query = 'SELECT * FROM vista_usuarios_con_rol ORDER BY usuario_id';
      const [rows] = await connection.execute(query);
      return rows.map(row => new User(
        row.usuario_id,
        row.nombre,
        row.apellido,
        row.email,
        row.clave,
        row.habilitado,
        row.rol_id,
        row.rol_nombre
      ));
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  // Método estático para obtener usuario por ID
  static async obtenerPorId(id) {
    try {
      const query = 'SELECT * FROM vista_usuarios_con_rol WHERE usuario_id = ?';
      const [rows] = await connection.execute(query, [id]);
      if (rows.length === 0) {
        return null;
      }
      const row = rows[0];
      return new User(
        row.usuario_id,
        row.nombre,
        row.apellido,
        row.email,
        row.clave,
        row.habilitado,
        row.rol_id,
        row.nombre_rol
      );
    } catch (error) {
      throw new Error(`Error(user.obtenerPorId) al obtener usuario: ${error.message}`);
    }
  }

  // Método estático para obtener usuario por email
  static async obtenerPorEmail(email) {
    try {
      const query = 'SELECT * FROM vista_usuarios_con_rol WHERE email = ?';
      const [rows] = await connection.execute(query, [email]);
      if (rows.length === 0) {
        return null;
      }
      const row = rows[0];
      return new User(
        row.usuario_id,
        row.nombre,
        row.apellido,
        row.email,
        row.clave,
        row.habilitado,
        row.rol_id,
        row.rol_nombre
      );
    } catch (error) {
      throw new Error(`Error al obtener usuario por email: ${error.message}`);
    }
  }

  // Método para actualizar usuario
  async actualizar() {
    try {
      const query = `
        UPDATE usuarios 
        SET nombre = ?, apellido = ?, email = ?, clave = ?, habilitado = ?, rol_id = ?
        WHERE usuario_id = ?
      `;
      await connection.execute(query, [
        this.nombre,
        this.apellido,
        this.email,
        this.clave,
        this.habilitado,
        this.rol_id,
        this.id
      ]);
      return true;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  // Método para eliminar usuario
  async eliminar() {
    try {
      const query = 'DELETE FROM usuarios WHERE usuario_id = ?';
      
      await connection.execute(query, [this.id]);
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  // Método para habilitar/deshabilitar usuario
  async cambiarEstado(habilitado) {
    try {
      const query = 'UPDATE usuarios SET habilitado = ? WHERE usuario_id = ?';

      await connection.execute(query, [habilitado, this.id]);
      this.habilitado = habilitado;
      return true;

    } catch (error) {
      throw new Error(`Error al cambiar estado del usuario: ${error.message}`);
    }
  }

  // Método para obtener usuarios por rol
  static async obtenerPorRol(rol_id) {
    try {
      const query = 'SELECT * FROM usuarios WHERE rol_id = ? ORDER BY nombre';
      const [rows] = await connection.execute(query, [rol_id]);
      return rows.map(row => new User(
        row.usuario_id,
        row.nombre,
        row.apellido,
        row.email,
        row.clave,
        row.habilitado,
        row.rol_id
      ));
    } catch (error) {
      throw new Error(`Error al obtener usuarios por rol: ${error.message}`);
    }
  }

  // Método para verificar si el email ya existe
  static async emailExiste(email, excluirId = null) {
    try {
      let query = 'SELECT COUNT(*) as count FROM usuarios WHERE email = ?';
      let params = [email];
      
      if (excluirId) {
        query += ' AND usuario_id != ?';
        params.push(excluirId);
      }
      
      const [rows] = await connection.execute(query, params);
      return rows[0].count > 0;
    } catch (error) {
      throw new Error(`Error al verificar email: ${error.message}`);
    }
  }

  // Método para obtener estadísticas de usuarios
  static async obtenerEstadisticas() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_usuarios,
          COUNT(CASE WHEN habilitado = TRUE THEN 1 END) as usuarios_activos,
          COUNT(CASE WHEN habilitado = FALSE THEN 1 END) as usuarios_inactivos,
          rol_id,
          (SELECT nombre FROM roles WHERE rol_id = usuarios.rol_id) as nombre_rol
        FROM usuarios 
        GROUP BY rol_id
        ORDER BY nombre_rol
      `;
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

/* const userId = 1;
User.obtenerPorId(userId).then(user => {
  console.log(user);
}).catch(error => {
  console.error(error);
}); */

