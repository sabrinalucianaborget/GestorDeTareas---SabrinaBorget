# Gestor de Tareas — Parcial 1 Aplicaciones Móviles

# |PASOS PARA EJECUTAR LA APP|

```bash
# 1. Instalar dependencias
npm install
npx expo install

# 2. Iniciar el servidor de desarrollo
npx expo start

# 3. Escanear el QR con la app Expo Go
```

# |FUNCIONALIDADES IMPLEMENTADAS|

- **Registro de usuario** con usuario y contraseña (guardado en AsyncStorage)
- **Login** con validación de credenciales guardadas localmente
- **Protección de rutas**: sin sesión iniciada no se puede acceder al Home
- **Listado de tareas** con FlatList, persistidas en AsyncStorage
- **Agregar tareas** con título (obligatorio) y descripción (opcional)
- **Marcar como completada** tocando la tarea (tachado visual)
- **Eliminar tareas** con confirmación
- **Notificaciones locales**: al guardar una tarea, se dispara una notificación a los 5 segundos
- **Contador de tareas pendientes** en el header del Home
- **Cierre de sesión** desde el Home

# |ESTRUCTURA DEL PROYECTO|

```
gestor-de-tareas/
├── App.js
├── app.json
├── babel.config.js
├── package.json
├── README.md
└── src/
    ├── navigation/
    │   └── AppNavigator.js       ← Stack Navigator con 4 pantallas
    ├── screens/
    │   ├── LoginScreen.js        ← Pantalla de inicio de sesión
    │   ├── RegisterScreen.js     ← Pantalla de registro
    │   ├── HomeScreen.js         ← Lista de tareas (pantalla principal)
    │   └── AddTaskScreen.js      ← Alta de nueva tarea + notificación
    ├── components/
    │   └── TaskItem.js           ← Componente reutilizable de tarea
    └── utils/
        └── storage.js            ← Funciones de AsyncStorage
```

# |LINK VIDEO DEMO EN YOUTUBE|

> 🎥 [https://youtube.com/shorts/qYNOrHKeJ7g?si=beAMm2-52mF2MFoE]