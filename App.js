import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';

// IMPORTANTE: en esta versión de expo-notifications, `shouldShowAlert` está
// deprecado y reemplazado por `shouldShowBanner` + `shouldShowList`. Si no se
// definen estos dos campos, la notificación se programa pero nunca se
// muestra en pantalla (este era el motivo por el que las notificaciones
// "nunca llegaban").
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();

    // En Android es necesario registrar un canal de notificación; sin esto,
    // algunas versiones de Android pueden no mostrar la notificación o
    // mostrarla sin sonido/prioridad adecuada.
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Recordatorios de tareas',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}