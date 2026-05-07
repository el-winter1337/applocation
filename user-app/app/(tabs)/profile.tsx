import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import axios from 'axios';
import { getApiBaseUrl } from '../../constants/api';


export default function ProfileScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-refresh the data every time the user taps on the Profile tab
  useFocusEffect(
    useCallback(() => {
      fetchMyStats();
    }, [])
  );

  const fetchMyStats = async () => {
    try {
      const url = `${getApiBaseUrl()}/api/reports/all`;
      const response = await axios.get(url, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      setReports(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate the live stats from the database
  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
  const pendingReports = reports.filter(r => r.status === 'Pending').length;

  const handleLogout = () => {
    router.replace('/');
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Edit Profile' },
    { icon: 'notifications-outline', title: 'Notifications' },
    { icon: 'location-outline', title: 'Saved Locations' },
    { icon: 'settings-outline', title: 'Settings' },
    { icon: 'help-circle-outline', title: 'Help & Support' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Top Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={40} color="#1d3557" />
        </View>
        <Text style={styles.userName}>Test User</Text>
        <Text style={styles.userEmail}>user@hamroawaaz.com</Text>
      </View>

      {/* User Stats Row (Now dynamic!) */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="document-text" size={24} color="#457b9d" />
          {loading ? (
             <ActivityIndicator size="small" color="#457b9d" style={{marginVertical: 5}} />
          ) : (
             <Text style={styles.statBoxNumber}>{totalReports}</Text>
          )}
          <Text style={styles.statBoxLabel}>Total Reports</Text>
        </View>
        
        <View style={styles.statBox}>
          <Ionicons name="checkmark-circle" size={24} color="#2a9d8f" />
          {loading ? (
             <ActivityIndicator size="small" color="#2a9d8f" style={{marginVertical: 5}} />
          ) : (
             <Text style={styles.statBoxNumber}>{resolvedReports}</Text>
          )}
          <Text style={styles.statBoxLabel}>Resolved</Text>
        </View>
        
        <View style={styles.statBox}>
          <Ionicons name="time" size={24} color="#e63946" />
          {loading ? (
             <ActivityIndicator size="small" color="#e63946" style={{marginVertical: 5}} />
          ) : (
             <Text style={styles.statBoxNumber}>{pendingReports}</Text>
          )}
          <Text style={styles.statBoxLabel}>Pending</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon as any} size={22} color="gray" style={{marginRight: 15}} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#e63946" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>HamroAwaaz v1.0.0{"\n"}Making your city better, together</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { backgroundColor: '#1d3557', alignItems: 'center', paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  avatarPlaceholder: { width: 80, height: 80, backgroundColor: 'white', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  userName: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  userEmail: { color: '#a8b2c1', fontSize: 14, marginTop: 5 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 15, marginTop: -20 },
  statBox: { flex: 1, backgroundColor: 'white', padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  statBoxNumber: { fontSize: 20, fontWeight: 'bold', color: '#1d3557', marginVertical: 5 },
  statBoxLabel: { fontSize: 11, color: 'gray' },
  menuContainer: { backgroundColor: 'white', marginTop: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { fontSize: 16, color: '#333' },
  logoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginTop: 20, padding: 18, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' },
  logoutText: { color: '#e63946', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  versionText: { textAlign: 'center', color: 'gray', fontSize: 12, marginTop: 30, marginBottom: 40 }
});