import { StyleSheet, View } from "react-native";

import IconCard from "@/components/ui/IconCard";

import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";


export default function HomeScreen() {
  const { session } = useAuth();
  const role = session?.role;

  let isAdmin;
  if (role === "GERENTE") {
    isAdmin = true;
  }
  else {
    isAdmin = false;
  }

  return (
    <View style={styles.body}>
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
            /> </>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
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
