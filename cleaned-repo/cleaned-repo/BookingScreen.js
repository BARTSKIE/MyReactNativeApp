// import React, { useState, useRef, useEffect } from 'react';
// import { SafeAreaView, rooms, View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Pressable, Image, Animated, Platform } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useFonts } from 'expo-font';
// import { getAuth, signOut } from "firebase/auth";
// import { database } from './firebase';
// import { ref, onValue } from 'firebase/database';

// export default function AvailableRooms({ navigation }) {
//   const [fontsLoaded] = useFonts({
//     PlayfairDisplay: require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
//   });

//   const [rooms, setRooms] = useState([]);
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [isSidebarVisible, setSidebarVisible] = useState(false);
//   const sidebarAnim = useRef(new Animated.Value(-sidebarWidth)).current;

//   useEffect(() => {
//     Animated.timing(sidebarAnim, {
//       toValue: isSidebarVisible ? 0 : -sidebarWidth,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   }, [isSidebarVisible]);

//   // 🔹 Fetch rooms from Firebase
//   useEffect(() => {
//   const roomsRef = ref(database, 'rooms');
//   const unsubscribe = onValue(roomsRef, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       // Convert object to array
//       const roomArray = Object.keys(data).map((key) => ({
//         id: key,
//         ...data[key],
//       }));
//       setRooms(roomArray);
//     }
//   });

//   return () => unsubscribe();
// }, []);

// if (!rooms) {
//   return (
//     <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Room details not available.</Text>
//     </SafeAreaView>
//   );
// }



//   if (!fontsLoaded) return null;

//   const filteredRooms = rooms.filter((room) =>
//     selectedFilter === 'all' ? true : room.type === selectedFilter
//   );

//   const chunkedRooms = [];
//   for (let i = 0; i < filteredRooms.length; i += 2) {
//     chunkedRooms.push(filteredRooms.slice(i, i + 2));
//   }

//   return (
//     <View style={styles.container}>
//       {/* Rest of your sidebar, navbar, filter, and card UI remains the same */}
//       <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
//         {chunkedRooms.map((row, rowIndex) => (
//           <View key={rowIndex} style={styles.row}>
//             {row.map((room) => (
//               <View key={room.id} style={styles.card}>
//                 <View style={styles.imagePlaceholder}>
//                   <Image source={{ uri: room.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
//                 </View>
//                 <Text style={styles.roomName}>{room.name}</Text>
//                 <Text style={styles.priceLine}><Text style={styles.goldPrice}>{room.dayPrice}</Text> / Day Use</Text>
//                 <Text style={styles.priceLine}><Text style={styles.goldPrice}>{room.overnightPrice}</Text> / Overnight</Text>
//                 <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('RoomDetails', { room })}>
//                   <Text style={styles.bookText}>Book Now</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const sidebarWidth = Dimensions.get('window').width * 0.65;
// const cardWidth = (Dimensions.get('window').width - 40) / 2;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     zIndex: 5,
//   },
//   sidebar: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     width: sidebarWidth,
//     backgroundColor: '#fff',
//     paddingTop: Platform.OS === 'android' ? 50 : 70,
//     paddingHorizontal: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 2, height: 0 },
//     shadowRadius: 5,
//     elevation: 10,
//     zIndex: 20,
//   },
//   menuHeader: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 25,
//     color: '#d4af37',
//     textAlign: 'center',
//   },
//   menuList: {
//     flex: 1,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomColor: '#ddd',
//     borderBottomWidth: 1,
//   },
//   menuIcon: {
//     marginRight: 15,
//   },
//   menuText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   logoutWrapper: {
//     paddingVertical: 15,
//     borderTopColor: '#ddd',
//     borderTopWidth: 1,
//   },
//   logoutBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#b22222',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 25,
//     justifyContent: 'center',
//   },
//   logoutText: {
//     color: '#fff',
//     fontSize: 16,
//     marginLeft: 8,
//     fontWeight: '600',
//   },
//   navbar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: Platform.OS === 'android' ? 50 : 60,
//     paddingHorizontal: 20,
//     paddingBottom: 15,
//     backgroundColor: '#fff',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   navTitle: {
//     marginLeft: 15,
//     fontSize: 22,
//     fontWeight: '600',
//     fontFamily: 'PlayfairDisplay',
//     color: '#2c3e50',
//   },
//   titleContainer: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   pageTitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     fontFamily: 'PlayfairDisplay',
//     color: '#333',
//   },
//   goldLine: {
//     marginTop: 6,
//     width: 80,
//     height: 3,
//     backgroundColor: '#d4af37',
//     borderRadius: 2,
//   },
//   filterBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
//   filterBtn: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#aaa',
//     backgroundColor: '#fff',
//   },
//   filterText: {
//     color: '#000',
//     fontWeight: '600',
//   },
//   activeFilter: {
//     backgroundColor: '#d4af37',
//     borderColor: 'transparent',
//   },
//   activeFilterText: {
//     color: '#fff',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//     marginBottom: 16,
//   },
//   card: {
//     width: cardWidth,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 15,
//     padding: 10,
//     elevation: 2,
//   },
//   imagePlaceholder: {
//     width: '100%',
//     aspectRatio: 1,
//     backgroundColor: '#ddd',
//     borderRadius: 10,
//     marginBottom: 10,
//     overflow: 'hidden',
//   },
//   roomName: {
//     fontSize: 16,
//     fontFamily: 'PlayfairDisplay',
//     fontWeight: '600',
//     marginBottom: 5,
//     color: '#333',
//   },
//   priceLine: {
//     fontSize: 14,
//     color: '#444',
//   },
//   goldPrice: {
//     color: '#d4af37',
//     fontWeight: '700',
//   },
//   bookBtn: {
//     marginTop: 10,
//     backgroundColor: '#d4af37',
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   bookText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });

