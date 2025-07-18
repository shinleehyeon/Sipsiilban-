import { VStack, Button, Typo } from '@/components/atoms';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Color } from '@/constants/color';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

export default function FirstOnboard() {
    const router = useRouter();
    const theme = useTheme();
    const { refreshAuthStatus } = useAuth();

    const handleStart = () => {
        // 바로 메인 페이지로 이동
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={s.container}>
            <VStack style={s.content}>
                <View style={s.header}>
                    <Typo size={32} weight={700} color="text">
                        환영합니다
                    </Typo>
                    <Typo size={16} weight={400} color="textSecondary">
                        서비스를 이용해보세요
                    </Typo>
                </View>

                <View style={s.footer}>
                    <Button onPress={handleStart} style={s.loginButton}>
                        <Typo size={16} weight={600} color="textInverse">
                            시작하기
                        </Typo>
                    </Button>
                </View>
            </VStack>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.light.surface,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    footer: {
        paddingBottom: 20,
    },
    loginButton: {
        backgroundColor: Color.light.brand60,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
