import { Card, Text } from "react-native-paper";
import { TouchableOpacity, StyleSheet, } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function IconCard({
  iconName,
  title,
  onPress,
}: {
  iconName: string;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <MaterialIcons name={iconName as any} size={36} color="#6200ee" />
          <Text style={styles.title}>{title}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    margin: 8,
  },
  card: {
    width: 150,
    height: 120,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 14,
    textAlign: "center",
  },
});
