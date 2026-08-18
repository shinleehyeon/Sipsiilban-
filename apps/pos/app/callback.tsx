import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useSearchParams, useLocalSearchParams } from 'expo-router';
import { loginWithCode } from '@/api/axios';
import { Color } from '@/constants/color';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

export default function CallbackPage() {
    const router = useRouter();
    const { code } = useSearchParams();
    const localParams = useLocalSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
        'loading',
    );
    const [errorMessage, setErrorMessage] = useState('');
    const theme = useTheme();
    const { refreshAuthStatus } = useAuth();

    // URL 파라미터에서 code 추출 (딥링크와 일반 라우팅 모두 지원)
    const authCode = code || localParams.code;

    useEffect(() => {
        const handleCallback = async () => {
            if (!authCode || typeof authCode !== 'string') {
                setStatus('error');
                setErrorMessage('인증 코드가 없습니다.');
                return;
            }

            try {
                const result = await loginWithCode(authCode);

                if (result.success) {
                    setStatus('success');
                    // 인증 상태 업데이트
                    await refreshAuthStatus();
                    // 로그인 성공 후 메인 페이지로 이동
                    setTimeout(() => {
                        router.replace('/(tabs)');
                    }, 1000);
                } else {
                    setStatus('error');
                    setErrorMessage('로그인에 실패했습니다.');
                }
            } catch (error) {
                setStatus('error');
                setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
                console.error('콜백 처리 오류:', error);
            }
        };

        handleCallback();
    }, [authCode, router, refreshAuthStatus]);

    const getStatusContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <View style={{ alignItems: 'center', gap: 16 }}>
                        <ActivityIndicator
                            size="large"
                            color={Color[theme].brand60}
                        />
                        <Text
                            style={{ color: Color[theme].text, fontSize: 16 }}
                        >
                            로그인 처리 중...
                        </Text>
                    </View>
                );
            case 'success':
                return (
                    <View style={{ alignItems: 'center', gap: 16 }}>
                        <Text
                            style={{
                                color: Color[theme].success60,
                                fontSize: 16,
                            }}
                        >
                            로그인 성공!
                        </Text>
                        <Text
                            style={{ color: Color[theme].text, fontSize: 14 }}
                        >
                            메인 페이지로 이동합니다...
                        </Text>
                    </View>
                );
            case 'error':
                return (
                    <View style={{ alignItems: 'center', gap: 16 }}>
                        <Text
                            style={{
                                color: Color[theme].error60,
                                fontSize: 16,
                            }}
                        >
                            로그인 실패
                        </Text>
                        <Text
                            style={{ color: Color[theme].text, fontSize: 14 }}
                        >
                            {errorMessage}
                        </Text>
                        <Text
                            style={{
                                color: Color[theme].brand60,
                                fontSize: 14,
                                textDecorationLine: 'underline',
                            }}
                            onPress={() => router.back()}
                        >
                            다시 시도하기
                        </Text>
                    </View>
                );
        }
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Color[theme].surface,
                padding: 20,
            }}
        >
            {getStatusContent()}
        </View>
    );
}
