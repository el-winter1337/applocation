import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { getApiBaseUrl } from '../constants/api';
import { saveUserId } from '../utils/auth';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    try {
      const res = await axios.post(`${getApiBaseUrl()}/api/auth/register`, { name, email, password });
      if (res.data.success) {
        await saveUserId(res.data.user._id);
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to register.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-add" size={32} color="#1d3557" />
        </View>
        <Text style={styles.welcomeText}>Create Account</Text>
        <Text style={styles.subText}>Join HamroAwaaz to start reporting</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="gray" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="John Doe" value={name} onChangeText={setName} />
        </View>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="gray" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="your.email@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="Create a password" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" style={styles.inputIconRight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={handleSignup}>
          <Text style={styles.signInText}>Sign Up</Text>
        </TouchableOpacity>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>

      <TouchableOpacity style={styles.signUpContainer} onPress={() => router.back()}>
        <Text style={styles.noAccountText}>Already have an account? <Text style={styles.signUpText}>Sign In</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1d3557' },
  topSection: { alignItems: 'center', marginTop: 80, marginBottom: 40 },
  iconContainer: { backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 15 },
  welcomeText: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subText: { color: '#a8b2c1', fontSize: 14 },
  card: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, flex: 1, padding: 25 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, height: 50 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: '100%' },
  signInButton: { backgroundColor: '#1d3557', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  signInText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#b91c1c', fontSize: 13, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  signUpContainer: { backgroundColor: 'white', paddingBottom: 40, alignItems: 'center' },
  noAccountText: { color: 'gray', fontSize: 14 },
  signUpText: { color: '#1d3557', fontWeight: 'bold' },
});
