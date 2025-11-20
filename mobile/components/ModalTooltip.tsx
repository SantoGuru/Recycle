import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, MD3Theme, useTheme, Portal, Modal } from "react-native-paper";

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
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={style.content}
      >
        {typeof children === "string" ? (
          <Text style={style.text}>{children}</Text>
        ) : (
          children
        )}
        <Button
          mode="contained-tonal"
          style={{ marginTop: 12 }}
          onPress={onClose}
        >
          Fechar
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    content: {
      backgroundColor: theme.colors.background,
      padding: 16,
      borderRadius: 8,
      margin: 20,
      alignItems: "center",
    },
    text: {
      fontSize: 16,
      marginBottom: 12,
    },
  });
