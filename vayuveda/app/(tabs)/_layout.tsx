import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          elevation: 8,
        },
      }}>
      {/* Map Screen */}
      <Tabs.Screen
        name="map" // Name of the map screen
        options={{
          title: 'Map',
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="map"
              size={24}
              color={focused ? "#2E7D32" : "#757575"}
            />
          ),
        }}
      />

      {/* Stats Screen */}
      <Tabs.Screen
        name="stats" // Name of the stats screen
        options={{
          title: 'Stats',
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="bar-chart"
              size={24}
              color={focused ? "#2E7D32" : "#757575"}
            />
          ),
        }}
      />
    </Tabs>
  );
}