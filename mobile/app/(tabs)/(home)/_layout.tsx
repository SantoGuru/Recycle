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
      <Stack.Screen name="cadastroFuncionario" options={{ title: "Cadastro" }} />
      <Stack.Screen name="funcionarios" options={{ title: "Funcionários" }}/>
    </Stack>
  );
}