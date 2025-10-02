# Event Tracker Prototype

Este prototipo lleva el mockup original HTML/JS a una aplicacion React con datos locales (hardcode o localStorage).
No hay integracion con backend ni APIs; todo vive en el navegador de la persona usuaria.

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

## Scripts disponibles

```bash
npm install      # instala dependencias
npm run dev      # levanta el servidor de desarrollo (Vite)
npm run build    # genera la version estatic
npm run preview  # (opcional) sirve el build localmente
```

## Estructura de directorios

```
.
+-- index.html          # entrada Vite; incluye Tailwind por CDN
+-- package.json        # dependencias y scripts
+-- vite.config.js      # configuracion Vite + plugin React
+-- src
    +-- App.jsx         # contenedor principal: estado global, layout, modales
    +-- main.jsx        # hidrata React en `#root`
    +-- data
    ¦   +-- initialEvents.js # arreglo de eventos semilla
    +-- components
    ¦   +-- Header.jsx        # login ficticio y CTA de nuevo evento
    ¦   +-- EventFilters.jsx  # filtros por texto, categoria y publico
    ¦   +-- UpcomingEvents.jsx# listado compacto de proximos eventos
    ¦   +-- EventGrid.jsx     # tarjetas de eventos + acciones admin
    ¦   +-- Calendar.jsx      # calendario mensual interactivo
    ¦   +-- Modal.jsx         # contenedor generico de modal
    ¦   +-- EventForm.jsx     # formulario crear/editar con persistencia local
    ¦   +-- ToastStack.jsx    # pila de notificaciones temporales
    +-- styles
    ¦   +-- global.css        # estilos base y resets
    +-- utils
        +-- date.js           # helpers de fecha (formato, matriz calendario)
```

## Flujo principal

1. `main.jsx` renderiza `App.jsx` sobre el `div#root` definido en `index.html`.
2. `App.jsx` carga eventos desde `localStorage` (o `initialEvents.js`), maneja el login ficticio (`admin` / `1234`) y orquesta la UI:
   - `Header` muestra el formulario de ingreso o acciones de administracion.
   - `EventFilters`, `UpcomingEvents` y `Calendar` permiten explorar y filtrar eventos.
   - `EventGrid` lista los eventos filtrados y expone ver detalle, editar o eliminar.
   - `Modal` + `EventForm` encapsulan la creacion/edicion guardando en `localStorage`.
   - `ToastStack` informa acciones (login, crear, editar, eliminar).

## Notas de implementacion

- El formulario valida que la fecha fin no sea anterior a la de inicio.
- Los catalogos (campus, categoria, publico, estados) estan definidos localmente en `EventForm.jsx`.
- El calendario se genera con utilidades de `utils/date.js` y sigue el formato lunes a domingo.
- Todo el contenido textual usa ASCII para evitar simbolos sin soporte.

## Limitaciones conocidas

- No existe autenticacion real ni manejo de sesiones.
- No se consideraron estados de error cuando `localStorage` no esta disponible.
- Tailwind se incluye via CDN solo para prototipo; en produccion deberia compilarse dentro del build.

