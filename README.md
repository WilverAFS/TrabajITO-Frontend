<div align="center">
  <h3>TECNOLÓGICO NACIONAL DE MÉXICO</h3>
  <h2>INSTITUTO TECNOLÓGICO DE OAXACA</h2>
  <p><strong>Ingeniería en Sistemas Computacionales</strong></p>
  <hr>
  <h1>TrabajITO</h1>
  <h3>Frontend del proyecto integrador</h3>
  <p><strong>Aplicación web para vincular clientes con trabajadores de oficio mediante perfiles basados en su reputación</strong></p>
  <p>
    <strong>Materia:</strong> SCG-1009 · Gestión de Proyectos de Software<br>
    <strong>Semestre:</strong> 7.º &nbsp; | &nbsp; <strong>Grupo:</strong> 8SC &nbsp; | &nbsp; <strong>Equipo:</strong> 5<br>
    <strong>Docente:</strong> Adelina Martínez Nieto
  </p>
  <h4>Integrantes del Equipo 5</h4>
  <p>
    -<br>
    Cruz Sanchez Jhoan Marvin<br>
    -<br>
    -<br>
    -<br>
    Valencia Durán José Eduardo<br>
  </p>
  <p><strong>Oaxaca de Juárez, Oaxaca · 2026</strong></p>
  <p><strong>Estado:</strong> En desarrollo &nbsp;·&nbsp; <strong>Método de trabajo:</strong> Kanban</p>
</div>

---

## 1. Descripción del proyecto

**TrabajITO** es un proyecto académico de aplicación web orientado a conectar a personas que necesitan contratar servicios de oficio con trabajadores independientes, por ejemplo, de carpintería, plomería, electricidad, albañilería, pintura y herrería.

La propuesta busca facilitar búsquedas más informadas mediante perfiles profesionales, especialidades, disponibilidad, evidencias de trabajos realizados y reputación basada en calificaciones y reseñas asociadas a servicios registrados. Su alcance inicial se concentra en Oaxaca de Juárez y su zona conurbada.

## 2. Descripción de este repositorio

Este repositorio aloja el **frontend de TrabajITO**, desarrollado con **React y Vite**. Su responsabilidad es presentar las interfaces de la aplicación, gestionar la interacción del usuario, validar datos en el navegador cuando corresponda y, en etapas posteriores, comunicarse con la API del backend desarrollado en Laravel.

Las áreas funcionales previstas para las interfaces son:

- **Usuarios:** pantallas de registro, inicio de sesión y acceso a cuentas.
- **Perfiles profesionales:** presentación de especialidades, experiencia, disponibilidad y portafolios.
- **Exploración:** búsqueda y filtrado de trabajadores por oficio y zona, con información de reputación.
- **Contratación:** interfaces para solicitudes de servicio, seguimiento y consulta del historial.
- **Administración:** vistas de supervisión según los permisos y funciones aprobados por el equipo.

**Estado actual del código:** las pantallas de **inicio de sesión** y **registro** están integradas en la rama `main`. Son interfaces de frontend: **aún no realizan autenticación ni guardan cuentas en el backend**. La página principal pública, el catálogo y los demás módulos continúan en desarrollo según los Work Items del equipo.

## 3. Tecnologías

| Tecnología | Uso |
|---|---|
| JavaScript y JSX | Lógica y composición de componentes de interfaz. |
| React 19 | Construcción de componentes y manejo de estado de la interfaz. |
| Vite 8 | Servidor de desarrollo y compilación del frontend. |
| HTML y CSS | Estructura visual, estilos y diseño responsivo. |
| ESLint | Revisión estática y reglas de calidad del código. |
| Node.js y npm | Instalación de dependencias y ejecución de comandos del proyecto. |
| Figma | Referencia de diseño para las pantallas acordadas. |
| Git y GitHub | Control de versiones y colaboración mediante ramas y Pull Requests. |
| GitHub Projects | Seguimiento de actividades mediante Kanban. |
| Visual Studio Code | Editor de desarrollo recomendado. |

**Arquitectura prevista:** frontend React ↔ API del backend Laravel ↔ PostgreSQL. El frontend **no se conecta directamente a la base de datos**.

## 4. Requisitos previos

Antes de instalar el frontend, verifica que tengas:

- **Node.js** en una versión compatible con Vite 8 y **npm**. El entorno del equipo se ha comprobado con Node.js 24.14.0 y npm 11.9.0.
- **Git** instalado y acceso al repositorio en GitHub.
- **Visual Studio Code** u otro editor compatible.
- Un navegador web moderno para realizar las pruebas visuales.

Para comprobar las herramientas principales en PowerShell:

```powershell
node -v
npm -v
git --version
```

**Nota:** PHP, Composer y PostgreSQL son herramientas del backend. No es necesario instalarlas para visualizar el frontend de manera independiente. La integración con servicios reales requerirá configurar el backend cuando el equipo lo indique.

## 5. Guía de instalación local (Windows / PowerShell)

### 5.1 Clonar el repositorio

Abre una terminal de Visual Studio Code o PowerShell en la carpeta donde deseas guardar el proyecto:

```powershell
git clone https://github.com/WilverAFS/TrabajITO-Frontend.git
cd TrabajITO-Frontend
```

Si ya tienes el repositorio clonado, **no vuelvas a clonarlo**. Entra a tu carpeta existente, revisa los cambios locales y actualiza la rama que corresponda al flujo de colaboración.

### 5.2 Instalar dependencias

```powershell
npm ci
```

`npm ci` utiliza las versiones registradas en `package-lock.json` para reproducir la instalación del equipo.

### 5.3 Iniciar el servidor de desarrollo

