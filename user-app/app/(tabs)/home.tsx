import React, { useState, useCallback } from 'react'; // Added useCallback
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router'; // Added useFocusEffect
import axios from 'axios';
import { getApiBaseUrl } from '../../constants/api';

export default function HomeScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete the old useEffect and paste this:
  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [])
  );

  const fetchReports = async () => {
    try {
      const url = `${getApiBaseUrl()}/api/reports/all`;
      console.log('📡 Fetching from:', url);
      const response = await axios.get(url, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        timeout: 5000
      });
      console.log('✅ Reports loaded:', response.data);
      setReports(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error('❌ Error fetching reports:');
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Network error - no response from server. Check if backend is running at:', error.config?.url);
      } else {
        console.error('Error:', error.message);
      }
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate live stats from the database!
  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
  const pendingReports = reports.filter(r => r.status === 'Pending').length;

  return (
    <ScrollView style={styles.container}>
      {/* Top Blue Dashboard Section */}
      <View style={styles.topSection}>
        <Text style={styles.headerTitle}>HamroAwaaz</Text>
        <Text style={styles.headerSubtitle}>Making your city better, together</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{loading ? "-" : totalReports}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{loading ? "-" : resolvedReports}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{loading ? "-" : pendingReports}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Big Report Button */}
        <TouchableOpacity 
          style={styles.reportButton} 
          onPress={() => router.push('/(tabs)/report')}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.reportButtonText}>Report an Issue</Text>
        </TouchableOpacity>

        {/* Nearby Reports Header */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Recent Community Reports</Text>
        </View>

        {/* Show live reports or loading spinner */}
        {loading ? (
          <ActivityIndicator size="large" color="#1d3557" />
        ) : (
          reports.slice(0, 3).map((report, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardIconPlaceholder}>
                 <Ionicons name="alert-circle-outline" size={30} color="#1d3557" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{report.category}</Text>
                <Text style={styles.cardLocation}>
                  <Ionicons name="location-outline" size={12} /> {report.location || "Location saved"}
                </Text>
              </View>
              <View style={[styles.badge, report.status === 'Pending' ? styles.badgePending : styles.badgeInProgress]}>
                <Text style={[styles.badgeText, report.status === 'Pending' ? {color: '#e63946'} : {color: '#1d3557'}]}>
                  {report.status}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  topSection: { backgroundColor: '#1d3557', padding: 20, paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { color: '#a8b2c1', fontSize: 14, marginBottom: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 15, borderRadius: 10, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  statNumber: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  statLabel: { color: '#a8b2c1', fontSize: 12, marginTop: 5 },
  content: { padding: 20 },
  reportButton: { backgroundColor: '#1d3557', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, marginBottom: 25 },
  reportButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1d3557' },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardIconPlaceholder: { width: 50, height: 50, backgroundColor: '#f1faee', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardLocation: { fontSize: 12, color: 'gray', marginTop: 5 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  badgeInProgress: { backgroundColor: '#e2eafc' },
  badgePending: { backgroundColor: '#ffe5d9' },
  badgeText: { fontSize: 12, fontWeight: 'bold' }
});