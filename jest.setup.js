// Mock oficial de AsyncStorage para los tests (evita tocar almacenamiento real
// en el dispositivo/simulador y hace que las funciones de utils/storage.js
// sean síncronas/predecibles dentro de Jest).
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
