import { Button, HStack, Typo, VStack } from '@/components/atoms';
import { Color } from '@/constants/color';
import { useTheme } from '@/hooks/useTheme';
import React, { useState } from 'react';
import { Text, SafeAreaView, Image } from 'react-native';
import Logo from '@/assets/images/icon.png';
import Order from '@/components/Order';
import { ScanQrCode } from 'lucide-react-native';
import { useNavigation } from 'expo-router';

export default function HomeScreen() {
    const theme = useTheme();
    const navigate = useNavigation()
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
                <Button onPress={() => {
                    navigate.navigate('qr')
                }}>
                    <HStack bgColor='brand50' gap={6} style={{display: 'flex', alignItems: 'center'}}>
                        <ScanQrCode color={'#fff'} /> <Typo color='textInverse'>QR 코드 리더기 열기</Typo>
                    </HStack>
                </Button>
                <VStack gap={12}>
                    <Typo size={16} color={'textSecondary'}>
                        주문 내역
                    </Typo>
                    <Order orderer="한유찬" price={323232} date={new Date()} />
                </VStack>
            </SafeAreaView>
        </>
    );
}
