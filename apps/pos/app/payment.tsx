import { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Typo, VStack, HStack } from '@/components/atoms';
import { ButtonVariant } from '@/components/atoms/Button/Button.type';
import { useNavigation } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { formatWon } from '@/utils/price';

export default function PaymentPage() {
    const navigation = useNavigation();
    const [amount, setAmount] = useState('');

    const handleNumberPress = (num: string) => {
        if (num === 'backspace') {
            setAmount((prev) => prev.slice(0, -1));
        } else if (num === 'clear') {
            setAmount('');
        } else {
            // 최대 8자리까지 입력 가능
            if (amount.length < 8) {
                setAmount((prev) => prev + num);
            }
        }
    };

    const handleNext = () => {
        if (amount && parseInt(amount) > 0) {
            navigation.navigate('qr', {
                amount: parseInt(amount),
            } as never);
        }
    };

    const numberPad = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['clear', '0', 'backspace'],
    ];

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
                        결제 금액 입력
                    </Typo>
                    <View style={s.placeholder} />
                </HStack>
            </VStack>

            <VStack style={s.content} gap={32}>
                {/* 금액 표시 */}
                <VStack style={s.amountContainer} gap={8}>
                    <Typo size={16} color="textSecondary">
                        결제 금액
                    </Typo>
                    <Typo size={48} weight={600} color="brand60">
                        {amount ? formatWon(parseInt(amount)) : '0원'}
                    </Typo>
                </VStack>

                {/* 키패드 */}
                <VStack style={s.keypadContainer} gap={16}>
                    {numberPad.map((row, rowIndex) => (
                        <HStack key={rowIndex} gap={16}>
                            {row.map((num) => (
                                <TouchableOpacity
                                    key={num}
                                    style={[
                                        s.keypadButton,
                                        num === 'clear' && s.clearButton,
                                        num === 'backspace' &&
                                            s.backspaceButton,
                                    ]}
                                    onPress={() => handleNumberPress(num)}
                                >
                                    {num === 'backspace' ? (
                                        <Typo size={24} color="textSecondary">
                                            ⌫
                                        </Typo>
                                    ) : num === 'clear' ? (
                                        <Typo size={18} color="textSecondary">
                                            C
                                        </Typo>
                                    ) : (
                                        <Typo size={24} weight={600}>
                                            {num}
                                        </Typo>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </HStack>
                    ))}
                </VStack>

                {/* 다음 버튼 */}
                <Button
                    onPress={handleNext}
                    disabled={!amount || parseInt(amount) === 0}
                    fullWidth
                >
                    <Typo color="textInverse" size={18} weight={600}>
                        다음
                    </Typo>
                </Button>
            </VStack>
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
        paddingTop: 32,
        paddingBottom: 32,
    },
    amountContainer: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    keypadContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    keypadButton: {
        flex: 1,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    clearButton: {
        backgroundColor: '#FEF3C7',
    },
    backspaceButton: {
        backgroundColor: '#FEE2E2',
    },
});
