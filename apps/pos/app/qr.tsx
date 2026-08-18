import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import { CameraView, BarcodeScanningResult, Camera } from 'expo-camera';
import { Button, Typo, VStack, HStack } from '@/components/atoms';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { RotateCcw } from 'lucide-react-native';
import { formatWon } from '@/utils/price';

export default function QRPage() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const cameraRef = useRef<CameraView>(null);

    const amount = params.amount ? parseInt(params.amount as string) : 0;

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getCameraPermissions();
    }, []);

    const handleBarCodeScanned = async (scanResult: BarcodeScanningResult) => {
        if (scanned || isProcessing) return;

        const { type, data } = scanResult;
        setScanned(true);
        setIsProcessing(true);

        // QR 인식 성공 시 바로 홈으로 이동
        setTimeout(() => {
            Alert.alert(
                'QR 인식 성공',
                `${formatWon(amount)} 결제가 완료되었습니다.`,
                [
                    {
                        text: '확인',
                        onPress: () => {
                            navigation.navigate('(tabs)' as never);
                        },
                    },
                ],
            );
        }, 500); // 0.5초 후 알림 표시
    };

    const resetScanner = () => {
        setScanned(false);
        setIsProcessing(false);
    };

    if (hasPermission === null) {
        return (
            <SafeAreaView style={s.container}>
                <VStack style={s.centerContent}>
                    <Typo size={16}>카메라 권한을 요청 중...</Typo>
                </VStack>
            </SafeAreaView>
        );
    }

    if (hasPermission === false) {
        return (
            <SafeAreaView style={s.container}>
                <VStack style={s.centerContent} gap={16}>
                    <Typo size={16}>카메라 접근 권한이 필요합니다.</Typo>
                    <Button onPress={() => navigation.goBack()}>
                        <Typo color="textInverse">돌아가기</Typo>
                    </Button>
                </VStack>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={s.container}>
            <View style={{ height: 40 }} />
            {/* 결제 금액 표시 */}
            <VStack style={s.amountDisplay} gap={4}>
                <Typo size={14} color="textSecondary">
                    결제 금액
                </Typo>
                <Typo size={24} weight={600} color="brand60">
                    {formatWon(amount)}
                </Typo>
            </VStack>

            <View style={s.cameraContainer}>
                <CameraView
                    ref={cameraRef}
                    style={s.camera}
                    facing="back"
                    onBarcodeScanned={
                        scanned ? undefined : handleBarCodeScanned
                    }
                >
                    <View style={s.overlay}>
                        <View style={s.scanArea} />
                    </View>
                </CameraView>
            </View>

            <VStack style={s.footer} gap={16}>
                <Typo size={16} color="textSecondary" style={s.instruction}>
                    QR 코드를 사각형 안에 맞춰주세요
                </Typo>

                {scanned && (
                    <Button onPress={resetScanner} disabled={isProcessing}>
                        <HStack gap={8} style={s.resetButton}>
                            <RotateCcw size={20} color="#fff" />
                            <Typo color="textInverse">
                                {isProcessing ? '처리 중...' : '다시 스캔'}
                            </Typo>
                        </HStack>
                    </Button>
                )}
            </VStack>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
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
    cameraContainer: {
        flex: 1,
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: 'transparent',
        borderRadius: 20,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    instruction: {
        textAlign: 'center',
    },
    resetButton: {
        alignItems: 'center',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    amountDisplay: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
});
