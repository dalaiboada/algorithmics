import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../bd/models/User.js';

dotenv.config();

const soloAdmin = async (req, res, next) => {
  console.log('\nSolo Admin')
  const tokenDecodificado = await verificarTokenInterno(req, res)
  
  if(!tokenDecodificado) {
    console.log('\n[ERROR] No se encuentra token. No autenticado')
    return res.redirect('/')
  }

  const user = await User.obtenerPorId(tokenDecodificado.id)
  if(!user) {
    console.log('\n[ERROR] No se encuentra usuario. No autenticado')
    return res.redirect('/')
  }
  console.log('\nUsuario:', user)

  if (user.rol_id !== 1) {
    console.log('\n[ERROR] No se encuentra usuario con rol de admin. No autenticado')
    return res.redirect('/')
  }
  
  req.user = user
  next()
}

const soloDocente = async (req, res, next) => {
  console.log('\nSolo Docente ')
  const tokenDecodificado = await verificarTokenInterno(req, res)
  
  if(!tokenDecodificado) {
    console.log('\n[ERROR] No se encuentra token. No autenticado')
    return res.redirect('/')
  }

  const user = await User.obtenerPorId(tokenDecodificado.id)
  if(!user) {
    console.log('\n[ERROR] No autenticado')
    return res.redirect('/')
  }

  if (user.rol_id !== 2) {
    console.log('\n[ERROR] No autenticado')
    return res.redirect('/')
  }
  
  req.user = user
  next()
}

const soloAlumno = async (req, res, next) => {
  console.log('\nSolo Alumno | Cookie:', req.headers.cookie)
  next()
}

const soloPublico = (req, res, next) => {
  console.log('\nSolo Publico')
  next()
}

// Función interna para verificar token (usada por soloAdmin y soloDocente)
const verificarTokenInterno = async (req, res) => {
  try {
    const token = req.headers.cookie.split('; ').find(cookie => cookie.startsWith('token=')).slice(6); 

    if (!token) {
      console.log('\n[ERROR] No autenticado')
      return null
    }

    console.log('\nVerificar Token | Cookie:', req.headers.cookie)
    console.log('\nToken:', token);

    const tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET)
    console.log('\nToken Decodificado:', tokenDecodificado)

    return tokenDecodificado;
  } catch (error) {
    console.log('\n[ERROR] Error al verificar token:', error)
    return null
  }
}

// Middleware para verificar token en rutas API
const verificarToken = async (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie;
    
    if (!cookieHeader) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado - No se encontró token'
      });
    }

    const tokenCookie = cookieHeader.split('; ').find(cookie => cookie.startsWith('token='));
    
    if (!tokenCookie) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado - Token no válido'
      });
    }

    const token = tokenCookie.slice(6);
    console.log('\nVerificar Token | Cookie:', cookieHeader);
    console.log('\nToken:', token);

    const tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET);
    console.log('\nToken Decodificado:', tokenDecodificado);

    const user = await User.obtenerPorId(tokenDecodificado.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('\n[ERROR] Error al verificar token:', error);
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
}

export const methods = {
  soloAdmin,
  soloDocente,
  soloAlumno,
  soloPublico,
  verificarToken
}