import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'app_users';
const TASKS_PREFIX = 'tasks_';

export async function registerUser(username, password) {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  const users = raw ? JSON.parse(raw) : [];
  const exists = users.find((u) => u.username === username);
  if (exists) return false;
  users.push({ username, password });
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
}

export async function loginUser(username, password) {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  const users = raw ? JSON.parse(raw) : [];
  return users.find((u) => u.username === username && u.password === password) || null;
}

export async function getTasks(username) {
  const raw = await AsyncStorage.getItem(TASKS_PREFIX + username);
  return raw ? JSON.parse(raw) : [];
}

export async function saveTasks(username, tasks) {
  await AsyncStorage.setItem(TASKS_PREFIX + username, JSON.stringify(tasks));
}