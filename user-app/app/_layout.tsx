import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The Login Screen */}
      <Stack.Screen name="index" />
      {/* The Main App (Bottom Tabs) */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
