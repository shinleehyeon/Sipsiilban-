import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { 
  Settings, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight 
} from 'lucide-react-native';
import ProfileImage from '../components/ProfileImage';

export default function ProfileScreen() {
  const menuItems = [
    {
      id: 3,
      title: '도움말',
      icon: <HelpCircle size={20} color="#6F7785" />,
      onPress: () => console.log('도움말'),
    },
    {
      id: 4,
      title: '설정',
      icon: <Settings size={20} color="#6F7785" />,
      onPress: () => console.log('설정'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>  
        <View style={styles.header}>
          <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Image 
            source={require('../assets/firestation.png')} 
            style={styles.fireLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.profileSection}>
          <ProfileImage 
            size={80}
            name="신이현"
            showName={false}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>신이현</Text>
            <Text style={styles.userDepartment}>서울특별시소방재난본부</Text>
            <Text style={styles.userPosition}>소방위</Text>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <CreditCard size={20} color="#ffffff" />
            <Text style={styles.balanceLabel}>현재 사용 가능 금액</Text>
          </View>
          <Text style={styles.balanceAmount}>16,990원</Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuLeft}>
                {item.icon}
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#F87171" />
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
  },
  logo: {
    width: 36,
    height: 36,
  },
  fireLogo: {
    width: 108,
    height: 27.648,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 32,
  },
  userDepartment: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6F7785',
    lineHeight: 22,
  },
  userPosition: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    lineHeight: 20,
  },
  balanceCard: {
    backgroundColor: '#FF7049',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    lineHeight: 20,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 36,
  },
  menuSection: {
    gap: 4,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#F87171',
    lineHeight: 22,
  },
}); 