import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {
  TextInput,
  Button,
  Searchbar,
  List,
  IconButton,
  Divider,
} from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { Material } from "./material";

import { API_URL } from "../../../config";

export default function CadastroSaida() {
  const { session } = useAuth();
  const token = session?.token;
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<number>();
  const [quantidade, setQuantidade] = useState<string>("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (session == null) {
      router.push("/");
    }
  }, [session]);

  useEffect(() => {
    if (!token) return;

    const fetchMaterials = async () => {
      try {
        const response = await fetch(`${API_URL}/api/materiais`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setMaterials(data);
        }
      } catch (e) {
        console.error("Não foi possível conectar ao servidor", e);
      }
    };
    fetchMaterials();
  }, [token]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleQuantidadeChange = (text: string) => {
    const numeroLimpo = text.replace(/[^0-9]/g, "");
    setQuantidade(numeroLimpo);
  };


  const handleCreateSaida = async () => {
    if (!selectedMaterial || !quantidade) {
      setMessage("Preencha todos os campos");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    const quantidadeNumerica = Number(quantidade);

    try {
      const response = await fetch(`${API_URL}/api/saidas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([
          {
            materialId: selectedMaterial,
            quantidade: quantidadeNumerica,
          },
        ]),
      });

      if (response.ok) {
        setMessage("Saída Cadastrada com sucesso!");
        setMessageType("success");
      } else {
        setMessage("Erro ao cadastrar saída");
        setMessageType("error");
      }
    } catch (err) {
      console.log("Mensagem erro: ", err);
      setMessage("Não foi possível conectar ao servidor");
      setMessageType("error");
      return { error: "Não foi possível conectar ao servidor" };
    }

    setLoading(false);
  };

  const selectedMaterialName = useMemo(() => {
    return materials.find((m) => m.id === selectedMaterial)?.nome;
  }, [materials, selectedMaterial]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) =>
      m.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [materials, searchQuery]);

  const handleSelectMaterial = (materialId: number) => {
    setSelectedMaterial(materialId);
    setIsModalVisible(false);
    setSearchQuery("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>
          Cadastro de Saída
        </Text>

        <Button
          mode="outlined"
          onPress={() => setIsModalVisible(true)}
          icon="chevron-down"
          contentStyle={styles.selectButton}
          style={styles.select}
        >
          {selectedMaterialName || "Selecione o Material"}
        </Button>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <SafeAreaView style={[styles.modalContainer, { backgroundColor }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                Selecionar Material
              </Text>
              <IconButton
                icon="close"
                onPress={() => setIsModalVisible(false)}
              />
            </View>

            <Searchbar
              placeholder="Buscar material..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
            />

            <FlatList
              data={filteredMaterials}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item }) => (
                <List.Item
                  title={item.nome}
                  onPress={() => handleSelectMaterial(item.id)}
                  style={
                    selectedMaterial === item.id ? styles.selectedItem : null
                  }
                />
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhum material encontrado</Text>
              }
            />
          </SafeAreaView>
        </Modal>

        <TextInput
          mode="flat"
          label="Quantidade"
          style={[styles.input, { color: textColor }]}
          value={quantidade}
          onChangeText={handleQuantidadeChange}
          keyboardType="numeric"
          returnKeyType="done"
        />


        <Button
          mode="contained"
          style={{ backgroundColor: tintColor, marginTop: 10 }}
          labelStyle={{ color: backgroundColor }}
          onPress={handleCreateSaida}
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar Saída"}
        </Button>

        {message ? (
          <Text
            style={[
              styles.message,
              messageType === "success" ? styles.success : styles.error,
            ]}
          >
            {message}
          </Text>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "transparent",
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
  select: {
    marginBottom: 20,
  },
  selectButton: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    height: 50,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchbar: {
    margin: 10,
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});
