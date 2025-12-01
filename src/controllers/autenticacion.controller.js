import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../bd/models/User.js';

dotenv.config();
const saltRounds = process.env.SALT_ROUNDS;
const secretKey = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;
const cookieExpires = process.env.JWT_COOKIE_EXPIRES;

const registrar = async (req, res) => {
  const { nombre, apellido, email, password, password_confirm } = req.body;

  // Función auxiliar para renderizar con error
  const renderError = (mensaje) => {
    return res.render('registro', {
      title: 'Registro - Algorithmics',
      error: mensaje,
      success: null,
      formData: req.body
    });
  };

  // Validar campos requeridos
  if(!nombre || !apellido || !email || !password) {
    return renderError('Todos los campos son obligatorios');
  }

  // Validar que las contraseñas coincidan
  if(password !== password_confirm) {
    return renderError('Las contraseñas no coinciden');
  }

  // Validar longitud mínima de contraseña
  if(password.length < 8) {
    return renderError('La contraseña debe tener al menos 8 caracteres');
  }

  try {
    // Verificar si el email ya existe
    const existingUser = await User.obtenerPorEmail(email);
    if(existingUser) {
      return renderError('El correo electrónico ya está registrado');
    }

    // Hashear la contraseña (convertir saltRounds a número)
    const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds));
    
    const user = await User.crear(nombre, apellido, email, hashedPassword);

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id },
      secretKey,
      { expiresIn: expiresIn }
    );

    // Configurar cookie
    const cookieOptions = {
      expires: new Date(Date.now() + cookieExpires * 24 * 60 * 60 * 1000),
      path: '/',
      /* httpOnly: true,
      secure: true,
      sameSite: 'strict', */
    };
    res.cookie('token', token, cookieOptions);

    // Redireccionar al dashboard de pendiente
    return res.redirect('/dashboard/pendiente');
  } 
  catch (error) {
    console.error('Error al registrar usuario:', error);
    return renderError('Error al registrar usuario. Por favor, intenta de nuevo.');
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ 
      message: 'Email y contraseña son obligatorios' 
    });
  }

  try {
    console.log(email, password);
    const user = await User.obtenerPorEmail(email);
    const validPassword = await bcrypt.compare(password, user.clave);

    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    if (!validPassword) {
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    const token = jwt.sign(
      { id: user.id },
      secretKey,
      { expiresIn: expiresIn }
    );
    console.log(token);

    const cookieOptions = {
      expires: new Date(Date.now() + cookieExpires * 24 * 60 * 60 * 1000),
      path: '/',
      /* httpOnly: true,
      secure: true,
      sameSite: 'strict', */
    };
    res.cookie('token', token, cookieOptions);

    const rol = user.rol_id;
    console.log(rol);
    let ruta = '';

    switch (rol) {
      case 1:
        ruta = '/dashboard/admin';
        break;
      case 2:
        ruta = '/dashboard/docente';
        break;
      case 3:
        ruta = '/dashboard/alumno';
        break;
    }
    
    res.send({
      status: 'ok',
      message: 'Inicio de sesión exitoso',
      token,
      redirect: ruta 
    });
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({ 
      message: 'Error al iniciar sesión' 
    });
  }
}

export const methods = {
  login,
  registrar
};

const pruebaRegistrar = async () => {
  const nombre = 'Juan';
  const apellido = 'Perez';
  const email = 'juan.perez@algorithmics.com';
  const password = '123456';
  const rol_id = 2;

  console.log("Prueba de registro");
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.crear(nombre, apellido, email, hashedPassword, rol_id);
  console.log(user);
}




