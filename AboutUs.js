//AboutUs.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import Sidebar from './Sidebar'; // Import the Sidebar component

export default function AboutUs({ navigation }) {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay: require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
  });
  const [sidebarVisible, setSidebarVisible] = useState(false); // Add state for sidebar

  if (!fontsLoaded) return null;

  const whyChooseItems = [
    {
      icon: <MaterialCommunityIcons name="leaf" size={20} color="#d4af37" style={{ marginRight: 10 }} />,
      text: "Proximity to Nature: Strategically located amidst lush greenery, offering a peaceful ambiance away from city noise.",
    },
    {
      icon: <Ionicons name="bed-outline" size={20} color="#d4af37" style={{ marginRight: 10 }} />,
      text: "Versatile Accommodations: From cozy rooms to spacious cottages and exclusive whole resort rentals, we cater to all types of travelers and groups.",
    },
    {
      icon: <MaterialCommunityIcons name="pool" size={20} color="#d4af37" style={{ marginRight: 10 }} />,
      text: "Family-Friendly Amenities: Our pristine swimming pools, including a dedicated kiddie pool, are perfect for family fun and relaxation.",
    },
    {
      icon: <FontAwesome5 name="hands-helping" size={20} color="#d4af37" style={{ marginRight: 10 }} />,
      text: "Genuine Hospitality: Our dedicated team is committed to providing warm, personalized service to make your stay truly special.",
    },
    {
      icon: <Ionicons name="calendar-outline" size={20} color="#d4af37" style={{ marginRight: 10 }} />,
      text: "Ideal for Events: With flexible spaces, Don Elmer's is also a perfect venue for intimate gatherings, celebrations, and corporate events.",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Sidebar Component */}
      <Sidebar 
        isVisible={sidebarVisible} 
        setVisible={setSidebarVisible} 
        navigation={navigation} 
      />
      
      <View style={styles.navbar}>
        {/* Changed to use state instead of navigation.openDrawer */}
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Don Elmer's Resort</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>More Than Just a Stay, It's an Experience</Text>
        <View style={styles.goldLine} />
        <Text style={styles.paragraph}>
          Nestled in the serene landscapes of Rodriguez (Montalban), Rizal, Don Elmer's Inn and Resort is your perfect escape from the bustling city life. Established with a passion for hospitality and a deep appreciation for nature, we offer a tranquil haven where guests can unwind, reconnect, and create lasting memories. From our refreshing pools to our cozy accommodations, every detail is crafted to ensure a memorable stay.
        </Text>
        <Text style={styles.paragraph}>
          Here at Don Elmer's, we believe in providing a personalized and warm experience. Whether you're seeking a quiet family getaway, a fun-filled barkada adventure, or a serene venue for special occasions, our resort offers a unique blend of comfort, convenience, and natural beauty. We pride ourselves on our friendly staff, well-maintained facilities, and commitment to genuine Filipino hospitality.
        </Text>

        <Image
          source={{ uri: 'https://i.imgur.com/UYiroysl.jpg' }}
          style={styles.image}
        />

        <Text style={styles.heading}>Our Humble Beginnings</Text>
        <View style={styles.goldLine} />
        <Text style={styles.paragraph}>
          Don Elmer's Inn and Resort began as a cherished family dream in 2005. What started as a modest private property eventually blossomed into a welcoming retreat, built from the ground up with dedication and love. The founder envisioned a place where families and friends could gather, relax, and enjoy the simple joys of nature away from the city's hustle and bustle.
        </Text>
        <Text style={styles.paragraph}>
          Over the years, Don Elmer's has evolved, adding more comfortable accommodations, expanding our pool areas, and enhancing our services to meet the growing needs of our beloved guests. Despite our growth, our core values remain the same: to provide a comforting home away from home and a memorable experience for everyone who walks through our doors.
        </Text>

        <Image
          source={{ uri: 'https://i.imgur.com/UYiroysl.jpg' }}
          style={styles.image}
        />

        <Text style={styles.heading}>Our Commitment</Text>
        <View style={styles.goldLine} />

        <View style={styles.commitmentRow}>
          <View style={styles.commitmentBox}>
            <Text style={styles.commitmentTitle}>Our Mission</Text>
            <Text style={styles.commitmentDesc}>
              To provide an exceptional and memorable resort experience, offering comfortable accommodations, refreshing amenities, and heartfelt Filipino hospitality, ensuring every guest feels valued and relaxed.
            </Text>
          </View>
          <View style={styles.commitmentBox}>
            <Text style={styles.commitmentTitle}>Our Vision</Text>
            <Text style={styles.commitmentDesc}>
              To be the preferred choice for family getaways and special events in Rizal, renowned for our serene environment, quality service, and unwavering dedication to guest satisfaction.
            </Text>
          </View>
        </View>

        <Text style={styles.heading}>Why Choose Don Elmer's?</Text>
        <View style={styles.goldLine} />

        {whyChooseItems.map((item, index) => (
          <View key={index} style={styles.iconTextRow}>
            {item.icon}
            <Text style={styles.sectionDesc}>{item.text}</Text>
          </View>
        ))}

        {/* Footer */}
        <Text style={styles.footerText}>© 2025 Don Elmer's Inn and Resort. All rights reserved</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  navTitle: {
    marginLeft: 15,
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'PlayfairDisplay',
    color: '#333',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    fontWeight: '600',
    fontFamily: 'PlayfairDisplay',
    marginTop: 25,
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  goldLine: {
    height: 4,
    width: 80,
    backgroundColor: '#C8A951',
    alignSelf: 'center',
    marginBottom: 35,
    borderRadius: 2,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 12,
    color: '#444',
    textAlign: 'justify',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  commitmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  commitmentBox: {
    width: '48%',
    backgroundColor: '#f8f4e3',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#d4af37',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  commitmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#b8860b',
    textAlign: 'center',
  },
  commitmentDesc: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
    paddingHorizontal: 5,
  },
  sectionDesc: {
    flex: 1,
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  footerText: {
    marginTop: 35,
    fontSize: 13,
    textAlign: 'center',
    color: '#aaa',
    fontStyle: 'italic',
  },
});