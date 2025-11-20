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
  const { nombre, apellido, email, password } = req.body;

  if(!nombre || !apellido || !email || !password) {
    return res.status(400).json({ 
      message: 'Nombre, apellido, email y contraseña son obligatorios' 
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.crear(nombre, apellido, email, hashedPassword, rol_id);

    return res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      user 
    });
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({ 
      message: 'Error al registrar usuario' 
    });
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

    res.send({
      status: 'ok',
      message: 'Inicio de sesión exitoso',
      token,
      redirect: '/dashboard/docente' 
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
  login
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




