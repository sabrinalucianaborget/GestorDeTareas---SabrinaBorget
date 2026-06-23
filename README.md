# Gestor de Tareas — Parcial 1 y Parcial 2 (Aplicaciones Móviles)

App de gestión de tareas hecha con React Native + Expo. Continúa sobre la
base del Parcial 1 (login, registro, listado y alta de tareas con
notificaciones locales) sumando las funcionalidades pedidas en el Parcial 2:
acceso a recursos del dispositivo (cámara, galería, ubicación, contactos y
calendario), testing automatizado con Jest y migración del estado a Zustand.

# |PASOS PARA EJECUTAR LA APP|

# 1. Instalar dependencias
npm install
npx expo install

# 2. Iniciar el servidor de desarrollo
npx expo start

# 3. Escanear el QR con la app Expo Go

> Esta versión usa expo-image-picker, expo-location, expo-contacts y
> expo-calendar, que requieren permisos nativos del dispositivo (cámara,
> ubicación, contactos, calendario). Para probar estas funciones es necesario
> usar un dispositivo físico o un emulador con esos servicios disponibles
> (en Expo Go alcanza con aceptar los permisos cuando los pida la app).

# |CÓMO CORRER LOS TESTS|

npm test

Esto ejecuta toda la suite con Jest + React Native Testing Library
(preset `jest-expo`). Se incluyen 3 archivos de test (22 tests en total):

- `__tests__/TaskItem.test.js` → test del **componente reutilizable** `TaskItem`
  (renderiza correctamente y responde a interacciones: tocar para completar,
  tocar para eliminar, mostrar foto/ubicación/contacto/calendario).
- `__tests__/taskHelpers.test.js` → test de **lógica de negocio** pura
  (validación del título de la tarea, formateo de ubicación/coordenadas,
  conteo de tareas pendientes).
- `__tests__/taskStore.test.js` → test del **store global (Zustand)**,
  verificando que `addTask`, `toggleTask`, `updateTask` y `deleteTask`
  actualizan correctamente el estado y lo persisten en AsyncStorage.

# |FUNCIONALIDADES DEL PARCIAL 1|

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

# |NUEVAS FUNCIONALIDADES — PARCIAL 2|

### 1. Permisos y acceso a recursos del dispositivo
Todas las funciones que acceden a un recurso nativo (`src/utils/permissions.js`)
solicitan el permiso correspondiente antes de usarlo y manejan los 3 estados
posibles (concedido / denegado / pendiente). Si el permiso es rechazado, se
muestra un `Alert` claro explicando qué pasó y qué se puede hacer.

### 2. Cámara y galería (`expo-image-picker`)
Desde "Nueva Tarea" se puede tomar una foto con la cámara o elegir una imagen
de la galería para asociarla a la tarea. La foto se muestra como miniatura en
el listado (`TaskItem`) y en grande en la pantalla de detalle
(`TaskDetailScreen`).

### 3. Ubicación (`expo-location`)
Se puede asociar la ubicación actual del dispositivo al lugar donde hay que
realizar la tarea. Se intenta obtener una dirección aproximada con geocoding
inverso y, si no está disponible, se muestran las coordenadas.

### 4. Contactos y calendario (`expo-contacts` / `expo-calendar`)
- Se puede elegir un contacto de la agenda del dispositivo como responsable
  de la tarea.
- Se puede crear un evento/recordatorio en el calendario nativo del
  dispositivo, vinculado a la tarea (se guarda el id del evento creado).

### 5. Testing con Jest + React Native Testing Library
Ver sección "Cómo correr los tests" más arriba.

### 6. Estado global con Zustand
Se creó `src/store/taskStore.js`, que centraliza la lista de tareas y el
usuario actual (antes vivían en `useState` dentro de `HomeScreen` y se
duplicaban llamadas a `AsyncStorage` desde `AddTaskScreen`). `HomeScreen` y
`AddTaskScreen` ahora leen y modifican el estado exclusivamente a través de
los selectores/acciones del store (`addTask`, `toggleTask`, `updateTask`,
`deleteTask`, `loadTasks`, `reset`), sin `useState` local para la lista de
tareas ni prop drilling entre pantallas.

# |ESTRUCTURA DEL PROYECTO|

```
gestor-de-tareas/
├── App.js
├── app.json
├── babel.config.js
├── package.json
├── jest.setup.js
├── README.md
├── __tests__/
│   ├── TaskItem.test.js          ← test de componente
│   ├── taskHelpers.test.js       ← test de lógica de negocio
│   └── taskStore.test.js         ← test del store global
└── src/
    ├── navigation/
    │   └── AppNavigator.js       ← Stack Navigator (+ pantalla TaskDetail)
    ├── screens/
    │   ├── LoginScreen.js        ← Pantalla de inicio de sesión (sin cambios)
    │   ├── RegisterScreen.js     ← Pantalla de registro (sin cambios)
    │   ├── HomeScreen.js         ← Lista de tareas, ahora usando el store global
    │   ├── AddTaskScreen.js      ← Alta de tarea + foto/ubicación/contacto/calendario
    │   └── TaskDetailScreen.js   ← NUEVO: detalle de una tarea
    ├── components/
    │   └── TaskItem.js           ← Componente reutilizable (extendido)
    ├── store/
    │   └── taskStore.js          ← NUEVO: store global con Zustand
    └── utils/
        ├── storage.js             ← Funciones de AsyncStorage (sin cambios)
        ├── permissions.js         ← NUEVO: manejo de permisos
        ├── device.js              ← NUEVO: cámara/galería, ubicación, contactos, calendario
        └── taskHelpers.js         ← NUEVO: funciones puras (validación/formateo)
```

# |PUNTO EXTRA: IA APLICADA AL DESARROLLO|

Para esta segunda entrega se usó Claude (Anthropic) como asistente de IA
para generar el código de las nuevas funcionalidades sobre la base ya
entregada en el Parcial 1.

Se usó como guía de contexto el código de HomeScreen.js, AddTaskScreen.js y TaskItem.js existentes, para que el estilo visual y la estructura de las pantallas nuevas (y las modificadas) fueran consistentes con las originales.
Se verificaron en el entorno real las versiones exactas de los paquetes de Expo compatibles con el SDK del proyecto (expo-image-picker, expo-location, expo-contacts, expo-calendar) y se corrió la suite de tests para confirmar que los 3 tests mínimos pedidos pasan correctamente.

Comparación código generado vs. código final integrado:

El código generado por la IA se integró prácticamente sin cambios manuales, ya que se pidió explícitamente que respetara el estilo (StyleSheet, nombres de variables, estructura de carpetas) de las pantallas originales. La principal revisión manual fue ajustar la generación de id de las tareas en el store (de Date.now().toString() a Date.now()-random) para evitar colisiones cuando se crean varias tareas en un lapso muy corto, detectado al correr los tests automatizados.

# |LINK VIDEO DEMO EN YOUTUBE|

> 🎥 Demo: [https://youtube.com/shorts/HEymiFuUSpM?si=SEYYvl0eUW7jAxaS]
