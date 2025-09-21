// app/(auth)/_layout.js
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack initialRouteName="inicio">
      <Stack.Screen name="inicio" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}