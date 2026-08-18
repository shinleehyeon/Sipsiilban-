// 환경 변수 또는 설정 값들
export const AUTH_CONFIG = {
  // Google OAuth 클라이언트 ID (더미 모드)
  GOOGLE_CLIENT_ID: 'DUMMY_FIXED_TOKEN_MODE',
  
  // 고정 JWT 토큰
  FIXED_JWT_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNGMwMTEwNi0wYTAxLTQ3ZGUtOTAxYi04MmExMmM2NGY5NDciLCJleHAiOjE3NTM3MzUwMTN9.LZ5Rg1d__lIute5YiSRpv52dCGKVC09etD5FA-3NvoA',
  
  // 백엔드 API 베이스 URL (실제 값으로 교체 필요)
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://yuchan-macbook:8080',
  
  // OAuth 리다이렉트 URI 스킴
  REDIRECT_URI_SCHEME: 'sunrinthon-app',
};

// API 엔드포인트들
export const API_ENDPOINTS = {
  LOGIN_MOBILE: '/auth/login/mobile',
};

// 플랫폼 감지
export const getPlatform = () => {
  // React Native에서 플랫폼 감지
  const { Platform } = require('react-native');
  return Platform.OS === 'ios' ? 'ios' : 'android';
}; 