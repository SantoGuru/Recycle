import { useEffect, useState } from "react";
import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

import { TextInput, Button, Menu } from "react-native-paper";

import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";

import { API_URL } from "../../../config";

export default function CadastroMaterial() {

  const { session } = useAuth();
  const role = session?.role;
  const token = session?.token;

  useEffect(() => {
    if (session == null) {
      router.push("/");
    }
  }, [session]);

  if (role != "GERENTE") {
    router.push("/");
  }


  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [unidade, setUnidade] = useState("");

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const options = ['kg', 'g', 'un', 'l', 'ml'];


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");

  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleCreateFuncionario = async () => {
    if (!nome || !descricao || !unidade) {
      setMessage("Preencha todos os campos");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");


    try {
      const response = await fetch(`${API_URL}/api/materiais`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({nome, descricao, unidade}),
      });

      if (response.ok) {
        setMessage("Material Cadastrado com sucesso!");
        setMessageType("success");
      } else {
        setMessage("Erro ao cadastrar material");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Não foi possível conectar ao servidor");
      setMessageType("error");
      return { error: "Não foi possível conectar ao servidor" };
    }


    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        Cadastro de Material
      </Text>

      <TextInput
        mode="flat"
        style={[styles.input, { color: textColor }]}
        placeholder="Nome"
        placeholderTextColor={textColor}
        value={nome}
        onChangeText={setNome}
        autoCapitalize="none"
      />

      <TextInput
        mode="flat"
        style={[styles.description, { color: textColor }]}
        placeholder="Descrição"
        placeholderTextColor={textColor}
        value={descricao}
        onChangeText={setDescricao}
        autoCapitalize="none"

        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />


      <View style={styles.select}>

        <Menu   
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button mode="outlined" onPress={openMenu}>
              {unidade ? `Unidade: ${unidade}` : 'Selecione a unidade'}
            </Button>
          }
        >
          {options.map((opt) => (
            <Menu.Item
              key={opt}
              onPress={() => {
                setUnidade(opt);
                closeMenu();
              }}
              title={opt}
            />
          ))}
        </Menu>

      </View>


      <Button
        mode="contained"
        style={{ backgroundColor: tintColor }}
        labelStyle={{ color: backgroundColor }}
        onPress={handleCreateFuncionario}
        disabled={loading}
      >
        {loading ? "Cadastrando..." : "Cadastrar Material"}
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
    height: 50,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
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
  description: {
    height: 120,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  select: {
    paddingHorizontal: 15,
    marginBottom: 20,
    borderRadius: 10,
  }
});
