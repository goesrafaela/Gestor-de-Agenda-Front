// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('userToken');
      try {
        const response = await axios.get('http://192.168.11.100:4000/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Falha ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Função para logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Remove o token do usuário
      navigation.navigate('Login'); // Navega de volta para a tela de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d87f0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Produtos</Text>

      {/* Botões para Adicionar Produto e Visualizar Todos */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Product')}
        >
          <Text style={styles.buttonText}>Adicionar Produto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('ProductList')}
        >
          <Text style={styles.buttonTextSecondary}>Ver Produtos Cadastrados</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>R$ {item.price}</Text>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => navigation.navigate('Product', { productId: item.id })}
              >
                <Text style={styles.detailButtonText}>Ver detalhes</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      {/* Botão de logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d87f0',
    marginTop: 40,  // Adicionamos o marginTop para dar espaço do topo
    marginBottom: 20,  // Ajuste do espaçamento inferior para melhor equilíbrio
    textAlign: 'center', // Garante que o título ficará centralizado
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2d87f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonTextSecondary: {
    color: '#2d87f0',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  detailButton: {
    backgroundColor: '#2d87f0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#f44336', // Cor vermelha para o botão de logout
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
