import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleRegister = async () => {
    if (password !== passwordConfirmation) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.11.100:4000/register', {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        Alert.alert('Erro', error.response.data.error || 'Erro ao registrar usuário.');
      } else {
        Alert.alert('Erro', 'Erro desconhecido ao registrar usuário.');
      }
    }
  };

  const isButtonDisabled = !name || !email || !password || !passwordConfirmation;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registrar</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isButtonDisabled}
      >
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.registerText}>Já possui uma conta? Faça o login.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2d87f0',
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  button: {
    backgroundColor: '#2d87f0',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#2d87f0',
    fontSize: 16,
    marginTop: 20,
  },
});
