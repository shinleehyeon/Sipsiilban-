import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { CreditCard, Search, MapPin } from 'lucide-react-native';
import QRIcon from '../assets/icon/scan-qr-code1.svg';

interface Store {
  id: number;
  name: string;
  distance: string;
  image: any;
}

interface HomeScreenProps {
  onPaymentPress?: () => void;
  onSearchPress?: () => void;
  onStorePress?: (store: any) => void;
}

export default function HomeScreen({ onPaymentPress, onSearchPress, onStorePress }: HomeScreenProps) {
  const categories = [
    { id: 1, name: '음식점', image: require('../assets/images/food.png') },
    { id: 2, name: '카페', image: require('../assets/images/coffee.png') },
    { id: 3, name: '마트', image: require('../assets/images/mart.png') },
    { id: 4, name: '편의점', image: require('../assets/images/gs25.png') },
  ];

  const favoriteStores: Store[] = [
    { id: 1, name: '서브웨이 강남역점', distance: '32m', image: require('../assets/images/subway.png') },
    { id: 2, name: '맥도날드 부천역점', distance: '120m', image: require('../assets/images/mac.png') },
    { id: 3, name: '버거킹 역곡점', distance: '200m', image: require('../assets/images/king.png') },
  ];

  const popularStores = [
    { id: 1, name: '맥도날드 부천역점', subtitle: '이전 맥도날드 원조' },
    { id: 2, name: '맥도날드 부천역점', subtitle: '이전 맥도날드 원조' },
  ];



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity style={styles.headerButton} onPress={onPaymentPress}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonSubtitle}>가맹점</Text>
            <Text style={styles.buttonTitle}>QR 결제하기</Text>
          </View>
          <QRIcon width={50} height={50} fill="#FF7049" />
        </TouchableOpacity>

        <View style={styles.amountCard}>
          <View style={styles.amountHeader}>
            <CreditCard size={20} color="#ffffff" />
            <Text style={styles.amountLabel}>현재 사용 가능 금액</Text>
          </View>
          <Text style={styles.amountValue}>16,990원</Text>
        </View>

        <View style={styles.searchSection}>
          <TouchableOpacity style={styles.searchContainer} onPress={onSearchPress}>
            <Search size={20} color="#6F7785" />
            <Text style={styles.searchPlaceholder}>가맹점 검색하기</Text>
          </TouchableOpacity>
          
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <Image source={category.image} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.storeSection}>
          <Text style={styles.sectionTitle}>내가 자주 이용하는 가맹점</Text>
          {favoriteStores.map((store: Store) => (
            <TouchableOpacity 
              key={store.id} 
              style={styles.storeItem}
              onPress={() => onStorePress?.({ 
                id: store.id, 
                name: store.name, 
                address: '경기도 역곡시 용산동 32-1',
                distance: store.distance 
              })}
            >
              <Image 
                source={store.image} 
                style={styles.storeImage}
                resizeMode="cover"
              />
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>{store.name}</Text>
                <Text style={styles.storeDistance}>{store.distance}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.adContainer}>
          <Image 
            source={require('../assets/images/ad.png')} 
            style={styles.adImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.popularSectionTitle}>나와 가까운 가맹점</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#6F7785" />
              <Text style={styles.locationText}>부천시 관악구</Text>
            </View>
          </View>
          {favoriteStores.map((store: Store) => (
            <TouchableOpacity key={store.id} style={styles.storeItem}>
              <Image 
                source={store.image} 
                style={styles.storeImage}
                resizeMode="cover"
              />
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>{store.name}</Text>
                <Text style={styles.storeDistance}>{store.distance}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.trendingSection}>
          <Text style={styles.trendingSectionTitle}>현재 인기있는 가맹점</Text>
          {popularStores.map((store) => (
            <TouchableOpacity key={store.id} style={styles.trendingStoreItem}>
                             <Image 
                 source={require('../assets/images/mc.jpg')} 
                 style={styles.trendingStoreImage}
                 resizeMode="cover"
               />
              <View style={styles.trendingStoreInfo}>
                <Text style={styles.trendingStoreName}>{store.name}</Text>
                <Text style={styles.trendingStoreSubtitle}>{store.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoSection: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logo: {
    width: 36,
    height: 36,
    aspectRatio: 1,
  },
  headerButton: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
    gap: 8,
    marginBottom: 20,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  buttonContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  buttonSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6F7785',
    lineHeight: 20,
    marginBottom: 4,
  },
  buttonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0D0E0E',
    lineHeight: 24,
  },

  amountCard: {
    backgroundColor: '#FF7049',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  amountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
  },
  searchSection: {
    borderRadius: 12,
    marginBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    marginBottom: 16,
    marginHorizontal: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#6F7785',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryImage: {
    width: 40,
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 0,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 24,
  },
  storeSection: {
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 26,
    marginBottom: 12,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  storeImage: {
    width: 90,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 26,
    marginBottom: 2,
  },
  storeDistance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6F7785',
    lineHeight: 20,
  },

  adContainer: {
    alignSelf: 'stretch',
    marginTop: 10,
    marginBottom: 10,
  },
  adImage: {
    height: 92.5,
    alignSelf: 'stretch',
    aspectRatio: 370.00 / 92.50,
    borderRadius: 16,
  },
  popularSection: {
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 30,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
     locationText: {
     fontSize: 14,
     fontWeight: '500',
     color: '#6F7785',
     lineHeight: 20,
   },
   popularSectionTitle: {
     fontSize: 18,
     fontWeight: '600',
     color: '#000000',
     lineHeight: 26,
   },
   trendingSection: {
     borderRadius: 12,
     marginBottom: 20,
     marginTop: 10,
   },
   trendingSectionTitle: {
     fontSize: 18,
     fontWeight: '600',
     color: '#000000',
     lineHeight: 26,
     marginBottom: 12,
   },
   trendingStoreItem: {
     flexDirection: 'column',
     alignItems: 'flex-start',
     gap: 12,
     alignSelf: 'stretch',
     marginBottom: 20,
     borderRadius: 16,
     overflow: 'hidden',
     backgroundColor: '#ffffff',
   },
   trendingStoreImage: {
     height: 170,
     width: '100%',
     alignSelf: 'stretch',
     borderRadius: 16,
   },
   trendingStoreInfo: {
     alignItems: 'flex-start',
     alignSelf: 'stretch',
   },
   trendingStoreName: {
     fontSize: 17,
     fontWeight: '500',
     color: '#0D0E0E',
     lineHeight: 24,
     marginBottom: 4,
   },
   trendingStoreSubtitle: {
     fontSize: 14,
     fontWeight: '500',
     color: '#6F7785',
     lineHeight: 20,
   },
});