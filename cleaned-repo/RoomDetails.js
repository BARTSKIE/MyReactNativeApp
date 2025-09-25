import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoomDetails({ route, navigation }) {
  const { room } = route.params;
  const [date, setDate] = useState('');
  const [days, setDays] = useState(0);
  const [nights, setNights] = useState(0);
  const [guests, setGuests] = useState(1);

  const dayPrice = parseInt(room.dayPrice.replace(/[^0-9]/g, ''));
  const nightPrice = parseInt(room.overnightPrice.replace(/[^0-9]/g, ''));
  const totalPrice = (days * dayPrice) + (nights * nightPrice);

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{room.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image with curved overlay */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: room.image }} 
            style={styles.roomImage}
            resizeMode="cover"
          />
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>FROM {room.dayPrice}</Text>
          </View>
          <View style={styles.curvedOverlay} />
        </View>

        {/* Main Card */}
        <View style={styles.mainCard}>
          {/* Title Section */}
          <View style={styles.titleRow}>
            <Text style={styles.roomName}>{room.name}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{room.type.toUpperCase()}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>DESCRIPTION</Text>
          <Text style={styles.description}>
            {room.description || 'Premium accommodation featuring modern amenities and breathtaking views for an unforgettable stay.'}
          </Text>

          {/* Amenities */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>AMENITIES</Text>
          <View style={styles.amenitiesGrid}>
            {['Wi-Fi', 'AC', 'TV', 'Shower', 'Coffee', 'Safe'].map((item, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle" size={16} color="#d4af37" />
                <Text style={styles.amenityText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Pricing */}
          <View style={styles.pricingCard}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Day Rate:</Text>
              <Text style={styles.pricingValue}>{room.dayPrice}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Overnight:</Text>
              <Text style={styles.pricingValue}>{room.overnightPrice}</Text>
            </View>
          </View>

          {/* Booking Form */}
          <Text style={styles.sectionTitle}>BOOK YOUR STAY</Text>
          <View style={styles.bookingForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CHECK-IN DATE</Text>
              <View style={styles.dateInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Select date"
                  placeholderTextColor="#999"
                  value={date}
                  onChangeText={setDate}
                />
                <Ionicons name="calendar" size={20} color="#d4af37" />
              </View>
            </View>

            <View style={styles.counterRow}>
              <View style={styles.counterGroup}>
                <Text style={styles.inputLabel}>DAYS</Text>
                <View style={styles.counter}>
                  <TouchableOpacity 
                    onPress={() => setDays(Math.max(0, days - 1))}
                    style={styles.counterButton}
                    disabled={days === 0}
                  >
                    <Ionicons 
                      name="remove" 
                      size={18} 
                      color={days === 0 ? '#ccc' : '#d4af37'} 
                    />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{days}</Text>
                  <TouchableOpacity 
                    onPress={() => setDays(days + 1)}
                    style={styles.counterButton}
                  >
                    <Ionicons name="add" size={18} color="#d4af37" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.counterGroup}>
                <Text style={styles.inputLabel}>NIGHTS</Text>
                <View style={styles.counter}>
                  <TouchableOpacity 
                    onPress={() => setNights(Math.max(0, nights - 1))}
                    style={styles.counterButton}
                    disabled={nights === 0}
                  >
                    <Ionicons 
                      name="remove" 
                      size={18} 
                      color={nights === 0 ? '#ccc' : '#d4af37'} 
                    />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{nights}</Text>
                  <TouchableOpacity 
                    onPress={() => setNights(nights + 1)}
                    style={styles.counterButton}
                  >
                    <Ionicons name="add" size={18} color="#d4af37" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.counterGroup}>
                <Text style={styles.inputLabel}>GUESTS</Text>
                <View style={styles.counter}>
                  <TouchableOpacity 
                    onPress={() => setGuests(Math.max(1, guests - 1))}
                    style={styles.counterButton}
                    disabled={guests === 1}
                  >
                    <Ionicons 
                      name="remove" 
                      size={18} 
                      color={guests === 1 ? '#ccc' : '#d4af37'} 
                    />
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{guests}</Text>
                  <TouchableOpacity 
                    onPress={() => setGuests(guests + 1)}
                    style={styles.counterButton}
                  >
                    <Ionicons name="add" size={18} color="#d4af37" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Total Price */}
          <View style={styles.totalContainer}>
            <View style={styles.priceBreakdown}>
              {days > 0 && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>{days} Day(s):</Text>
                  <Text style={styles.priceValue}>₱{(days * dayPrice).toLocaleString()}</Text>
                </View>
              )}
              {nights > 0 && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>{nights} Night(s):</Text>
                  <Text style={styles.priceValue}>₱{(nights * nightPrice).toLocaleString()}</Text>
                </View>
              )}
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalPrice}>₱{totalPrice.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Book Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>RESERVE NOW</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  roomImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  priceBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  priceBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  curvedOverlay: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 2,
  },

  safeContainer: {
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
    fontFamily: 'PlayfairDisplay',
    fontWeight: '600',
    color: '#2c3e50',
    letterSpacing: 0.5,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  imageContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
  },
  roomImage: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  priceBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  mainCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomName: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay',
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
  },
  typeBadge: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginLeft: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d4af37',
    letterSpacing: 1,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  amenityText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  pricingCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pricingLabel: {
    fontSize: 15,
    color: '#666',
  },
  pricingValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#d4af37',
  },
  bookingForm: {
    marginTop: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
     fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 5,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 14,
  },
   counterRow: {
    flexDirection: 'column'
  },
  dayNightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  counterGroup: {
     flex: 1,
    marginHorizontal: 5,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 5,
  },
   guestCounterGroup: {
    width: '100%', 
  },
  counterButton: {
    padding: 5,
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    minWidth: 20,
    textAlign: 'center',
  },
  totalContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  priceBreakdown: {
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  priceLabel: {
    color: '#666',
    fontSize: 14,
  },
  priceValue: {
    color: '#2c3e50',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  totalLabel: {
    color: '#2c3e50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalPrice: {
    color: '#d4af37',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bookButton: {
    backgroundColor: '#d4af37',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
})