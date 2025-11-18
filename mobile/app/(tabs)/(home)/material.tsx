import IconCard from "@/components/ui/IconCard";
import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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
  DataTable,
  MD3Theme,
  Text,
  useTheme,
  Searchbar,
} from "react-native-paper";
import ModalTooltip from "@/components/ModalTooltip";
import { formatDatetimeExtensive } from "@/utils/date-formatter";
import { useFocusEffect } from "@react-navigation/native";
import { apiFetch } from "@/utils/api";
const { width, height } = Dimensions.get("window");

export interface Material {
  id: number;
  nome: string;
  descricao: string;
  unidade: string;
  dataAtualizacao: string;
  dataCriacao: string;
}

export default function Materials() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<{
    nome: string;
    descricao: string;
    unidade: string;
    dataAtualizacao: string;
    dataCriacao: string;
  } | null>(null);

  const { session } = useAuth();
  const token = session?.token;
  const empresaNome = session?.empresaNome;
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const style = useMemo(() => styles(theme), [theme]);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [items, setItems] = useState<Material[]>([]);
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

  const handleFilter = (query: string) => {
    setSearchQuery(query);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchMaterials = async () => {
        try {
          const data = await apiFetch<Material[]>(`${API_URL}/api/materiais`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          setItems(data);
          setMessage("");
          setMessageType("");
        } catch (error) {
          let message = "Erro ao carregar dados";

          if (error instanceof Error) {
            message = error.message;
          }

          setMessage(message);
          setMessageType("error");
        }
      };
      fetchMaterials();
      setPage(0);
    }, [token])
  );

  const filteredItems = items.filter((item) => {
    const itemString = Object.values(item).join(" ").toLowerCase();

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

        <View style={style.grid}>
          <IconCard
            iconName="add"
            title="Cadastrar material"
            description="Adicione um novo material"
            onPress={() => router.push("/(tabs)/(home)/cadastroMaterial")}
          />
        </View>
      </View>
      <Searchbar
        placeholder="Buscar por..."
        onChangeText={handleFilter}
        value={searchQuery}
        style={{ marginHorizontal: 8 }}
      />

      {message ? (
        <Text
          style={[
            style.message,
            messageType === "success" ? style.success : style.error,
          ]}
        >
          {message}
        </Text>
      ) : null}
      <DataTable style={style.table}>
        <DataTable.Header>
          <DataTable.Title>Nome</DataTable.Title>
          <DataTable.Title>descricao</DataTable.Title>
        </DataTable.Header>
        {filteredItems.length > 0 &&
          filteredItems.slice(from, to).map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setTooltipContent({
                  nome: item.nome,
                  unidade: item.unidade,
                  descricao: item.descricao,
                  dataAtualizacao: item.dataAtualizacao,
                  dataCriacao: item.dataCriacao,
                });
                setTooltipVisible(true);
              }}
              android_ripple={{ color: "#e0e0e0" }}
            >
              <DataTable.Row pointerEvents="box-none">
                <DataTable.Cell>
                  {item.nome} ({item.unidade})
                </DataTable.Cell>
                <DataTable.Cell>{item.descricao}</DataTable.Cell>
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
              <Text style={{ fontWeight: "bold" }}>Unidade</Text>:{" "}
              {tooltipContent.unidade}
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
