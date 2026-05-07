import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import { getApiBaseUrl } from '../../constants/api';

export default function MyReportsScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete the old useEffect and paste this:
  useFocusEffect(
    useCallback(() => {
      fetchMyReports(); // Make sure this matches your function name!
    }, [])
  );

  const fetchMyReports = async () => {
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
        <Text style={styles.headerSubtitle}>Track your submitted reports</Text>
      </View>

      {/* Filters (Visual only for now) */}
      <View style={styles.filterContainer}>
        <Ionicons name="filter" size={20} color="gray" style={{marginRight: 10}} />
        <TouchableOpacity style={[styles.filterPill, styles.activePill]}>
          <Text style={styles.activePillText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.pillText}>Pending</Text>
        </TouchableOpacity>
      </View>

      {/* Reports List */}
      <ScrollView style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#1d3557" style={{ marginTop: 50 }} />
        ) : reports.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 50, color: 'gray' }}>No reports found.</Text>
        ) : (
          reports.map((report, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{report.description || "Civic Issue Reported"}</Text>
                <Text style={styles.cardCategory}>{report.category}</Text>
                <Text style={styles.cardLocation}>
                  <Ionicons name="location-outline" size={12} /> {report.location || "Location saved"}
                </Text>
              </View>
              <View style={[
                styles.badge, 
                report.status === 'Resolved' ? styles.badgeResolved : 
                report.status === 'In Progress' ? styles.badgeInProgress : 
                styles.badgePending
              ]}>
                <Text style={[
                  styles.badgeText, 
                  report.status === 'Pending' ? {color: '#e63946'} : {color: '#1d3557'}
                ]}>
                  {report.status}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { backgroundColor: '#1d3557', padding: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#a8b2c1', fontSize: 14 },
  filterContainer: { flexDirection: 'row', padding: 15, alignItems: 'center', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
  filterPill: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1faee', marginRight: 10 },
  activePill: { backgroundColor: '#1d3557' },
  pillText: { color: 'gray', fontWeight: 'bold' },
  activePillText: { color: 'white', fontWeight: 'bold' },
  listContainer: { padding: 15 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardCategory: { fontSize: 13, color: 'gray', marginVertical: 3 },
  cardLocation: { fontSize: 12, color: 'gray' },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  badgeResolved: { backgroundColor: '#2a9d8f' },
  badgeInProgress: { backgroundColor: '#e2eafc' },
  badgePending: { backgroundColor: '#ffe5d9' },
  badgeText: { fontSize: 12, fontWeight: 'bold' }
});