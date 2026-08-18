import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Home, Map, CreditCard, User } from 'lucide-react-native';

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  const tabs = [
    { key: 'home', label: '홈', Icon: Home },
    { key: 'map', label: '지도', Icon: Map },
    { key: 'history', label: '결제 내역', Icon: CreditCard },
    { key: 'profile', label: '프로필', Icon: User },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const IconComponent = tab.Icon;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
          >
            <IconComponent 
              size={24}
              stroke={activeTab === tab.key ? '#000000' : '#6F7785'}
              strokeWidth={2}
            />
            <Text style={[
              styles.label,
              activeTab === tab.key && styles.activeLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: '#6F7785',
    marginTop: 4,
  },
  activeLabel: {
    color: '#000000',
    fontWeight: '600',
  },
}); 