import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import IconCard from "@/components/ui/IconCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Avatar, MD3Theme, Surface, Text, useTheme } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { useMemo, useState, useCallback } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { API_URL } from "@/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { convertToReal } from "@/utils/currencyr-formatter";
import { apiFetch } from "@/utils/api";
import AppErrorMessage from "@/components/AppErrorMessage";

const { width } = Dimensions.get("window");

interface Dashboard {
  materiaisComEstoqueBaixo: number;
  quantidadeTotalKg: number;
  totalMateriais: number;
  valorTotalEstoque: number;
}

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const positiveColor = theme.dark ? "#A5D6A7" : "rgb(56, 107, 1)";
  const tabBarHeight = useBottomTabBarHeight();
  const style = useMemo(() => styles(theme, insets), [theme, insets]);
  const { session } = useAuth();
  const role = session?.role;
  const token = session?.token;
  const nome = session?.nome.split(" ")[0];
  const empresaNome = session?.empresaNome;
  const [dashboard, setDashboard] = useState<Dashboard>({
    materiaisComEstoqueBaixo: 0,
    quantidadeTotalKg: 0,
    totalMateriais: 0,
    valorTotalEstoque: 0,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [messageVisible, setMessageVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchDashboard = async () => {
        try {
          const data = await apiFetch<Dashboard>(
            `${API_URL}/api/dashboard/resumo`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setDashboard(data);
        } catch (error) {
          let message = "Não foi possível conectar ao servidor";

          if (error instanceof Error) {
            message = error.message;
          }

          setMessage(message);
          setMessageType("error");
          setMessageVisible(true);
        }
      };

      fetchDashboard();
    }, [token])
  );

  let isAdmin;
  if (role === "GERENTE") {
    isAdmin = true;
  } else {
    isAdmin = false;
  }

  return (
    <>
      <View style={style.header}>
        <Avatar.Image
          size={48}
          source={require("@/assets/images/recycle-logo.png")}
          style={{
            backgroundColor: theme.colors.surface,
          }}
        />
        <View>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Bem-vindo, {nome}!
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Empresa: {empresaNome}
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 0,
          paddingBottom: insets.bottom + tabBarHeight + 16,
        }}
        style={[{ flex: 1, backgroundColor: theme.colors.background }]}
      >
        <View style={style.body}>
          <View style={style.resume}>
            <Surface elevation={1} style={style.card}>
              <View style={style.cardRow}>
                <View style={style.cardLeft}>
                  <Text variant="labelMedium">Materiais com Estoque</Text>
                  <Text variant="titleLarge" style={style.cardValue}>
                    {dashboard.totalMateriais}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/(home)/material")}
                  >
                    <Text
                      variant="bodySmall"
                      style={[style.cardLink, { color: theme.colors.primary }]}
                    >
                      Ver materiais
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={style.cardRight}>
                  <MaterialIcons
                    name="inventory"
                    size={36}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
            </Surface>

            <Surface elevation={1} style={style.card}>
              <View style={style.cardRow}>
                <View style={style.cardLeft}>
                  <Text variant="labelMedium">Valor do Estoque</Text>
                  <Text
                    variant="titleLarge"
                    style={[style.cardValue, { color: positiveColor }]}
                  >
                    {convertToReal(dashboard.valorTotalEstoque)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/(home)/estoque")}
                  >
                    <Text
                      variant="bodySmall"
                      style={[style.cardLink, { color: theme.colors.primary }]}
                    >
                      Ver estoque
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={style.cardRight}>
                  <MaterialIcons
                    name="attach-money"
                    size={36}
                    color={positiveColor}
                  />
                </View>
              </View>
            </Surface>

            <Surface elevation={1} style={style.card}>
              <View style={style.cardRow}>
                <View style={style.cardLeft}>
                  <Text variant="labelMedium">Itens em Baixa</Text>
                  <Text
                    variant="titleLarge"
                    style={[style.cardValue, { color: theme.colors.error }]}
                  >
                    {dashboard.materiaisComEstoqueBaixo}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/(home)/estoque",
                        params: { lowOnly: "true" },
                      })
                    }
                  >
                    <Text
                      variant="bodySmall"
                      style={[style.cardLink, { color: theme.colors.primary }]}
                    >
                      Ver detalhes
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={style.cardRight}>
                  <MaterialIcons
                    name="warning"
                    size={36}
                    color={theme.colors.error}
                  />
                </View>
              </View>
            </Surface>
          </View>

          <AppErrorMessage
            visible={messageVisible}
            message={message}
            type={messageType as "success" | "error"}
            onDismiss={() => setMessageVisible(false)}
          />

          <View style={style.grid}>
            <IconCard
              iconName="add"
              title="Movimentações"
              description="Gerencie movimentações"
              onPress={() => router.push("/(tabs)/(home)/movimentacoes")}
            />

            {/* <IconCard
          iconName="remove"
          title="Saída"
          description="Gerencie saídas"
          onPress={() => console.log("Início")}
        /> */}

            <IconCard
              iconName="inbox"
              title="Estoque"
              description="Gerencie saídas"
              onPress={() => router.push("/(tabs)/(home)/estoque")}
            />

            {isAdmin && (
              <>
                <IconCard
                  iconName="inventory"
                  title="Materiais"
                  description="Gerencie seus itens"
                  onPress={() => router.push("/(tabs)/(home)/material")}
                />
                <IconCard
                  iconName="person"
                  title="Funcionários"
                  description="gerencie pessoas"
                  onPress={() => router.push("/(tabs)/(home)/funcionarios")}
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = (theme: MD3Theme, insets: any) =>
  StyleSheet.create({
    body: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    header: {
      position: "relative",
      zIndex: 10,
      left: 0,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      gap: width * 0.08,
      width: "100%",
      paddingTop: insets.top,
      paddingHorizontal: 16,
      paddingBottom: 16,
      borderRadius: 12,
      alignItems: "center",
      borderBottomColor: theme.colors.outline,
      borderBottomWidth: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.surface,
    },
    resume: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: width * 0.03,
      paddingTop: 36,
    },
    card: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: width * 0.9,
      padding: 12,
      borderRadius: 12,
      alignItems: "flex-start",
      marginBottom: 12,
    },
    cardRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    cardLeft: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      paddingRight: 12,
    },
    cardRight: {
      width: 56,
      alignItems: "center",
      justifyContent: "center",
    },
    cardValue: {
      marginTop: 6,
      marginBottom: 2,
      fontWeight: "700",
    },
    cardLink: {
      marginTop: 6,
      textDecorationLine: "underline",
    },
    materialContent: {
      display: "flex",
      minHeight: 36,
      gap: 0,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignContent: "space-between",
      gap: 20,
      marginBottom: 24,
      marginTop: 16,
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
    message: {
      marginTop: 20,
      textAlign: "center",
      fontSize: 16,
    },
    success: {
      color: "green",
    },
    error: {
      color: "red",
    },
  });
