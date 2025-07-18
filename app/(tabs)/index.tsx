import { Button, HStack, Typo, VStack } from '@/components/atoms';
import { useTheme } from '@/hooks/useTheme';
import { Text, SafeAreaView, Image, View } from 'react-native';
import Logo from '@/assets/images/icon.png';
import Order from '@/components/Order';
import { CreditCard } from 'lucide-react-native';
import { useNavigation } from 'expo-router';

export default function HomeScreen() {
    const theme = useTheme();
    const navigate = useNavigation();
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
                <View style={{ height: 40 }} />
                <VStack>
                    <Image source={Logo} style={{ width: 40, height: 40 }} />
                </VStack>
                <VStack gap={4}>
                    <Typo size={16} color={'textSecondary'}>
                        당일 정산 금액
                    </Typo>
                    <Typo size={32} weight={600}>
                        199,290원
                    </Typo>
                </VStack>
                <Button
                    onPress={() => {
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
                    <Order
                        orderer="한유찬"
                        price={323232}
                        date={new Date()}
                        id={1}
                    />
                </VStack>
            </SafeAreaView>
        </>
    );
}
