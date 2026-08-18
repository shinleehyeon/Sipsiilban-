import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Check } from 'lucide-react-native';

interface SignupCompleteScreenProps {
  onComplete: () => void;
}

export default function SignupCompleteScreen({ onComplete }: SignupCompleteScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Check size={40} color="#FF7049" />
        </View>
        
        <Text style={styles.title}>가입이 완료되었습니다</Text>
        <Text style={styles.subtitle}>3초뒤 홈 화면으로 이동합니다</Text>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    padding: 16,
    borderRadius: 9999,
    backgroundColor: '#FFEDE8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0D0E0E',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6F7785',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 