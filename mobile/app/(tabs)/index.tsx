import {StyleSheet, View } from "react-native";


import IconCard from "@/components/ui/IconCard";

export default function HomeScreen() {
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
        <IconCard
          iconName="new-label"
          title="Novo Item"
          onPress={() => console.log("Início")}
        />
        <IconCard
          iconName="person-add"
          title="Cadastrar Funcionário"
          onPress={() => console.log("Início")}
        />
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
    width: "100%",
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
