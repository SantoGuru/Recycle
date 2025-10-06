import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cadastroFuncionario" options={{ title: "Detalhes", headerShown: false }} />
    </Stack>
  );
}