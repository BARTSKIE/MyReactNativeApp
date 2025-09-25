// BookingScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, onValue } from 'firebase/database';
import Sidebar from './Sidebar';

export default function BookingScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay: require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
  });
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  if (!fontsLoaded) return null;

  useEffect(() => {
    const db = getDatabase();
    const accRef = ref(db, 'accommodations');

    onValue(accRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.values(data);
        setAccommodations(arr);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  const filteredRooms = accommodations.filter((room) =>
    selectedFilter === 'all' ? true : room.type === selectedFilter
  );

  const chunkedRooms = [];
  for (let i = 0; i < filteredRooms.length; i += 2) {
    chunkedRooms.push(filteredRooms.slice(i, i + 2));
  }

  const cardWidth = (Dimensions.get('window').width - 40) / 2;

  return (
    <View style={styles.container}>
      <Sidebar isVisible={sidebarVisible} setVisible={setSidebarVisible} navigation={navigation} />

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Bookings</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Our Rooms & Cottages</Text>
        <View style={styles.goldLine} />
      </View>

      <View style={styles.filterBar}>
        {['all', 'room', 'cottage', 'whole'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterBtn, selectedFilter === type && styles.activeFilter]}
            onPress={() => setSelectedFilter(type)}
          >
            <Text style={[styles.filterText, selectedFilter === type && styles.activeFilterText]}>
              {type === 'all' ? 'ALL' : type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {chunkedRooms.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((room) => (
              <View key={room.id} style={[styles.card, { width: cardWidth }]}>
                <View style={styles.imagePlaceholder}>
                  <Image source={{ uri: room.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                </View>

                <View style={styles.textContainer}>
  <Text style={styles.roomName}>{room.name}</Text>
  {room.packageType && (
    <Text style={styles.packageType}>{room.packageType}</Text>
  )}
</View>

{/* Price Container Section */}
<View style={styles.priceContainer}>
  {room.type === 'whole' ? (
    <Text style={styles.wholeResortPrice}>
      <Text style={styles.goldPrice}>{room.wholeResortPrice}</Text> / 24 Hours
    </Text>
  ) : (
    <>
      <Text style={styles.priceLine}>
        <Text style={styles.goldPrice}>{room.dayPrice}</Text> / Day Use
      </Text>
      <Text style={styles.priceLine}>
        <Text style={styles.goldPrice}>{room.overnightPrice}</Text> / Overnight
      </Text>
    </>
  )}
</View>

                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => navigation.navigate('RoomDetails', { room })}
                >
                  <Text style={styles.bookText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
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
  },
  navTitle: { marginLeft: 15, fontSize: 22, fontWeight: '600', fontFamily: 'PlayfairDisplay', color: '#2c3e50' },
  titleContainer: { alignItems: 'center', marginVertical: 15 },
  pageTitle: { fontSize: 22, fontWeight: '600', fontFamily: 'PlayfairDisplay', color: '#333' },
  goldLine: { marginTop: 6, width: 80, height: 3, backgroundColor: '#d4af37', borderRadius: 2 },
  filterBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginVertical: 10, 
    paddingHorizontal: 10 
  },
  filterBtn: { 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#aaa', 
    backgroundColor: '#fff' 
  },
  filterText: { color: '#000', fontWeight: '600' },
  activeFilter: { backgroundColor: '#d4af37', borderColor: 'transparent' },
  activeFilterText: { color: '#fff' },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 10, 
    marginBottom: 12 
  },
  card: { 
    backgroundColor: '#f8f8f8', 
    borderRadius: 12, 
    padding: 8, 
    elevation: 2,
    minHeight: 310, // Reduced height for smaller cards
    justifyContent: 'space-between',
  },
  imagePlaceholder: { 
    width: '100%', 
    aspectRatio: 1, 
    backgroundColor: '#ddd', 
    borderRadius: 8, 
    marginBottom: 8, 
    overflow: 'hidden' 
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  roomName: { 
    fontSize: 15, 
    fontFamily: 'PlayfairDisplay', 
    fontWeight: '600', 
    color: '#333',
    textAlign: 'center',
  },
  packageType: { 
    fontSize: 12, 
    fontStyle: 'italic', 
    color: '#03963bff', 
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom:8 ,
  },
  priceLine: { 
    fontSize: 14, 
    color: '#444', 
    marginBottom: 2,
    textAlign: 'center',
  },
  wholeResortPrice: { 
    fontSize: 14, 
    color: '#444', 
    fontWeight: '600',
    textAlign: 'center',
  },
  goldPrice: { color: '#d4af37', fontWeight: '700' },
  bookBtn: { 
    backgroundColor: '#d4af37', 
    paddingVertical: 6, 
    borderRadius: 6, 
    alignItems: 'center' 
  },
  bookText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});