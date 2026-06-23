import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTaskStore } from '../store/taskStore';
import { countPendingTasks } from '../utils/taskHelpers';
import TaskItem from '../components/TaskItem';

export default function HomeScreen({ navigation, route }) {
  const { username } = route.params;

  // Estado global (Zustand): la lista de tareas ya no vive en un useState
  // local, sino en el store compartido entre HomeScreen, AddTaskScreen y
  // TaskDetailScreen.
  const tasks = useTaskStore((state) => state.tasks);
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const reset = useTaskStore((state) => state.reset);

  useFocusEffect(
    useCallback(() => {
      loadTasks(username);
    }, [username])
  );

  function handleDelete(id) {
    Alert.alert('Eliminar tarea', '¿Estás seguro de que querés eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => deleteTask(id),
      },
    ]);
  }

  function handleToggle(id) {
    toggleTask(id);
  }

  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        onPress: () => {
          reset();
          navigation.replace('Login');
        },
      },
    ]);
  }

  function handleDetail(task) {
    navigation.navigate('TaskDetail', { taskId: task.id, username });
  }

  const pending = countPendingTasks(tasks);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {username} 👋</Text>
          <Text style={styles.count}>
            {pending > 0 ? `${pending} tarea${pending > 1 ? 's' : ''} pendiente${pending > 1 ? 's' : ''}` : 'Todo al día ✓'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Mis Tareas</Text>

      {tasks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyText}>No tenés tareas aún</Text>
          <Text style={styles.emptyHint}>Tocá el botón + para agregar una</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onPressDetail={handleDetail}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask', { username })}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  count: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#ffeaea',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  logoutText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 13,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3a5bd9',
    paddingHorizontal: 22,
    marginTop: 10,
    marginBottom: 18,
  },
  list: {
    paddingHorizontal: 22,
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 18,
    color: '#aaa',
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 34,
    right: 26,
    backgroundColor: '#3a5bd9',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3a5bd9',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 32,
  },
});
