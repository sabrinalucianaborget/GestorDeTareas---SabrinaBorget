import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { getTasks, saveTasks } from '../utils/storage';

export default function AddTaskScreen({ navigation, route }) {
  const { username } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function scheduleNotification(taskTitle) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Tarea pendiente',
        body: `Recordatorio: "${taskTitle}"`,
        sound: true,
      },
      trigger: { seconds: 5 },
    });
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Título requerido', 'Por favor ingresá un título para la tarea.');
      return;
    }
    const tasks = await getTasks(username);
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    await saveTasks(username, updated);
    await scheduleNotification(newTask.title);
    Alert.alert(
      'Tarea guardada ✓',
      'Recibirás un recordatorio en 5 segundos.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
            <Text style={styles.back}>← Volver</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Nueva Tarea</Text>

          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="¿Qué tenés que hacer?"
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Descripción (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Agregá notas o detalles..."
            placeholderTextColor="#aaa"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              🔔 Al guardar, recibirás una notificación de recordatorio en 5 segundos.
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar Tarea</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backRow: {
    marginBottom: 18,
  },
  back: {
    fontSize: 15,
    color: '#3a5bd9',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3a5bd9',
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 20,
    color: '#222',
    borderWidth: 1,
    borderColor: '#e0e4f0',
  },
  textarea: {
    height: 110,
  },
  noticeBox: {
    backgroundColor: '#eef1ff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#3a5bd9',
  },
  noticeText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#3a5bd9',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});