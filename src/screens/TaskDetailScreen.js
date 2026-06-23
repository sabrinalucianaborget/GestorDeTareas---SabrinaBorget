import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTaskStore } from '../store/taskStore';
import { formatLocationLabel } from '../utils/taskHelpers';

export default function TaskDetailScreen({ navigation, route }) {
  const { taskId } = route.params;
  const task = useTaskStore((state) => state.tasks.find((t) => t.id === taskId));

  if (!task) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.notFound}>Esta tarea ya no existe.</Text>
      </SafeAreaView>
    );
  }

  const locationLabel = formatLocationLabel(task.location);

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
          <Text style={styles.back}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.status}>
          {task.completed ? '✓ Completada' : '○ Pendiente'}
        </Text>

        {task.imageUri ? (
          <Image source={{ uri: task.imageUri }} style={styles.image} />
        ) : null}

        {task.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Descripción</Text>
            <Text style={styles.sectionValue}>{task.description}</Text>
          </View>
        ) : null}

        {locationLabel ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📍 Ubicación</Text>
            <Text style={styles.sectionValue}>{locationLabel}</Text>
            {task.location?.address && task.location?.latitude ? (
              <Text style={styles.sectionHint}>
                Coordenadas: {task.location.latitude.toFixed(5)}, {task.location.longitude.toFixed(5)}
              </Text>
            ) : null}
          </View>
        ) : null}

        {task.contact ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>👤 Contacto relacionado</Text>
            <Text style={styles.sectionValue}>{task.contact.name}</Text>
            {task.contact.phone ? (
              <Text style={styles.sectionHint}>{task.contact.phone}</Text>
            ) : null}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>📅 Calendario</Text>
          <Text style={styles.sectionValue}>
            {task.calendarEventId
              ? 'Se creó un recordatorio en el calendario del dispositivo.'
              : 'No se agregó un recordatorio al calendario.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f4ff',
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  status: {
    fontSize: 14,
    color: '#888',
    marginBottom: 18,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 20,
    backgroundColor: '#eef1ff',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e4f0',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3a5bd9',
    marginBottom: 6,
  },
  sectionValue: {
    fontSize: 15,
    color: '#333',
  },
  sectionHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  notFound: {
    fontSize: 15,
    color: '#888',
    paddingHorizontal: 24,
  },
});
