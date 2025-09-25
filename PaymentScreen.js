import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from './firebase';

export default function PaymentScreen({ route }) {
  const navigation = useNavigation();
  const { room, date, guests, dayHours, overnightHours, isWholeResort } = route.params;
  const [selectedPayment, setSelectedPayment] = useState('');
  const [firebasePrice, setFirebasePrice] = useState(0);

  useEffect(() => {
    const fetchPriceFromFirebase = async () => {
      try {
        const db = getDatabase(app);
        const roomRef = ref(db, `accommodations/${room.id}`);
        const snapshot = await get(roomRef);
        if (snapshot.exists()) {
          const roomData = snapshot.val();
          if (isWholeResort) {
            setFirebasePrice(parseFloat(roomData.wholeResortPrice.replace(/₱|,/g, '')));
          } else if (dayHours > 0 && overnightHours > 0) {
            const dayPrice = parseFloat(roomData.dayPrice.replace(/₱|,/g, ''));
            const overnightPrice = parseFloat(roomData.overnightPrice.replace(/₱|,/g, ''));
            setFirebasePrice(dayPrice + overnightPrice);
          } else if (dayHours > 0) {
            setFirebasePrice(parseFloat(roomData.dayPrice.replace(/₱|,/g, '')));
          } else if (overnightHours > 0) {
            setFirebasePrice(parseFloat(roomData.overnightPrice.replace(/₱|,/g, '')));
          }
        }
      } catch (error) {
        console.error("Error fetching price from Firebase:", error);
      }
    };

    fetchPriceFromFirebase();
  }, [room.id, dayHours, overnightHours, isWholeResort]);

  const handlePayment = async () => {
    if (!selectedPayment) {
      Alert.alert('Payment Method', 'Please select a payment method to proceed.');
      return;
    }

    if (selectedPayment === "GCash") {
      try {
        // Call your backend to create a GCash payment source
        const response = await fetch("http://192.168.1.60:3000/create-gcash", {  // use 10.0.2.2 for Android emulator
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: firebasePrice * 100 // PayMongo needs centavos
          })
        });


        const data = await response.json();

        if (data.data?.attributes?.redirect?.checkout_url) {
          Linking.openURL(data.data.attributes.redirect.checkout_url);
        } else {
          Alert.alert("Error", "Failed to start GCash payment.");
        }
      } catch (error) {
        console.error("Payment Error:", error);
        Alert.alert("Error", "Something went wrong while processing payment.");
      }
    }
  };

  const paymentOptions = [
    { name: 'GCash', icon: 'phone-portrait-outline' },
  ];

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Total Amount</Text>
          <View style={styles.totalAmountContainer}>
            <Text style={styles.totalAmountText}>₱{firebasePrice.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paymentOption,
                selectedPayment === option.name && styles.selectedPaymentOption,
              ]}
              onPress={() => {
                if (selectedPayment === option.name) {
                  setSelectedPayment('');
                } else {
                  setSelectedPayment(option.name);
                }
              }}
            >
              <View style={styles.paymentOptionContent}>
                <Ionicons
                  name={option.icon}
                  size={24}
                  color={selectedPayment === option.name ? '#d4af37' : '#6B7280'}
                />
                <Text style={[
                  styles.paymentOptionText,
                  selectedPayment === option.name && styles.selectedPaymentText,
                ]}>
                  {option.name}
                </Text>
              </View>
              {selectedPayment === option.name && (
                <Ionicons name="checkmark-circle" size={20} color="#d4af37" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Reservation Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Room:</Text>
            <Text style={styles.summaryValue}>{room.name}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Check-in Date:</Text>
            <Text style={styles.summaryValue}>{date}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>
              {isWholeResort ? '24-HOUR PACKAGE' : (
                <>
                  {dayHours > 0 && `DAY`} 
                  {dayHours > 0 && overnightHours > 0 && ' • '}
                  {overnightHours > 0 && `OVERNIGHT`}
                </>
              )}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#2c3e50', letterSpacing: 0.5 },
  container: { flex: 1, padding: 16 },
  sectionCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#2c3e50', marginBottom: 16 },
  totalAmountContainer: { alignItems: 'center', padding: 20, backgroundColor: '#fcf8e3', borderRadius: 8 },
  totalAmountText: { fontSize: 24, fontWeight: '700', color: '#d4af37' },
  paymentOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 15, paddingHorizontal: 12, borderWidth: 1,
    borderColor: '#e0e0e0', borderRadius: 8, marginBottom: 10,
  },
  selectedPaymentOption: { borderColor: '#d4af37', backgroundColor: '#fcf8e3' },
  paymentOptionContent: { flexDirection: 'row', alignItems: 'center' },
  paymentOptionText: { fontSize: 16, color: '#2c3e50', marginLeft: 12 },
  selectedPaymentText: { fontWeight: '600', color: '#d4af37' },
  summaryItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, fontWeight: '500', color: '#2c3e50' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  payButton: { backgroundColor: '#d4af37', paddingVertical: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  totalAmountContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fcf8e3',
    borderRadius: 8,
  },
  totalAmountText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#d4af37',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedPaymentOption: {
    borderColor: '#d4af37',
    backgroundColor: '#fcf8e3',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  selectedPaymentText: {
    fontWeight: '600',
    color: '#d4af37',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  payButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});