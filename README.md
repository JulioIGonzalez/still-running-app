# 🏃 Still Running App

**Still Running App** es una aplicación web *mobile-first* para corredores, diseñada para registrar sesiones de running en tiempo real utilizando geolocalización y mapas interactivos.

El proyecto está desarrollado como un **MVP funcional**, enfocado en una arquitectura clara, experiencia de usuario fluida y lógica real de tracking.

---

## 🎯 Objetivo

Permitir que un runner pueda:

- Iniciar, pausar, reanudar y detener una sesión de running
- Ver su recorrido dibujado en el mapa en tiempo real
- Medir tiempo, distancia y ritmo (pace)
- Guardar sesiones localmente
- Exportar entrenamientos en formato GPX
- Revisar el historial de corridas

---

## 🧱 Stack Tecnológico

- **React + TypeScript**
- **Vite**
- **Leaflet / React-Leaflet**
- **Geolocation API**
- **LocalStorage**
- **Arquitectura basada en hooks**
- **Diseño mobile-first**

---

## 🗺️ Mapa Interactivo

- Mapa a pantalla completa
- Seguimiento GPS en tiempo real
- Dibujo del recorrido con `Polyline`
- Controles flotantes sin interferir con el mapa
- Experiencia optimizada para dispositivos móviles

---

## ⏱️ Gestión de Sesión

La lógica principal se maneja mediante el hook:

### `useRunSession`

Este hook se encarga de:

- Controlar el estado de la sesión (`idle`, `running`, `paused`)
- Gestionar el cronómetro
- Registrar el path GPS
- Calcular distancia con la fórmula de Haversine
- Calcular ritmo (min/km)
- Guardar automáticamente la sesión al finalizar

Toda la lógica está centralizada para evitar inconsistencias de estado.

---

## ▶️ Controles de Running

- **Iniciar**: comienza una nueva sesión
- **Pausar**: detiene tiempo y GPS sin perder datos
- **Reanudar**: continúa la sesión pausada
- **Stop**: guarda el entrenamiento y reinicia el estado

Diseñados para uso rápido durante la actividad.

---

## 📜 Historial de Entrenamientos

- Listado de sesiones guardadas
- Fecha, duración y distancia
- Persistencia local
- Exportación individual en formato GPX

---

## 📦 Exportación GPX

Cada sesión puede exportarse como archivo **GPX estándar**, compatible con:

- Strava
- Garmin
- Komoot
- Google Earth

---

## 🧠 Decisiones Técnicas

- Un único estado de sesión → menor complejidad
- Hooks desacoplados → escalabilidad
- Sin backend → funcional offline
- Base sólida para futuras integraciones

---

## 🚀 Estado del Proyecto

✔ MVP completo  
✔ Funcional y estable  
✔ Listo para escalar  

---

## 🔮 Próximas Mejoras

- Autopause inteligente
- Estadísticas avanzadas
- Backend con usuarios
- Autenticación
- Modo entrenamiento
- Publicación como PWA

---

## 📷 Screenshots

*(agregar imágenes del mapa, controles y historial)*

---

## 📄 Licencia

MIT
