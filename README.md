# Algorithmics C.A

Sistema de gestión educativa enfocado en la preparación y administración de Olimpiadas de Programación. Este proyecto permite la gestión de estudiantes, docentes, cursos, proyectos y competencias de programación.

## 📋 Características

- **Roles de Usuario**:

  - **Administrador**: Gestión total del sistema (usuarios, cursos, olimpiadas).
  - **Docente**: Gestión de cursos, asignaciones y seguimiento de estudiantes.
  - **Estudiante**: Acceso a cursos, participación en olimpiadas y entrega de proyectos.
- **Módulos Principales**:

  - **Autenticación**: Inicio de sesión y registro seguro.
  - **Dashboards**: Paneles personalizados para cada rol de usuario.
  - **Gestión Académica**: Cursos, secciones, evaluaciones y calificaciones.
  - **Olimpiadas**: Organización y gestión de competencias de programación.
  - **Proyectos**: Asignación y entrega de proyectos prácticos.

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript templates), CSS3, JavaScript (Vanilla)
- **Base de Datos**: MySQL (usando `mysql2`)
- **Autenticación**: JSON Web Tokens (JWT), bcryptjs
- **Herramientas**: Nodemon (desarrollo), Morgan (logging)

## 🚀 Instalación y Configuración

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v14 o superior)
- [MySQL](https://www.mysql.com/)

### Pasos de Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/dalaiboada/algorithmics-edu-system.git
   cd algorithmics-edu-system
   ```
2. **Instalar dependencias**:

   ```bash
   npm install
   ```
3. **Configurar la Base de Datos**:

   - Crea una base de datos en MySQL.
   - Importa el archivo `algorithmicsca.sql` ubicado en la raíz del proyecto para crear las tablas y estructura necesaria.
   - Configura las credenciales de conexión en `config.js` (o crea un archivo `.env` si el proyecto lo soporta, revisa `config.js` para más detalles).
4. **Ejecutar el servidor**:

   - **Modo Desarrollo** (con recarga automática):
     ```bash
     npm run dev
     ```
   - **Modo Producción**:
     ```bash
     npm start
     ```
5. **Acceder a la aplicación**:
   Abre tu navegador y visita `http://localhost:3000` (o el puerto configurado).

## 📂 Estructura del Proyecto

```bash
algorithmics-edu-system/
├── docs/                 # Documentación del proyecto
├── public/               # Archivos estáticos (CSS, JS, Imágenes)
├── src/
│   ├── auth/             # Lógica de autenticación
│   ├── controllers/      # Controladores de la aplicación
│   ├── models/           # Modelos de base de datos
│   ├── routes/           # Definición de rutas (Express)
│   ├── utils/            # Utilidades y helpers
│   └── views/            # Plantillas EJS (Frontend)
├── server.js             # Punto de entrada de la aplicación
├── config.js             # Archivo de configuración
├── algorithmicsca.sql    # Script SQL para la base de datos
└── package.json          # Dependencias y scripts
```

## 📖 Documentación Adicional

Puedes encontrar más detalles sobre la estructura y conceptos del proyecto en la carpeta `docs/`:

- [Estructura del Proyecto](docs/estructura.md)
- [Sobre las Olimpiadas de Programación](docs/olimpiadas.md)

## 🗄️ Diccionario de Datos

A continuación se detalla la estructura de la base de datos `algorithmicsca`.

### 1. roles
Catálogo de roles disponibles en el sistema.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `rol_id` | SMALLINT UNSIGNED | NO | **PK**, Auto Increment |
| `nombre` | VARCHAR(100) | NO | **Unique**. Nombre del rol (ej: Administrador, Estudiante) |

#### Código de Creación

```sql
CREATE TABLE roles(
    rol_id SMALLINT UNSIGNED AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    
    PRIMARY KEY(rol_id)
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO Roles (nombre) VALUES
('Administrador'),
('Personal Académico'),
('Estudiante');
```

### 2. usuarios
Usuarios registrados en el sistema.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `usuario_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `nombre` | VARCHAR(100) | NO | Nombre del usuario |
| `apellido` | VARCHAR(100) | NO | Apellido del usuario |
| `email` | VARCHAR(150) | NO | **Unique**. Correo electrónico |
| `clave` | VARCHAR(255) | NO | Contraseña hash |
| `habilitado` | BOOLEAN | NO | Default: `TRUE` |
| `rol_id` | SMALLINT UNSIGNED | NO | **FK** ref `roles(rol_id)` (`ON DELETE RESTRICT`) |

#### Relaciones
- **roles**: Se vincula con la tabla de roles para asignar un perfil de permisos específico a cada usuario (ej. Administrador, Estudiante).

#### Reglas de Integridad
- **ON DELETE RESTRICT (rol_id)**: Impide la eliminación de un rol si existen usuarios asignados a él. Esto asegura que no queden usuarios "huérfanos" con un rol inexistente, obligando a reasignar o eliminar los usuarios antes de borrar el rol.

#### Código de Creación

```sql
CREATE TABLE usuarios (
    usuario_id INT UNSIGNED AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL, 
    habilitado BOOLEAN NOT NULL DEFAULT TRUE,
    -- para el acceso al sistema (ej: 'Administrador', 'Personal Académico', 'Estudiante').
    rol_id SMALLINT UNSIGNED NOT NULL, 
    
    PRIMARY KEY(usuario_id),
    -- ON DELETE RESTRICT no permite eliminar rol si algún usuario lo tiene
	FOREIGN KEY(rol_id) REFERENCES roles(rol_id) ON DELETE RESTRICT
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO usuarios (nombre, apellido, email, clave, rol_id) VALUES
('Victoria', 'Pérez', 'victoria.perez@academia.com', '2424', 1),
('Lilith', 'Zahir', 'lilith.zahir@academia.com', '4444', 1);
```


### 3. cursos
Cursos académicos disponibles.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `curso_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `nombre` | VARCHAR(255) | NO | Nombre del curso |
| `descripcion` | TEXT | SI | Descripción detallada |
| `fecha_creacion` | DATETIME | SI | Default: `CURRENT_TIMESTAMP` |
| `estado` | VARCHAR(20) | NO | Default: 'En desarrollo'. **Check**: 'Activo', 'En desarrollo', 'Suspendido' |

#### Código de Creación

```sql
CREATE TABLE cursos (
	curso_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT, 
    -- DATETIME DEFAULT CURRENT_TIMESTAMP: Registra la fecha y hora de creación automáticamente
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP, 
    estado VARCHAR(20) NOT NULL DEFAULT 'En desarrollo',
    
    -- Restricción CHECK: Asegura que solo se puedan ingresar los dos valores definidos.
    CONSTRAINT chk_estado_curso 
        CHECK (estado IN ('Activo', 'En desarrollo', 'Suspendido'))
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO Cursos (nombre, descripcion, estado) VALUES
('Algoritmos Avanzados', 'Profundización en técnicas algorítmicas complejas y su optimización.', 'Activo'),
('Python para Principiantes', 'Introducción a la programación con Python.', 'Activo');
```

### 4. secciones
Instancias temporales de un curso (cohortes).

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `seccion_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `curso_id` | INT UNSIGNED | NO | **FK** ref `cursos(curso_id)` |
| `nombre` | VARCHAR(255) | NO | Identificador de la sección (ej: Q4 2025) |
| `fecha_inicio` | DATE | NO | Fecha de inicio |
| `fecha_fin` | DATE | SI | Fecha de finalización |
| `horario` | VARCHAR(100) | SI | Horario de clases |

#### Relaciones
- **cursos**: Cada sección pertenece a un curso específico. Una sección es la instancia impartida de un curso en un periodo determinado.

#### Reglas de Integridad
- **ON DELETE RESTRICT (curso_id)**: No se puede eliminar un curso si tiene secciones (cohortes) creadas. Esto preserva el historial académico, ya que las secciones dependen de la definición del curso base.

#### Código de Creación

```sql
CREATE TABLE secciones (
    seccion_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    curso_id INT UNSIGNED NOT NULL,
    
    nombre VARCHAR(255) NOT NULL, 
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    horario VARCHAR(100), 

    CONSTRAINT fk_seccion_curso FOREIGN KEY (curso_id) REFERENCES Cursos (curso_id) ON DELETE RESTRICT 
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO secciones (curso_id, nombre, fecha_inicio, fecha_fin, horario) VALUES
(1, 'Algoritmos Avanzados - Tarde Q4 2025', '2025-10-15', '2026-02-15', 'Lunes y Miércoles 16:00'),
(2, 'Python Principiantes - Mañana Q4 2025', '2025-11-01', '2026-01-31', 'Martes y Jueves 09:00');
```

### 5. inscripciones
Relación de estudiantes inscritos en secciones.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `inscripcion_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `id_usuario` | INT UNSIGNED | NO | **FK** ref `usuarios(usuario_id)` (`ON DELETE CASCADE`) |
| `id_seccion` | INT UNSIGNED | NO | **FK** ref `secciones(seccion_id)` (`ON DELETE RESTRICT`) |
| `fecha_inscripcion`| DATETIME | SI | Default: `CURRENT_TIMESTAMP` |
| `estado` | VARCHAR(20) | NO | Default: 'En curso' |
| **Restricciones** | | | **Unique**: (`id_usuario`, `id_seccion`) |

#### Relaciones
- **usuarios**: Vincula a un estudiante con la sección.
- **secciones**: Vincula la inscripción con una oferta académica específica.

#### Reglas de Integridad
- **ON DELETE CASCADE (id_usuario)**: Si se elimina un usuario del sistema, todas sus inscripciones se eliminan automáticamente.
- **ON DELETE RESTRICT (id_seccion)**: No se puede eliminar una sección si hay estudiantes inscritos en ella, protegiendo los registros académicos activos.

#### Código de Creación

```sql
CREATE TABLE inscripciones (
    inscripcion_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL, 
    id_seccion INT UNSIGNED NOT NULL,  
    
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'En curso', 
    
    CONSTRAINT fk_inscripcion_usuario  FOREIGN KEY (id_usuario) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_inscripcion_seccion FOREIGN KEY (id_seccion) REFERENCES secciones(seccion_id) ON DELETE RESTRICT,

    -- Restricción Única: Un estudiante solo puede estar inscrito una vez en una sección específica.
    CONSTRAINT unique_inscripcion_usuario_seccion
        UNIQUE (id_usuario, id_seccion)
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO inscripciones (id_usuario, id_seccion, estado) VALUES
(30, 1, 'En curso'), 
(30, 3, 'En curso');
```

### 6. asignaciones_roles_seccion
Asignación de personal (docentes, asistentes) a secciones.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `asignacion_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `id_usuario` | INT UNSIGNED | NO | **FK** ref `usuarios(usuario_id)` (`ON DELETE CASCADE`) |
| `id_rol` | SMALLINT UNSIGNED | NO | **FK** ref `roles(rol_id)` (`ON DELETE RESTRICT`) |
| `id_seccion` | INT UNSIGNED | NO | **FK** ref `secciones(seccion_id)` (`ON DELETE CASCADE`) |
| **Restricciones** | | | **Unique**: (`id_usuario`, `id_rol`, `id_seccion`) |

#### Relaciones
- **usuarios**: El docente o personal asignado.
- **roles**: El rol que desempeña en esa sección específica (ej. Instructor, Asistente).
- **secciones**: La clase donde ejerce este rol.

#### Reglas de Integridad
- **ON DELETE CASCADE (id_usuario)**: Si se elimina al usuario, se eliminan sus asignaciones docentes.
- **ON DELETE CASCADE (id_seccion)**: Si se elimina la sección, se eliminan todas las asignaciones de personal asociadas.
- **ON DELETE RESTRICT (id_rol)**: No se puede borrar un rol si está siendo usado en una asignación activa.

#### Código de Creación

```sql
CREATE TABLE asignaciones_roles_seccion (
	asignacion_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL,
    id_rol SMALLINT UNSIGNED NOT NULL,
    id_seccion INT UNSIGNED NOT NULL, 
    
    CONSTRAINT fk_ars_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (usuario_id) ON DELETE CASCADE, 
    CONSTRAINT fk_ars_rol FOREIGN KEY (id_rol) REFERENCES roles (rol_id) ON DELETE RESTRICT,
    CONSTRAINT fk_ars_seccion FOREIGN KEY (id_seccion) REFERENCES secciones (seccion_id) ON DELETE CASCADE, 
        
    -- Restricción Única: Un usuario solo puede tener el mismo rol una vez en una sección.
    CONSTRAINT unique_usuario_rol_seccion
        UNIQUE (id_usuario, id_rol, id_seccion)
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO asignaciones_roles_seccion (id_usuario, id_rol, id_seccion) VALUES
(5, 4, 1), -- Instructor en Algoritmos Avanzados
(5, 4, 3); -- Instructor en Python Intermedio
```

### 7. modulos
Unidades temáticas dentro de un curso.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `modulo_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `curso_id` | INT UNSIGNED | NO | **FK** ref `cursos(curso_id)` |
| `nombre` | VARCHAR(255) | NO | Nombre del módulo |
| `orden` | INT | NO | Secuencia del módulo |
| **Restricciones** | | | **Unique**: (`curso_id`, `orden`), (`curso_id`, `nombre`) |

#### Relaciones
- **cursos**: El módulo es una parte constituyente del curso.

#### Reglas de Integridad
- **ON DELETE CASCADE (curso_id)**: Si se elimina un curso, se eliminan automáticamente todos sus módulos. Esto facilita la limpieza de datos, asumiendo que el contenido (módulos) no tiene sentido sin el curso padre.

#### Código de Creación

```sql
CREATE TABLE modulos (
    modulo_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    
    curso_id INT UNSIGNED NOT NULL, -- Define a qué curso pertenece este módulo
    nombre VARCHAR(255) NOT NULL,
    orden INT NOT NULL, -- El orden en que debe aparecer el módulo dentro del curso

    CONSTRAINT fk_modulos_curso FOREIGN KEY (curso_id) REFERENCES cursos (curso_id)
        ON DELETE CASCADE, -- Si se borra el curso, se borran todos sus módulos.
        
    -- Restricción Única: un curso no puede tener dos módulos con el mismo orden ni con el mismo nombre.
    CONSTRAINT unique_orden_nombre_curso UNIQUE (curso_id, orden),
    CONSTRAINT unique_nombre_curso UNIQUE (curso_id, nombre)
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO modulos (curso_id, nombre, orden) VALUES
(1, 'Análisis de Complejidad y Notación O', 1),
(1, 'Algoritmos de Ordenamiento Avanzado', 2);
```

### 8. evaluaciones
Actividades evaluativas dentro de un módulo.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `evaluacion_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `modulo_id` | INT UNSIGNED | NO | **FK** ref `modulos(modulo_id)` (`ON DELETE CASCADE`) |
| `nombre` | VARCHAR(255) | NO | Nombre de la evaluación |
| `descripcion` | TEXT | SI | Instrucciones |
| `puntuacion_max` | DECIMAL(6, 2) | NO | **Check**: 1.00 - 20.00 |
| **Restricciones** | | | **Unique**: (`modulo_id`, `nombre`) |

#### Relaciones
- **modulos**: La evaluación pertenece a un tema específico (módulo) del curso.

#### Reglas de Integridad
- **ON DELETE CASCADE (modulo_id)**: Si se elimina un módulo, se eliminan todas las evaluaciones asociadas a él, manteniendo la consistencia del contenido académico.

#### Código de Creación

```sql
CREATE TABLE evaluaciones (
    evaluacion_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    modulo_id INT UNSIGNED NOT NULL,  -- Define a qué módulo pertenece esta evaluacion
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT, 
    puntuacion_max DECIMAL(6, 2) NOT NULL, -- Puntuación máxima: de 1.00 a 20.00 puntos

    CONSTRAINT fk_evaluaciones_modulo FOREIGN KEY (modulo_id) REFERENCES modulos(modulo_id)
        ON DELETE CASCADE, -- Si se borra el módulo, se borran sus asignaciones.
        
    -- Restricción de Rango: Asegura que la puntuación máxima esté entre 1 y 20
    CONSTRAINT chk_puntuacion_rango
        CHECK (puntuacion_max >= 1.00 AND puntuacion_max <= 20.00),
        
    -- Restricción Única: Un módulo no puede tener dos asignaciones con el mismo nombre.
    CONSTRAINT unique_nombre_evaluacion_modulo
        UNIQUE (modulo_id, nombre)
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO evaluaciones (modulo_id, nombre, descripcion, puntuacion_max) VALUES
(1, 'Cuestionario: Notación O', 'Evaluar la complejidad temporal de 5 pseudocódigos simples.', 10.00),
(1, 'Tarea de Análisis de Caso', 'Análisis de la eficiencia de una función recursiva.', 10.00);
```

### 9. calificaciones
Notas obtenidas por los estudiantes en las evaluaciones.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `calificacion_id`| INT UNSIGNED | NO | **PK**, Auto Increment |
| `id_inscripcion` | INT UNSIGNED | NO | **FK** ref `inscripciones(inscripcion_id)` (`ON DELETE CASCADE`) |
| `id_evaluacion` | INT UNSIGNED | NO | **FK** ref `evaluaciones(evaluacion_id)` (`ON DELETE RESTRICT`) |
| `calificacion` | DECIMAL(6, 2) | NO | Nota obtenida |
| `fecha_limite` | DATETIME | SI | Deadline específico |
| `fecha_entrega` | DATETIME | SI | Fecha real de entrega |
| `comentarios` | TEXT | SI | Feedback del docente |
| **Restricciones** | | | **Unique**: (`id_inscripcion`, `id_evaluacion`) |

#### Relaciones
- **inscripciones**: Vincula la nota con un estudiante específico en una sección específica.
- **evaluaciones**: Vincula la nota con la actividad evaluada.

#### Reglas de Integridad
- **ON DELETE CASCADE (id_inscripcion)**: Si se elimina la inscripción de un estudiante, se borran todas sus calificaciones.
- **ON DELETE RESTRICT (id_evaluacion)**: No se puede eliminar una evaluación (la definición de la tarea) si ya existen calificaciones registradas para ella. Esto protege la integridad del historial académico de los alumnos.

#### Código de Creación

```sql
CREATE TABLE calificaciones (
    calificacion_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,

    -- 1. Identifica al estudiante y la sección (a través de la inscripción)
    id_inscripcion INT UNSIGNED NOT NULL,
    -- 2. Identifica la tarea evaluada (definición de la evaluacion)
    id_evaluacion INT UNSIGNED NOT NULL,
    
    -- Información de la Calificación
    calificacion DECIMAL(6, 2) NOT NULL, -- La nota obtenida (ej: 18.50)
    fecha_limite DATETIME,           -- La fecha límite específica para esta asignación en esta cohorte.
    fecha_entrega DATETIME,          -- La fecha en que el estudiante entregó la tarea.
    
    -- Comentarios (Opcional)
    comentarios TEXT,

    CONSTRAINT fk_calificaciones_inscripcion FOREIGN KEY (id_inscripcion) REFERENCES inscripciones(inscripcion_id)
        ON DELETE CASCADE, 
    CONSTRAINT fk_calificaciones_evaluacion FOREIGN KEY (id_evaluacion) REFERENCES evaluaciones(evaluacion_id)
        ON DELETE RESTRICT, -- No se puede borrar una asignación si ya tiene calificaciones.

    -- Restricción Única: Asegura que una inscripción (estudiante + sección) solo tenga una calificación por asignación.
    CONSTRAINT unique_inscripcion_asignacion
        UNIQUE (id_inscripcion, id_evaluacion)
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO calificaciones (id_inscripcion, id_evaluacion, calificacion, fecha_limite, fecha_entrega, comentarios) VALUES
(1, 1, 9.00, '2025-10-30 23:59:59', '2025-10-28 10:30:00', 'Análisis muy claro. Casi perfecto.'),
(2, 1, 8.50, '2025-10-30 23:59:59', '2025-10-30 22:15:00', 'Faltó justificar completamente la notación Omega.');
```

### 10. proyectos
Proyectos prácticos asociados a un curso.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `proyecto_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `curso_id` | INT UNSIGNED | NO | **FK** ref `cursos(curso_id)` (`ON DELETE CASCADE`). **Unique** (1 proyecto x curso) |
| `nombre` | VARCHAR(255) | NO | Título del proyecto |
| `descripcion` | TEXT | SI | Detalles del proyecto |
| `puntuacion_max` | DECIMAL(6, 2) | NO | Nota máxima |
| `es_grupal` | BOOLEAN | NO | Default: `TRUE` |

#### Relaciones
- **cursos**: El proyecto es la actividad integradora de un curso.

#### Reglas de Integridad
- **ON DELETE CASCADE (curso_id)**: Si se elimina el curso, se elimina también su proyecto asociado.

#### Código de Creación

```sql
CREATE TABLE proyectos (
	proyecto_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    curso_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT, 
    puntuacion_max DECIMAL(6, 2) NOT NULL,
    es_grupal BOOLEAN NOT NULL DEFAULT TRUE, -- Opcional: Define si el proyecto acepta grupos
    
    CONSTRAINT fk_proyecto_curso FOREIGN KEY (curso_id) REFERENCES Cursos (curso_id)
        ON DELETE CASCADE,
        
    -- Asegura que solo haya un proyecto por curso.
    CONSTRAINT unique_curso_proyecto
        UNIQUE (curso_id)
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO proyectos (curso_id, nombre, puntuacion_max, es_grupal) VALUES
(1, 'Proyecto Final: Optimización de Ruta', 20.00, TRUE),
(3, 'Proyecto Integrador de API REST con Python', 20.00, TRUE);
```

### 11. proyectos_x_estudiantes
Entregas y calificaciones de proyectos.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `proyecto_estudiante_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `id_proyecto` | INT UNSIGNED | NO | **FK** ref `proyectos(proyecto_id)` (`ON DELETE RESTRICT`) |
| `id_inscripcion` | INT UNSIGNED | NO | **FK** ref `inscripciones(inscripcion_id)` (`ON DELETE CASCADE`) |
| `grupo_identificador` | VARCHAR(50) | SI | ID del equipo (si aplica) |
| `calificacion` | DECIMAL(6, 2) | SI | Nota obtenida |
| `fecha_limite` | DATETIME | NO | Deadline |
| `fecha_entrega` | DATETIME | SI | Fecha de entrega |
| **Restricciones** | | | **Unique**: (`id_inscripcion`, `id_proyecto`) |

#### Relaciones
- **proyectos**: La definición del proyecto a realizar.
- **inscripciones**: El estudiante (o grupo de estudiantes) que realiza la entrega.

#### Reglas de Integridad
- **ON DELETE RESTRICT (id_proyecto)**: No se puede eliminar un proyecto si ya hay estudiantes que lo han entregado o están siendo evaluados.
- **ON DELETE CASCADE (id_inscripcion)**: Si se elimina la inscripción de un estudiante, se elimina su registro de proyecto.

#### Código de Creación

```sql
CREATE TABLE proyectos_x_estudiantes (
    proyecto_estudiante_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    
    -- FK: A qué proyecto se está evaluando (referencia a Proyectos_Curso)
    id_proyecto INT UNSIGNED NOT NULL,
    -- FK: El estudiante y la sección (referencia a Inscripciones)
    id_inscripcion INT UNSIGNED NOT NULL, 
    
    -- Clave para la agrupación. Si es NULL, el proyecto es individual.
    grupo_identificador VARCHAR(50) NULL, 
    calificacion DECIMAL(6, 2),
    fecha_limite DATETIME NOT NULL,
    fecha_entrega DATETIME,
    
    CONSTRAINT fk_pe_proyecto FOREIGN KEY (id_proyecto) REFERENCES proyectos (proyecto_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_pe_inscripcion FOREIGN KEY (id_inscripcion) REFERENCES inscripciones(inscripcion_id)
        ON DELETE CASCADE,
        
    -- Restricción: Un estudiante solo puede tener un registro por proyecto en su inscripción.
    CONSTRAINT unique_inscripcion_proyecto
        UNIQUE (id_inscripcion, id_proyecto)
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO proyectos_x_estudiantes (id_proyecto, id_inscripcion, grupo_identificador, calificacion, fecha_limite, fecha_entrega) VALUES
(1, 1, 'ALGO-A', 18.50, '2026-02-01 23:59:59', '2026-01-30 14:00:00'),
(1, 2, 'ALGO-A', 18.50, '2026-02-01 23:59:59', '2026-01-30 14:00:00');
```

### 12. olimpiadas
Eventos de competencia.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `olimpiada_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `nombre` | VARCHAR(255) | NO | Nombre del evento |
| `descripcion` | TEXT | SI | Detalles |
| `fecha_inicio` | DATE | NO | Inicio del evento |
| `fecha_fin` | DATE | NO | Fin del evento |
| `categoria` | VARCHAR(100) | SI | Ej: Programación, Robótica |
| `estado` | VARCHAR(20) | NO | Default: 'Programada'. **Check**: 'Programada', 'En curso', 'Finalizada' |

#### Código de Creación

```sql
CREATE TABLE olimpiadas (
    olimpiada_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT, 
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    categoria VARCHAR(100), -- Ej: 'Programación', 'Robótica'
    estado VARCHAR(20) NOT NULL DEFAULT 'Programada', 
    
    CONSTRAINT chk_estado_olimpiada
        CHECK (estado IN ('Programada', 'En curso', 'Finalizada'))
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO olimpiadas (nombre, descripcion, fecha_inicio, fecha_fin, categoria, estado) VALUES
('Olimpiada de Algoritmos 2026', 'Competencia de lógica y optimización.', '2026-03-01', '2026-03-05', 'Programación', 'En curso');
```

### 13. asignaciones_roles_olimpiada
Personal asignado a la organización de olimpiadas.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `asignacion_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `id_usuario` | INT UNSIGNED | NO | **FK** ref `usuarios(usuario_id)` (`ON DELETE CASCADE`) |
| `id_rol` | SMALLINT UNSIGNED | NO | **FK** ref `roles(rol_id)` (`ON DELETE RESTRICT`) |
| `id_olimpiada` | INT UNSIGNED | NO | **FK** ref `olimpiadas(olimpiada_id)` (`ON DELETE CASCADE`) |
| **Restricciones** | | | **Unique**: (`id_usuario`, `id_rol`, `id_olimpiada`) |

#### Relaciones
- **usuarios**: La persona que colabora en la olimpiada.
- **olimpiadas**: El evento específico.
- **roles**: La función que desempeña (ej. Juez, Organizador).

#### Reglas de Integridad
- **ON DELETE CASCADE (id_usuario / id_olimpiada)**: Si se elimina el usuario o la olimpiada, la asignación desaparece automáticamente.
- **ON DELETE RESTRICT (id_rol)**: Impide borrar un rol si hay personal asignado con ese rol en una olimpiada.

#### Código de Creación

```sql
CREATE TABLE asignaciones_roles_olimpiada (
    asignacion_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL, 
    id_rol SMALLINT UNSIGNED NOT NULL, -- El rol contextual (ej: Juez, rol_id=7)
    id_olimpiada INT UNSIGNED NOT NULL, 
    
    CONSTRAINT fk_aro_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(usuario_id) ON DELETE CASCADE, 
    CONSTRAINT fk_aro_rol FOREIGN KEY (id_rol) REFERENCES roles(rol_id) ON DELETE RESTRICT,
    CONSTRAINT fk_aro_olimpiada FOREIGN KEY (id_olimpiada) REFERENCES olimpiadas(olimpiada_id) ON DELETE CASCADE,
        
    -- Un usuario no puede tener el mismo rol dos veces en la misma olimpiada.
    CONSTRAINT unique_usuario_rol_olimpiada
        UNIQUE (id_usuario, id_rol, id_olimpiada)
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO asignaciones_roles_olimpiada (id_usuario, id_rol, id_olimpiada) VALUES
(4, 7, 1), -- Juez Principal
(6, 9, 1); -- Coordinador
```

### 14. participaciones_olimpiada
Registro de participantes y equipos en olimpiadas.

| Columna | Tipo | Nulo | Descripción / Restricciones |
| :--- | :--- | :--- | :--- |
| `participacion_id` | INT UNSIGNED | NO | **PK**, Auto Increment |
| `id_usuario` | INT UNSIGNED | NO | **FK** ref `usuarios(usuario_id)` (`ON DELETE CASCADE`) |
| `id_olimpiada` | INT UNSIGNED | NO | **FK** ref `olimpiadas(olimpiada_id)` (`ON DELETE CASCADE`) |
| `equipo_identificador` | VARCHAR(50) | NO | Nombre/ID del equipo |
| `es_participante` | BOOLEAN | NO | Default: `TRUE` (1=Participante, 0=Tutor) |
| `fecha_asignacion` | DATETIME | SI | Default: `CURRENT_TIMESTAMP` |
| `puntuacion_final` | DECIMAL(6, 2) | SI | Puntaje obtenido |
| `ranking` | INT | SI | Posición final |
| **Restricciones** | | | **Unique**: (`id_usuario`, `id_olimpiada`) |

#### Relaciones
- **usuarios**: El participante.
- **olimpiadas**: La competencia.

#### Reglas de Integridad
- **ON DELETE CASCADE (id_usuario / id_olimpiada)**: La participación depende existencialmente del usuario y del evento. Si alguno deja de existir, el registro de participación se elimina.

#### Código de Creación

```sql
CREATE TABLE participaciones_olimpiada (
    participacion_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL, 
    id_olimpiada INT UNSIGNED NOT NULL, 
    equipo_identificador VARCHAR(50) NOT NULL, 
    es_participante BOOLEAN NOT NULL DEFAULT TRUE, -- 1 = Estudiante Participante (Compitiendo); 0 = Tutor/Personal Académico
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    puntuacion_final DECIMAL(6, 2) NULL, -- Solo se llena si es_participante = 1
    ranking INT NULL, 
    
    CONSTRAINT fk_po_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_po_olimpiada FOREIGN KEY (id_olimpiada) REFERENCES olimpiadas (olimpiada_id) ON DELETE CASCADE,
        
    -- Un usuario solo puede tener una asignación (ya sea como participante o tutor) por olimpiada.
    CONSTRAINT unique_usuario_olimpiada
        UNIQUE (id_usuario, id_olimpiada)
);
```

#### Ejemplo de Inserción

```sql
INSERT INTO participaciones_olimpiada (id_usuario, id_olimpiada, equipo_identificador, es_participante, puntuacion_final, ranking) VALUES
(30, 1, 'ALPHA', TRUE, 150.00, 2),
(31, 1, 'ALPHA', TRUE, 150.00, 2);
```
