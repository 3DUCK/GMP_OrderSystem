import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useSelector } from 'react-redux'; // Redux의 useSelector 가져오기

const DessertDetailScreen = ({ route, navigation, addToCart }) => {
  const { item } = route.params;
  const [temperature, setTemperature] = useState('HOT');
  const [size, setSize] = useState('톨');
  const [extraShot, setExtraShot] = useState(false);
  const [syrup, setSyrup] = useState(false);
  const [quantity, setQuantity] = useState(1); // 수량 상태 추가

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // 로그인 상태 가져오기

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      Alert.alert(
        '로그인 필요',
        '로그인을 먼저 해주세요.',
        [
          { text: '확인', onPress: () => navigation.navigate('Login') } // 로그인 화면으로 이동
        ]
      );
      return;
    }

    // Firestore에서 가져온 price가 문자열이라서 숫자로 변환
    const unitPrice = parseInt(item.price, 10) || 0;

    addToCart({
      id: item.id,
      name: item.name,
      image: item.image_url,
      temperature,
      size,
      extraShot,
      syrup,
      quantity, // 수량 추가
      unitPrice, // 가격 추가
    });
    alert('장바구니에 담았습니다!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.detailContainer}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Image source={{ uri: item.image_url }} style={styles.menuImage} />
        <Text style={styles.detailText}>{item.name}</Text>
        <Text style={styles.detailDescription}>{item.description}</Text>

        {/* 수량 선택 */}
        <Text>수량:</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => setQuantity(Math.max(1, quantity - 1))} // 수량 감소
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => setQuantity(quantity + 1)} // 수량 증가
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.orderButton} onPress={handleAddToCart}>
        <Text style={styles.orderButtonText}>장바구니에 담기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    padding: 20,
    width: '90%', // 가로폭 90%로 설정
    alignSelf: 'center', // 중앙 정렬
  },
  menuImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  detailText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center', // 텍스트 센터 정렬
  },
  detailDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20, // 설명과 수량 선택 사이의 간격 추가
  },
  quantityContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between', // 버튼 간의 공간을 균등하게
    width: '40%', // 가로폭을 100% 사용
    marginVertical: 10,
  },
  quantityButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  quantityText: {
    fontSize: 20,
  },
  orderButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DessertDetailScreen;
