// screens/ProductList.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function ProductList({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar os produtos cadastrados na API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.11.100:4000/products'); // Substitua pelo URL correto
        setProducts(response.data); // Armazena os produtos no estado
      } catch (error) {
        console.error('Erro ao buscar os produtos:', error);
      } finally {
        setLoading(false); // Fim do carregamento
      }
    };

    fetchProducts();
  }, []);

  // Função para renderizar cada item da lista de produtos
  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text style={styles.productPrice}>Preço: R${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Produtos</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2d87f0" />
      ) : (
        <>
          {/* Lista de produtos */}
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()} // Assumindo que cada produto tem um id único
            contentContainerStyle={styles.productList}
          />
          
          {/* Botão para voltar para a tela Home */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')} // Navega para a tela Home
          >
            <Text style={styles.buttonText}>Voltar para o Inicio</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30, // Aumentei o espaçamento inferior
    marginTop: 40,    // Adicionando um espaçamento superior para afastar do topo
    color: '#2d87f0',
    textAlign: 'center', // Garante que o texto esteja centralizado
  },
  productList: {
    width: '100%',
    marginBottom: 20,
  },
  productItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d87f0',
  },
  backButton: {
    backgroundColor: '#ddd',
    paddingVertical: 13,
    paddingHorizontal:15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