```powershell
npm run dev
```

Vite mostrará una dirección local, normalmente **http://localhost:5173**. Abre la dirección que aparezca en la terminal.

Para detener el servidor, presiona **Ctrl + C**.

### 5.4 Verificar las interfaces disponibles

Con el servidor de desarrollo activo:

| Ruta | Pantalla actual | Observación |
|---|---|---|
| `/` | Inicio de sesión | Interfaz visual; autenticación con backend pendiente. |
| `/registro` | Registro de usuarios | Formulario con validaciones básicas; creación real de cuentas pendiente. |

Por ahora, la selección de pantalla utiliza una comprobación sencilla de la ruta en `src/main.jsx`; todavía no hay un enrutador dedicado. Estas rutas podrán reorganizarse cuando se implemente la página principal pública.

### 5.5 Revisar y compilar el proyecto

```powershell
npm run lint
npm run build
```

El primer comando ejecuta ESLint. El segundo genera la versión compilada en `dist/`. Si deseas comprobar esa compilación localmente, ejecuta:

```powershell
npm run preview
```

La compilación correcta verifica el empaquetado del frontend, **no** confirma que los servicios del backend estén conectados ni que todas las funciones de negocio estén implementadas.

## 6. Estructura general del frontend

```text
public/                  Recursos estáticos públicos
src/
  assets/                Imágenes y recursos de las interfaces
  pages/
    Registro.jsx         Componente del formulario de registro
    Registro.css         Estilos de la pantalla de registro
  App.jsx                Componente de la pantalla de inicio de sesión
  App.css                Estilos de inicio de sesión
  index.css              Estilos generales
  main.jsx               Punto de entrada y selección temporal de pantalla
index.html               Documento HTML principal
package.json             Dependencias y scripts de npm
package-lock.json        Versiones bloqueadas de dependencias
vite.config.js           Configuración de Vite
eslint.config.js         Configuración de ESLint
README.md                Documentación principal del frontend
LEEME-PR-REGISTRO.md     Notas de la primera contribución de registro
```

Algunas imágenes utilizadas en el registro son **recursos provisionales**, pendientes de reemplazo por los archivos finales aprobados de diseño.

## 7. Flujo de colaboración con Git y GitHub

Las contribuciones se desarrollan en **ramas personales creadas a partir de `main`** y se integran mediante Pull Requests revisados por el equipo. No deben subirse cambios directamente a `main` fuera de ese proceso.

### 7.1 Actualizar la rama principal local

```powershell
git status
git fetch origin
git switch main
git pull --ff-only origin main
```

Antes de cambiar de rama, asegúrate de no tener cambios sin guardar o modificaciones locales pendientes. No utilices comandos destructivos para descartar trabajo sin revisarlo.

### 7.2 Crear una rama personal

Por ejemplo, para una actualización de documentación:

```powershell
git switch -c docs/readme-frontend
```

Para nuevas pantallas o funcionalidades, utiliza nombres descriptivos como `feat/home-publica`, siempre que la rama no exista y su actividad haya sido acordada por el equipo.

### 7.3 Editar, revisar y registrar cambios

```powershell
git status
git diff -- README.md
git diff --check
git add README.md
git diff --cached --stat
git commit -m "docs: documentar frontend de TrabajITO"
```

Agrega únicamente los archivos de la actividad correspondiente. Verifica la identidad de Git antes de realizar el commit, para que la autoría quede correctamente registrada.

### 7.4 Publicar la rama

```powershell
git push -u origin docs/readme-frontend
```

### 7.5 Crear un Pull Request

En GitHub, selecciona **Compare & pull request** o **Pull requests → New pull request**, usando:

- **Base:** `main`.
- **Compare:** la rama de tu actividad, por ejemplo `docs/readme-frontend`.

Describe qué modificaste, indica cómo lo verificaste y solicita la revisión del líder. **No fusiones el PR por tu cuenta** cuando el repositorio requiera una revisión aprobatoria.

## 8. Buenas prácticas

- Mantener cada tarea en una rama identificable, con commits claros y Pull Requests revisables.
- Seguir las pantallas aprobadas en Figma, los criterios de aceptación y los Work Items del tablero Kanban.
- Reutilizar componentes y estilos del repositorio antes de crear elementos duplicados.
- Ejecutar `npm run lint` y `npm run build` antes de solicitar revisión.
- Verificar navegación, validaciones básicas y visualización en diferentes tamaños de pantalla.
- No subir `node_modules/`, `dist/`, credenciales, tokens o archivos de configuración local sensibles.
- Conservar `package-lock.json` y evitar actualizaciones de dependencias ajenas a la actividad.
- No presentar formularios visuales como procesos completos mientras no exista conexión con la API del backend.
- Coordinar cambios que afecten archivos compartidos o rutas para evitar conflictos entre integrantes.

## 9. Equipo y enlaces

Proyecto académico del **Equipo 5** de Ingeniería en Sistemas Computacionales, Instituto Tecnológico de Oaxaca.

- **Repositorio Frontend:** https://github.com/WilverAFS/TrabajITO-Frontend
- **Repositorio Backend:** https://github.com/WilverAFS/TrabajITO-Backend
- **Tablero Kanban:** https://github.com/users/WilverAFS/projects/3
- **Diseño de referencia en Figma:** https://www.figma.com/design/sPgweiMU30aVgemofdbC4N/Sistema
- **Documentación de React:** https://react.dev/
- **Documentación de Vite:** https://vite.dev/
- **Documentación de Node.js:** https://nodejs.org/

---

*TrabajITO — Proyecto integrador de Gestión de Proyectos de Software.*
