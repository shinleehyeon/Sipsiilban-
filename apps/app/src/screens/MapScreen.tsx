import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import SearchIcon from '../assets/icon/search.svg';


interface MapScreenProps {
  onPaymentPress?: () => void;
  onStorePress?: (store: any) => void;
}

export default function MapScreen({ onPaymentPress, onStorePress }: MapScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('음식점');
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
      if (status !== 'granted') {
        Alert.alert('권한 필요', '위치 권한이 필요합니다.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const stores = [
    {
      id: 1,
      name: '서브웨이',
      latitude: 37.5665,
      longitude: 126.9780,
      distance: '32m',
      address: '서울특별시 중구 세종대로 110',
      phone: '02-1234-5678',
      rating: 4.5,
      reviews: 128,
    },
    {
      id: 2,
      name: '서브웨이',
      latitude: 37.5670,
      longitude: 126.9785,
      distance: '85m',
      address: '서울특별시 중구 세종대로 120',
      phone: '02-1234-5679',
      rating: 4.3,
      reviews: 95,
    },
    {
      id: 3,
      name: '서브웨이',
      latitude: 37.5668,
      longitude: 126.9775,
      distance: '32m',
      address: '서울특별시 중구 세종대로 130',
      phone: '02-1234-5680',
      rating: 4.7,
      reviews: 156,
    },
  ];

  const categories = [
    { id: '음식점', image: require('../assets/images/food.png') },
    { id: '카페', image: require('../assets/images/coffee.png') },
    { id: '마트', image: require('../assets/images/mart.png') },
    { id: '편의점', image: require('../assets/images/gs25.png') },
  ];

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
          onPress={() => {
            onStorePress?.({
              id: 1,
              name: '서브웨이 역곡점',
              address: '경기도 역곡시 용산동 32-1',
              distance: '32m',
            });
          }}
        >
          <Image 
            source={require('../assets/images/subwaypin.png')} 
            style={styles.markerImage}
            resizeMode="contain"
          />
        </Marker>

        {stores.map((store) => (
          <Marker
            key={store.id}
            coordinate={{
              latitude: store.latitude,
              longitude: store.longitude,
            }}
            onPress={() => {
              onStorePress?.({
                id: store.id,
                name: `${store.name} 역곡점`,
                address: store.address,
                distance: store.distance,
              });
            }}
          >
            <Image 
              source={require('../assets/images/subwaypin.png')} 
              style={styles.markerImage}
              resizeMode="contain"
            />
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon width={20} height={20} fill="#6F7785" />
          <TextInput
            style={styles.searchInput}
            placeholder="가맹점 검색하기"
            placeholderTextColor="#6F7785"
          />
        </View>
      </View>

      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.activeCategory
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Image 
              source={category.image} 
              style={styles.categoryImage}
              resizeMode="contain"
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.activeCategoryText
            ]}>
              {category.id}
            </Text>
          </TouchableOpacity>
        ))}
      </View>




    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 24,
    color: '#6F7785',
  },
  categoryContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    zIndex: 1,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  activeCategory: {
    backgroundColor: '#E8F5E8',
  },
  categoryImage: {
    width: 20,
    height: 20,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    lineHeight: 24,
  },
  activeCategoryText: {
    color: '#4CAF50',
  },

  map: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  subwayPinButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  markerImage: {
    width: 40,
    height: 40,
  },
  
}); 