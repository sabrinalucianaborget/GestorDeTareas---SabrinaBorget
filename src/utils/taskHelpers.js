/**
 * Funciones puras de lógica de negocio, sin dependencias de React Native,
 * pensadas para ser fáciles de testear con Jest.
 */

// Valida el título de una tarea. Devuelve { valid, error }.
export function validateTaskTitle(title) {
  if (!title || !title.trim()) {
    return { valid: false, error: 'Por favor ingresá un título para la tarea.' };
  }
  if (title.trim().length < 3) {
    return { valid: false, error: 'El título debe tener al menos 3 caracteres.' };
  }
  return { valid: true, error: null };
}

// Formatea unas coordenadas para mostrarlas de forma legible.
export function formatCoordinates(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return '';
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

// Devuelve un texto de ubicación priorizando la dirección aproximada
// y usando las coordenadas como respaldo.
export function formatLocationLabel(location) {
  if (!location) return null;
  if (location.address) return location.address;
  return formatCoordinates(location.latitude, location.longitude);
}

// Cuenta cuántas tareas están pendientes (no completadas).
export function countPendingTasks(tasks) {
  if (!Array.isArray(tasks)) return 0;
  return tasks.filter((t) => !t.completed).length;
}
