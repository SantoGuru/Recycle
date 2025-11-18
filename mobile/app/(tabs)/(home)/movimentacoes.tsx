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
import {
  Avatar,
  Button,
  DataTable,
  MD3Theme,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import {
  formatDatetime,
  formatDatetimeExtensive,
} from "../../../utils/date-formatter";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import ModalTooltip from "@/components/ModalTooltip";
import { convertToReal } from "@/utils/currencyr-formatter";
import { useFocusEffect } from "@react-navigation/native";
import { apiFetch } from "@/utils/api";
const { width, height } = Dimensions.get("window");

interface Movimentacao {
  id: number;
  tipo: "ENTRADA" | "SAIDA";
  materialNome: string;
  usuarioNome: string;
  quantidade: number;
  data: string;
  preco?: string;
  valorTotal?: string;
}

interface EntradaResponse {
  id: number;
  materialNome: string;
  usuarioNome: string;
  quantidade: number;
  data: string;
  preco: string;
  valorTotal: string;
}

interface SaidaResponse {
  id: number;
  materialNome: string;
  usuarioNome: string;
  quantidade: number;
  data: string;
}

async function fetchMovimentacoes(token: string): Promise<Movimentacao[]> {
  const [entradas, saidas] = await Promise.all([
    apiFetch<EntradaResponse[]>(`${API_URL}/api/entradas`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    apiFetch<SaidaResponse[]>(`${API_URL}/api/saidas`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  const entradasFormatadas: Movimentacao[] = entradas.map((e: any) => ({
    id: e.id,
    tipo: "ENTRADA",
    materialNome: e.materialNome,
    quantidade: e.quantidade,
    data: e.data,
    usuarioNome: e.usuarioNome,
    preco: e.preco,
    valorTotal: e.valorTotal,
  }));

  const saídasFormatadas: Movimentacao[] = saidas.map((s: any) => ({
    id: s.id,
    tipo: "SAIDA",
    materialNome: s.materialNome,
    quantidade: s.quantidade,
    data: s.data,
    usuarioNome: s.usuarioNome,
  }));

  return [...entradasFormatadas, ...saídasFormatadas].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );
}

export default function Movimentacoes() {
  const [showEntrada, setShowEntrada] = useState(false);
  const [showSaida, setShowSaida] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<{
    tipo: string;
    materialNome: string;
    quantidade: string;
    data: string;
    usuarioNome: string;
    preco?: string;
    valorTotal?: string;
  } | null>(null);

  const { session } = useAuth();
  const token = session?.token;
  const empresaNome = session?.empresaNome;
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const theme = useTheme();
  const style = useMemo(() => styles(theme), [theme]);
  const [page, setPage] = useState<number>(0);
  const [items, setItems] = useState<Movimentacao[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
      if (!token) return;

      const load = async () => {
        try {
          const movimentos = await fetchMovimentacoes(token);
          setItems(movimentos);
          setPage(0);
        } catch {
          console.log("Erro ao buscar movimentações");
        }
      };

      load();

      return () => {};
    }, [token])
  );

  const handleFilter = (query: string) => {
    setSearchQuery(query);
  };

  const filteredItems = items.filter((item) => {
    const itemString = Object.values(item).join(" ").toLowerCase();
    const matchesSearch = itemString.includes(searchQuery.toLowerCase());

    if (showEntrada && !showSaida && item.tipo !== "ENTRADA") return false;
    if (!showEntrada && showSaida && item.tipo !== "SAIDA") return false;

    return matchesSearch;
  });

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, filteredItems.length);

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
            iconName="add"
            title="Cadastrar Entrada"
            description="Adicione uma nova entrada"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(home)/cadastroEntrada",
                params: { refresh: "1" },
              })
            }
          />

          <IconCard
            iconName="remove"
            title="Cadastrar Saída"
            description="Adicione uma nova saída"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(home)/cadastroSaida",
                params: { refresh: "1" },
              })
            }
          />
        </View>
      </View>
      <View style={{ flexDirection: "column", gap: 12 }}>
        <Searchbar
          placeholder="Buscar por..."
          onChangeText={handleFilter}
          value={searchQuery}
          style={{ marginHorizontal: 8 }}
        />
        <View style={{ flexDirection: "row", gap: 16, alignItems: 'center' }}>
          <Text variant="bodyMedium" style={{ paddingLeft: 5 }}>
            Filtrar:
          </Text>

          <Button
            mode={showEntrada ? "contained" : "outlined"}
            onPress={() => setShowEntrada((v) => !v)}
          >
            Entrada
          </Button>
          <Button
            buttonColor={showSaida ? theme.colors.error : ""}
            textColor={showSaida ? "" : theme.colors.error}
            mode={showSaida ? "contained" : "outlined"}
            onPress={() => setShowSaida((v) => !v)}
          >
            Saída
          </Button>
        </View>
      </View>

      <DataTable style={style.table}>
        <DataTable.Header>
          <DataTable.Title>Tipo</DataTable.Title>
          <DataTable.Title>Material</DataTable.Title>
          <DataTable.Title numeric>Quantidade</DataTable.Title>
          <DataTable.Title numeric>Data</DataTable.Title>
        </DataTable.Header>
        {filteredItems.length > 0 &&
          filteredItems.slice(from, to).map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                const base = {
                  tipo: item.tipo,
                  materialNome: item.materialNome,
                  quantidade: item.quantidade.toString(),
                  data: item.data,
                  usuarioNome: item.usuarioNome,
                };
                const final =
                  item.tipo === "ENTRADA"
                    ? {
                        ...base,
                        preco: item.preco,
                        valorTotal: item.valorTotal,
                      }
                    : base;
                setTooltipContent(final);
                setTooltipVisible(true);
              }}
              style={{ flex: 1 }}
              android_ripple={{ color: "#e0e0e0" }}
            >
              <DataTable.Row>
                <DataTable.Cell>
                  <Text
                    style={{
                      color:
                        item.tipo === "ENTRADA"
                          ? theme.colors.primary
                          : theme.colors.error,
                      fontWeight: "bold",
                    }}
                  >
                    {item.tipo}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>{item.materialNome}</DataTable.Cell>
                <DataTable.Cell numeric>{item.quantidade}</DataTable.Cell>
                <DataTable.Cell numeric>
                  {formatDatetime(item.data)}
                </DataTable.Cell>
              </DataTable.Row>
            </Pressable>
          ))}

        <DataTable.Pagination
          key={itemsPerPage}
          page={page}
          numberOfPages={Math.ceil(filteredItems.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} de ${filteredItems.length}`}
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
              <Text style={{ fontWeight: "bold" }}>Tipo</Text>{" "}
              {tooltipContent.tipo}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Material</Text>:{" "}
              {tooltipContent.materialNome}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>quantidade</Text>:{" "}
              {tooltipContent.quantidade}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Responsável</Text>:{" "}
              {tooltipContent.usuarioNome}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Data</Text>:{" "}
              {formatDatetimeExtensive(tooltipContent.data)}
            </Text>
            {tooltipContent.preco && (
              <Text variant="bodyMedium">
                <Text style={{ fontWeight: "bold" }}>Preço</Text>:{" "}
                {convertToReal(tooltipContent.preco)}
              </Text>
            )}
            {tooltipContent.valorTotal && (
              <Text variant="bodyMedium">
                <Text style={{ fontWeight: "bold" }}>Valor Total</Text>:{" "}
                {convertToReal(tooltipContent.valorTotal)}
              </Text>
            )}
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
      gap: 8,
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
