import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { getApiBaseUrl } from '../constants/api';
import { Ionicons } from '@expo/vector-icons';
import { getUserId } from '../utils/auth';

export default function ProfileEditScreen() {
  const [user, setUser] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '',
    ward: '',
    dob: '',
    gender: ''
  });

  useEffect(() => {
    getUserId().then(id => {
      axios.get(`${getApiBaseUrl()}/api/users/${id}`).then(res => {
        if (res.data.success) setUser({
          name: res.data.data.name || '',
          email: res.data.data.email || '',
          phone: res.data.data.phone || '',
          address: res.data.data.address || '',
          ward: res.data.data.ward || '',
          dob: res.data.data.dob || '',
          gender: res.data.data.gender || ''
        });
      }).catch(console.error);
    });
  }, []);

  const handleSave = async () => {
    try {
      const id = await getUserId();
      await axios.put(`${getApiBaseUrl()}/api/users/${id}`, user);
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>
      
      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={user.name} onChangeText={(text) => setUser({...user, name: text})} />
      
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={user.email} onChangeText={(text) => setUser({...user, email: text})} keyboardType="email-address" autoCapitalize="none" />
      
      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} value={user.phone} onChangeText={(text) => setUser({...user, phone: text})} keyboardType="phone-pad" />
      
      <Text style={styles.label}>Address</Text>
      <TextInput style={styles.input} value={user.address} onChangeText={(text) => setUser({...user, address: text})} />

      <Text style={styles.label}>Ward No</Text>
      <TextInput style={styles.input} value={user.ward} onChangeText={(text) => setUser({...user, ward: text})} keyboardType="number-pad" />

      <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={user.dob} onChangeText={(text) => setUser({...user, dob: text})} placeholder="e.g. 1990-01-01" />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.radioGroup}>
        {['Male', 'Female', 'Other'].map((option) => (
          <TouchableOpacity 
            key={option} 
            style={styles.radioButton} 
            onPress={() => setUser({...user, gender: option})}
          >
            <Ionicons 
              name={user.gender === option ? "radio-button-on" : "radio-button-off"} 
              size={24} 
              color={user.gender === option ? "#1d3557" : "gray"} 
            />
            <Text style={styles.radioText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 40 },
  backButton: { marginRight: 15 },
  title: { fontSize: 24, fontWeight: 'bold' },
  label: { fontSize: 14, color: '#333', marginBottom: 5, fontWeight: 'bold' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  radioGroup: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  radioButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', flex: 1, marginHorizontal: 4, justifyContent: 'center' },
  radioText: { marginLeft: 8, fontSize: 14, color: '#333' },
  saveButton: { backgroundColor: '#1d3557', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
