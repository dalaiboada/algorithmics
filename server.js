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


// Dashboard Admin
app.get('/dashboard/admin', autorizacion.soloAdmin, (req, res) => {
  const admin = req.user;

  console.log('\nAdmin:', admin);

  res.render('dashboards/admin', {
    title: 'Dashboard Admin - Algorithmics',
    usuario: admin,
    sidebar: {
      navItems: [
        { href: '#', text: 'Dashboard', icon: 'fas fa-tachometer-alt', panel: 'dashboard', active: true },
        { href: '#', text: 'Perfil', icon: 'fas fa-user-circle', panel: 'profile' },
        { href: '#', text: 'Mis Cursos', icon: 'fas fa-book-open', panel: 'courses' },
        { href: '#', text: 'Olimpiadas', icon: 'fas fa-trophy', panel: 'olympics' },
        { href: '#', text: 'Usuarios', icon: 'fas fa-trophy', panel: 'users' }
      ]
    }
  });
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



