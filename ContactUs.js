import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; // <-- Pinalitan ang import na ito
import { useFonts } from 'expo-font';

import Sidebar from './Sidebar';
import MapView, { Marker } from 'react-native-maps';

// 🔑 Firebase imports
import { getAuth } from "firebase/auth";
import { db } from './firebase';
import { collection, setDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';

export default function ContactUs({ navigation }) {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay: require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
  });
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // State for form data and submission status
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Auto-fill name & email of logged-in user from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFormData(prev => ({
              ...prev,
              name: data.fullName || "",
              email: user.email || ""
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              name: "",
              email: user.email || ""
            }));
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setFormData(prev => ({
            ...prev,
            email: user.email || ""
          }));
        }
      }
    };

    fetchUserData();
  }, []);

  const openGoogleMaps = () => {
    const address = 'P4HJ+9MC, Dao St, Rodriguez (Montalban), 1860 Rizal';
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });
    
    Linking.openURL(url).catch(err => 
      console.error('An error occurred opening Google Maps: ', err)
    );
  };

  // Form submission handler
  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be logged in to send a message.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save inquiry with random doc ID
      await setDoc(doc(collection(db, "inquiries")), {
        userId: user.uid,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        timestamp: serverTimestamp(),
        status: "new"
      });

      Alert.alert('Success', 'Your message has been sent successfully!');
      setFormData(prev => ({ ...prev, message: '' })); // reset only message
    } catch (error) {
      console.error("Error writing document: ", error);
      Alert.alert('Error', 'There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Sidebar 
        isVisible={sidebarVisible} 
        setVisible={setSidebarVisible} 
        navigation={navigation} 
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.burgerButton}>
              <Ionicons name="menu" size={28} color="#222" />
            </TouchableOpacity>
            <Text style={styles.header}>Contact Us</Text>
          </View>

          <View style={styles.goldLine} />

          {/* Contact Form */}
          <View style={styles.formCard}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Your Name" 
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              editable={!isSubmitting}
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              editable={!isSubmitting}
            />

            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Type your message here"
              placeholderTextColor="#999"
              multiline
              numberOfLines={5}
              value={formData.message}
              onChangeText={(text) => setFormData({...formData, message: text})}
              editable={!isSubmitting}
            />

            <TouchableOpacity 
              style={[styles.button, isSubmitting && styles.buttonDisabled]} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>How to Reach Us</Text>
            <Text style={styles.infoText}>
              We're here to help! Whether you have questions about reservations, facilities, or special requests, feel free to contact Don Elmer's Inn and Resort using the information below.
            </Text>

            <View style={styles.sectionRow}>
              <Ionicons name="call" size={20} color="#FFD700" style={styles.icon} />
              <Text style={styles.sectionHeader}>Call Us</Text>
            </View>
            <Text style={styles.infoText}>Mobile: (09) 123 456 7890 (Smart)</Text>
            <Text style={styles.infoText}>Mobile: (09) 987 654 3210 (Globe)</Text>
            <Text style={styles.infoText}>Landline: (02) 8123 4567</Text>

            <View style={styles.sectionRow}>
              <Ionicons name="mail" size={20} color="#FFD700" style={styles.icon} />
              <Text style={styles.sectionHeader}>Email Us</Text>
            </View>
            <Text style={styles.infoText}>info@donelmers.com</Text>
            <Text style={styles.infoText}>reservations@donelmers.com</Text>

            <View style={styles.sectionRow}>
              <Ionicons name="location" size={20} color="#FFD700" style={styles.icon} />
              <Text style={styles.sectionHeader}>Visit Us</Text>
            </View>
            <Text style={styles.infoText}>P4HJ+9MC, Dao St, Rodriguez (Montalban), 1860 Rizal</Text>
            
            <TouchableOpacity onPress={openGoogleMaps}>
              <Text style={[styles.infoText, styles.linkText]}>View on Google Maps</Text>
            </TouchableOpacity>

            <View style={styles.sectionRow}>
              <Ionicons name="time" size={20} color="#FFD700" style={styles.icon} />
              <Text style={styles.sectionHeader}>Operating Hours</Text>
            </View>
            <Text style={styles.infoText}>Front Desk: 24/7</Text>
            <Text style={styles.infoText}>Pool Area: 7:00 AM - 5:00 PM Daily</Text>

            <View style={styles.sectionRow}>
              <FontAwesome name="facebook" size={20} color="#FFD700" style={styles.icon} />
              <Text style={styles.sectionHeader}>Follow Us</Text>
            </View>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome name="facebook-square" size={30} color="#777" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome name="instagram" size={30} color="#777" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Map Section */}
          <View style={styles.mapCard}>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                    latitude: 14.7570457,
                    longitude: 121.1394541,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                    }}
                >
                    <Marker
                    coordinate={{ latitude: 14.7570457, longitude: 121.1394541 }}
                    title="Don Elmer's Inn and Resort"
                    description="P4HJ+9MC, Dao St, Rodriguez (Montalban), 1860 Rizal"
                    />
                </MapView>
            </View>
            <Text style={styles.locationNote}>
              Our exact location: P4HJ+9MC, Dao St, Rodriguez (Montalban), 1860 Rizal
            </Text>
          </View>

          <Text style={styles.footerText}>
            © 2025 Don Elmer's Inn and Resort. All rights reserved.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingVertical: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  burgerButton: {
    marginRight: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: '600',
    color: '#222',
    fontFamily: 'PlayfairDisplay',
    flex: 1,
    textAlign: 'center',
    marginRight: 34,
  },
  goldLine: {
    height: 4,
    width: 80,
    backgroundColor: '#C8A951',
    alignSelf: 'center',
    marginBottom: 35,
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 14,
    padding: 14,
    marginBottom: 22,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fdfdfd',
  },
  textArea: {
    height: 130,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#C8A951',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#34495e',
  },
  infoText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },
  // Add this new style for the clickable link
  linkText: {
    color: '#1a73e8',
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C8A951',
    marginTop: 14,
    marginBottom: 4,
  },
  socialIcons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  socialIcon: {
    marginRight: 16,
  },
  icon: {
    marginRight: 12,
  },
  iconYellow: {
    color: '#C8A951',
    marginRight: 10,
  },
  socialIconGray: {
    color: '#999',
    fontSize: 22,
    marginRight: 16,
  },
  mapCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 16,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapContainer: {
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
  locationNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  footerText: {
    marginTop: 35,
    fontSize: 13,
    textAlign: 'center',
    color: '#aaa',
    fontStyle: 'italic',
  },
});