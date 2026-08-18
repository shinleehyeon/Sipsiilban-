import { Button, HStack, Typo, VStack } from '@/components/atoms';
import { useTheme } from '@/hooks/useTheme';
import { Color } from '@/constants/color';
import {
    Text,
    SafeAreaView,
    Image,
    View,
    RefreshControl,
    ScrollView,
} from 'react-native';
import Logo from '@/assets/images/icon.png';
import Order from '@/components/Order';
import { CreditCard } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { getSettlementAmount } from '@/api/axios';
import { useState, useEffect, useCallback } from 'react';

// 주문 내역 목데이터
const mockOrders = [
    {
        id: 1,
        orderer: '신이현',
        price: 15000,
        date: new Date('2024-01-15T14:30:00'),
    },
    {
        id: 2,
        orderer: '한유찬',
        price: 25000,
        date: new Date('2024-01-15T15:45:00'),
    },
    {
        id: 3,
        orderer: '조성주',
        price: 18000,
        date: new Date('2024-01-15T16:20:00'),
    },
    {
        id: 4,
        orderer: '신이현',
        price: 32000,
        date: new Date('2024-01-15T17:10:00'),
    },
    {
        id: 5,
        orderer: '최동욱',
        price: 12000,
        date: new Date('2024-01-15T18:30:00'),
    },
];

export default function HomeScreen() {
    const theme = useTheme();
    const navigate = useNavigation();
    const [settlementAmount, setSettlementAmount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 잔액 조회 함수
    const fetchSettlementAmount = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getSettlementAmount();
            if (result.success) {
                setSettlementAmount(result.data.amount);
            } else {
                const errorMessage =
                    result.error?.message || '잔액 조회에 실패했습니다.';
                setError(errorMessage);
                console.error('잔액 조회 실패:', result.error);
            }
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                '잔액 조회 중 오류가 발생했습니다.';
            setError(errorMessage);
            console.error('잔액 조회 오류:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 새로고침 함수
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // await fetchSettlementAmount();
        setRefreshing(false);
    }, [fetchSettlementAmount]);

    // 컴포넌트 마운트 시 잔액 조회
    useEffect(() => {
        // fetchSettlementAmount();
    }, [fetchSettlementAmount]);

    return (
        <>
            <SafeAreaView
                style={{
                    paddingTop: 40,
                    marginInline: 20,
                    display: 'flex',
                    gap: 32,
                }}
            >
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ height: 40 }} />
                    <VStack>
                        <Image
                            source={Logo}
                            style={{ width: 40, height: 40 }}
                        />
                    </VStack>
                    <VStack gap={4}>
                        <Typo size={16} color={'textSecondary'}>
                            당일 정산 금액
                        </Typo>
                        {error ? (
                            <VStack gap={8}>
                                <Typo size={32} weight={600} color="error60">
                                    오류 발생
                                </Typo>
                                <VStack gap={4}>
                                    <Typo size={14} color="error60">
                                        {error}
                                    </Typo>
                                    <Typo size={12} color="textSecondary">
                                        자세한 정보는 개발자 콘솔을 확인하세요
                                    </Typo>
                                </VStack>
                                <Button
                                    onPress={fetchSettlementAmount}
                                    style={{
                                        backgroundColor: Color[theme].error60,
                                        height: 40,
                                        borderRadius: 8,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 8,
                                    }}
                                >
                                    <Typo
                                        size={14}
                                        weight={600}
                                        color="textInverse"
                                    >
                                        다시 시도
                                    </Typo>
                                </Button>
                            </VStack>
                        ) : (
                            <Typo size={32} weight={600}>
                                {isLoading
                                    ? '로딩 중...'
                                    : `${settlementAmount.toLocaleString()}원`}
                            </Typo>
                        )}
                    </VStack>
                    <Button
                        onPress={() => {
                            // @ts-ignore
                            navigate.navigate('payment');
                        }}
                    >
                        <HStack
                            bgColor="brand50"
                            gap={6}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <CreditCard color={'#fff'} />
                            <Typo color="textInverse">결제하기</Typo>
                        </HStack>
                    </Button>
                    <VStack gap={12}>
                        <Typo size={16} color={'textSecondary'}>
                            주문 내역
                        </Typo>
                        <VStack gap={8}>
                            {mockOrders.map((order) => (
                                <Order
                                    key={order.id}
                                    orderer={order.orderer}
                                    price={order.price}
                                    date={order.date}
                                    id={order.id}
                                />
                            ))}
                        </VStack>
                    </VStack>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
