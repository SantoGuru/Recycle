import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { signOut } = useAuth();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          height: 60 + insets.bottom,
          backgroundColor: theme.colors.surface,
          ...Platform.select({ 
            ios: {
              position: "absolute",
              borderTopColor: theme.colors.outlineVariant,
              borderTopWidth: 1,
            },
            default: {},
          }),
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sair"
        options={{
          title: "Sair",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="logout"
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
