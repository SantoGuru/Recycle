import IconCard from "@/components/ui/IconCard";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function Funcionarios() {
  return (
    <View style={styles.body}>
      <IconCard
        iconName="person-add"
        title="Cadastrar Funcionário"
        onPress={() => router.push("/(tabs)/(home)/cadastroFuncionario")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
