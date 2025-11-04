import IconCard from "@/components/ui/IconCard";
import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  Avatar,
  DataTable,
  MD3Theme,
  Text,
  useTheme,
} from "react-native-paper";
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
  const { session } = useAuth();
  const token = session?.token;
  const empresaNome = session?.empresaNome;

  const theme = useTheme();
  const style = useMemo(() => styles(theme), [theme]);
  const [page, setPage] = useState<number>(0);
  const [items, setItems] = useState<ItemMaterial[]>([]);
  const numberOfItemsPerPageList = useMemo(() => [1, 2, 5, 10], []);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
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

  useEffect(() => {
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
        console.log("Resposta da API:", data);
      } catch (e) {
        return { error: "Não foi possível conectar ao servidor" };
      }
    };
    fetchMaterials();
    setPage(0);
  }, [itemsPerPage, token]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  return (
    <View style={style.body}>
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
            onPress={() => router.push("/(tabs)/(home)/cadastroEntrada")}
          />
        </View>
      </View>
      <DataTable style={style.table}>
        <DataTable.Header>
          <DataTable.Title>Nome</DataTable.Title>
          <DataTable.Title>Quantidade</DataTable.Title>
          <DataTable.Title>Preço Médio</DataTable.Title>
          <DataTable.Title>Valor Total</DataTable.Title>
        </DataTable.Header>
        {items.length > 0 &&
          items.slice(from, to).map((item) => (
            <DataTable.Row key={item.materialId}>
              <DataTable.Cell>{item.material.nome} ({item.material.unidade})</DataTable.Cell>
              <DataTable.Cell>{item.quantidade}</DataTable.Cell>
              <DataTable.Cell>{item.precoMedio}</DataTable.Cell>
              <DataTable.Cell>{item.valorTotal}</DataTable.Cell>
            </DataTable.Row>
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
    </View>
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
