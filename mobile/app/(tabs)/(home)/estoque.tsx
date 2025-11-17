import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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
  DataTable,
  MD3Theme,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { convertToReal } from "@/utils/currencyr-formatter";
import ModalTooltip from "@/components/ModalTooltip";
import { formatDatetimeExtensive } from "@/utils/date-formatter";
import { useFocusEffect } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

export interface Material {
  id: number;
  nome: string;
  descricao: string;
  unidade: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface ItemMaterial {
  materialId: number;
  material: Material;
  quantidade: number;
  precoMedio: number;
  valorTotal: number;
}

export default function Estoque() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<{
    nome: string;
    quantidade: string;
    descricao: string;
    dataCriacao: string;
    dataAtualizacao: string;
    unidade: string;
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
  const [items, setItems] = useState<ItemMaterial[]>([]);
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
      const fetchMaterials = async () => {
        try {
          const response = await fetch(`${API_URL}/api/estoques`, {
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
      fetchMaterials();
      setPage(0);
    }, [token])
  );

  const handleFilter = (query: string) => {
    setSearchQuery(query);
  };

  const filteredItems = items.filter((item) => {
    let itemString = Object.values(item).join(" ").toLowerCase();
    itemString += `${Object.values(item.material).join(" ").toLowerCase()}`;

    return itemString.includes(searchQuery.toLowerCase());
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
        <Searchbar
          placeholder="Buscar por..."
          onChangeText={handleFilter}
          value={searchQuery}
          style={{ marginHorizontal: 8 }}
        />
      </View>

      <DataTable style={style.table}>
        <DataTable.Header>
          <DataTable.Title>Nome</DataTable.Title>
          <DataTable.Title>Quantidade</DataTable.Title>
          <DataTable.Title>Preço Médio</DataTable.Title>
          <DataTable.Title>Valor Total</DataTable.Title>
        </DataTable.Header>
        {filteredItems.length > 0 &&
          filteredItems.slice(from, to).map((item) => (
            <Pressable
              key={item.materialId}
              onPress={() => {
                setTooltipContent({
                  nome: item.material.nome,
                  dataAtualizacao: item.material.dataAtualizacao,
                  dataCriacao: item.material.dataCriacao,
                  quantidade: item.quantidade.toString(),
                  descricao: item.material.descricao,
                  unidade: item.material.unidade,
                  valorTotal: item.valorTotal.toString(),
                });
                setTooltipVisible(true);
              }}
              android_ripple={{ color: "#e0e0e0" }}
            >
              <DataTable.Row>
                <DataTable.Cell>
                  {item.material.nome} ({item.material.unidade})
                </DataTable.Cell>
                <DataTable.Cell>{item.quantidade}</DataTable.Cell>
                <DataTable.Cell>
                  {convertToReal(item.precoMedio)}
                </DataTable.Cell>
                <DataTable.Cell>
                  {convertToReal(item.valorTotal)}
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
              <Text style={{ fontWeight: "bold" }}>Nome</Text>:{" "}
              {tooltipContent.nome}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Descrição</Text>:{" "}
              {tooltipContent.descricao}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Quantidade</Text>:{" "}
              {tooltipContent.quantidade}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Unidade</Text>:{" "}
              {tooltipContent.unidade}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Total em Estoque</Text>:{" "}
              {convertToReal(tooltipContent.valorTotal)}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Criação</Text>:{" "}
              {formatDatetimeExtensive(tooltipContent.dataCriacao)}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Última alteração</Text>:{" "}
              {formatDatetimeExtensive(tooltipContent.dataAtualizacao)}
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
      flex: 1,
      padding: 8,
      gap: height * 0.06,
      justifyContent: "flex-start",
      alignItems: "center",
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
