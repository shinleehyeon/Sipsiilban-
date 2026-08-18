import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Home } from 'lucide-react-native';
import * as Location from 'expo-location';

interface OrderStatusScreenProps {
  store: {
    id: number;
    name: string;
    address: string;
    distance?: string;
  };
  orderAmount: number;
  onHome: () => void;
}

export default function OrderStatusScreen({ store, orderAmount, onHome }: OrderStatusScreenProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState({
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    })();
  }, []);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours}시 ${minutes}분 주문`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="standard"
      >
        <Marker
          coordinate={{
            latitude: region.latitude + 0.001,
            longitude: region.longitude + 0.001,
          }}
        >
          <Image 
            source={require('../assets/images/subwaypin.png')} 
            style={styles.markerImage}
            resizeMode="contain"
          />
        </Marker>
      </MapView>

      <View style={styles.orderCard}>
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusTitle}>음식이 조리중입니다</Text>
          <Text style={styles.statusSubtitle}>5분이 걸릴 예정이에요</Text>
        </View>
        
        <View style={styles.storeInfo}>
          <View style={styles.storeLogoContainer}>
            <Image 
              source={require('../assets/images/subway.png')} 
              style={styles.storeLogo}
              resizeMode="cover"
            />
          </View>
          <View style={styles.storeDetails}>
            <Text style={styles.storeName}>서브웨이</Text>
            <Text style={styles.orderTime}>{getCurrentTime()}</Text>
          </View>
          <Text style={styles.orderAmount}>{orderAmount.toLocaleString()}원</Text>
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={onHome}>
          <Home size={20} color="#ffffff" />
          <Text style={styles.homeButtonText}>홈으로 가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  markerImage: {
    width: 40,
    height: 40,
  },
  orderCard: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    flexDirection: 'column',
    gap: 24,
    alignSelf: 'stretch',
    shadowColor: 'rgba(0, 0, 0, 0.10)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
    marginBottom: 40,
  },
  statusTextContainer: {
    gap: 8,
    alignSelf: 'stretch',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 28,
  },
  statusSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6F7785',
    lineHeight: 22,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  storeLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#4CAF50',
  },
  storeLogo: {
    width: '100%',
    height: '100%',
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 22,
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6F7785',
    lineHeight: 18,
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF7049',
    lineHeight: 24,
  },
  homeButton: {
    backgroundColor: '#FF7049',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 24,
  },
}); 