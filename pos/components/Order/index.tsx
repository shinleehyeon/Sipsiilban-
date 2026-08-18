import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { HStack, Typo, VStack } from '../atoms';
import { formatWon } from '@/utils/price';
import { formatKoreanDate } from '@/utils/date';
import { useNavigation } from 'expo-router';

interface Props {
    orderer: string;
    price: number;
    date: Date;
    id: number;
}

export default function Order({ orderer, price, date, id }: Props) {
    const navigate = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => {
                navigate.navigate('order' as never, { id } as never);
            }}
        >
            <HStack style={s.container}>
                <VStack gap={4}>
                    <Typo size={20}>{orderer}</Typo>
                    <Typo size={16} color="textSecondary">
                        {formatKoreanDate(date)}
                    </Typo>
                </VStack>
                <Typo size={18} color="brand60" weight={600}>
                    {formatWon(price)}
                </Typo>
            </HStack>
        </TouchableOpacity>
    );
}

const s = StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 20,
        paddingInline: 16,
        paddingBlock: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
