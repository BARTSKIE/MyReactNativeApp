import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PaymentStep from './PaymentStep';

export default function ReservationReviewScreen({ route, navigation }) {
  const { room, date, guests, totalPrice, dayHours, overnightHours } = route.params;
  const [selectedPayment, setSelectedPayment] = useState('');

  const isWholeResort = room.type === 'whole';

  const handleConfirmReservation = () => {
    navigation.navigate('PaymentScreen', {
      room,
      date,
      guests,
      totalPrice,
      selectedPayment,
      dayHours,
      overnightHours,
      isWholeResort
    });
  };

  return (
    <SafeAreaView style={styles.reservationFullScreenContainer}>
      <View style={styles.reservationHeader}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.reservationHeaderTitle}>Reservation Review</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView 
        style={styles.reviewContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.roomCard}>
          <Image 
            source={{ uri: room.image }} 
            style={styles.reservationRoomImage}
            resizeMode="cover"
          />
          <View style={styles.roomInfo}>
            <Text style={styles.roomNameReservation}>
              {room.name.replace(/•.*/g, '').trim()}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleReservation}>Reservation Details</Text>
          <View style={styles.detailsGrid}>
            {date && (
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="calendar-outline" size={20} color="#d4af37" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Check-in Date</Text>
                  <Text style={styles.detailValue}>{date}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="time-outline" size={20} color="#d4af37" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>
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
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="people-outline" size={20} color="#d4af37" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Guests</Text>
                <Text style={styles.detailValue}>{guests} Guest(s)</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleReservation}>Pricing Breakdown</Text>
          <View style={styles.pricingList}>
            {dayHours > 0 && (
              <View style={styles.pricingItem}>
                <Text style={styles.pricingDescription}>DAY</Text>
                <Text style={styles.pricingAmount}>{room.dayPrice}</Text>
              </View>
            )}
            {overnightHours > 0 && (
              <View style={styles.pricingItem}>
                <Text style={styles.pricingDescription}>OVERNIGHT</Text>
                <Text style={styles.pricingAmount}>{room.overnightPrice}</Text>
              </View>
            )}
            {isWholeResort && (
              <View style={styles.pricingItem}>
                <Text style={styles.pricingDescription}>24-HOUR PACKAGE</Text>
                <Text style={styles.pricingAmount}>{room.wholeResortPrice}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>₱{totalPrice.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitleReservation}>Policies</Text>
          <View style={styles.policyItem}>
            <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.policyText}>Free cancellation up to 24 hours before check-in</Text>
          </View>
          {isWholeResort && (
            <View style={styles.policyItem}>
              <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
              <Text style={styles.policyText}>Whole resort rental includes exclusive access to all facilities</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.reservationFooter}>
        <View style={styles.footerContent}>
          <View style={styles.priceSummary}>
            <Text style={styles.footerLabel}>Total</Text>
            <Text style={styles.footerPrice}>₱{totalPrice.toLocaleString()}</Text>
          </View>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirmReservation}
          >
            <Text style={styles.confirmButtonText}>Confirm Reservation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  counterRow: {
    flexDirection: 'column'
  },
  counterGroup: {
    marginBottom: 15,
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
  disabledButton: {
    backgroundColor: '#ccc',
    shadowColor: '#ccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  calendar: {
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7f8c8d',
    textAlign: 'center',
    width: 40,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginVertical: 2,
  },
  selectedDay: {
    backgroundColor: '#d4af37',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  otherMonthDay: {
    color: '#ccc',
  },
  dateconfirmButton: {
    backgroundColor: '#d4af37',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateconfirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  reservationFullScreenContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reservationHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  reviewContainer: {
    flex: 1,
    padding: 16,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  reservationRoomImage: {
    width: '100%',
    height: 200,
  },
  roomInfo: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomNameReservation: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  roomTypeBadge: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  roomTypeText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitleReservation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  detailsGrid: {
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff8e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  pricingList: {
  },
  pricingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pricingDescription: {
    color: '#6B7280',
    fontSize: 14,
  },
  pricingAmount: {
    color: '#2c3e50',
    fontWeight: '500',
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d4af37',
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  policyText: {
    color: '#6B7280',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  reservationFooter: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSummary: {
    flex: 1,
    marginRight: 16,
  },
  footerLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d4af37',
  },
  confirmButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '60%',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#ccc',
  },
});
