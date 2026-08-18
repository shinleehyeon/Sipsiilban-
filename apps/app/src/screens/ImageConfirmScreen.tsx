import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';

interface ImageConfirmScreenProps {
  imageUri: string;
  onConfirm: () => void;
  onRetake: () => void;
}

export default function ImageConfirmScreen({ imageUri, onConfirm, onRetake }: ImageConfirmScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>제대로 촬영된 사진인가요?</Text>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>네, 맞아요</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
          <Text style={styles.retakeButtonText}>다시 촬영할래요</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 40,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  confirmButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FF7049',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
  retakeButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFF2F0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retakeButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF7049',
  },
}); 