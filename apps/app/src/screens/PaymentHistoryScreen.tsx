import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import ProfileImage from '../components/ProfileImage';

export default function PaymentHistoryScreen() {
  const paymentHistory = [
    {
      id: 1,
      storeName: '서브웨이',
      amount: -3000,
      date: '3월 32일',
      logo: require('../assets/images/subway.png'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.appLogo}
              resizeMode="contain"
            />
          </View>
          <Image 
            source={require('../assets/firestation.png')} 
            style={styles.fireLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.monthlySection}>
          <Text style={styles.sectionLabel}>이번 달 결제 금액</Text>
          <Text style={styles.monthlyAmount}>19,990원</Text>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.sectionLabel}>총 결제 금액</Text>
          <Text style={styles.totalAmount}>274,280원</Text>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>결제 내역</Text>
          
          {paymentHistory.map((item) => (
            <TouchableOpacity key={item.id} style={styles.historyItem}>
              <View style={styles.storeLogoContainer}>
                <Image 
                  source={item.logo} 
                  style={styles.storeLogo}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.storeName}>{item.storeName}</Text>
                <Text style={styles.paymentDate}>{item.date}</Text>
              </View>
              <Text style={styles.paymentAmount}>
                {item.amount.toLocaleString()}원
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appLogo: {
    width: 36,
    height: 36,
  },
  fireLogo: {
    width: 108,
    height: 27.648,
  },
  monthlySection: {
    marginBottom: 30,
  },
  totalSection: {
    marginBottom: 40,
  },
  sectionLabel: {
    fontSize: 17,
    color: '#6F7785',
    marginBottom: 8,
    fontWeight: '500',
    lineHeight: 24,
  },
  monthlyAmount: {
    fontSize: 29,
    fontWeight: '600',
    color: '#0D0E0E',
    lineHeight: 30,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0D0E0E',
    lineHeight: 30,
  },
  historySection: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  storeLogoContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  storeLogo: {
    width: 60,
    height: 60,
  },
  historyInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
    lineHeight: 24,
  },
  paymentDate: {
    fontSize: 14,
    color: '#6F7785',
    fontWeight: '500',
    lineHeight: 20,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
}); 