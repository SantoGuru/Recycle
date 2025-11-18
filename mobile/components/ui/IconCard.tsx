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
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        <View style={styles.cardHeader}>
          <Avatar.Icon
            size={40}
            style={{ backgroundColor: "transparent" }}
            icon={() => (
              <MaterialIcons
                name={iconName}
                size={22}
                color={theme.colors.primary}
              />
            )}
          />
          <TouchableOpacity onPress={onPress} style={styles.actionButton}>
            <Avatar.Icon
              size={32}
              icon={({ size, color }) => (
                <MaterialIcons name="north-east" size={20} color={color} />
              )}
            />
          </TouchableOpacity>
        </View>

        <View>
          <Text variant="bodySmall" style={[styles.text, {fontWeight: "bold" }]}>
            {title}
          </Text>
          <Text variant="bodySmall" style={[styles.text, {color : theme.colors.onSurfaceVariant}]}>
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
    width: width * 0.42,
    height: Math.min(140, height * 0.16),
    borderRadius: 12,
    justifyContent: "flex-start",
    alignItems: "baseline",
    elevation: 3,
  },
  cardHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    gap: 6,
    paddingVertical: 8,
  },
  text: {
    textAlign: "left",
    fontSize: 13,
  },
  actionButton: {
    padding: 2,
    marginRight: -6,
  },
});
