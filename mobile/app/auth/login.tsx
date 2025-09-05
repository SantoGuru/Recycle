import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { TextInput } from 'react-native-paper';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);


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
    setLoading(false);
  };




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#ccc"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={!mostrarSenha}
        right={
          <TextInput.Icon
            icon={mostrarSenha ? "eye-off" : "eye"}
            onPress={() => setMostrarSenha(!mostrarSenha)}
          />
        }
      />


      <Button
        title={loading ? 'Entrando...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />

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
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#fff',
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
