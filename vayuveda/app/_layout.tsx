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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="home"
              size={24}
              color={focused ? "#2E7D32" : "#757575"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
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
      <Tabs.Screen
        name="stats"
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