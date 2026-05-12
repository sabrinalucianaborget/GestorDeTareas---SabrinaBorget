import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TaskItem({ task, onDelete, onToggle }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.info} onPress={() => onToggle(task.id)}>
        <Text style={[styles.title, task.completed && styles.completedText]}>
          {task.completed ? '✓ ' : '○ '}
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteBtn}>
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