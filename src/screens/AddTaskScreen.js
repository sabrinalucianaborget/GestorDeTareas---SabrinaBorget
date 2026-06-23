import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { useTaskStore } from '../store/taskStore';
import { validateTaskTitle, formatLocationLabel } from '../utils/taskHelpers';
import {
  takePhoto,
  pickImageFromGallery,
  getCurrentLocation,
  pickContact,
  createCalendarEvent,
} from '../utils/device';

export default function AddTaskScreen({ navigation, route }) {
  const { username } = route.params;
  const addTask = useTaskStore((state) => state.addTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [contact, setContact] = useState(null);
  const [calendarEventId, setCalendarEventId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function scheduleNotification(taskTitle) {
    // IMPORTANTE: en esta versión de expo-notifications, el trigger necesita
    // un campo `type` (o `channelId`); el formato viejo `{ seconds: 5 }` ya
    // no es válido y hace que scheduleNotificationAsync arroje un error
    // (por eso la notificación nunca se programaba ni llegaba).
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Tarea pendiente',
        body: `Recordatorio: "${taskTitle}"`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        channelId: 'default',
      },
    });
  }

  async function handleTakePhoto() {
    const uri = await takePhoto();
    if (uri) setImageUri(uri);
  }

  async function handlePickImage() {
    const uri = await pickImageFromGallery();
    if (uri) setImageUri(uri);
  }

  async function handleUseLocation() {
    const loc = await getCurrentLocation();
    if (loc) setLocation(loc);
  }

  async function handlePickContact() {
    const c = await pickContact();
    if (c) setContact(c);
  }

  async function handleAddToCalendar() {
    if (!title.trim()) {
      Alert.alert('Título requerido', 'Ingresá primero un título para poder crear el recordatorio.');
      return;
    }
    const eventId = await createCalendarEvent({
      title: title.trim(),
      notes: description.trim(),
    });
    if (eventId) {
      setCalendarEventId(eventId);
      Alert.alert('Listo ✓', 'Se agregó un recordatorio en tu calendario.');
    }
  }

  async function handleSave() {
    const { valid, error } = validateTaskTitle(title);
    if (!valid) {
      Alert.alert('Título requerido', error);
      return;
    }

    setSaving(true);
    const newTask = await addTask({
      title: title.trim(),
      description: description.trim(),
      imageUri,
      location,
      contact,
      calendarEventId,
    });

    // La tarea ya quedó guardada en este punto. Si la notificación falla por
    // cualquier motivo (permiso denegado, etc.), no queremos que eso le
    // impida al usuario ver la confirmación y volver a la lista.
    try {
      await scheduleNotification(newTask.title);
    } catch (err) {
      console.warn('No se pudo programar la notificación:', err);
    }

    setSaving(false);

    Alert.alert(
      'Tarea guardada ✓',
      'Recibirás un recordatorio en 5 segundos.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }

  const locationLabel = formatLocationLabel(location);

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

          <Text style={styles.label}>Foto adjunta (opcional)</Text>
          {imageUri ? (
            <View style={styles.imagePreviewRow}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity onPress={() => setImageUri(null)}>
                <Text style={styles.removeLink}>Quitar foto</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={styles.row}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleTakePhoto}>
              <Text style={styles.secondaryButtonText}>📷 Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handlePickImage}>
              <Text style={styles.secondaryButtonText}>🖼️ Galería</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Ubicación (opcional)</Text>
          {locationLabel ? (
            <Text style={styles.infoText}>📍 {locationLabel}</Text>
          ) : null}
          <TouchableOpacity style={styles.secondaryButtonFull} onPress={handleUseLocation}>
            <Text style={styles.secondaryButtonText}>📍 Usar mi ubicación actual</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Contacto relacionado (opcional)</Text>
          {contact ? (
            <Text style={styles.infoText}>
              👤 {contact.name}{contact.phone ? ` · ${contact.phone}` : ''}
            </Text>
          ) : null}
          <TouchableOpacity style={styles.secondaryButtonFull} onPress={handlePickContact}>
            <Text style={styles.secondaryButtonText}>👤 Elegir contacto</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Calendario (opcional)</Text>
          {calendarEventId ? (
            <Text style={styles.infoText}>📅 Recordatorio agregado al calendario</Text>
          ) : null}
          <TouchableOpacity style={styles.secondaryButtonFull} onPress={handleAddToCalendar}>
            <Text style={styles.secondaryButtonText}>📅 Crear recordatorio en el calendario</Text>
          </TouchableOpacity>

          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              🔔 Al guardar, recibirás una notificación de recordatorio en 5 segundos.
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
            <Text style={styles.buttonText}>{saving ? 'Guardando...' : 'Guardar Tarea'}</Text>
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
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#eef1ff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbe1fb',
  },
  secondaryButtonFull: {
    backgroundColor: '#eef1ff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbe1fb',
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: '#3a5bd9',
    fontWeight: '600',
    fontSize: 13.5,
  },
  imagePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  imagePreview: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#eef1ff',
  },
  removeLink: {
    color: '#e74c3c',
    fontSize: 13,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 13,
    color: '#3a5bd9',
    marginBottom: 10,
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
