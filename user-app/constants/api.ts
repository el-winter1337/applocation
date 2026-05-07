import Constants from 'expo-constants';
import { Platform } from 'react-native';

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function getHostFromExpoUrl(url?: string) {
  if (!url) {
    return '';
  }

  const match = url.match(/^[a-zA-Z]+:\/\/([^/:]+)(?::\d+)?/);
  return match?.[1] || '';
}

export function getApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (configuredUrl) {
    console.log('✓ Using configured API URL:', configuredUrl);
    return stripTrailingSlash(configuredUrl);
  }

  const expoHost = getHostFromExpoUrl(Constants.expoConfig?.hostUri || Constants.linkingUri || undefined);
  if (expoHost && expoHost !== 'localhost' && expoHost !== '127.0.0.1') {
    const url = `http://${expoHost}:5000`;
    console.log('✓ Using Expo host IP:', url);
    return url;
  }

  if (Platform.OS === 'android') {
    console.log('✓ Using Android emulator IP: http://10.0.2.2:5000');
    return 'http://10.0.2.2:5000';
  }

  const defaultUrl = 'http://localhost:5000';
  console.log('✓ Using default localhost:', defaultUrl);
  return defaultUrl;
}
