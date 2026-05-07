import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import { getApiBaseUrl } from '../../constants/api';

export default function ReportScreen() {
  const mapRef = useRef<MapView>(null);
  
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [locationName, setLocationName] = useState(''); 
  const [description, setDescription] = useState('');
  // Add these right after description state
  const [ward, setWard] = useState('Ward 1');
  const wardsList = Array.from({ length: 32 }, (_, i) => `Ward ${i + 1}`);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingGPS, setIsGettingGPS] = useState(false);

  const [mapRegion, setMapRegion] = useState<any>({
    latitude: 27.7172,
    longitude: 85.3240,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  // --- REVERSE GEOCODING (With Garbage Link Filter) ---
  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      if (geocode.length > 0) {
        const place = geocode[0];
        // Filter out URLs and "Unnamed" roads to keep the address clean for the Admin Portal
        const addressParts = [place.name, place.street, place.subregion, place.city]
          .filter(Boolean)
          .filter(part => !String(part).includes('http'))
          .filter(part => !String(part).includes('Unnamed'));
          
        const uniqueAddress = [...new Set(addressParts)].join(', ');
        setLocationName(uniqueAddress || `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
      } else {
        setLocationName(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
      }
    } catch (err) {
      setLocationName(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
    }
  };

  // --- DOUBLE-ENGINE SEARCH ---
  const searchMapByText = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    let foundLat = null;
    let foundLon = null;
    let foundName = "";

    try {
      // 1. Try Native Geocoder first
      try {
        const nativeResult = await Location.geocodeAsync(searchQuery);
        if (nativeResult.length > 0) {
          foundLat = nativeResult[0].latitude;
          foundLon = nativeResult[0].longitude;
          foundName = searchQuery; 
        }
      } catch (e) { /* Fallback to OSM */ }

      // 2. Fallback to OpenStreetMap if Native fails
      if (!foundLat) {
        const osmResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}, Nepal&limit=1`, 
          { headers: { 'User-Agent': 'HamroAwaaz-FYP-App' } }
        );
        if (osmResponse.data && osmResponse.data.length > 0) {
          foundLat = parseFloat(osmResponse.data[0].lat);
          foundLon = parseFloat(osmResponse.data[0].lon);
          foundName = osmResponse.data[0].display_name.split(',').slice(0, 3).join(',');
        }
      }

      // 3. Move map if found
      if (foundLat && foundLon) {
        const newRegion = { latitude: foundLat, longitude: foundLon, latitudeDelta: 0.005, longitudeDelta: 0.005 };
        mapRef.current?.animateToRegion(newRegion, 1000);
        setMapRegion(newRegion);
        setLocationName(foundName);
      } else {
        alert(`Could not find "${searchQuery}". Try a specific location like "Koteshwor".`);
      }
    } catch (error) { 
      alert("Search failed. Check your connection."); 
    }
    setIsSearching(false);
  };

  // --- GPS BUTTON ---
  const getLocation = async () => {
    setIsGettingGPS(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { alert('Need location access!'); setIsGettingGPS(false); return; }
    
    const curLoc = await Location.getCurrentPositionAsync({});
    const newRegion = { 
        latitude: curLoc.coords.latitude, 
        longitude: curLoc.coords.longitude, 
        latitudeDelta: 0.005, 
        longitudeDelta: 0.005 
    };
    
    mapRef.current?.animateToRegion(newRegion, 1000);
    setMapRegion(newRegion);
    await fetchAddress(newRegion.latitude, newRegion.longitude); 
    setIsGettingGPS(false);
  };

  const selectCategory = (cat: string) => { setCategory(cat); setStep(2); };
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled) { setImage(result.assets[0].uri); setStep(3); }
  };
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!result.canceled) { setImage(result.assets[0].uri); setStep(3); }
  };
  
  const deleteImage = () => { setImage(null); setStep(2); };
  
  const resetForm = () => {
    setStep(1); setCategory(''); setImage(null); setLocationName('');
    setMapRegion({ latitude: 27.7172, longitude: 85.3240, latitudeDelta: 0.005, longitudeDelta: 0.005 });
    setDescription(''); setSearchQuery('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const locationName = await handleLocation();
      const submitUrl = `${getApiBaseUrl()}/api/reports/submit`;
      console.log('📤 Submitting to:', submitUrl);

      const formData = new FormData();

      // Add text data
      formData.append('category', category);
      formData.append('description', description);
      formData.append('location', locationName || 'Unknown Location');
      formData.append('ward', ward);
      formData.append('username', 'test_user');
      formData.append('latitude', mapRegion.latitude.toString());
      formData.append('longitude', mapRegion.longitude.toString());

      // Add image if present
      if (image) {
        const filename = image.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('photo', {
          uri: image,
          name: filename,
          type: type,
        } as any);
      }

      const response = await axios.post(submitUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true',
        },
        timeout: 10000
      });
      console.log('✅ Report submitted:', response.data);
      alert('✅ Report submitted successfully!');
      resetForm();
      router.push('/');
    } catch (error: any) {
      console.error('❌ Error submitting report:');
      if (error.response) {
        console.error('Server error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Network error - check backend URL:', error.config?.url);
      } else {
        console.error('Error:', error.message);
      }
      alert('❌ Failed to submit the report. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const place = address[0];
        return `${place.name || ''} ${place.street || ''}, ${place.city || ''}`.trim();
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }

    return 'Unknown Location';
  };

  // --- UI RENDER STEPS ---
  if (step === 1) return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report an Issue</Text>
        <Text style={styles.headerSubtitle}>Select the type of problem you want to report</Text>
      </View>
      <View style={styles.content}>
        <CategoryCard title="Waste" icon="trash-outline" color="#2a9d8f" onPress={() => selectCategory("Waste")} />
        <CategoryCard title="Road Damage" icon="warning-outline" color="#e63946" onPress={() => selectCategory("Road Damage")} />
        <CategoryCard title="Streetlight" icon="bulb-outline" color="#f4a261" onPress={() => selectCategory("Streetlight")} />
        <CategoryCard title="Drainage" icon="water-outline" color="#457b9d" onPress={() => selectCategory("Drainage")} />
        <CategoryCard title="Other" icon="alert-circle-outline" color="gray" onPress={() => selectCategory("Other")} />
      </View>
    </ScrollView>
  );

  if (step === 2) return (
    <View style={[styles.container, {backgroundColor: '#0d1b2a'}]}>
        <View style={styles.centerContent}>
            <Ionicons name="camera-outline" size={80} color="#a8b2c1" />
            <Text style={{color: 'white', fontSize: 18, marginTop: 20}}>Add Photo Evidence</Text>
        </View>
        <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={takePhoto}><Text style={styles.actionButtonText}>Open Camera</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#457b9d', marginTop: 10}]} onPress={pickFromGallery}><Text style={styles.actionButtonText}>Choose from Gallery</Text></TouchableOpacity>
        </View>
    </View>
  );

  if (step === 3) return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Type a location (e.g. Kathmandu)" 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          onSubmitEditing={searchMapByText} 
        />
        <TouchableOpacity onPress={searchMapByText} style={styles.searchButton}>
          {isSearching ? <ActivityIndicator color="white" size="small" /> : <Ionicons name="search" size={20} color="white" />}
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <MapView 
          ref={mapRef}
          style={{flex: 1}} 
          initialRegion={mapRegion}
          onRegionChangeComplete={(reg) => {
            setMapRegion(reg);
            fetchAddress(reg.latitude, reg.longitude);
          }}
        >
          <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} />
        </MapView>

        <TouchableOpacity style={styles.gpsButton} onPress={getLocation}>
           {isGettingGPS ? <ActivityIndicator color="#1d3557" /> : <Ionicons name="locate" size={24} color="#1d3557" />}
        </TouchableOpacity>
      </View>

      <View style={[styles.locationCard, { paddingBottom: 110 }]}>
        <Text style={{fontWeight: 'bold', fontSize: 16, color: '#1d3557'}}>Current Location:</Text>
        <Text numberOfLines={2} style={styles.addressText}>{locationName || "Detecting address..."}</Text>
        
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#2a9d8f', marginTop: 10}]} onPress={() => setStep(4)}>
            <Text style={styles.actionButtonText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (step === 4) return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSmall}><Text style={styles.headerTitleSmall}>Review & Submit</Text></View>
      <View style={styles.content}>
        
        <Text style={styles.label}>Photo Attached</Text>
        <View style={styles.imagePreviewContainer}>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            <TouchableOpacity style={styles.deleteBadge} onPress={deleteImage}>
                <Ionicons name="trash" size={16} color="white" />
                <Text style={{color: 'white', marginLeft: 5, fontSize: 12}}>Remove</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.label}>Category</Text>
        <View style={styles.infoBox}><Text style={styles.infoValue}>{category}</Text></View>
{/* --- THE NEW "CHANGE LOCATION" FEATURE --- */}
        <View style={styles.labelRow}>
            <Text style={styles.label}>Location Address</Text>
            <TouchableOpacity onPress={() => setStep(3)}>
                <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.infoBox}>
            <Text style={styles.infoValue}>{locationName}</Text>
        </View>

        {/* 🚀 THE NEW WARD PICKER GOES RIGHT HERE */}
        <Text style={[styles.label, { marginTop: 15, marginBottom: 8 }]}>Select Your Ward</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#f9f9f9', overflow: 'hidden', marginBottom: 15 }}>
            <Picker
                selectedValue={ward}
                onValueChange={(itemValue) => setWard(itemValue)}
                style={{ height: 50, width: '100%' }}
            >
                {wardsList.map((w) => (
                    <Picker.Item key={w} label={w} value={w} />
                ))}
            </Picker>
        </View>
        {/* ------------------------------------------ */}

        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput 
          style={styles.textArea} 
          placeholder="Explain the issue in detail..." 
          multiline 
          value={description} 
          onChangeText={setDescription} 
        />

        <TouchableOpacity style={[styles.actionButton, {marginTop: 30, marginBottom: 100}]} onPress={handleSubmit}>
            {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.actionButtonText}>Submit Report</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (step === 5) return (
    <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={100} color="#2a9d8f" />
        <Text style={[styles.headerTitle, {color: '#1d3557', marginTop: 10}]}>Submitted!</Text>
        <TouchableOpacity style={[styles.actionButton, {marginTop: 30, width: '80%'}]} onPress={() => { resetForm(); router.replace('/(tabs)/home'); }}>
            <Text style={styles.actionButtonText}>Back to Home</Text>
        </TouchableOpacity>
    </View>
  );
}

