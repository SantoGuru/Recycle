import { StyleSheet, View, Dimensions } from "react-native";

import IconCard from "@/components/ui/IconCard";

import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { Avatar, MD3Theme, Surface, Text, useTheme } from "react-native-paper";
import { useMemo } from "react";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const theme = useTheme();
  const style = useMemo(() => styles(theme), [theme]);
  const { session } = useAuth();
  const role = session?.role;
  const nome = session?.nome.split(" ")[0];
  const empresaNome = session?.empresaNome;

  let isAdmin;
  if (role === "GERENTE") {
    isAdmin = true;
  } else {
    isAdmin = false;
  }

  return (
    <View style={style.body}>
      <View style={style.header}>
        <Avatar.Image
          size={48}
          source={require("@/assets/images/recycle-logo.png")}
          style={{
            backgroundColor: theme.colors.surface,
          }}
        />
        <View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Bem-vindo, {nome}!
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Empresa: {empresaNome}
          </Text>
        </View>
      </View>
      <View style={style.resume}>
        <Surface elevation={1} style={style.card}>
          <View style={style.materialContent}>
            <Text variant="displayMedium">32</Text>
            <Text variant="bodySmall" style={{ color: "rgb(56, 107, 1)" }}>
              (R$ 20,40)
            </Text>
          </View>
          <Text variant="labelMedium">Total de Materiais</Text>
        </Surface>
        <Surface elevation={1} style={style.card}>
          <View style={style.materialContent}>
            <Text variant="displayMedium" style={{ color: theme.colors.error }}>
              2
            </Text>
            <Text variant="bodySmall"> </Text>
          </View>
          <Text variant="labelMedium">Itens em Baixa</Text>
        </Surface>
      </View>

      <View style={style.grid}>
        <IconCard
          iconName="add"
          title="Entrada"
          onPress={() => console.log("Início")}
        />
        <IconCard
          iconName="remove"
          title="Saída"
          onPress={() => console.log("Início")}
        />
        {isAdmin && (
          <>
            <IconCard
              iconName="new-label"
              title="Novo Item"
              onPress={() => console.log("Início")}
            />
            <IconCard
              iconName="person"
              title="Funcionários"
              onPress={() => router.push("/(tabs)/(home)/funcionarios")}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    body: {
      flex: 1,
      justifyContent: "space-evenly",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      gap: width * 0.08,
      width: "100%",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      borderBottomColor: theme.colors.outline,
      borderBottomWidth: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.surface,
    },
    resume: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignContent: "space-between",
      gap: width * 0.03,
    },
    card: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: width * 0.45,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    materialContent: {
      display: "flex",
      minHeight: 60,
      gap: 0,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignContent: "space-between",
      gap: 8,
      marginBottom: 20,
    },
    headerImage: {
      color: "#808080",
      bottom: -90,
      left: -35,
      position: "absolute",
    },
    titleContainer: {
      flexDirection: "row",
      gap: 8,
    },
    button: {
      alignItems: "center",
      width: 100,
      height: 100,
    },
  });
