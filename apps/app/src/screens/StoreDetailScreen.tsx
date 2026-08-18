import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { ArrowLeft, ShoppingBag } from 'lucide-react-native';

interface StoreDetailScreenProps {
  store: {
    id: number;
    name: string;
    address: string;
    distance?: string;
  };
  onBack: () => void;
  onOrder: () => void;
}

export default function StoreDetailScreen({ store, onBack, onOrder }: StoreDetailScreenProps) {
  const menuItems = [
    { id: 1, name: '싸이버거', description: '유찬맛의 일품', price: '3,000원' },
    { id: 2, name: '싸이버거', description: '언제나 베스트셀러', price: '3,000원' },
    { id: 3, name: '싸이버거', description: '', price: '3,000원' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Image 
          source={require('../assets/images/subway.png')} 
          style={styles.headerLogo}
          resizeMode="cover"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>      
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.storeAddress}>{store.address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>가맹점 소개</Text>
          <Text style={styles.sectionContent}>
            서브웨이는 1965년 미국 코네티컷주에서 시작된 세계적인 패스트푸드 체인점으로, 신선한 재료를 사용해 고객이 직접 서브마리를 만들 수 있는 가스터마이징 시스템으로 유명합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>메뉴</Text>
          {menuItems.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <Image 
                source={require('../assets/images/burger.png')} 
                style={styles.menuImage}
                resizeMode="cover"
              />
              <View style={styles.menuInfo}>
                <Text style={styles.menuName}>{item.name}</Text>
                {item.description ? (
                  <Text style={styles.menuDescription}>{item.description}</Text>
                ) : null}
              </View>
              <Text style={styles.menuPrice}>{item.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.orderButton} onPress={onOrder}>
          <ShoppingBag size={20} color="#ffffff" />
          <Text style={styles.orderButtonText}>포장 주문하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 30,
    zIndex: 1,
  },
  headerLogo: {
    width: '100%',
    height: 198,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  storeInfo: {
    paddingVertical: 20,
  },
  storeName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 30,
    marginBottom: 8,
  },
  storeAddress: {
    fontSize: 17,
    fontWeight: '500',
    color: '#6F7785',
    lineHeight: 24,
  },
  section: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 26,
    marginBottom: 16,
  },
  sectionContent: {
    fontSize: 17,
    fontWeight: '500',
    color: '#6F7785',
    lineHeight: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  menuImage: {
    width: 55,
    height: 45,
    borderRadius: 8,
},
  menuInfo: {
    flex: 1,
  },
  menuName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6F7785',
    lineHeight: 18,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
  },
  bottomContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#E5E7EB',
    borderRightColor: '#E5E7EB',
    borderLeftColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    padding: 16,
    alignItems: 'center',
  },
  orderButton: {
    backgroundColor: '#FF7049',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
  },
  orderButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 24,
  },
}); 