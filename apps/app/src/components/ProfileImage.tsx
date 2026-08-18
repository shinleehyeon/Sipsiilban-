import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import { User } from 'lucide-react-native';

interface ProfileImageProps {
  imageUri?: string;
  size?: number;
  name?: string;
  showName?: boolean;
}

export default function ProfileImage({ 
  imageUri, 
  size = 40, 
  name = "사용자",
  showName = false 
}: ProfileImageProps) {
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { width: size, height: size, borderRadius: size / 2 }]}>
        {imageUri ? (
          <Image 
            source={{ uri: imageUri }} 
            style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]}>
            {name ? (
              <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
                {getInitials(name)}
              </Text>
            ) : (
              <User size={size * 0.6} color="#6F7785" />
            )}
          </View>
        )}
      </View>
      {showName && (
        <Text style={styles.nameText}>{name}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  imageContainer: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  image: {
    backgroundColor: '#F9FAFB',
  },
  placeholder: {
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: '600',
    color: '#6F7785',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
}); 