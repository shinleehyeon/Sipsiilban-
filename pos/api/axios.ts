import axios from 'axios';
import { getToken, setToken } from '@/utils/auth';

export const client = axios.create({
    baseURL: 'https://pay-main.thnos.app',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// 요청 인터셉터: 모든 요청에 고정 토큰 추가
client.interceptors.request.use(
    async (config) => {
        // 고정된 액세스 토큰 사용
        const fixedToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNGMwMTEwNi0wYTAxLTQ3ZGUtOTAxYi04MmExMmM2NGY5NDciLCJleHAiOjE3NTM3MzUwMTN9.LZ5Rg1d__lIute5YiSRpv52dCGKVC09etD5FA-3NvoA';
        config.headers.Authorization = `Bearer ${fixedToken}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 응답 인터셉터: 401 에러 처리
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 토큰이 만료되었거나 유효하지 않은 경우
            console.log('인증 토큰이 만료되었습니다.');
            // 여기서 로그인 페이지로 리다이렉트하거나 토큰을 제거할 수 있습니다
        }
        return Promise.reject(error);
    },
);

// 로그인 API 함수
export const loginWithCode = async (code: string) => {
    try {
        const response = await client.post('/auth/login/web', { code });
        const { token } = response.data.data;

        if (token) {
            await setToken(token);
            return { success: true, token };
        } else {
            throw new Error('토큰이 응답에 포함되지 않았습니다.');
        }
    } catch (error) {
        console.error('로그인 실패:', error);
        return { success: false, error };
    }
};

// 잔액 조회 API 함수
export const getSettlementAmount = async () => {
    try {
        const response = await client.get('/pay/pos/settlement-amount');
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        console.error('잔액 조회 실패:', error);

        // 자세한 에러 정보 구성
        const errorInfo = {
            message:
                error?.response?.data?.message ||
                error?.message ||
                '알 수 없는 오류',
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            url: error?.config?.url,
            method: error?.config?.method,
            headers: error?.config?.headers,
            data: error?.response?.data,
        };

        console.log('자세한 에러 정보:', errorInfo);

        return {
            success: false,
            error: errorInfo,
        };
    }
};
