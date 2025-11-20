import IconCard from "@/components/ui/IconCard";
import { API_URL } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { useState, useMemo, useCallback } from "react";
import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Avatar,
  DataTable,
  MD3Theme,
  Text,
  useTheme,
  Searchbar,
  Button,
  Menu,
} from "react-native-paper";
import ModalTooltip from "@/components/ModalTooltip";
import { formatDatetimeExtensive } from "@/utils/date-formatter";
import { useFocusEffect } from "@react-navigation/native";
import { apiFetch } from "@/utils/api";
import AppErrorMessage from "@/components/AppErrorMessage";
import { useThemeColor } from "@/hooks/useThemeColor";
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
  const role = session?.role;
  const token = session?.token;
  const empresaNome = session?.empresaNome;
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const style = useMemo(() => styles(theme), [theme]);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Material[]>([]);
  const numberOfItemsPerPageList = useMemo(() => [5, 10, 30], []);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[1]
  );
  const filteredItemsPerPageList = useMemo(
    () => numberOfItemsPerPageList.filter((n) => n !== itemsPerPage),
    [numberOfItemsPerPageList, itemsPerPage]
  );

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [messageVisible, setMessageVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");

  const [editUnidade, setEditUnidade] = useState("");
  const [menuUnidadeVisible, setMenuUnidadeVisible] = useState(false);
  const openUnidadeMenu = () => setMenuUnidadeVisible(true);
  const closeUnidadeMenu = () => setMenuUnidadeVisible(false);
  const options = ["kg", "g", "un", "l", "ml"];


  const handleEditMaterial = (material: Material) => {
    setEditMaterial(material);
    setEditNome(material.nome);
    setEditDescricao(material.descricao);
    setEditUnidade(material.unidade);
    setEditModalVisible(true);
  };

  const updateMaterial = async () => {
    if (!editMaterial) return;

    try {
      await apiFetch(`${API_URL}/api/materiais/${editMaterial.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: editNome,
          descricao: editDescricao,
          unidade: editUnidade,
        }),
      });


      setEditModalVisible(false);

      await fetchMaterials();
    } catch (error) {
      console.log("Erro ao atualizar:", error);
    }
  };




  const handleItemsPerPageChange = (value: number) => {
    if (value !== itemsPerPage) {
      setTimeout(() => onItemsPerPageChange(value), 150);
    }
  };

  const handleFilter = (query: string) => {
    setSearchQuery(query);
  };

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
      setMessageVisible(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
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

  let isAdmin;
  if (role === "GERENTE") {
    isAdmin = true;
  } else {
    isAdmin = false;
  }

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

        {isAdmin && (
          <View style={style.grid}>
            <IconCard
              iconName="add"
              title="Cadastrar material"
              description="Adicione um novo material"
              onPress={() => router.push("/(tabs)/(home)/cadastroMaterial")}
            />
          </View>
        )}
      </View>
      <Searchbar
        placeholder="Buscar por..."
        onChangeText={handleFilter}
        value={searchQuery}
        style={{ marginHorizontal: 8 }}
      />

      <AppErrorMessage
        visible={messageVisible}
        message={message}
        type={messageType as "success" | "error"}
        onDismiss={() => setMessageVisible(false)}
      />

      <DataTable style={style.table}>
        <DataTable.Header>
          <DataTable.Title>Nome</DataTable.Title>
          <DataTable.Title>Descricao</DataTable.Title>
          <DataTable.Title>Ações</DataTable.Title>
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
                <DataTable.Cell>
                  <TouchableOpacity onPress={() => handleEditMaterial(item)}>
                    <Text style={{ color: theme.colors.onSurfaceVariant }}>Editar</Text>
                  </TouchableOpacity>
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


      <ModalTooltip
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      >

        <View style={{
          backgroundColor: theme.colors.background,
          padding: 20,
          borderRadius: 12,
          width: "100%",
        }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
            Editar Material
          </Text>

          <TextInput
            value={editNome}
            onChangeText={setEditNome}
            placeholder="Nome"
            style={style.input}
          />

          <TextInput
            value={editDescricao}
            onChangeText={setEditDescricao}
            placeholder="Descrição"
            style={style.input}
          />

          <TouchableOpacity
            style={[style.input, { justifyContent: "center" }]}
            onPress={() => setMenuUnidadeVisible(true)}
          >
            <Text>
              {editUnidade || "Selecione a unidade"}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={menuUnidadeVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setMenuUnidadeVisible(false)}
          >
            <View style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)"
            }}>
              <View style={{
                backgroundColor: theme.colors.background,
                padding: 20,
                borderRadius: 12,
                width: "50%"
              }}>
                <Text style={{ fontSize: 18, marginBottom: 12 }}>Selecione a unidade</Text>

                {options.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => {
                      setEditUnidade(opt);
                      setMenuUnidadeVisible(false);
                    }}
                    style={{
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{opt}</Text>
                  </TouchableOpacity>
                ))}

                <Button
                  style={{ marginTop: 20 }}
                  onPress={() => setMenuUnidadeVisible(false)}
                >
                  Fechar
                </Button>
              </View>
            </View>
          </Modal>






          <View style={{ justifyContent: "space-between" }}>

            <Button
              onPress={updateMaterial}
              mode="contained-tonal"
            >
              <Text style={[style.text, { fontWeight: "bold" }]}>Salvar</Text>
            </Button>
          </View>
        </View>

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
    input: {
      borderWidth: 1,
      borderRadius: theme.roundness,
      shadowColor: theme.colors.shadow,
      padding: 10,
      marginBottom: 12,
      color: theme.colors.onSurface,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    text: {
      fontSize: 16,
      marginBottom: 12,
      color: theme.colors.onSurface,
    },
    select: {
      paddingHorizontal: 15,
      marginBottom: 20,
      borderRadius: 10,
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
