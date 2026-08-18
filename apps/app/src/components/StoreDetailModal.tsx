import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { CreditCard, QrCode } from 'lucide-react-native';

const { height: screenHeight } = Dimensions.get('window');

interface Store {
  id: number;
  name: string;
  distance: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
}

interface StoreDetailModalProps {
  visible: boolean;
  store: Store | null;
  onClose: () => void;
  onOrder: () => void;
}

export default function StoreDetailModal({ 
  visible, 
  store, 
  onClose, 
  onOrder 
}: StoreDetailModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const modalHeight = useRef(new Animated.Value(screenHeight * 0.45)).current;
  
  useEffect(() => {
    if (visible) {
      setIsExpanded(false);
      modalHeight.setValue(screenHeight * 0.45);
    }
  }, [visible]);
  
  const nearbyStores = [
    { id: 1, name: '서브웨이', distance: '50m', address: '서울특별시 중구 세종대로 110' },
    { id: 2, name: '서브웨이', distance: '85m', address: '서울특별시 중구 세종대로 120' },
    { id: 3, name: '서브웨이', distance: '120m', address: '서울특별시 중구 세종대로 130' },
    { id: 4, name: '서브웨이', distance: '150m', address: '서울특별시 중구 세종대로 140' },
    { id: 5, name: '서브웨이', distance: '180m', address: '서울특별시 중구 세종대로 150' },
  ];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      const newHeight = isExpanded 
        ? screenHeight - gestureState.dy
        : screenHeight * 0.45 - gestureState.dy;
      
      if (newHeight >= screenHeight * 0.45 && newHeight <= screenHeight) {
        modalHeight.setValue(newHeight);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const velocity = gestureState.vy;
      
      if (!isExpanded && (gestureState.dy < -100 || velocity < -0.5)) {
        // 위로 드래그하거나 빠른 속도로 위로 스와이프 → 확장
        setIsExpanded(true);
        Animated.spring(modalHeight, {
          toValue: screenHeight,
          useNativeDriver: false,
        }).start();
      } else if (isExpanded && (gestureState.dy > 100 || velocity > 0.5)) {
        // 아래로 드래그하거나 빠른 속도로 아래로 스와이프 → 축소
        setIsExpanded(false);
        Animated.spring(modalHeight, {
          toValue: screenHeight * 0.45,
          useNativeDriver: false,
        }).start();
      } else {
        // 원래 상태로 복원
        Animated.spring(modalHeight, {
          toValue: isExpanded ? screenHeight : screenHeight * 0.45,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View 
          style={[styles.modalContent, { height: modalHeight }]}
        >
          <View 
            style={styles.dragHandleContainer} 
            {...panResponder.panHandlers}
          >
            <View style={styles.dragHandle} />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.paymentCard}>
            <View style={styles.balanceSection}>
              <View style={styles.balanceHeader}>
                <CreditCard size={20} color="#6F7785" />
                <Text style={styles.balanceLabel}>현재 사용 가능 금액</Text>
              </View>
              <Text style={styles.balanceAmount}>19,990원</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.paymentButton}
              onPress={onOrder}
            >
              <View style={styles.paymentButtonContent}>
                <QrCode size={20} color="#ffffff" />
                <Text style={styles.paymentButtonText}>가맹점 결제</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.nearbyStoresSection}>
            <Text style={styles.nearbyStoresTitle}>내 근처 매장</Text>
            <View style={styles.storeList}>
              {nearbyStores.map((store) => (
                <TouchableOpacity key={store.id} style={styles.storeItem}>
                  <Image 
                    source={require('../assets/images/subway.png')} 
                    style={styles.storeIcon}
                    resizeMode="cover"
                  />
                  <View style={styles.storeInfo}>
                    <Text style={styles.storeName}>{store.name}</Text>
                    <Text style={styles.storeDistance}>{store.distance}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.footerSection}>
              <View style={styles.footerItem}>
                <Image 
                  source={require('../assets/logo.png')} 
                  style={styles.footerLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.footerItem}>
                <Text style={styles.footerText}>소속</Text>
                <Image 
                  source={require('../assets/firestation.png')} 
                  style={styles.footerFireIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
                      </View>
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '50%',
  },
  dragHandleContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 5,
  },
  dragHandle: {
    width: 79,
    height: 5,
    backgroundColor: '#E4E4E4',
    borderRadius: 9999,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  storeLogoContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeLogo: {
    width: 32,
    height: 24,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  storeDistance: {
    fontSize: 14,
    color: '#6F7785',
  },
  paymentCard: {
    display: 'flex',
    padding: 24,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 20,
    gap: 16,
  },
  balanceSection: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6F7785',
    fontWeight: '500',
    lineHeight: 20,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0D0E0E',
    lineHeight: 30,
  },
  paymentButton: {
    display: 'flex',
    height: 46,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#FF7049',
    alignSelf: 'stretch',
  },
  paymentButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  nearbyStoresSection: {
    marginBottom: 20,
  },
  nearbyStoresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  storeList: {
    gap: 0,
  },
  storeItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: -16,
    marginHorizontal: -14,
  },
  storeIcon: {
    width: 90,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  footerItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  footerLogo: {
    width: 36,
    height: 36,
    aspectRatio: 1,
  },
  footerFireIcon: {
    width: 86,
    height: 22,
    aspectRatio: 43/11,
  },
  footerText: {
    fontSize: 14,
    color: '#6F7785',
    fontWeight: '500',
  },
}); 