import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
  RefreshControl,
  TextInput, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import siteData from '../site_ids.json';

const parseCSV = (csvText: string) => {
  const lines = csvText.split("\n").filter((line) => line.trim() !== "");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    return {
      dt_time: values[headers.indexOf("dt_time")] || "Unknown",
      pm25: isNaN(Number(values[headers.indexOf("pm2.5cnc")]))
        ? 0
        : Number(values[headers.indexOf("pm2.5cnc")]),
      pm10: isNaN(Number(values[headers.indexOf("pm10cnc")]))
        ? 0
        : Number(values[headers.indexOf("pm10cnc")]),
    };
  });
};

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSite, setSelectedSite] = useState<{
    site_id: string;
    city: string;
    state: string;
    station_name: string;
    aqiData: { pm25: number; pm10: number; dt_time?: string };
  } | null>(null);
  const [showSiteModal, setShowSiteModal] = useState(false);
  const [cityStations, setCityStations] = useState<{ [key: string]: any[] }>({});

  const [searchQuery, setSearchQuery] = useState('');

  const fetchAirQualityData = useCallback(async (site: { site_id: string; city: string; station_name: string }) => {
    try {
      const response = await axios.get(
        `https://atmos.urbansciences.in/adp/v4/getDeviceDataParam/imei/${site.site_id}/params/pm2.5cnc,pm10cnc/startdate/2025-03-14T00:00/enddate/2025-03-14T00:00/ts/dd/avg/7/api/63h3AckbgtY?gaps=1&gap_value=NaN`
      );
      const parsedData = parseCSV(response.data);
      return parsedData[parsedData.length - 1] || null;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }, []);

  const fetchAllStationsData = useCallback(async () => {
    setLoading(true);
    const groupedStations: { [key: string]: any[] } = {};

    await Promise.all(
      siteData.map(async (site) => {
        if (site.city && !groupedStations[site.city]) {
          groupedStations[site.city] = [];
        }
        const data = await fetchAirQualityData({
          site_id: site.id,
          city: site.city || 'Unknown',
          station_name: site.name,
        });
        if (site.city) {
          groupedStations[site.city].push({
            ...site,
            aqiData: data,
          });
        }
      })
    );

    setCityStations(groupedStations);
    setLoading(false);
    setRefreshing(false);
  }, [fetchAirQualityData]);

  useEffect(() => {
    fetchAllStationsData();
    const interval = setInterval(fetchAllStationsData, 300000);
    return () => clearInterval(interval);
  }, [fetchAllStationsData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllStationsData();
  }, [fetchAllStationsData]);

  const getAQIStatus = (pm25Value: number) => {
    if (pm25Value <= 50) return { text: 'Good', color: '#00C853' };
    if (pm25Value <= 100) return { text: 'Moderate', color: '#FFD600' };
    if (pm25Value <= 150) return { text: 'Unhealthy for Sensitive Groups', color: '#FF9100' };
    if (pm25Value <= 200) return { text: 'Unhealthy', color: '#FF4D4D' };
    return { text: 'Very Unhealthy', color: '#8F3F97' };
  };

  const renderStationCard = ({
    station,
    cityName,
  }: {
    station: {
      site_id: string;
      city: string;
      station_name: string;
      aqiData: { pm25: number; pm10: number; dt_time?: string };
    };
    cityName: string;
  }) => {
    const pm25 = station.aqiData?.pm25 || 0;
    const pm10 = station.aqiData?.pm10 || 0;
    const statusObj = getAQIStatus(pm25);
    const lastUpdated = station.aqiData?.dt_time || 'N/A';
    return (
      <TouchableOpacity
        key={station.site_id}
        style={styles.stationCard}
        onPress={() => {
          setSelectedSite({
            ...station,
            city: station.city || 'Unknown',
            state: 'Unknown',
          });
          setShowSiteModal(true);
        }}
      >

        <View style={styles.cityStatusRow}>
          <Text style={styles.cityName}>{cityName}</Text>
          <View style={[styles.statusContainer, { backgroundColor: statusObj.color }]}>
            <Text style={styles.statusText}>{statusObj.text}</Text>
          </View>
        </View>

        <View style={styles.pollutantContainer}>
          <Text style={styles.pollutantLabel}>PM2.5</Text>
          <Text style={styles.pollutantValue}>
            {pm25.toFixed(1)} µg/m³
          </Text>
          <Text style={styles.pollutantLabel}>PM10</Text>
          <Text style={styles.pollutantValue}>
            {pm10.toFixed(1)} µg/m³
          </Text>
          <Text style={styles.pollutantLabel}>AQI</Text>
          <Text style={styles.pollutantValue}>
            {Math.round(pm25)}
          </Text>
        </View>

        <Text style={styles.lastUpdated}>
          Last updated: {lastUpdated}
        </Text>
      </TouchableOpacity>
    );
  };

  const cityList = Object.keys(cityStations);

  const filteredCities = cityList.filter((cityName) =>
    cityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Real-time Air Quality Monitoring</Text>
      </View>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Location"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item: cityName }) => {
          const stations = cityStations[cityName];
          return (
            <View>
              {stations.map((station) =>
                renderStationCard({ station, cityName })
              )}
            </View>
          );
        }}
      />
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Air Quality Tips</Text>
        <Text style={styles.tipsText}>Wear masks when AQI exceeds 150</Text>
      </View>

      <TouchableOpacity style={styles.fab}>
        <Image
          source={require('../assets/images/plus.png')}
          style={styles.fabIcon}
        />
      </TouchableOpacity>
      <Modal
        visible={showSiteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSiteModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Station Details</Text>
            {selectedSite && (
              <>
                <Text style={styles.modalStation}>{selectedSite.station_name}</Text>
                <Text style={styles.modalCity}>
                  {selectedSite.city}, {selectedSite.state}
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSiteModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  searchBarContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },

  stationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  cityStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pollutantContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pollutantLabel: {
    fontSize: 14,
    color: '#555',
    width: '20%',
  },
  pollutantValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: '25%',
  },
  lastUpdated: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },

  tipsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#555',
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalStation: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalCity: {
    color: '#666666',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});