import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { Button, Typo, VStack, HStack } from '@/components/atoms';
import { ButtonVariant } from '@/components/atoms/Button/Button.type';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { client } from '@/api/axios';
import { ArrowLeft, Store, User, Calendar, Package } from 'lucide-react-native';
import { formatWon } from '@/utils/price';
import { formatKoreanDate } from '@/utils/date';

interface OrderDetail {
    id: number;
    orderer: string;
    price: number;
    date: Date;
    storeName: string;
    productName: string;
    status: 'completed' | 'pending' | 'cancelled';
}

export default function OrderDetailPage() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const orderId = params.id;
                const response = await client.get(`/api/orders/${orderId}`);
                setOrderDetail(response.data);
            } catch (error) {
                console.error(
                    '주문 상세 정보를 불러오는데 실패했습니다:',
                    error,
                );
                // 임시 데이터 (실제로는 에러 처리)
                setOrderDetail({
                    id: 1,
                    orderer: '한유찬',
                    price: 323232,
                    date: new Date(),
                    storeName: '스타벅스 강남점',
                    productName: '아메리카노 외 3건',
                    status: 'completed',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [params.id]);

    if (loading) {
        return (
            <SafeAreaView style={s.container}>
                <VStack style={s.centerContent}>
                    <Typo size={16}>주문 정보를 불러오는 중...</Typo>
                </VStack>
            </SafeAreaView>
        );
    }

    if (!orderDetail) {
        return (
            <SafeAreaView style={s.container}>
                <VStack style={s.centerContent} gap={16}>
                    <Typo size={16}>주문 정보를 찾을 수 없습니다.</Typo>
                    <Button onPress={() => navigation.goBack()}>
                        <Typo color="textInverse">돌아가기</Typo>
                    </Button>
                </VStack>
            </SafeAreaView>
        );
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return { text: '완료', color: 'success' as const };
            case 'pending':
                return { text: '처리중', color: 'warning' as const };
            case 'cancelled':
                return { text: '취소됨', color: 'error' as const };
            default:
                return { text: '알 수 없음', color: 'textSecondary' as const };
        }
    };

    const statusInfo = getStatusText(orderDetail.status);

    return (
        <SafeAreaView style={s.container}>
            <View style={{ height: 40 }} />
            <VStack style={s.header}>
                <HStack style={s.headerContent}>
                    <Button
                        variant={ButtonVariant.SECONDARY}
                        onPress={() => navigation.goBack()}
                        style={s.backButton}
                    >
                        <ArrowLeft size={24} color="#000" />
                    </Button>
                    <Typo size={18} weight={600}>
                        주문 상세
                    </Typo>
                    <View style={s.placeholder} />
                </HStack>
            </VStack>

            <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
                <VStack gap={24}>
                    {/* 주문 상태 */}
                    <VStack style={s.statusCard} gap={8}>
                        <Typo size={14} color="textSecondary">
                            주문 상태
                        </Typo>
                        <HStack style={s.statusContent}>
                            <View
                                style={[
                                    s.statusBadge,
                                    {
                                        backgroundColor:
                                            statusInfo.color === 'success'
                                                ? '#10B981'
                                                : statusInfo.color === 'warning'
                                                  ? '#F59E0B'
                                                  : '#EF4444',
                                    },
                                ]}
                            >
                                <Typo
                                    size={12}
                                    color="textInverse"
                                    weight={600}
                                >
                                    {statusInfo.text}
                                </Typo>
                            </View>
                        </HStack>
                    </VStack>

                    {/* 주문 금액 */}
                    <VStack style={s.card} gap={8}>
                        <Typo size={14} color="textSecondary">
                            주문 금액
                        </Typo>
                        <Typo size={32} weight={600} color="brand60">
                            {formatWon(orderDetail.price)}
                        </Typo>
                    </VStack>

                    {/* 주문 정보 */}
                    <VStack style={s.card} gap={16}>
                        <Typo size={16} weight={600}>
                            주문 정보
                        </Typo>

                        <VStack gap={12}>
                            <HStack style={s.infoRow}>
                                <HStack gap={8} style={s.infoLabel}>
                                    <User size={16} color="#6B7280" />
                                    <Typo size={14} color="textSecondary">
                                        구매자
                                    </Typo>
                                </HStack>
                                <Typo size={14}>{orderDetail.orderer}</Typo>
                            </HStack>

                            <HStack style={s.infoRow}>
                                <HStack gap={8} style={s.infoLabel}>
                                    <Calendar size={16} color="#6B7280" />
                                    <Typo size={14} color="textSecondary">
                                        주문일시
                                    </Typo>
                                </HStack>
                                <Typo size={14}>
                                    {formatKoreanDate(orderDetail.date)}
                                </Typo>
                            </HStack>
                        </VStack>
                    </VStack>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerContent: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    statusCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    statusContent: {
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    infoRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        alignItems: 'center',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});
