import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { getApiBaseUrl } from '../constants/api';
import { Ionicons } from '@expo/vector-icons';
import { getUserId } from '../utils/auth';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    getUserId().then(id => {
      axios.get(`${getApiBaseUrl()}/api/notifications/${id}`).then(res => {
        if (res.data.success) setNotifications(res.data.data);
      }).catch(console.error);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>
      
      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={24} color="#457b9d" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
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
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyStateText: { fontSize: 16, color: 'gray', marginTop: 10 },
  notificationCard: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  iconContainer: { marginRight: 15, justifyContent: 'center' },
  textContainer: { flex: 1 },
  notificationTitle: { fontSize: 16, fontWeight: 'bold', color: '#1d3557', marginBottom: 5 },
  notificationMessage: { fontSize: 14, color: '#333', marginBottom: 5 },
  notificationTime: { fontSize: 12, color: 'gray' }
});
