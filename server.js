import express from "express";
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ejs from 'ejs';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; // join es lo que usamos para unir rutas

import { methods as auth } from './src/controllers/autenticacion.controller.js';
import { methods as autorizacion } from './src/middlewares/autorizacion.js';
import { methods as cursosController } from './src/controllers/cursos.controller.js';
import User from './src/bd/models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.listen(PORT, () => {
  console.log('\nINICIANDO SERVIDOR');
  console.log(`Servidor ejecutado en http://localhost:${PORT}`);
  console.log(`Express está buscando vistas en: ${viewsPath}`);
});

// ---- CONFIGURACIÓN DE EJS ----
app.set('view engine', 'ejs');
const viewsPath = join(__dirname, 'src', 'views');
app.set('views', viewsPath);

// ---- MIDDLEWARES ----
app.use(cors({ origin: 'http://localhost:4000' }));
app.use(express.json());
app.use(express.static(join(__dirname, 'public'))); // Servir archivos estáticos
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// ---- RUTAS ----
app.get("/", autorizacion.soloPublico, (req, res) => {
  res.sendFile(join(__dirname, 'public/index.html'));
});

// Autenticación
app.get('/auth/docente', autorizacion.soloPublico, (req, res) => {
  const error = req.query.error || null;
  const success = req.query.success || null;
  const formData = req.query.formData ? JSON.parse(decodeURIComponent(req.query.formData)) : {};
  
  res.render('inicio_sesion-docente', {
    title: 'Iniciar Sesión Docente - Algorithmics',
    error,
    success,
    formData
  });
});


app.post('/api/auth/docente', auth.login);

// Registro
app.get('/auth/registro', autorizacion.soloPublico, (req, res) => {
  const error = req.query.error || null;
  const success = req.query.success || null;
  const formData = req.query.formData ? JSON.parse(decodeURIComponent(req.query.formData)) : {};
  
  res.render('registro', {
    title: 'Registro - Algorithmics',
    error,
    success,
    formData
  });
});

app.post('/auth/registro', auth.registrar);

// Dashboard Admin
app.get('/dashboard/admin', autorizacion.soloAdmin, async (req, res) => {
  const admin = req.user;

  console.log('\nAdmin:', admin);

  try {
    const usuarios = await User.obtenerTodos();
    console.log('\nUsuarios:', usuarios);
    
    res.render('dashboards/admin', {
      title: 'Dashboard Admin - Algorithmics',
      usuario: admin,
      usuarios: usuarios, // Pasamos la lista de usuarios
      sidebar: {
        navItems: [
          { href: '#', text: 'Dashboard', icon: 'fas fa-tachometer-alt', panel: 'dashboard', active: true },
          { href: '#', text: 'Perfil', icon: 'fas fa-user-circle', panel: 'profile' },
          { href: '#', text: 'Cursos', icon: 'fas fa-book-open', panel: 'courses' },
          { href: '#', text: 'Olimpiadas', icon: 'fas fa-trophy', panel: 'olympics' },
          { href: '#', text: 'Usuarios', icon: 'fas fa-users', panel: 'users' }
        ]
      }
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Dashboard Docente
app.get('/dashboard/docente', autorizacion.soloDocente, (req, res) => {
  const docente = req.user;

  console.log('\nDocente:', docente);

  res.render('dashboards/docente', {
    title: 'Dashboard Docente - Algorithmics',
    usuario: docente,
    sidebar: {
      navItems: [
        { href: '#', text: 'Dashboard', icon: 'fas fa-tachometer-alt', panel: 'dashboard', active: true },
        { href: '#', text: 'Perfil', icon: 'fas fa-user-circle', panel: 'profile' },
        { href: '#', text: 'Mis Cursos', icon: 'fas fa-book-open', panel: 'courses' },
        { href: '#', text: 'Olimpiadas', icon: 'fas fa-trophy', panel: 'olympics' }
      ]
    }
  });
});

// Dashboard Alumno
app.get('/dashboard/alumno', autorizacion.soloAlumno, (req, res) => {
  const alumno = req.user;

  console.log('\nAlumno:', alumno);

  res.render('dashboards/alumno', {
    title: 'Dashboard Alumno - Algorithmics',
    usuario: alumno,
    sidebar: {
      navItems: [
        { href: '#', text: 'Dashboard', icon: 'fas fa-tachometer-alt', panel: 'dashboard', active: true },
        { href: '#', text: 'Perfil', icon: 'fas fa-user-circle', panel: 'profile' },
        { href: '#', text: 'Mis Cursos', icon: 'fas fa-book-open', panel: 'courses' },
        { href: '#', text: 'Olimpiadas', icon: 'fas fa-trophy', panel: 'olympics' }
      ]
    }
  });
});

// Dashboard Pendiente
app.get('/dashboard/pendiente', autorizacion.soloPendiente, (req, res) => {
  const usuario = req.user;
  console.log("Dashboard Pendiente:",usuario);
  console.log('\nUsuario Pendiente:', usuario);

  res.render('dashboards/pendiente', {
    title: 'Verificación Pendiente - Algorithmics',
    usuario: usuario
  });
});

// Cursos
app.get('/api/cursos', autorizacion.soloAdmin, cursosController.listarCursos);

//app.post('/api/cursos', autorizacion.soloAdmin, cursosController.crearCurso);



