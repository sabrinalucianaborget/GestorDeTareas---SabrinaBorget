import {
  validateTaskTitle,
  formatCoordinates,
  formatLocationLabel,
  countPendingTasks,
} from '../src/utils/taskHelpers';

describe('validateTaskTitle', () => {
  it('rechaza un título vacío', () => {
    const result = validateTaskTitle('');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/título/i);
  });

  it('rechaza un título que es solo espacios', () => {
    const result = validateTaskTitle('   ');
    expect(result.valid).toBe(false);
  });

  it('rechaza un título demasiado corto', () => {
    const result = validateTaskTitle('Hi');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/al menos 3 caracteres/i);
  });

  it('acepta un título válido', () => {
    const result = validateTaskTitle('Comprar pan');
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });
});

describe('formatCoordinates', () => {
  it('formatea latitud y longitud con 5 decimales separados por coma', () => {
    expect(formatCoordinates(-34.603722, -58.381592)).toBe('-34.60372, -58.38159');
  });

  it('devuelve string vacío si los valores no son numéricos', () => {
    expect(formatCoordinates(undefined, undefined)).toBe('');
  });
});

describe('formatLocationLabel', () => {
  it('devuelve null si no hay ubicación', () => {
    expect(formatLocationLabel(null)).toBeNull();
  });

  it('prioriza la dirección aproximada si está disponible', () => {
    const label = formatLocationLabel({
      latitude: -34.6,
      longitude: -58.4,
      address: 'Av. Corrientes 1000',
    });
    expect(label).toBe('Av. Corrientes 1000');
  });

  it('usa las coordenadas como respaldo si no hay dirección', () => {
    const label = formatLocationLabel({ latitude: -34.6, longitude: -58.4, address: null });
    expect(label).toBe('-34.60000, -58.40000');
  });
});

describe('countPendingTasks', () => {
  it('cuenta solo las tareas no completadas', () => {
    const tasks = [
      { id: '1', completed: false },
      { id: '2', completed: true },
      { id: '3', completed: false },
    ];
    expect(countPendingTasks(tasks)).toBe(2);
  });

  it('devuelve 0 si la lista está vacía o no es un array', () => {
    expect(countPendingTasks([])).toBe(0);
    expect(countPendingTasks(undefined)).toBe(0);
  });
});
