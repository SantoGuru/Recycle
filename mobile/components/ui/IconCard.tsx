import { Avatar, Card, Text, useTheme } from "react-native-paper";
import { TouchableOpacity, StyleSheet, View, Dimensions } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const { width, height } = Dimensions.get("window");

export default function IconCard({
  iconName,
  title,
  description,
  onPress,
}: {
  iconName: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.cardHeader}>
          <Avatar.Icon
            size={48}
            style={{ backgroundColor: "transparent" }}
            icon={() => (
              <MaterialIcons
                name={iconName}
                size={24}
                color={theme.colors.primary}
              />
            )}
          />
          <TouchableOpacity onPress={onPress}>
            <Avatar.Icon
              size={40}
              icon={({ size, color }) => (
                <MaterialIcons name="north-east" size={24} color={color} />
              )}
            />
          </TouchableOpacity>
        </View>

        <View>
          <Text variant="titleMedium" style={styles.text}>
            {title}
          </Text>
          <Text variant="bodySmall" style={styles.text}>
            {description}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  touchable: {
    margin: 8,
  },
  card: {
    width: width * 0.4,
    height: height * 0.2,
    borderRadius: 16,
    justifyContent: "flex-start",
    alignItems: "baseline",
    elevation: 4,
  },
  cardHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "2%",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    gap: 8,
  },
  text: {
    textAlign: "left",
  },
});
