import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../bd/models/User.js';

dotenv.config();

const soloAdmin = (req, res, next) => {
  console.log('\nSolo Admin | Cookie:', req.headers.cookie)
  next()
}

const soloDocente = async (req, res, next) => {
  console.log('\nSolo Docente ')
  const tokenDecodificado = await verificarToken(req, res)
  
  if(!tokenDecodificado) {
    console.log('\nNo autenticado')
    return res.redirect('/')
  }

  const user = await User.obtenerPorId(tokenDecodificado.id)
  if(!user) {
    console.log('\nNo autenticado')
    return res.redirect('/')
  }

  if (user.rol_id !== 2) {
    console.log('\nNo autenticado')
    return res.redirect('/')
  }
  
  req.user = user
  next()
}

const soloAlumno = (req, res, next) => {
  console.log('\nSolo Alumno | Cookie:', req.headers.cookie)
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
      console.log('\nNo autenticado')
      return res.redirect('/auth/docente')
    }

    console.log('\nVerificar Token | Cookie:', req.headers.cookie)
    console.log('\nToken:', token);

    const tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET)
    console.log('\nToken Decodificado:', tokenDecodificado)

    return tokenDecodificado;
  } catch (error) {
    console.log('\nError al verificar token:', error)
    return res.redirect('/auth/docente')
  }
}

export const methods = {
  soloAdmin,
  soloDocente,
  soloAlumno,
  soloPublico,
  verificarToken
}