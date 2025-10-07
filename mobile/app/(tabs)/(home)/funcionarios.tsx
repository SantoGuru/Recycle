import IconCard from "@/components/ui/IconCard";
import { router } from "expo-router";
import { useState, useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { DataTable, useTheme } from "react-native-paper";

export default function Funcionarios() {
  const theme = useTheme();
  const [page, setPage] = useState<number>(0);
  const numberOfItemsPerPageList = useMemo(() => [1, 2, 5, 10], []);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const handleItemsPerPageChange = (value: number) => {
    setTimeout(() => onItemsPerPageChange(value), 150);
  };

  const [items] = useState([
    {
      key: 1,
      nome: "Daniel Mascarenhas",
      entradas: 3,
      saidas: 1,
    },
    {
      key: 2,
      nome: "Breno",
      entradas: 3,
      saidas: 1,
    },
    {
      key: 3,
      nome: "Walther",
      entradas: 3,
      saidas: 1,
    },
  ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
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

  return (
    <View style={styles.body}>
      <View style={styles.grid}>
        <IconCard
          iconName="person-add"
          title="Cadastrar Funcionário"
          onPress={() => router.push("/(tabs)/(home)/cadastroFuncionario")}
        />
      </View>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title>Nome</DataTable.Title>
          <DataTable.Title numeric>Entradas</DataTable.Title>
          <DataTable.Title numeric>Saídas</DataTable.Title>
        </DataTable.Header>
        {items.slice(from, to).map((item) => (
          <DataTable.Row key={item.key}>
            <DataTable.Cell>{item.nome}</DataTable.Cell>
            <DataTable.Cell numeric>{item.entradas}</DataTable.Cell>
            <DataTable.Cell numeric>{item.saidas}</DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          key={itemsPerPage}
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} de ${items.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={"Linhas por página"}
        />
      </DataTable>
    </View>
  );
}
