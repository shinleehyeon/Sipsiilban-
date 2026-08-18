import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { QRCodeData } from '../types';

const { width } = Dimensions.get('window');

interface QRPaymentScreenProps {
  onBack?: () => void;
  onPaymentComplete?: () => void;
}

export default function QRPaymentScreen({ onBack, onPaymentComplete }: QRPaymentScreenProps) {
  const [timeLeft, setTimeLeft] = useState(180);
  const [amount, setAmount] = useState(19990); // 결제 금액 상태
  const [qrData, setQrData] = useState<QRCodeData>({
    paymentId: 'payment_123456',
    amount: amount,
    expiresAt: new Date(Date.now() + 180000),
  });
  
  // API에서 받아온 secret 값
  const [qrSecret, setQrSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // QR 코드용 고정 timestamp (한 번만 생성)
  const [fixedTimestamp] = useState(new Date().toISOString());

  // QR 코드 생성 (목 데이터 사용)
  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      
      // 목 데이터로 QR 코드 생성 (1초 로딩 시뮬레이션)
      setTimeout(() => {
        const mockSecret = `mock_payment_qr_${amount}_${Date.now()}`;
        console.log('목 QR secret 생성:', mockSecret);
        setQrSecret(mockSecret);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.log('QR 생성 에러:', error);
      setQrSecret('fallback_qr_code_' + Date.now());
      setIsLoading(false);
    }
  };

  // amount 변경 시 qrData 업데이트
  useEffect(() => {
    setQrData(prev => ({
      ...prev,
      amount: amount
    }));
  }, [amount]);

  // 컴포넌트 마운트 시 QR 코드 생성
  useEffect(() => {
    generateQRCode();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerText}>우리페이 현장 결제</Text>
        </View>
      </View>

      <View style={styles.qrSection}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>QR 코드 생성중...</Text>
          </View>
        ) : qrSecret ? (
          <>
            <QRCode
              value={qrSecret}
              size={202}
              color="black"
              backgroundColor="white"
            />
            
            <Text style={styles.instructionText}>
              위 QR 코드를 인식해주세요
            </Text>
            
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={styles.expireText}>
                {' '}만료
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>QR 코드 생성 실패</Text>
            <Text style={styles.errorText}>다시 시도해주세요</Text>
          </View>
        )}
      </View>

      <View style={styles.affiliationSection}>
        <Text style={styles.affiliationLabel}>소속</Text>
        <Image 
          source={require('../assets/firestation.png')} 
          style={styles.policeImage}
          resizeMode="contain"
        />
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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
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
  qrSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 202,
  },
  loadingText: {
    fontSize: 17,
    color: '#6F7785',
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#F03839',
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  instructionText: {
    fontSize: 17,
    color: '#6F7785',
    fontWeight: '500',
    lineHeight: 24,
    marginTop: 20,
    textAlign: 'center',
  },
  timerContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 17,
    color: '#F03839',
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
  },
  expireText: {
    fontSize: 17,
    color: '#6F7785',
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
  },
  affiliationSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  affiliationLabel: {
    fontSize: 17,
    color: '#6F7785',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  policeImage: {
    width: 108,
    height: 27.648,
  },
}); 