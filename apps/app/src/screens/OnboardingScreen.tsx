import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function OnboardingScreen({ onContinue }: { onContinue: () => void }) {
  const scanLineY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createScanAnimation = () => {
      return Animated.sequence([
        Animated.timing(scanLineY, {
          toValue: 250,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scanLineY, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]);
    };

    const loopAnimation = Animated.loop(createScanAnimation(), {
      iterations: -1,
    });

    loopAnimation.start();

    return () => loopAnimation.stop();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>서비스 혜택을 위해</Text>
          <Text style={styles.title}>사용자 신원 인증을 해주세요</Text>
        </View>

        <Text style={styles.description}>
          서비스의 혜택을 받기 위해선 소속증명 및{'\n'}
          직업증명서를 제출해야 해요
        </Text>

        <View style={styles.scanContainer}>
          <View style={styles.documentContainer}>

            <Image 
              source={require('../assets/images/auth.png')} 
              style={styles.authImage}
              resizeMode="cover"
            />

            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY: scanLineY }],
                },
              ]}
            />

            <View style={styles.scanFrame}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
          </View>
        </View>
              
        <TouchableOpacity style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>지금 인증할래요</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: '#6F7785',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
  },
  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
    marginBottom: 40,
  },
  documentContainer: {
    position: 'relative',
    width: 280,
    height: 350,
  },
  authImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FF7049',
    shadowColor: '#FF7049',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },
  scanFrame: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FF7049',
    borderTopLeftRadius: 4,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FF7049',
    borderTopRightRadius: 4,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FF7049',
    borderBottomLeftRadius: 4,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FF7049',
    borderBottomRightRadius: 4,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#FF7049',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
}); 