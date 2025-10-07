import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cadastroFuncionario" options={{ title: "Cadastro" }} />
      <Stack.Screen name="funcionarios" options={{ title: "Funcionários" }}/>
    </Stack>
  );
}