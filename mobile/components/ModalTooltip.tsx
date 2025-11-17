// ModalTooltip.tsx
import React, { useMemo } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { Button, MD3Theme, useTheme } from "react-native-paper";

type ModalTooltipPros = {
  visible?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

export default function ModalTooltip({
  visible = false,
  onClose,
  children,
}: ModalTooltipPros) {
  const theme = useTheme();
  const style = useMemo(() => styles(theme), [theme]);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={style.overlay}>
        <View style={style.content}>
          {typeof children === "string" ? (
            <Text style={style.text}>{children}</Text>
          ) : (
            children
          )}
          <Button mode="contained-tonal" style={{ marginTop: 12}} onPress={onClose}>Fechar</Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "hsla(0, 0%, 0%, 0.7)"
    },
    content: {
      backgroundColor: theme.colors.background,
      padding: 16,
      borderRadius: 8,
      maxWidth: "95%",
      alignItems: "center",
    },
    text: {
      fontSize: 16,
      marginBottom: 12,
    },
  });
