import { StyleSheet, View, Dimensions } from "react-native";

import IconCard from "@/components/ui/IconCard";

import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { Avatar, Surface, Text, useTheme } from "react-native-paper";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const theme = useTheme();
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
    <View style={styles.body}>
      <Surface style={styles.header} elevation={2}>
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
      </Surface>
      <View style={styles.grid}>
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

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: width * 0.08,
    width: "90%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "space-between",
    gap: 8,
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
