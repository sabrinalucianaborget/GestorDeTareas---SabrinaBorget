import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import {
  requestCameraPermission,
  requestGalleryPermission,
  requestLocationPermission,
  requestContactsPermission,
  requestCalendarPermission,
} from './permissions';

/**
 * Funciones de acceso a recursos del dispositivo para el Parcial 2.
 * Cada función pide el permiso correspondiente antes de usar el recurso
 * y devuelve `null` si el usuario cancela o si el permiso fue rechazado,
 * para que la pantalla que llama pueda manejarlo sin romperse.
 */

// --- Cámara / Galería (expo-image-picker) ---

export async function takePhoto() {
  const granted = await requestCameraPermission();
  if (!granted) return null;

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.6,
  });

  if (result.canceled) return null;
  return result.assets?.[0]?.uri ?? null;
}

export async function pickImageFromGallery() {
  const granted = await requestGalleryPermission();
  if (!granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.6,
  });

  if (result.canceled) return null;
  return result.assets?.[0]?.uri ?? null;
}

// --- Ubicación (expo-location) ---

export async function getCurrentLocation() {
  const granted = await requestLocationPermission();
  if (!granted) return null;

  const position = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = position.coords;

  let address = null;
  try {
    const places = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (places && places.length > 0) {
      const p = places[0];
      address = [p.street, p.city, p.region].filter(Boolean).join(', ');
    }
  } catch (error) {
    // Si falla el geocoding inverso, no es crítico: nos quedamos solo
    // con las coordenadas, que de todas formas cumplen el requisito.
  }

  return { latitude, longitude, address };
}

// --- Contactos (expo-contacts) ---

export async function pickContact() {
  const granted = await requestContactsPermission();
  if (!granted) return null;

  const contact = await Contacts.presentContactPickerAsync();
  if (!contact) return null;

  return {
    name: contact.name ?? 'Sin nombre',
    phone: contact.phoneNumbers?.[0]?.number ?? null,
  };
}

// --- Calendario (expo-calendar) ---

async function getWritableCalendarId() {
  if (Platform.OS === 'ios') {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar?.id ?? null;
  }
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable = calendars.find((c) => c.allowsModifications);
  return writable ? writable.id : null;
}

/**
 * Crea un evento en el calendario del dispositivo vinculado a una tarea.
 * @param {{ title: string, notes?: string, date?: string | Date }} params
 * @returns {Promise<string|null>} el id del evento creado, o null si no se pudo crear.
 */
export async function createCalendarEvent({ title, notes, date }) {
  const granted = await requestCalendarPermission();
  if (!granted) return null;

  const calendarId = await getWritableCalendarId();
  if (!calendarId) {
    Alert.alert(
      'Calendario no disponible',
      'No se encontró un calendario disponible en el dispositivo para crear el evento.'
    );
    return null;
  }

  const startDate = date ? new Date(date) : new Date(Date.now() + 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

  const eventId = await Calendar.createEventAsync(calendarId, {
    title: `Tarea: ${title}`,
    notes,
    startDate,
    endDate,
  });

  return eventId;
}
