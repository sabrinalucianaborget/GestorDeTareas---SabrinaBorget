import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';

/**
 * Utilidades de permisos.
 *
 * Cada función solicita el permiso correspondiente (si todavía no fue
 * concedido) y devuelve un booleano indicando si se puede continuar.
 * Si el permiso es denegado, se muestra un Alert claro al usuario,
 * tal como pide la consigna ("Mostrar un mensaje claro al usuario si el
 * permiso es rechazado").
 *
 * Los tres estados posibles que maneja Expo (granted / denied / undetermined)
 * se resumen en true/false, pero quien llama a estas funciones puede volver
 * a pedir el permiso más tarde si el usuario cambia de opinión, ya que no
 * se guarda ningún estado "definitivo" de rechazo.
 */

function alertaPermisoDenegado(recurso) {
  Alert.alert(
    'Permiso denegado',
    `No otorgaste permiso para acceder a ${recurso}. Podés habilitarlo desde los ajustes del dispositivo si querés usar esta función.`
  );
}

export async function requestCameraPermission() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    alertaPermisoDenegado('la cámara');
    return false;
  }
  return true;
}

export async function requestGalleryPermission() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alertaPermisoDenegado('la galería de fotos');
    return false;
  }
  return true;
}

export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alertaPermisoDenegado('la ubicación');
    return false;
  }
  return true;
}

export async function requestContactsPermission() {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    alertaPermisoDenegado('los contactos');
    return false;
  }
  return true;
}

export async function requestCalendarPermission() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    alertaPermisoDenegado('el calendario');
    return false;
  }
  return true;
}
