import { create } from 'zustand';
import { getTasks, saveTasks } from '../utils/storage';

/**
 * Store global de tareas (Zustand).
 *
 * Centraliza el estado que antes vivía en useState dentro de HomeScreen y
 * AddTaskScreen (lista de tareas + usuario actual), y expone acciones para
 * agregar, eliminar, actualizar y marcar tareas como completadas.
 *
 * Cada acción que modifica la lista también persiste el resultado en
 * AsyncStorage reutilizando las funciones ya existentes en utils/storage.js,
 * por lo que la persistencia entre sesiones se mantiene igual que en el
 * Parcial 1.
 */
export const useTaskStore = create((set, get) => ({
  username: null,
  tasks: [],
  loading: false,

  // Carga las tareas del usuario logueado desde AsyncStorage y las pone en el store.
  loadTasks: async (username) => {
    set({ loading: true });
    const data = await getTasks(username);
    set({ tasks: data, username, loading: false });
  },

  // Agrega una tarea nueva al principio de la lista.
  addTask: async (taskData) => {
    const { username, tasks } = get();
    const newTask = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      completed: false,
      createdAt: new Date().toISOString(),
      title: '',
      description: '',
      imageUri: null,
      location: null,
      contact: null,
      calendarEventId: null,
      ...taskData,
    };
    const updated = [newTask, ...tasks];
    set({ tasks: updated });
    await saveTasks(username, updated);
    return newTask;
  },

  // Actualiza campos puntuales de una tarea existente (ej: foto, ubicación, contacto, evento).
  updateTask: async (id, changes) => {
    const { username, tasks } = get();
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...changes } : t));
    set({ tasks: updated });
    await saveTasks(username, updated);
  },

  // Alterna el estado completado/pendiente de una tarea.
  toggleTask: async (id) => {
    const { username, tasks } = get();
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    set({ tasks: updated });
    await saveTasks(username, updated);
  },

  // Elimina una tarea de la lista.
  deleteTask: async (id) => {
    const { username, tasks } = get();
    const updated = tasks.filter((t) => t.id !== id);
    set({ tasks: updated });
    await saveTasks(username, updated);
  },

  // Limpia el store (se usa al cerrar sesión).
  reset: () => set({ tasks: [], username: null, loading: false }),
}));
