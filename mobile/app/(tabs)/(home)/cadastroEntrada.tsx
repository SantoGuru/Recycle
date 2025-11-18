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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import { apiFetch } from "@/utils/api";
import AppErrorMessage from "@/components/AppErrorMessage";

export default function CadastroEntrada() {
  const { session } = useAuth();
  const token = session?.token;
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<number>();
  const [quantidade, setQuantidade] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    if (session == null) {
      router.push("/");
    }
  }, [session]);

  useEffect(() => {
    if (!token) return;

    const fetchMaterials = async () => {
      try {
        const data = await apiFetch<Material[]>(`${API_URL}/api/materiais`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setMaterials(data);
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
    fetchMaterials();
  }, [token]);
  const handleQuantidadeChange = (text: string) => {
    const numeroLimpo = text.replace(/[^0-9]/g, "");
    setQuantidade(numeroLimpo);
  };

  const handleValorChange = (text: string) => {
    let textoFormatado = text.replace(".", ",");
    const regex = /^\d*(,\d{0,2})?$/;
    if (regex.test(textoFormatado)) {
      setValor(textoFormatado);
    }
  };

  const handleCreateEntrada = async () => {
    if (!selectedMaterial || !quantidade || !valor) {
      setMessage("Preencha todos os campos");
      setMessageType("error");
      setMessageVisible(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    const valorFormatoJS = valor.replace(",", ".");

    const precoNumerico = Number(valorFormatoJS);
    const quantidadeNumerica = Number(quantidade);

    try {
      await apiFetch(`${API_URL}/api/entradas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([
          {
            materialId: selectedMaterial,
            quantidade: quantidadeNumerica,
            preco: precoNumerico,
          },
        ]),
      });

      setMessage("Entrada Cadastrada com sucesso!");
      setMessageType("success");
      setMessageVisible(true);
    } catch (error) {
      let message = "Não foi possível conectar ao servidor";

      if (error instanceof Error) {
        message = error.message;
      }

      setMessage(message);
      setMessageType("error");
      setMessageVisible(true);
    } finally {
      setLoading(false);
    }
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor }]}
        >
          <Text style={[styles.title, { color: textColor }]}>
            Cadastro de Entrada
          </Text>

          <AppErrorMessage
            visible={messageVisible}
            message={message}
            type={messageType as "success" | "error"}
            onDismiss={() => setMessageVisible(false)}
          />

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
                  <Text style={styles.emptyText}>
                    Nenhum material encontrado
                  </Text>
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

          <TextInput
            mode="flat"
            label="Valor"
            style={[styles.input, { color: textColor }]}
            value={valor}
            onChangeText={handleValorChange}
            keyboardType="decimal-pad"
            returnKeyType="done"
            left={<TextInput.Affix text="R$ " />}
          />

          <Button
            mode="contained"
            style={{ backgroundColor: tintColor, marginTop: 10 }}
            labelStyle={{ color: backgroundColor }}
            onPress={handleCreateEntrada}
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar Entrada"}
          </Button>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
