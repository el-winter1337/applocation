import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { getApiBaseUrl } from '../constants/api';
import { saveUserId } from '../utils/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${getApiBaseUrl()}/api/auth/login`, { email, password });
      if (res.data.success) {
        await saveUserId(res.data.user._id);
        setErrorMessage('');
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={32} color="#1d3557" />
        </View>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>Sign in to continue reporting</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="gray" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="gray" style={styles.inputIconRight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or continue with</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signUpContainer} onPress={() => router.push('/signup')}>
        <Text style={styles.noAccountText}>
          Don&apos;t have an account? <Text style={styles.signUpText}>Sign Up</Text>
        </Text>
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
  inputIconRight: { marginLeft: 10 },
  input: { flex: 1, height: '100%' },
  forgotText: { color: '#1d3557', textAlign: 'left', marginTop: 15, marginBottom: 20, fontSize: 13, fontWeight: '500' },
  signInButton: { backgroundColor: '#1d3557', paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  signInText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#b91c1c', fontSize: 13, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  line: { flex: 1, height: 1, backgroundColor: '#eee' },
  orText: { marginHorizontal: 10, color: 'gray', fontSize: 13 },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ddd', paddingVertical: 14, borderRadius: 8 },
  googleText: { marginLeft: 10, fontSize: 15, fontWeight: '600', color: '#333' },
  signUpContainer: { backgroundColor: 'white', paddingBottom: 40, alignItems: 'center' },
  noAccountText: { color: 'gray', fontSize: 14 },
  signUpText: { color: '#1d3557', fontWeight: 'bold' },
});
