# TrabajITO — Maquetación frontend de Registro

Esta entrega contiene **solo los archivos nuevos o modificados** respecto a `main` del repositorio `WilverAFS/TrabajITO-Frontend`, no un proyecto nuevo.

## Alcance

Pantalla `/registro` según la referencia «Registro · Escritorio.png», procedente del ZIP de Figma facilitado por el equipo:

- Nombre, apellidos, correo, contraseña y confirmación.
- Mostrar / ocultar contraseñas.
- Casilla obligatoria de aceptación de condiciones.
- Validación básica del navegador y verificación de coincidencia de contraseñas.
- Mensaje indicando que falta la conexión con el backend.
- Diseño responsivo para móviles, tablets y escritorio.

**No implementado:** llamadas a API, creación real de usuarios, roles, verificación de correo, aceptación legal de términos, acceso a otras páginas, publicación de perfil ni almacenamiento de datos. La regla de contraseña mínima de 8 caracteres es provisional y deberá acordarse con el backend.

**Recursos gráficos:** `registro-logo-provisional.png` y `registro-hero-provisional.png` son recortes de una **captura de la maqueta** del equipo, no los recursos originales exportados de Figma. Se deben sustituir por los originales en cuanto estén disponibles, especialmente para accesibilidad, calidad y consistencia visual.

## Archivos

- `src/pages/Registro.jsx` **nuevo**: formulario y comportamiento local.
- `src/pages/Registro.css` **nuevo**: estilos propios de la página y adaptación móvil.
- `src/assets/registro-logo-provisional.png` **nuevo**: logotipo de referencia, provisional.
- `src/assets/registro-hero-provisional.png` **nuevo**: sección fotográfica de referencia, provisional.
- `src/main.jsx` **modificado**: muestra Registro al navegar a `/registro` y deja el resto de rutas atendidas por `App.jsx`.

## Pasos manuales — Windows PowerShell

### Preparar el repositorio local

Si todavía no lo tienes:

```powershell
git clone https://github.com/WilverAFS/TrabajITO-Frontend.git
cd TrabajITO-Frontend
```

Si ya lo tienes, entra a esa carpeta en VS Code y abre su terminal PowerShell. Luego:

Antes de crear tu primer commit, verifica que Git utilizará tu identidad correcta en este repositorio:

```powershell
git config --local user.name "TU NOMBRE"
git config --local user.email "TU_CORREO_DE_GITHUB"
git config --get user.name
git config --get user.email
```

Utiliza tu nombre y el correo asociado a GitHub (o la dirección privada `noreply` que GitHub indique en tus ajustes). Los commits quedarán atribuidos a ti.

A continuación:

```powershell
git status
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c feat/registro-ui
```

IMPORTANTE: `git status` debe estar limpio antes de cambiar de rama. Si aparecen archivos modificados, primero hay que revisarlos; **no usar `git reset --hard`**.

### Copiar los archivos

Descomprime esta entrega en una ubicación temporal, por ejemplo, `Descargas\TrabajITO-Registro-UI`. Copia al repositorio exactamente las carpetas `src/pages/` y `src/assets/` con los archivos mencionados arriba. Después, reemplaza el contenido de `src/main.jsx` con el archivo que acompaña esta entrega.

**NO** copies/borres `App.jsx`, `App.css`, `index.css`, ni ninguna otra carpeta de tu repositorio. Tampoco copies el README de esta entrega dentro del repo salvo que el equipo lo quiera documentar ahí.

### Probar la pantalla

```powershell
npm ci
npm run dev
```

Abre la dirección que indique Vite, normalmente `http://localhost:5173/registro`.

Pruebas manuales sugeridas: muestra/oculta contraseña; campos vacíos; correo mal formado; contraseñas diferentes; casilla de términos desmarcada; éxito de validación local; ancho móvil del navegador. El mensaje de éxito **no significa** que exista una cuenta en el servidor.

Para hacer verificaciones generales:

```powershell
npm run lint
npm run build
```

Si fallan, guarda el mensaje de error y corrige antes de presentar el PR. La compilación real requiere tener el entorno del proyecto instalado.

### Revisar y registrar los cambios

```powershell
git branch --show-current
git status
git diff -- src/main.jsx
git add src/main.jsx src/pages/Registro.jsx src/pages/Registro.css src/assets/registro-logo-provisional.png src/assets/registro-hero-provisional.png
git diff --cached --stat
git commit -m "feat(frontend): maquetar pantalla de registro"
git push -u origin feat/registro-ui
```

**No incluyas** `node_modules`, `.env` ni recursos ajenos al trabajo.

### Abrir un Pull Request

En GitHub > repositorio Frontend > Pull requests > New pull request:

- Base: `main`.
- Compare: `feat/registro-ui`.
- Título: `feat(frontend): interfaz de registro de usuarios`.
- Descripción: detallar alcance visual, ruta `/registro`, pruebas realizadas, recursos provisionales y pendiente de integración con Laravel.
- Solicitar revisión al líder del proyecto y **no fusionar el PR tú mismo**.

El PR no completa el Work Item de registro de usuarios: solo su interfaz frontend.

### Resumen de colaboración

Este parche evita modificar `App.jsx`, que es el archivo modificado por la rama `ForntEnd-DPC`. Una vez aprobadas ambas interfaces, deberán definirse las rutas y enlaces del proyecto de manera conjunta (preferentemente mediante un enrutador React). La solución de ruta actual es temporal: en despliegue habrá que configurar un fallback SPA para que `/registro` funcione al recargar.
