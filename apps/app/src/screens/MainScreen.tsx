import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
import QRPaymentScreen from './QRPaymentScreen';
import PaymentHistoryScreen from './PaymentHistoryScreen';
import SearchScreen from './SearchScreen';
import StoreDetailScreen from './StoreDetailScreen';
import OrderScreen from './OrderScreen';
import OrderStatusScreen from './OrderStatusScreen';
import PaymentCompleteScreen from './PaymentCompleteScreen';
import ProfileScreen from './ProfileScreen';
import BottomTabBar from '../components/BottomTabBar';

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState('home');
  const [showQR, setShowQR] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showStoreDetail, setShowStoreDetail] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [showPaymentComplete, setShowPaymentComplete] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [orderAmount, setOrderAmount] = useState(0);

  const handlePaymentPress = () => {
    setShowQR(true);
    setActiveTab('home'); // QR 화면으로 이동할 때 홈 탭으로 설정
  };

  const handlePaymentComplete = () => {
    setShowQR(false);
    setShowPaymentComplete(true);
  };

  const handleSearchPress = () => {
    setShowSearch(true);
  };

  const handleStorePress = (store: any) => {
    setSelectedStore(store);
    setShowStoreDetail(true);
  };

  const handleOrderPress = () => {
    setShowStoreDetail(false);
    setShowOrder(true);
  };

  const handleBackFromQR = () => {
    setShowQR(false);
  };

  const handleConfirmPaymentComplete = () => {
    setShowPaymentComplete(false);
    setSelectedStore(null);
    setOrderAmount(0);
    setActiveTab('home');
  };

  const handleBackFromSearch = () => {
    setShowSearch(false);
  };

  const handleBackFromStoreDetail = () => {
    setShowStoreDetail(false);
    setSelectedStore(null);
  };

  const handleBackFromOrder = () => {
    setShowOrder(false);
    setShowStoreDetail(true);
  };

  const handlePaymentFromOrder = (totalAmount: number) => {
    setOrderAmount(totalAmount);
    setShowOrder(false);
    setShowOrderStatus(true);
  };

  const handleHomeFromOrderStatus = () => {
    setShowOrderStatus(false);
    setSelectedStore(null);
    setOrderAmount(0);
    setActiveTab('home');
  };

  const renderScreen = () => {
    if (showQR) {
      return <QRPaymentScreen onBack={handleBackFromQR} onPaymentComplete={handlePaymentComplete} />;
    }

    if (showPaymentComplete) {
      return <PaymentCompleteScreen orderAmount={orderAmount} onConfirm={handleConfirmPaymentComplete} />;
    }

    if (showSearch) {
      return <SearchScreen onBackPress={handleBackFromSearch} onStorePress={handleStorePress} />;
    }

    if (showStoreDetail && selectedStore) {
      return (
        <StoreDetailScreen 
          store={selectedStore} 
          onBack={handleBackFromStoreDetail}
          onOrder={handleOrderPress}
        />
      );
    }

    if (showOrder && selectedStore) {
      return (
        <OrderScreen 
          store={selectedStore} 
          onBack={handleBackFromOrder}
          onPayment={handlePaymentFromOrder}
        />
      );
    }

    if (showOrderStatus && selectedStore) {
      return (
        <OrderStatusScreen 
          store={selectedStore} 
          orderAmount={orderAmount}
          onHome={handleHomeFromOrderStatus}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen onPaymentPress={handlePaymentPress} onSearchPress={handleSearchPress} onStorePress={handleStorePress} />;
      case 'map':
        return <MapScreen onPaymentPress={handlePaymentPress} onStorePress={handleStorePress} />;
      case 'history':
        return <PaymentHistoryScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onPaymentPress={handlePaymentPress} onSearchPress={handleSearchPress} onStorePress={handleStorePress} />;
    }
  };

  // OrderStatus 화면일 때는 SafeArea 없이 전체 화면 사용 (지도)
  if (showOrderStatus) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {renderScreen()}
        </View>
      </View>
    );
  }

  // StoreDetail, Order, PaymentComplete 화면일 때는 SafeAreaView 사용하고 바텀바 숨김
  if (showStoreDetail || showOrder || showPaymentComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {renderScreen()}
        </View>
      </SafeAreaView>
    );
  }

  // Map 화면일 때는 SafeArea 없이
  if (activeTab === 'map' && !showQR && !showSearch) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {renderScreen()}
        </View>
        <BottomTabBar 
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
      </View>
    );
  }

  // 다른 페이지들은 SafeAreaView 사용
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      {!showQR && !showSearch && !showOrder && !showOrderStatus && !showPaymentComplete && (
        <BottomTabBar 
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },

}); 