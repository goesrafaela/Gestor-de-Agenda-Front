import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import axios from 'axios';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('userToken');
      axios.get('http://192.168.11.100:4000/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
        .then(response => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
          setError('Falha ao carregar produtos');
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  return (
    <View>
      <Text>Produtos</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.price}</Text>
            <Button
              title="Ver detalhes"
              onPress={() => navigation.navigate('Product', { productId: item.id })}
            />
          </View>
        )}
      />
    </View>
  );
}
