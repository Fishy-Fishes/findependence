import { Platform } from 'react-native';

export function getApiBaseUrl(): string {
  const loopback = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${loopback}:3000`;
}
