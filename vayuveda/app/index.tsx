import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'HomeScreen' && styles.navActive]}
        onPress={() => setActiveTab('HomeScreen')}
      >
        <FontAwesome name="home" size={24} color={activeTab === 'HomeScreen' ? "#2E7D32" : "#757575"} />
        <Text style={[styles.navText, activeTab === 'HomeScreen' && styles.navTextActive]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'map' && styles.navActive]}
        onPress={() => setActiveTab('map')}
      >
        <FontAwesome name="map" size={24} color={activeTab === 'map' ? "#2E7D32" : "#757575"} />
        <Text style={[styles.navText, activeTab === 'map' && styles.navTextActive]}>Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, activeTab === 'stats' && styles.navActive]}
        onPress={() => setActiveTab('stats')}
      >
        <FontAwesome name="bar-chart" size={24} color={activeTab === 'stats' ? "#2E7D32" : "#757575"} />
        <Text style={[styles.navText, activeTab === 'stats' && styles.navTextActive]}>Stats</Text>
      </TouchableOpacity>
    </View>
  );
};

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('HomeScreen');
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={require('../assets/images/bg_image.png')}
          style={styles.backgroundImage}
        >
          <View style={styles.contentContainer}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.appTitle}>VayuVeda Air Quality</Text>
            <Text style={styles.sloganBold}>Breathe Safe</Text>
            <Text style={styles.slogan}>Stay Informed</Text>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Ensure spacing for content
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  appTitle: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sloganBold: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  slogan: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default SplashScreen;
