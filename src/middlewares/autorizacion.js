import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../bd/models/User.js';

dotenv.config();

const soloAdmin = async (req, res, next) => {
  console.log('\nSolo Admin')
  const tokenDecodificado = await verificarToken(req, res)
  
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
  const tokenDecodificado = await verificarToken(req, res)
  
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
  console.log('\nSolo Alumno')
  const tokenDecodificado = await verificarToken(req, res)
  
  if(!tokenDecodificado) {
    console.log('\n[ERROR] No se encuentra token. No autenticado')
    return res.redirect('/')
  }

  const user = await User.obtenerPorId(tokenDecodificado.id)
  if(!user) {
    console.log('\n[ERROR] No autenticado')
    return res.redirect('/')
  }

  if (user.rol_id !== 3) {
    console.log('\n[ERROR] No autenticado')
    return res.redirect('/')
  }
  
  req.user = user
  next()
}

const soloPendiente = async (req, res, next) => {
  console.log('\nSolo Pendiente')
  const tokenDecodificado = await verificarToken(req, res)
  
  if(!tokenDecodificado) {
    console.log('\n[ERROR] No se encuentra token. No autenticado')
    return res.redirect('/')
  }

  const user = await User.obtenerPorId(tokenDecodificado.id)
  if(!user) {
    console.log('\n[ERROR] No autenticado en middleware')
    return res.redirect('/')
  }

  // Debug log
  console.log('Verificando rol pendiente. rol_id:', user.rol_id);

  // Usuario pendiente: sin rol asignado (rol_id es null o undefined o 0)
  // Si tiene un rol asignado (valor truthy), redirigir
  if (user.rol_id) {
    console.log('\n[ERROR] Usuario ya tiene rol asignado:', user.rol_id)
    return res.redirect('/')
  }
  
  req.user = user
  next()
}

const soloPublico = (req, res, next) => {
  console.log('\nSolo Publico')
  next()
}

const verificarToken = async (req, res) => {
  try {
    const token = req.headers.cookie.split('; ').find(cookie => cookie.startsWith('token=')).slice(6); 

    if (!token) {
      console.log('\n[ERROR] No autenticado')
      return res.redirect('/auth/docente')
    }

    console.log('\nVerificar Token | Cookie:', req.headers.cookie)
    console.log('\nToken:', token);

    const tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET)
    console.log('\nToken Decodificado:', tokenDecodificado)

    return tokenDecodificado;
  } catch (error) {
    console.log('\n[ERROR] Error al verificar token:', error)
    return res.redirect('/auth/docente')
  }
}

export const methods = {
  soloAdmin,
  soloDocente,
  soloAlumno,
  soloPendiente,
  soloPublico,
  verificarToken
}