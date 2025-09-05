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
    <View>
      <Text>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
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

    </View>
  );
}

