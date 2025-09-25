// Sidebar.js
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, Animated, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';

const sidebarWidth = Dimensions.get('window').width * 0.65;

export default function Sidebar({ isVisible, setVisible, navigation, showLogout = true }) {
  const sidebarAnim = useRef(new Animated.Value(-sidebarWidth)).current;

  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: isVisible ? 0 : -sidebarWidth,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isVisible]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setVisible(false);
      // Reset navigation to Login screen after logout
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout. Try again.");
    }
  };

  const menuItems = [
    { title: 'Rooms', icon: 'bed-outline', screen: 'Bookings' }, // Changed to 'Bookings'
    { title: 'Amenities', icon: 'cafe-outline', screen: 'Amenities' },
    { title: 'About Us', icon: 'information-circle-outline', screen: 'AboutUs' },
    { title: 'Contact', icon: 'call-outline', screen: 'ContactUs' },
  ];

  const handleMenuPress = (screen) => {
    setVisible(false);
    // Reset navigation stack for main menu items
    navigation.reset({
      index: 0,
      routes: [{ name: screen }],
    });
  };

  return (
    <>
      {isVisible && <Pressable style={styles.overlay} onPress={() => setVisible(false)} />}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <Text style={styles.menuHeader}>Menu</Text>
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.screen)}
            >
              <Ionicons name={item.icon} size={20} color="#333" style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {showLogout && (
          <View style={styles.logoutWrapper}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 5,
  },
  sidebar: {
    position: 'absolute', top: 0, bottom: 0, width: sidebarWidth,
    backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 50 : 70,
    paddingHorizontal: 20, shadowColor: '#000', shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 0 }, shadowRadius: 5,
    elevation: 10, zIndex: 20,
  },
  menuHeader: { fontSize: 20, fontWeight: '700', marginBottom: 25, color: '#d4af37', textAlign: 'center' },
  menuList: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomColor: '#ddd', borderBottomWidth: 1 },
  menuIcon: { marginRight: 15 },
  menuText: { fontSize: 16, color: '#333' },
  logoutWrapper: { paddingVertical: 15, borderTopColor: '#ddd', borderTopWidth: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#b22222', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 25, justifyContent: 'center' },
  logoutText: { color: '#fff', fontSize: 16, marginLeft: 8, fontWeight: '600' },
});