//Amenities.js
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
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import Sidebar from './Sidebar'; // Import the Sidebar component

export default function Amenities({ navigation }) {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay: require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
  });
  const [sidebarVisible, setSidebarVisible] = useState(false); // Add state for sidebar

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Sidebar Component */}
      <Sidebar 
        isVisible={sidebarVisible} 
        setVisible={setSidebarVisible} 
        navigation={navigation} 
      />
      
      <View style={styles.navbar}>
        {/* Change this to use state instead of navigation.openDrawer */}
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Don Elmer's Resort</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>What Don Elmer's Offers</Text>
        <View style={styles.goldLine} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Swimming Pools</Text>
          <Text style={styles.sectionDesc}>
            Don Elmer's Inn and Resort boasts a beautifully maintained swimming pool area,
            designed for both adults and children to enjoy. Our spacious adult pool offers a
            refreshing dip, while a dedicated kiddie pool provides a safe and fun environment for the little ones.{"\n\n"}
            Surrounded by lush greenery and comfortable lounge chairs, it's the perfect spot
            to relax, sunbathe, or simply unwind.
          </Text>
        </View>

        <Text style={styles.heading}>More Pool Views</Text>
        <View style={styles.goldLine} />
        <View style={styles.poolGrid}>
          <View style={styles.poolBox}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
              style={styles.poolImage}
              resizeMode="cover"
            />
            <Text style={styles.poolLabel}>Kiddie Pool</Text>
            <Text style={styles.poolDesc}>A safe and shallow area for kids to play.</Text>
          </View>
          <View style={styles.poolBox}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
              style={styles.poolImage}
              resizeMode="cover"
            />
            <Text style={styles.poolLabel}>Adult Pool</Text>
            <Text style={styles.poolDesc}>Relax and swim in our spacious adult pool.</Text>
          </View>
          <View style={styles.poolBox}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1' }}
              style={styles.poolImage}
              resizeMode="cover"
            />
            <Text style={styles.poolLabel}>Poolside Lounge</Text>
            <Text style={styles.poolDesc}>Comfortable seating for sunbathing.</Text>
          </View>
          <View style={styles.poolBox}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
              style={styles.poolImage}
              resizeMode="cover"
            />
            <Text style={styles.poolLabel}>Pool at Night</Text>
            <Text style={styles.poolDesc}>Enjoy an evening swim under the stars.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food and Drinks</Text>
          <View style={styles.goldLine} />
          <Text style={styles.sectionDesc}>
            Quench your thirst and satisfy your cravings at our poolside snack bar! We offer a variety of refreshing beverages, light snacks, and delicious meals to keep you energized throughout your stay.{"\n\n"} Enjoy convenient service right by the pool, ensuring you never have to step far from the fun.
          </Text>
          <Text style={[styles.sectionDesc, styles.foodHeading]}>
            Don Elmer's Food and Drinks
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Your styles remain the same...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingHorizontal: 25,
    paddingBottom: 15,
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    zIndex: 10,
  },
  navTitle: {
    marginLeft: 15,
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'PlayfairDisplay',
    color: '#2c3e50',
    letterSpacing: 0.5,
  },
  container: {
    padding: 25,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  goldLine: {
    height: 4,
    width: 100,
    backgroundColor: '#C8A951',
    alignSelf: 'center',
    marginBottom: 35,
    borderRadius: 2,
    shadowColor: '#C8A951',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    fontSize: 26,
    fontWeight: '600',
    fontFamily: 'PlayfairDisplay',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2c3e50',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'PlayfairDisplay',
    letterSpacing: 0.5,
  },
  sectionDesc: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    textAlign: 'left',
    fontFamily: 'PlayfairDisplay',
  },
  foodHeading: {
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '600',
    color: '#C8A951',
  },
  poolGrid: {
    flexDirection: 'column',
    gap: 20,
    marginBottom: 20,
  },
  poolBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    marginBottom: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  poolImage: {
    width: '100%',
    height: 200,
    marginBottom: 0,
  },
  poolLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 15,
    fontFamily: 'PlayfairDisplay',
  },
  poolDesc: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingBottom: 20,
    fontFamily: 'PlayfairDisplay',
    lineHeight: 22,
  },
});