import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'; // Ajuste de importação

export default function ProductScreen({ route, navigation }) {
    const { productId } = route.params || {}; 
    const [product, setProduct] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (productId) {
            axios.get(`http://192.168.11.100:4000/products/${productId}`)
                .then(response => {
                    setProduct(response.data);
                    setName(response.data.name);
                    setPrice(String(response.data.price));
                    setDescription(response.data.description);
                    setStock(String(response.data.stock));
                })
                .catch(error => console.error('Error fetching product:', error))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [productId]);

    const handleAddProduct = async () => {
        const token = await AsyncStorage.getItem('userToken');
        console.log("User Token:", token);
    
        if (!token) {
            Alert.alert('Erro', 'Usuário não autenticado');
            return;
        }
    
        try {
            // Decodifica o token JWT
            const decodedToken = jwtDecode(token); 
            console.log("Decoded Token:", decodedToken);
    
            // Usa 'userId' ou 'sub' como identificador de usuário
            const userId = decodedToken.userId || decodedToken.sub; 
    
            if (!userId) {
                Alert.alert('Erro', 'ID de usuário não encontrado no token');
                return;
            }
    
            // Valida e converte o preço
            const numericPrice = parseFloat(price.replace(',', '.'));
            if (isNaN(numericPrice) || numericPrice <= 0) {
                Alert.alert('Erro', 'Preço inválido');
                return;
            }
    
            // Cria o objeto do novo produto
            const newProduct = { 
                name, 
                price: numericPrice, 
                description,
                stock: stock ? parseInt(stock) : 0, 
                userId, 
            };
    
            // Envia o novo produto para a API
            const response = await axios.post('http://192.168.11.100:4000/products', newProduct, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Verifica o status de sucesso
            if (response.status === 201) {
                Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'ProductList' }],
                });
            }
        } catch (error) {
            console.error('Erro ao cadastrar o produto:', error.response ? error.response.data : error.message);
            Alert.alert('Erro', 'Falha ao cadastrar produto');
        }
    };
    const isFormValid = name && price && description && !isNaN(parseFloat(price)) && parseInt(stock) >= 0;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{productId ? 'Detalhes do Produto' : 'Cadastrar Produto'}</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome do Produto"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Preço"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Estoque"
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.textArea}
                placeholder="Descrição"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <TouchableOpacity 
                style={[styles.button, !isFormValid && styles.buttonDisabled]}
                onPress={handleAddProduct}
                disabled={!isFormValid} 
            >
                <Text style={styles.buttonText}>{productId ? 'Atualizar Produto' : 'Cadastrar Produto'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.buttonText}>Voltar para Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 25,
    color: '#2d87f0',
    textAlign: 'center',
    marginTop: 20
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#2d87f0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: '#7aaee3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#ddd',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});
