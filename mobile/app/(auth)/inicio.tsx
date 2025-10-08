import { View, Text, StyleSheet, Image } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { router } from "expo-router";

export default function Inicio() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Image
        source={require("./../../assets/images/recycle-logo.png")}
        style={styles.image}
      />

      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        Recycle
      </Text>

      <Text style={{ color: theme.colors.onBackground }}>
        Ajudando com seu gerenciamento sempre!
      </Text>

      <Button
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        labelStyle={{ color: theme.colors.onPrimary }}
        onPress={() => router.push("/(auth)/login")}
      >
        Começar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 50,
    backgroundColor: "Black",
    padding: 4,
    borderRadius: 8,
  },
});
