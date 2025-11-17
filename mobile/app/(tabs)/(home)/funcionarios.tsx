import IconCard from "@/components/ui/IconCard";
import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  Avatar,
  DataTable,
  MD3Theme,
  Text,
  useTheme,
} from "react-native-paper";
import ModalTooltip from "@/components/ModalTooltip";
import { useFocusEffect } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

interface Funcionario {
  id: number;
  nome: string;
  entradas: number;
  saidas: number;
  email: string;
  role: string;
}

interface FuncionarioComMovimentacoes {
  funcionario: Funcionario;
  entradas: any[];
  saidas: any[];
  totalEntradas: number;
  totalSaidas: number;
}

export default function Funcionarios() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<{
    nome: string;
    entradas: number;
    saidas: number;
    email: string;
    cargo: string;
  } | null>(null);

  const { session } = useAuth();
  const token = session?.token;
  const empresaNome = session?.empresaNome;
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const theme = useTheme();
  const style = useMemo(() => styles(theme), [theme]);
  const [page, setPage] = useState<number>(0);
  const [items, setItems] = useState<FuncionarioComMovimentacoes[]>([]);
  const numberOfItemsPerPageList = useMemo(() => [5, 10, 30], []);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[1]
  );
  const filteredItemsPerPageList = useMemo(
    () => numberOfItemsPerPageList.filter((n) => n !== itemsPerPage),
    [numberOfItemsPerPageList, itemsPerPage]
  );

  const handleItemsPerPageChange = (value: number) => {
    if (value !== itemsPerPage) {
      setTimeout(() => onItemsPerPageChange(value), 150);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchFuncionarios = async () => {
        try {
          const response = await fetch(`${API_URL}/api/usuarios/funcionarios`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setItems(data);
          }
        } catch (e) {
          return { error: "Não foi possível conectar ao servidor" };
        }
      };
      fetchFuncionarios();
      setPage(0);
    }, [token])
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  return (
    <ScrollView
      contentContainerStyle={[
        style.body,
        { paddingBottom: Math.max(tabBarHeight + 16, insets.bottom + 16) },
      ]}
    >
      <View style={{ width: "100%", gap: height * 0.03 }}>
        <View style={style.header}>
          <Avatar.Image
            size={48}
            source={require("@/assets/images/recycle-logo.png")}
            style={{
              backgroundColor: theme.colors.surface,
            }}
          />
          <View>
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {empresaNome}
            </Text>
          </View>
        </View>
        <View style={style.grid}>
          <IconCard
            iconName="person-add"
            title="Cadastrar Funcionário"
            description="Adicione um novo funcionário"
            onPress={() => router.push("/(tabs)/(home)/cadastroFuncionario")}
          />
        </View>
      </View>
      <DataTable style={style.table}>
        <DataTable.Header>
          <DataTable.Title>Nome</DataTable.Title>
          <DataTable.Title numeric>Entradas</DataTable.Title>
          <DataTable.Title numeric>Saídas</DataTable.Title>
        </DataTable.Header>
        {items.length > 0 &&
          items.slice(from, to).map((item) => (
            <Pressable
              key={item.funcionario.id}
              onPress={() => {
                setTooltipContent({
                  nome: item.funcionario.nome,
                  entradas: item.totalEntradas,
                  saidas: item.totalSaidas,
                  email: item.funcionario.email,
                  cargo: item.funcionario.role,
                });
                setTooltipVisible(true);
              }}
              style={{ flex: 1 }}
              android_ripple={{ color: "#e0e0e0" }}
            >
              <DataTable.Row pointerEvents="box-none">
                <DataTable.Cell>
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {item.funcionario.nome}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>{item.totalEntradas}</DataTable.Cell>
                <DataTable.Cell numeric>{item.totalSaidas}</DataTable.Cell>
              </DataTable.Row>
            </Pressable>
          ))}

        <DataTable.Pagination
          key={itemsPerPage}
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} de ${items.length}`}
          numberOfItemsPerPageList={filteredItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={"Linhas por página"}
        />
      </DataTable>

      <ModalTooltip
        visible={tooltipVisible}
        onClose={() => setTooltipVisible(false)}
      >
        {tooltipContent && (
          <View style={{ alignItems: "flex-start", gap: 8 }}>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Nome</Text>:{" "}
              {tooltipContent.nome}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>E-mail</Text>:{" "}
              {tooltipContent.email}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Acesso</Text>:{" "}
              {tooltipContent.cargo.toLowerCase()}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Entradas</Text>:{" "}
              {tooltipContent.entradas}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Saídas</Text>:{" "}
              {tooltipContent.saidas}
            </Text>
          </View>
        )}
      </ModalTooltip>
    </ScrollView>
  );
}

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    body: {
      padding: 8,
      gap: height * 0.06,
      justifyContent: "flex-start",
      backgroundColor: theme.colors.background,
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      gap: width * 0.08,
      width: "100%",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      borderBottomColor: theme.colors.outline,
      borderBottomWidth: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.surface,
    },
    grid: {
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignContent: "space-between",
    },
    table: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.roundness,
      elevation: 4,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
  });
