import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import TaskItem from '../src/components/TaskItem';

const baseTask = {
  id: '1',
  title: 'Comprar pan',
  description: 'Antes de las 19hs',
  completed: false,
  imageUri: null,
  location: null,
  contact: null,
  calendarEventId: null,
};

describe('TaskItem', () => {
  it('renderiza el título y la descripción de la tarea', () => {
    render(<TaskItem task={baseTask} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText(/Comprar pan/)).toBeTruthy();
    expect(screen.getByText('Antes de las 19hs')).toBeTruthy();
  });

  it('muestra el título tachado (✓) cuando la tarea está completada', () => {
    render(<TaskItem task={{ ...baseTask, completed: true }} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText(/✓ Comprar pan/)).toBeTruthy();
  });

  it('llama a onToggle con el id correcto al tocar la tarea', () => {
    const onToggle = jest.fn();
    render(<TaskItem task={baseTask} onToggle={onToggle} onDelete={jest.fn()} />);

    fireEvent.press(screen.getByTestId('task-toggle-1'));

    expect(onToggle).toHaveBeenCalledWith('1');
  });

  it('llama a onDelete con el id correcto al tocar el botón de eliminar', () => {
    const onDelete = jest.fn();
    render(<TaskItem task={baseTask} onToggle={jest.fn()} onDelete={onDelete} />);

    fireEvent.press(screen.getByTestId('task-delete-1'));

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('muestra los badges de ubicación, contacto y calendario cuando la tarea los tiene asociados', () => {
    const fullTask = {
      ...baseTask,
      location: { latitude: -34.6, longitude: -58.4, address: 'Av. Siempre Viva 123' },
      contact: { name: 'Juan Pérez', phone: '11-1234-5678' },
      calendarEventId: 'evento-123',
    };
    render(<TaskItem task={fullTask} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText(/Av. Siempre Viva 123/)).toBeTruthy();
    expect(screen.getByText(/Juan Pérez/)).toBeTruthy();
    expect(screen.getByText(/En calendario/)).toBeTruthy();
  });
});
