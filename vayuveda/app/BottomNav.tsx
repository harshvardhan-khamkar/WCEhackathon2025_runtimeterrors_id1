import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'home' && styles.navActive]}
        onPress={() => setActiveTab('home')}
      >
        <FontAwesome name="home" size={24} color={activeTab === 'home' ? "#2E7D32" : "#757575"} />
        <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'map' && styles.navActive]}
        onPress={() => setActiveTab('map')}
      >
        <FontAwesome name="map" size={24} color={activeTab === 'map' ? "#2E7D32" : "#757575"} />
        <Text style={[styles.navText, activeTab === 'map' && styles.navTextActive]}>
          Map
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'stats' && styles.navActive]}
        onPress={() => setActiveTab('stats')}
      >
        <FontAwesome name="bar-chart" size={24} color={activeTab === 'stats' ? "#2E7D32" : "#757575"} />
        <Text style={[styles.navText, activeTab === 'stats' && styles.navTextActive]}>
          Stats
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navActive: {
    backgroundColor: '#e8f5e9',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#757575',
  },
  navTextActive: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});

export default BottomNav;