const CategoryCard = ({title, icon, color, onPress}: any) => (
  <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
    <View style={[styles.catIconBg, {backgroundColor: color + '15'}]}><Ionicons name={icon} size={24} color={color} /></View>
    <View style={{flex: 1, marginLeft: 15}}><Text style={{fontWeight: 'bold', color: '#333'}}>{title}</Text></View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: { backgroundColor: '#1d3557', padding: 25, paddingTop: 60, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#a8b2c1', fontSize: 13, marginTop: 5 },
  content: { padding: 20 },
  label: { fontWeight: 'bold', color: '#1d3557', marginTop: 15, marginBottom: 5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15, marginBottom: 5 },
  changeText: { color: '#2a9d8f', fontWeight: 'bold', fontSize: 14, marginBottom: 5 },
  categoryCard: { backgroundColor: 'white', flexDirection: 'row', padding: 18, borderRadius: 12, marginBottom: 12, alignItems: 'center', elevation: 2 },
  catIconBg: { width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actionButton: { backgroundColor: '#1d3557', padding: 16, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  searchContainer: { flexDirection: 'row', padding: 10, paddingTop: 50, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchInput: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 8, padding: 12, fontSize: 16 },
  searchButton: { backgroundColor: '#1d3557', padding: 12, borderRadius: 8, marginLeft: 8 },
  gpsButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: 'white', padding: 15, borderRadius: 30, elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5 },
  locationCard: { padding: 20, backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  addressText: { color: '#666', fontSize: 14, marginVertical: 8, lineHeight: 20 },
  imagePreviewContainer: { position: 'relative', width: '100%', height: 220, borderRadius: 12, overflow: 'hidden', backgroundColor: '#eee', marginBottom: 5 },
  previewImage: { width: '100%', height: '100%' },
  deleteBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(230, 57, 70, 0.9)', padding: 8, borderRadius: 6, flexDirection: 'row', alignItems: 'center' },
  infoBox: { backgroundColor: 'white', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#eee' },
  infoValue: { fontSize: 14, color: '#444' },
  textArea: { backgroundColor: 'white', padding: 15, borderRadius: 10, height: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: '#eee' },
  headerSmall: { backgroundColor: '#1d3557', padding: 20, paddingTop: 50 },
  headerTitleSmall: { color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 18 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomButtons: { padding: 25, paddingBottom: 100 }
});