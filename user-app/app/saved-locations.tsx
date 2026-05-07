import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { getApiBaseUrl } from '../constants/api';
import { getUserId } from '../utils/auth';

export default function SavedLocationsScreen() {
  const [user, setUser] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const id = await getUserId();
      const res = await axios.get(`${getApiBaseUrl()}/api/users/${id}`);
      if (res.data.success) {
        setUser(res.data.data);
        setLocations(res.data.data.savedLocations || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLocation = async () => {
    if (!newTitle || !newAddress) {
      Alert.alert('Error', 'Please enter both title and address.');
      return;
    }

    const newLoc = {
      id: Date.now().toString(),
      title: newTitle,
      address: newAddress
    };

    const updatedLocations = [...locations, newLoc];
    setLocations(updatedLocations);
    setNewTitle('');
    setNewAddress('');

    try {
      const id = await getUserId();
      await axios.put(`${getApiBaseUrl()}/api/users/${id}`, { savedLocations: updatedLocations });
    } catch (err) {
      Alert.alert('Error', 'Failed to save location.');
      setLocations(locations); // revert
    }
  };

  const handleRemoveLocation = async (locId: string) => {
    const updatedLocations = locations.filter(loc => loc.id !== locId);
    setLocations(updatedLocations);

    try {
      const id = await getUserId();
      await axios.put(`${getApiBaseUrl()}/api/users/${id}`, { savedLocations: updatedLocations });
    } catch (err) {
      Alert.alert('Error', 'Failed to remove location.');
      setLocations(locations); // revert
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Saved Locations</Text>
      </View>
      
      <View style={styles.addSection}>
        <TextInput 
          style={styles.input} 
          placeholder="Location Title (e.g. Home, Work)" 
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Address or Ward No" 
          value={newAddress}
          onChangeText={setNewAddress}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddLocation}>
          <Text style={styles.addButtonText}>Add Location</Text>
        </TouchableOpacity>
      </View>

      {locations.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="location-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateText}>No saved locations yet</Text>
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.locationCard}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={24} color="#e63946" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.locationTitle}>{item.title}</Text>
                <Text style={styles.locationAddress}>{item.address}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveLocation(item.id)}>
                <Ionicons name="trash-outline" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 40 },
  backButton: { marginRight: 15 },
  title: { fontSize: 24, fontWeight: 'bold' },
  addSection: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  addButton: { backgroundColor: '#1d3557', padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyStateText: { fontSize: 16, color: 'gray', marginTop: 10 },
  locationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  iconContainer: { marginRight: 15 },
  textContainer: { flex: 1 },
  locationTitle: { fontSize: 16, fontWeight: 'bold', color: '#1d3557', marginBottom: 5 },
  locationAddress: { fontSize: 14, color: '#555' }
});
