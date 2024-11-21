import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Importando o AsyncStorage

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }
    
        try {
            const response = await axios.post('http://192.168.11.100:4000/login', { email, password });
            console.log('Resposta completa da API:', response.data);  // Log completo da resposta
    
            const { token } = response.data;  // Apenas extraímos o token agora
            console.log('Token:', token);
    
            if (!token) {
                throw new Error('Token ausente');
            }
    
            // Armazenar apenas o token no AsyncStorage
            await AsyncStorage.setItem('userToken', token);  // Armazenando o token
    
            // Como o userId não está mais sendo retornado, podemos seguir para a tela inicial
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error during login:', error);
            setError('Falha ao fazer login');
        }
    };

    const isButtonDisabled = !email || !password;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>

            {error && <Text style={styles.error}>{error}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity 
                style={[styles.button, isButtonDisabled && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={isButtonDisabled}
            >
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerText}>Ainda não tem uma conta? Registre-se</Text>
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
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#2d87f0',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 25,
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
    },
    button: {
        backgroundColor: '#2d87f0',
        paddingVertical: 15,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
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
    error: {
        color: '#e74c3c',
        fontSize: 14,
        marginBottom: 15,
    },
    registerText: {
        color: '#2d87f0',
        fontSize: 16,
        marginTop: 20,
    },
});
