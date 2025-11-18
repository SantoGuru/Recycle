import * as React from "react";
import { Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { View, StyleSheet, Text } from "react-native";

export type AppErrorMessageProps = {
  message: string;
  type?: "success" | "error" | "warning";
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
};

const getColor = (type?: "success" | "error" | "warning") => {
  switch (type) {
    case "success":
      return {
        bgColor: "hsla(140, 70%, 92%, 1)",
        borderColor: "hsla(140, 55%, 35%, 1)",
        textColor: "hsla(140, 55%, 35%, 1)",
      };
    case "error":
      return {
        bgColor: "hsla(0, 75%, 93%, 1)",
        borderColor: "hsla(0, 68%, 42%, 1)",
        textColor: "hsla(0, 68%, 42%, 1)",
      };
    case "warning":
      return {
        bgColor: "hsla(45, 95%, 92%, 1)",
        borderColor: "hsla(45, 80%, 40%, 1)",
        textColor: "hsla(45, 80%, 40%, 1)",
      };
    default:
      return {
        bgColor: "#333",
        textColor: "#fff",
        borderColor: "#222",
      };
  }
};

const getIcon = (type?: "success" | "error" | "warning") => {
  switch (type) {
    case "success":
      return "check-circle";
    case "error":
      return "error";
    case "warning":
      return "warning";
    default:
      return undefined;
  }
};

export default function AppErrorMessage({
  message,
  type,
  visible,
  onDismiss,
  duration = 3500,
  actionLabel,
  onAction,
}: AppErrorMessageProps) {
  const color = getColor(type);
  const icon = getIcon(type);

  React.useEffect(() => {
    if (visible && duration && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  if (!visible || !message) return null;

  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: color.bgColor,
          borderColor: color.borderColor,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.content}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={color.textColor}
            style={{ marginRight: 8 }}
          />
        )}

        <View style={styles.messageWrap}>
          <Text style={[styles.text, { color: color.textColor }]}>
            {message}
          </Text>
        </View>

        {actionLabel && onAction && (
          <Button
            mode="text"
            onPress={onAction}
            labelStyle={styles.actionLabel}
            compact
          >
            {actionLabel}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginVertical: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageWrap: {
    flex: 1,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  actionLabel: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 12,
    fontSize: 15,
  },
});
