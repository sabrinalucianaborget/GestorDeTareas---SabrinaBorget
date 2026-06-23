import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTaskStore } from '../src/store/taskStore';

describe('useTaskStore (Zustand)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useTaskStore.getState().reset();
  });

  it('arranca con la lista de tareas vacía', () => {
    expect(useTaskStore.getState().tasks).toEqual([]);
  });

  it('loadTasks carga las tareas guardadas del usuario y setea el username', async () => {
    await AsyncStorage.setItem(
      'tasks_sabrina',
      JSON.stringify([{ id: '1', title: 'Tarea previa', completed: false }])
    );

    await useTaskStore.getState().loadTasks('sabrina');

    const state = useTaskStore.getState();
    expect(state.username).toBe('sabrina');
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].title).toBe('Tarea previa');
  });

  it('addTask agrega una tarea nueva al principio de la lista y la persiste', async () => {
    await useTaskStore.getState().loadTasks('sabrina');

    const created = await useTaskStore.getState().addTask({ title: 'Comprar pan' });

    const state = useTaskStore.getState();
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].id).toBe(created.id);
    expect(state.tasks[0].title).toBe('Comprar pan');
    expect(state.tasks[0].completed).toBe(false);

    // Se persistió en AsyncStorage (no solo en memoria)
    const raw = await AsyncStorage.getItem('tasks_sabrina');
    expect(JSON.parse(raw)).toHaveLength(1);
  });

  it('toggleTask invierte el estado completed de la tarea correcta', async () => {
    await useTaskStore.getState().loadTasks('sabrina');
    const task = await useTaskStore.getState().addTask({ title: 'Lavar el auto' });

    await useTaskStore.getState().toggleTask(task.id);
    expect(useTaskStore.getState().tasks[0].completed).toBe(true);

    await useTaskStore.getState().toggleTask(task.id);
    expect(useTaskStore.getState().tasks[0].completed).toBe(false);
  });

  it('updateTask actualiza solo los campos indicados (ej: foto y ubicación)', async () => {
    await useTaskStore.getState().loadTasks('sabrina');
    const task = await useTaskStore.getState().addTask({ title: 'Ir al médico' });

    await useTaskStore.getState().updateTask(task.id, {
      imageUri: 'file://foto.jpg',
      location: { latitude: 1, longitude: 2, address: 'Calle Falsa 123' },
    });

    const updated = useTaskStore.getState().tasks[0];
    expect(updated.title).toBe('Ir al médico');
    expect(updated.imageUri).toBe('file://foto.jpg');
    expect(updated.location.address).toBe('Calle Falsa 123');
  });

  it('deleteTask elimina la tarea correspondiente de la lista', async () => {
    await useTaskStore.getState().loadTasks('sabrina');
    const t1 = await useTaskStore.getState().addTask({ title: 'Tarea 1' });
    await useTaskStore.getState().addTask({ title: 'Tarea 2' });

    await useTaskStore.getState().deleteTask(t1.id);

    const state = useTaskStore.getState();
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks.find((t) => t.id === t1.id)).toBeUndefined();
  });
});
