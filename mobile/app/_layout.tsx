import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  SplashScreen,
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { View } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { PaperProvider, MD3DarkTheme, MD3LightTheme, useTheme } from "react-native-paper";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

function RootLayout() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  const paperTheme = useTheme();

  useEffect(() => {
    if (!navigationState?.key || isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (session && inAuthGroup) {
      router.replace({ pathname: "/(tabs)/(home)" });
    } else if (!session && !inAuthGroup) {
      router.replace({ pathname: "/inicio" });
    }
  }, [session, isLoading, segments, navigationState?.key, router]);

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  if (!loaded || isLoading || !navigationState?.key) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, backgroundColor: paperTheme.colors.background }}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </View>
    </PaperProvider>
  );
}

export default function AppLayout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
