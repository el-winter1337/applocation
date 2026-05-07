import * as SecureStore from 'expo-secure-store';

export const saveUserId = async (id) => {
  try {
    await SecureStore.setItemAsync('userId', id.toString());
  } catch (e) {
    console.error('Error saving userId', e);
  }
};

export const getUserId = async () => {
  try {
    const id = await SecureStore.getItemAsync('userId');
    return id || '1'; // Default to 1 if not found
  } catch (e) {
    return '1';
  }
};
