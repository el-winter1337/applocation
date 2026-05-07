import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [locationTracking, setLocationTracking] = React.useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Push Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Location Services</Text>
        <Switch value={locationTracking} onValueChange={setLocationTracking} />
      </View>

      <TouchableOpacity style={styles.dangerZone}>
        <Text style={styles.dangerZoneText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 40 },
  backButton: { marginRight: 15 },
  title: { fontSize: 24, fontWeight: 'bold' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  settingLabel: { fontSize: 16, color: '#333' },
  dangerZone: { marginTop: 40, alignItems: 'center' },
  dangerZoneText: { color: '#e63946', fontSize: 16, fontWeight: 'bold' }
});
