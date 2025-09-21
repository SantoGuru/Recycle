import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { ActivityIndicator, Card, Text } from "react-native-paper";

export default function LogoutScreen() {
  const { signOut } = useAuth();

    useEffect(() => {
    const timer = setTimeout(() => {
      signOut();
    }, 1000);

    return () => clearTimeout(timer);
  }, [signOut]);

  return (
    <View style={styles.centered}>
      <Card>
        <Card.Content style={styles.container}>
          <ActivityIndicator size="large" />
          <Text >Saindo...</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: 'flex',
    width: 150,
    alignItems: 'center',
    textAlign: 'center',
    gap: 24
  },

});
