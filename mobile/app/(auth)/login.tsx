import { useState } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TextInput, Button } from 'react-native-paper';

import { useAuth } from '@/context/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");


  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleLogin = async () => {
    if (!email || !senha) {
      setMessage('Preencha email e senha');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    const result = await signIn(email, senha);

    if (result.success) {
      setMessage('Login realizado com sucesso!');
      setMessageType('success');
    } else {
      setMessage(`Erro: ${result.error}`);
      setMessageType('error');
    }
    
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
      <Text style={[styles.title, { color: textColor }]}>Login</Text>

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




      <Button
        mode="contained"
        style={{ backgroundColor: tintColor }}
        labelStyle={{ color: backgroundColor }}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? "Entrando..." : "Login"}
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
    </ScrollView>
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
