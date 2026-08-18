import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Check } from 'lucide-react-native';

interface PaymentCompleteScreenProps {
  orderAmount: number;
  onConfirm: () => void;
}

export default function PaymentCompleteScreen({ orderAmount, onConfirm }: PaymentCompleteScreenProps) {
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerText}>우리페이 현장 결제</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <Check size={40} color="#FF7049" />
        </View>
        
        <Text style={styles.successText}>
          결제가 완료되었습니다
        </Text>
        
        <View style={styles.paymentInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>가맹점</Text>
            <Text style={styles.infoValue}>쿠우쿠우</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>결제 금액</Text>
            <Text style={styles.infoValue}>{orderAmount.toLocaleString()}원</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>결제 일시</Text>
            <Text style={styles.infoValue}>{getCurrentDateTime()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>확인</Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
  },
  headerText: {
    fontSize: 17,
    color: '#6F7785',
    fontWeight: '500',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF2F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 28,
    marginBottom: 40,
    textAlign: 'center',
  },
  paymentInfo: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6F7785',
    lineHeight: 22,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  confirmButton: {
    backgroundColor: '#FF7049',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 24,
  },
}); 