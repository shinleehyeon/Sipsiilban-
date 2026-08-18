import React, { useState } from 'react';
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
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react-native';

interface OrderScreenProps {
  store: {
    id: number;
    name: string;
    address: string;
    distance?: string;
  };
  onBack: () => void;
  onPayment: (totalAmount: number) => void;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export default function OrderScreen({ store, onBack, onPayment }: OrderScreenProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: '싸이버거', description: '유찬맛의 일품', price: 3000, quantity: 0 },
    { id: 2, name: '싸이버거', description: '언제나 베스트셀러', price: 3000, quantity: 0 },
    { id: 3, name: '싸이버거', description: '', price: 3000, quantity: 0 },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
    );
  };

  const totalAmount = menuItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{store.name} 주문하기</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                <Text style={styles.menuPrice}>{item.price.toLocaleString()}원</Text>
              </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={styles.quantityButton} 
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Minus size={16} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton} 
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Plus size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.paymentButton, totalAmount === 0 && styles.disabledButton]} 
          onPress={totalAmount > 0 ? () => onPayment(totalAmount) : undefined}
          disabled={totalAmount === 0}
        >
          <ShoppingBag size={20} color="#ffffff" />
          <Text style={styles.paymentButtonText}>
            {totalAmount > 0 ? `${totalAmount.toLocaleString()}원 결제하기` : '메뉴를 선택해주세요'}
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
    marginBottom: 4,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    minWidth: 20,
    textAlign: 'center',
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
  paymentButton: {
    backgroundColor: '#FF7049',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 24,
  },
}); 