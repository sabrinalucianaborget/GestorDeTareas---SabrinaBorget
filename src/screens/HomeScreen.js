import React, { useState, useCallback } from 'react';
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
import { getTasks, saveTasks } from '../utils/storage';
import TaskItem from '../components/TaskItem';

export default function HomeScreen({ navigation, route }) {
  const { username } = route.params;
  const [tasks, setTasks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  async function loadTasks() {
    const data = await getTasks(username);
    setTasks(data);
  }

  async function handleDelete(id) {
    Alert.alert('Eliminar tarea', '¿Estás seguro de que querés eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const updated = tasks.filter((t) => t.id !== id);
          setTasks(updated);
          await saveTasks(username, updated);
        },
      },
    ]);
  }

  async function handleToggle(id) {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    await saveTasks(username, updated);
  }

  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', onPress: () => navigation.replace('Login') },
    ]);
  }

  const pending = tasks.filter((t) => !t.completed).length;

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
            <TaskItem task={item} onDelete={handleDelete} onToggle={handleToggle} />
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