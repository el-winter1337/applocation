import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1d3557',
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        tabBarItemStyle: { paddingVertical: 8 },
        tabBarStyle: {
          height: 72,
          paddingBottom: 14,
          paddingTop: 8,
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 12,
          borderRadius: 18,
          backgroundColor: '#ffffff',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 12,
          elevation: 8,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-reports"
        options={{
          title: 'My Reports',
          tabBarIcon: ({ color }) => <Ionicons name="list-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
