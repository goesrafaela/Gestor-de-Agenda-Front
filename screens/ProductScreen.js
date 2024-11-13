import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

export default function ProductScreen({ route }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://192.168.11.100:4000/products/${productId}`) // Substitua pelo endpoint correto
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product:', error));
  }, [productId]);

  return (
    <View>
      {product ? (
        <>
          <Text>Produto: {product.name}</Text>
          <Text>Preço: {product.price}</Text>
          <Text>Descrição: {product.description}</Text>
        </>
      ) : (
        <Text>Carregando...</Text>
      )}
    </View>
  );
}
