import express from "express";
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { methods as auth } from './src/controllers/autenticacion.controller.js';
import { methods as autorizacion } from './src/middlewares/autorizacion.js';
import { methods as cursosController } from './src/controllers/cursos.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.listen(PORT, () => {
  console.log('\n=================================');
  console.log('🚀 SERVIDOR INICIADO');
  console.log('=================================');
  console.log(`📡 API disponible en: http://localhost:${PORT}`);
  console.log(`📁 Archivos estáticos: ${join(__dirname, 'public')}`);
  console.log('=================================\n');
});

// ---- MIDDLEWARES ----
app.use(cors({ origin: 'http://localhost:4000' }));
app.use(express.json());
app.use(express.static(join(__dirname, 'public'))); // Servir archivos estáticos
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// ---- RUTAS PÚBLICAS ----
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(join(__dirname, 'public/login.html'));
});

// ---- API ENDPOINTS ----

// Autenticación
app.post('/api/auth/login', auth.login);

// Información del usuario autenticado
app.get('/api/auth/me', autorizacion.verificarToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Dashboard Admin (solo devuelve HTML)
app.get('/dashboard/admin', autorizacion.soloAdmin, (req, res) => {
  res.sendFile(join(__dirname, 'public/dashboard-admin.html'));
});

// Dashboard Docente (solo devuelve HTML)
app.get('/dashboard/docente', autorizacion.soloDocente, (req, res) => {
  res.sendFile(join(__dirname, 'public/dashboard-docente.html'));
});

// Cursos
app.get('/api/cursos', autorizacion.soloAdmin, cursosController.listarCursos);
//app.post('/api/cursos', autorizacion.soloAdmin, cursosController.crearCurso);

