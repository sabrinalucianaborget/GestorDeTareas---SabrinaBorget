import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { formatLocationLabel } from '../utils/taskHelpers';

export default function TaskItem({ task, onDelete, onToggle, onPressDetail }) {
  const locationLabel = formatLocationLabel(task.location);

  return (
    <View style={styles.container}>
      {task.imageUri ? (
        <Image source={{ uri: task.imageUri }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
          <Text style={styles.thumbnailPlaceholderText}>📋</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.info}
        onPress={() => onToggle(task.id)}
        testID={`task-toggle-${task.id}`}
      >
        <Text style={[styles.title, task.completed && styles.completedText]}>
          {task.completed ? '✓ ' : '○ '}
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}

        <View style={styles.badgesRow}>
          {locationLabel ? (
            <Text style={styles.badge}>📍 {locationLabel}</Text>
          ) : null}
          {task.contact ? (
            <Text style={styles.badge}>👤 {task.contact.name}</Text>
          ) : null}
          {task.calendarEventId ? (
            <Text style={styles.badge}>📅 En calendario</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {onPressDetail ? (
        <TouchableOpacity
          onPress={() => onPressDetail(task)}
          style={styles.detailBtn}
          testID={`task-detail-${task.id}`}
        >
          <Text style={styles.detailText}>ℹ️</Text>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        style={styles.deleteBtn}
        testID={`task-delete-${task.id}`}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  thumbnail: {
    width: 46,
    height: 46,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#eef1ff',
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailPlaceholderText: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  description: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    marginLeft: 18,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginLeft: 18,
    gap: 6,
  },
  badge: {
    fontSize: 11,
    color: '#3a5bd9',
    backgroundColor: '#eef1ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  detailBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  detailText: {
    fontSize: 16,
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});
