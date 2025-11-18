import { Stack } from "expo-router";
import { useTheme } from 'react-native-paper';

export default function HomeStackLayout() {
  const theme = useTheme();

  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.surface,
      },
      headerTintColor: theme.colors.onSurface,
      headerBackButtonDisplayMode: 'minimal',
      headerBackTitleStyle: {fontSize: 4},

    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cadastroFuncionario" options={{ title: "Cadastro Funcionário" }} />
      <Stack.Screen name="funcionarios" options={{ title: "Funcionários" }}/>
      <Stack.Screen name="cadastroMaterial" options={{ title: "Cadastro Material" }} />
      <Stack.Screen name="material" options={{ title: "Material" }} />
      <Stack.Screen name="movimentacoes" options={{ title: "Movimentações" }} />
      <Stack.Screen name="cadastroEntrada" options={{ title: "Cadastro Entrada" }} />
      <Stack.Screen name="cadastroSaida" options={{ title: "Cadastro Saída" }} />
      <Stack.Screen name="estoque" options={{ title: "Estoque" }} />
    </Stack>
  );
}