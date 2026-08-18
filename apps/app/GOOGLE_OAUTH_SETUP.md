# Google OAuth 2.0 설정 가이드

## 1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **라이브러리**에서 "Google+ API" 활성화
4. **API 및 서비스** > **사용자 인증 정보** 이동
5. **사용자 인증 정보 만들기** > **OAuth 2.0 클라이언트 ID** 선택
6. 애플리케이션 유형: **모바일 앱** 선택
7. 패키지 이름 입력: `com.sunrinthonapp`

## 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고 다음 내용을 추가하세요:

```env
# Google OAuth 클라이언트 ID (위에서 생성한 값)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# 백엔드 API 베이스 URL
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

## 3. 백엔드 API 연동

앱에서 다음 API 엔드포인트를 호출합니다:

### POST `/auth/login/mobile`

**Request Body:**
```json
{
  "code": "google_authorization_code",
  "platform": "android", // 또는 "ios"
  "customer_type": "sponsor"
}
```

**Response (200):**
```
"success_token_or_message"
```

**Response (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "code"],
      "msg": "string",
      "type": "string"
    }
  ]
}
```

## 4. 테스트 모드

개발 중에는 `.env` 파일에서 `EXPO_PUBLIC_GOOGLE_CLIENT_ID`를 설정하지 않으면 더미 로그인이 작동합니다.

## 5. 플랫폼별 설정

### iOS
- Xcode에서 URL Scheme `sunrinthon-app` 추가
- `Info.plist`에 URL Types 설정

### Android
- `android/app/src/main/AndroidManifest.xml`에 intent-filter 추가
- Deep link 스킴 `sunrinthon-app` 설정

## 주의사항

- 프로덕션 환경에서는 반드시 실제 Google Client ID를 사용하세요
- API 키와 비밀 정보는 `.env` 파일에 보관하고 git에 커밋하지 마세요
- 백엔드 API URL은 HTTPS를 사용해야 합니다 