// BookingScreen.js
import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  Platform,
  Animated,
  Image,
} from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from './Sidebar';

const rooms = [
  { 
    id: 1, 
    name: 'Room 1', 
    type: 'room', 
    dayPrice: '₱600', 
    overnightPrice: '₱960',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500',
    description: 'Standard room with queen bed and garden view'
  },
  {
  id: 2,
  name: 'Room 2',
  type: 'room',
  dayPrice: '₱400',
  overnightPrice: '₱650',
  image: 'https://i.imgur.com/3BeQ9Zm.jpg', 
  description: 'Budget-friendly room with single bed',
},
  { 
    id: 3, 
    name: 'Room 3', 
    type: 'room', 
    dayPrice: '₱500', 
    overnightPrice: '₱800',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
    description: 'Deluxe room with balcony'
  },
  { 
    id: 4, 
    name: 'Cottage 1', 
    type: 'cottage', 
    dayPrice: '₱450', 
    overnightPrice: '₱750',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
    description: 'Cozy cottage for 2-3 persons'
  },
  { 
    id: 5, 
    name: 'Cottage 2', 
    type: 'cottage', 
    dayPrice: '₱450', 
    overnightPrice: '₱750',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
    description: 'Modern cottage with veranda'
  },
  { 
    id: 6, 
    name: 'Cottage 3', 
    type: 'cottage', 
    dayPrice: '₱450', 
    overnightPrice: '₱750',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=500',
    description: 'Traditional bamboo cottage'
  },
  { 
    id: 7, 
    name: 'Cottage 4', 
    type: 'cottage', 
    dayPrice: '₱450', 
    overnightPrice: '₱750',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500',
    description: 'Family-sized cottage'
  },
  { 
    id: 8, 
    name: 'Cottage 5', 
    type: 'cottage', 
    dayPrice: '₱800', 
    overnightPrice: '₱1300',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500',
    description: 'Premium cottage with jacuzzi'
  },
  { 
    id: 9, 
    name: 'Cottage 6', 
    type: 'cottage', 
    dayPrice: '₱800', 
    overnightPrice: '₱1300',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
    description: 'Luxury cottage with private pool'
  },
  { 
    id: 10, 
    name: 'Cottage 7', 
    type: 'cottage', 
    dayPrice: '₱550', 
    overnightPrice: '₱900',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
    description: 'Honeymoon cottage with ocean view'
  },
  { 
    id: 11, 
    name: 'Cottage 8', 
    type: 'cottage', 
    dayPrice: '₱550', 
    overnightPrice: '₱900',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
    description: 'Beachfront cottage'
  },
  { 
    id: 12, 
    name: 'Whole Resort Rental', 
    type: 'whole', 
    dayPrice: '₱15000', 
    overnightPrice: '₱25000',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500',
    description: 'Entire resort with all facilities'
  },
];

const menuItems = [
  { title: 'Rooms', icon: 'bed-outline' },
  { title: 'Amenities', icon: 'cafe-outline' },
  { title: 'About Us', icon: 'information-circle-outline' },
  { title: 'Contact', icon: 'call-outline' },
];

export default function BookingScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay: require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
  });
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-sidebarWidth)).current;

  if (!fontsLoaded) return null;

  const filteredRooms = rooms.filter((room) =>
    selectedFilter === 'all' ? true : room.type === selectedFilter
  );

  const chunkedRooms = [];
  for (let i = 0; i < filteredRooms.length; i += 2) {
    chunkedRooms.push(filteredRooms.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <Sidebar
        isVisible={sidebarVisible}
        setVisible={setSidebarVisible}
        navigation={navigation}
        showLogout={true} // no logout here, only in HomeScreen
      />

      {/* Navbar */}
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
              <View key={room.id} style={styles.card}>
                <View style={styles.imagePlaceholder}>
                  <Image
                    source={{ uri: room.image }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.priceLine}>
                  <Text style={styles.goldPrice}>{room.dayPrice}</Text>
                  <Text> / Day Use</Text>
                </Text>
                <Text style={styles.priceLine}>
                  <Text style={styles.goldPrice}>{room.overnightPrice}</Text>
                  <Text> / Overnight</Text>
                </Text>
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

const sidebarWidth = Dimensions.get('window').width * 0.65;
const cardWidth = (Dimensions.get('window').width - 40) / 2;

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
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontFamily: 'PlayfairDisplay',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 5,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: sidebarWidth,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 50 : 70,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 5,
    elevation: 10,
    zIndex: 20,
  },
  menuHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 25,
    color: '#d4af37',
    textAlign: 'center',
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutWrapper: {
    paddingVertical: 15,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b22222',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
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
    color: '#2c3e50',
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'PlayfairDisplay',
    color: '#333',
  },
  goldLine: {
    marginTop: 6,
    width: 80,
    height: 3,
    backgroundColor: '#d4af37',
    borderRadius: 2,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#000',
    fontWeight: '600',
  },
  activeFilter: {
    backgroundColor: '#d4af37',
    borderColor: 'transparent',
  },
  activeFilterText: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 10,
    elevation: 2,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  roomName: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay',
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  priceLine: {
    fontSize: 14,
    color: '#444',
  },
  goldPrice: {
    color: '#d4af37',
    fontWeight: '700',
  },
  bookBtn: {
    marginTop: 10,
    backgroundColor: '#d4af37',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookText: {
    color: '#fff',
    fontWeight: '600',
  },
});