import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { TextInput, Button } from 'react-native-paper';

import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';

import { API_URL } from "../../config";

export default function cadastroFuncionario() {
  const { session } = useAuth();
  const role = session?.role;

  if (role != "GERENTE") {
    router.push("/")
  }

  const [nome, setNome] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");


  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleLogin = async () => {
    if (!email || !senha || !nome || !confirmaSenha) {
      setMessage('Preencha todos os campos');
      setMessageType('error');
      return;
    }

    if (senha != confirmaSenha) {
      setMessage('Senha e confirmar senha devem ser iguais');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch(`${API_URL}/api/auth/cadastroFuncionario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (response.ok) {
        setMessage('Cadastro de funcionário realizado com sucesso!');
        setMessageType('success');
      } else {
        setMessage('Erro ao cadastrar funcionario');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Não foi possível conectar ao servidor');
      setMessageType('error')
      return { error: 'Não foi possível conectar ao servidor' };
    }

    setLoading(false);

  };


  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Cadastro de Funcionário</Text>

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
        style={[styles.input, { color: textColor }]}
        placeholder="Email"
        placeholderTextColor={textColor}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        mode="flat"
        style={[styles.input, { color: textColor }]}
        placeholder="Senha"
        placeholderTextColor={textColor}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={!mostrarSenha}
        right={
          <TextInput.Icon
            icon={mostrarSenha ? "eye-off" : "eye"}
            color={iconColor}
            onPress={() => setMostrarSenha(!mostrarSenha)}
          />
        }
      />

      <TextInput
        mode="flat"
        style={[styles.input, { color: textColor }]}
        placeholder="Confirmar Senha"
        placeholderTextColor={textColor}
        value={confirmaSenha}
        onChangeText={setConfirmaSenha}
        secureTextEntry={!mostrarSenha}
        right={
          <TextInput.Icon
            icon={mostrarSenha ? "eye-off" : "eye"}
            color={iconColor}
            onPress={() => setMostrarSenha(!mostrarSenha)}
          />
        }
      />




      <Button
        mode="contained"
        style={{ backgroundColor: tintColor }}
        labelStyle={{ color: backgroundColor }}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? "Cadastrando..." : "Cadastrar Funcionário"}
      </Button>


      {message ? (
        <Text
          style={[
            styles.message,
            messageType === 'success' ? styles.success : styles.error,
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
});
