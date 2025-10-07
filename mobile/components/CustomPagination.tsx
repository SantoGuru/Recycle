import { Menu, Button, Text } from "react-native-paper";
import { useState } from "react";
import { View } from "react-native";

export function CustomPagination({
  itemsPerPage,
  onItemsPerPageChange,
  numberOfItemsPerPageList,
  label,
}: any) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 8,
      }}
    >
      <Text>{label}</Text>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button onPress={() => setMenuVisible(true)}>
            Linhas: {itemsPerPage}
          </Button>
        }
      >
        {numberOfItemsPerPageList.map((num: any) => (
          <Menu.Item
            key={num}
            onPress={() => {
              onItemsPerPageChange(num);
              setMenuVisible(false);
            }}
            title={`${num}`}
          />
        ))}
      </Menu>
    </View>
  );
}
