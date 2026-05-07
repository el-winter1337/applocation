import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HelpScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>How to report an issue?</Text>
        <Text style={styles.cardText}>Go to the 'Report' tab, fill in the details, take a picture of the issue, confirm your location, and submit.</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>How long does it take to resolve?</Text>
        <Text style={styles.cardText}>Depending on the severity, it can take anywhere from 24 hours to a week.</Text>
      </View>
      
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Contact Municipality</Text>
        <Text style={styles.contactText}>Phone: 111-222-3333</Text>
        <Text style={styles.contactText}>Email: support@hamroawaaz.gov.np</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 40 },
  backButton: { marginRight: 15 },
  title: { fontSize: 24, fontWeight: 'bold' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1d3557', marginBottom: 5 },
  cardText: { fontSize: 14, color: '#333', lineHeight: 20 },
  contactSection: { marginTop: 20, padding: 20, backgroundColor: '#eef2f3', borderRadius: 10, alignItems: 'center' },
  contactTitle: { fontSize: 18, fontWeight: 'bold', color: '#1d3557', marginBottom: 10 },
  contactText: { fontSize: 14, color: '#555', marginBottom: 5 }
});
