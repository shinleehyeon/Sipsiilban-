import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import GoogleIcon from '../assets/icon/google.svg';
import { AUTH_CONFIG, API_ENDPOINTS, getPlatform } from '../config/auth';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth 설정
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: AUTH_CONFIG.REDIRECT_URI_SCHEME,
  preferLocalhost: true, // iOS에서 localhost 사용 선호
});

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH_CONFIG.GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: GOOGLE_REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        access_type: 'offline',
      },
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      handleAuthResponse(response);
    } else if (response?.type === 'error') {
      setIsLoading(false);
      Alert.alert('로그인 오류', '로그인에 실패했습니다.');
    }
  }, [response]);

  const handleAuthResponse = async (response: AuthSession.AuthSessionResult) => {
    if (response.type === 'success') {
      try {
        const authCode = response.params.code;
        
        // 백엔드 API 호출
        const loginResponse = await fetch(`${AUTH_CONFIG.API_BASE_URL}${API_ENDPOINTS.LOGIN_MOBILE}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: authCode,
            platform: getPlatform(),
            customer_type: 'sponsor'
          }),
        });

        if (loginResponse.ok) {
          const result = await loginResponse.text();
          console.log('로그인 성공:', result);
          setIsLoading(false);
          onLogin();
        } else {
          const errorData = await loginResponse.json();
          console.error('API 에러:', errorData);
          setIsLoading(false);
          Alert.alert('로그인 실패', '서버 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('로그인 처리 오류:', error);
        setIsLoading(false);
        Alert.alert('오류', '로그인 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      if (AUTH_CONFIG.GOOGLE_CLIENT_ID === 'DUMMY_FIXED_TOKEN_MODE') {
        // 고정 JWT 토큰을 사용한 더미 로그인
        setTimeout(() => {
          console.log('고정 JWT 토큰으로 로그인 처리:', AUTH_CONFIG.FIXED_JWT_TOKEN);
          setIsLoading(false);
          onLogin();
        }, 1000);
        return;
      }

      // 실제 Google OAuth (사용 안 함)
      await WebBrowser.warmUpAsync();
      await promptAsync({
        windowFeatures: { width: 515, height: 680 },
        showInRecents: true,
      });
    } catch (error) {
      console.error('OAuth 시작 오류:', error);
      setIsLoading(false);
      Alert.alert('오류', '로그인을 시작할 수 없습니다.');
    }
  };



  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/login.png')}
        style={styles.backgroundImage}
        blurRadius={3}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
              <View style={styles.topSection}>
                <Image 
                  source={require('../assets/logo.png')} 
                  style={styles.logo}
                  resizeMode="contain"
                />
                
                <Text style={styles.title}>신결제에</Text>
                <Text style={styles.title}>혁신을 더하다</Text>
              </View>

              <View style={styles.bottomSection}>
                                  <TouchableOpacity
                    style={[styles.googleButton, isLoading && styles.disabledButton]}
                    onPress={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <GoogleIcon width={20} height={20} />
                    <Text style={styles.googleButtonText}>
                      {isLoading ? '로그인 중...' : 'Google로 계속하기'}
                    </Text>
                  </TouchableOpacity>
                
                <Text style={styles.bottomText}>
                  로그인에 문제가 있나요?
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingTop: 60,
    alignItems: 'flex-start',
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    lineHeight: 44,
    marginBottom: 4,
  },
  bottomSection: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  googleButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    width: 354,
    height: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  bottomText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
}); 