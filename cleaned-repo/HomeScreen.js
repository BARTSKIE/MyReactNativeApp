import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from './Sidebar'; // Sidebar with logout button

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay: require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
  });

  const [sidebarVisible, setSidebarVisible] = useState(false);

  if (!fontsLoaded) return null;

  const handleBookNow = () => {
    navigation.navigate("Bookings"); // Keep Book Now functionality
  };

  return (
    <View style={styles.container}>
      {/* Sidebar with logout */}
      <Sidebar
        isVisible={sidebarVisible}
        setVisible={setSidebarVisible}
        navigation={navigation}
        showLogout={true} // logout only here
      />

      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Don Elmer's Resort</Text>
      </View>

      {/* Main Content */}
      <LinearGradient
        colors={['#e0e0e0', '#808080']} 
        locations={[0.1, 0.9]} 
        style={styles.body}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.centeredContent}>
          <Text style={styles.smallText}>LUXURY & COMFORT</Text>
          <Text style={styles.bigText}>Discover Your Perfect Stay at Don Elmer's Inn and Resort</Text>
          <TouchableOpacity style={styles.button} onPress={handleBookNow}>
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
    color: '#2c3e50',
  },
  body: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: { alignItems: 'center' },
  smallText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  bigText: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 36,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'PlayfairDisplay',
  },
  button: {
    borderWidth: 1.5,
    borderColor: '#d4af37',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#d4af37',
    fontSize: 15,
    fontWeight: '600',
  },
});
