import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function RoomDetails({ route, navigation }) {
  const { room } = route.params || {
    name: 'Deluxe Room',
    type: 'room',
    dayPrice: '₱2,500',
    overnightPrice: '₱3,500',
    wholeResortPrice: '₱40,000',
    maxGuests: 4,
    image: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwa90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    features: [
      { name: 'Swimming Pool', price: 1000 },
      { name: 'Wifi', price: 0 },
      { name: 'Videoke', price: 500 },
      { name: 'Kitchen Access', price: 750 },
    ]
  };

  const [date, setDate] = useState('');
  const [dayHours, setDayHours] = useState(0);
  const [overnightHours, setOvernightHours] = useState(0);
  const [guests, setGuests] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const dayPrice = parseInt(room.dayPrice?.replace(/[^0-9]/g, '') || '0');
  const nightPrice = parseInt(room.overnightPrice?.replace(/[^0-9]/g, '') || '0');
  const wholeResortPrice = parseInt(room.wholeResortPrice?.replace(/[^0-9]/g, '') || '0');

  const isWholeResort = room.type === 'whole';
  const isCottage = room.type === 'cottage';
  const isRoom = room.type === 'room';

  const dayTotal = dayHours > 0 ? dayPrice : 0;
  const overnightTotal = overnightHours > 0 ? nightPrice : 0;
  const amenitiesTotal = selectedAmenities.reduce((sum, amenity) => sum + (amenity.price || 0), 0);
  const basePrice = isWholeResort ? wholeResortPrice : (dayTotal + overnightTotal);
  const totalPrice = basePrice + amenitiesTotal;

  const getMaxGuests = () => {
    return room.maxGuests || (isWholeResort ? 50 : isCottage ? 8 : 4);
  };

  const maxGuests = getMaxGuests();

  const isReservationValid = date && (isWholeResort || dayHours > 0 || overnightHours > 0) && guests > 0;

  const handleDayHoursIncrement = () => {
    setDayHours(10);
    setOvernightHours(0);
  };

  const handleDayHoursDecrement = () => {
    setDayHours(0);
  };

  const handleOvernightHoursIncrement = () => {
    setOvernightHours(10);
    setDayHours(0);
  };

  const handleOvernightHoursDecrement = () => {
    setOvernightHours(0);
  };

  const isDaySelected = dayHours === 10;
  const isOvernightSelected = overnightHours === 10;

  const isAmenityOptional = (amenity) => amenity.price > 0;

  const toggleAmenity = (amenity) => {
    if (!isAmenityOptional(amenity)) {
      return;
    }
    setSelectedAmenities(prevSelected => {
      if (prevSelected.some(item => item.name === amenity.name)) {
        return prevSelected.filter(item => item.name !== amenity.name);
      } else {
        return [...prevSelected, amenity];
      }
    });
  };

  const handleReservePress = () => {
    if (!isReservationValid) {
      Alert.alert(
        "Incomplete Reservation",
        "Please select a check-in date" + (isWholeResort ? "" : " and a stay duration") + " and at least 1 guest to proceed.",
        [{ text: "OK" }]
      );
      return;
    }
    navigation.navigate('ReservationReviewScreen', {
      room,
      date,
      dayHours,
      overnightHours,
      guests,
      totalPrice,
      selectedAmenities
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      currentDate.setHours(0, 0, 0, 0);

      const isPast = currentDate < today;
      const isSelected = selectedDate &&
        currentDate.getDate() === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear();

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isPast && styles.pastDay
          ]}
          onPress={() => {
            if (!isPast) {
              setSelectedDate(currentDate);
            }
          }}
          disabled={isPast}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            isPast && styles.pastDayText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{room.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: room.image }}
            style={styles.roomImage}
            resizeMode="cover"
          />
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>
              FROM ₱{isWholeResort ? wholeResortPrice.toLocaleString() : dayPrice.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.titleRow}>
            <Text style={styles.roomName}>{room.name}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{room.type.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>DESCRIPTION</Text>
          <Text style={styles.description}>
            {room.description || 'Premium accommodation with modern amenities and breathtaking views for an unforgettable stay.'}
          </Text>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>AMENITIES & INCLUSIONS</Text>
          <View style={styles.amenitiesGrid}>
            {room.features || room.amenities ? (
              (room.features || room.amenities).map((item, index) => {
                const isOptional = isAmenityOptional(item);
                const isSelected = selectedAmenities.some(amenity => amenity.name === item.name);

                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.amenityItem}
                    onPress={() => toggleAmenity(item)}
                    disabled={!isOptional}
                  >
                    <Ionicons
                      name={isSelected ? "checkmark-circle" : (isOptional ? "add-circle-outline" : "checkmark-circle")}
                      size={16}
                      color={isSelected || !isOptional ? "#d4af37" : "#ccc"}
                    />
                    <Text style={[styles.amenityText, { color: isOptional ? '#555' : '#777' }]}>
                      {item.name}
                      {isOptional && (
                        <Text style={styles.amenityPrice}> (+₱{item.price.toLocaleString()})</Text>
                      )}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.amenityText}>No amenities or inclusions listed.</Text>
            )}
          </View>

          <View style={styles.pricingCard}>
            {isWholeResort ? (
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>24-Hour Stay Package:</Text>
                <Text style={styles.pricingValue}>₱{wholeResortPrice.toLocaleString()}</Text>
              </View>
            ) : (
              <>
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Day Rate (10 hours):</Text>
                  <Text style={styles.pricingValue}>₱{dayPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Overnight (10 hours):</Text>
                  <Text style={styles.pricingValue}>₱{nightPrice.toLocaleString()}</Text>
                </View>
              </>
            )}
          </View>

          <Text style={styles.sectionTitle}>BOOK YOUR STAY</Text>
          <View style={styles.bookingForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CHECK-IN DATE</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={date ? styles.dateText : styles.placeholderText}>
                  {date || 'Select a date'}
                </Text>
                <Ionicons name="calendar" size={20} color="#d4af37" />
              </TouchableOpacity>
            </View>

            {!isWholeResort ? (
              <View style={styles.counterRow}>
                <View style={styles.counterGroup}>
                  <Text style={styles.inputLabel}>DAY HOURS (7AM-5PM)</Text>
                  <View style={styles.counter}>
                    <TouchableOpacity
                      onPress={handleDayHoursDecrement}
                      style={styles.counterButton}
                      disabled={dayHours === 0 || isOvernightSelected}
                    >
                      <Ionicons
                        name="remove"
                        size={18}
                        color={dayHours === 0 || isOvernightSelected ? '#ccc' : '#d4af37'}
                      />
                    </TouchableOpacity>
                    <Text style={[
                      styles.counterValue,
                      isOvernightSelected && styles.disabledText
                    ]}>
                      {dayHours === 10 ? 'DAY' : dayHours}
                    </Text>
                    <TouchableOpacity
                      onPress={handleDayHoursIncrement}
                      style={styles.counterButton}
                      disabled={dayHours === 10 || isOvernightSelected}
                    >
                      <Ionicons
                        name="add"
                        size={18}
                        color={dayHours === 10 || isOvernightSelected ? '#ccc' : '#d4af37'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.counterGroup}>
                  <Text style={styles.inputLabel}>OVERNIGHT HOURS (7PM-5AM)</Text>
                  <View style={styles.counter}>
                    <TouchableOpacity
                      onPress={handleOvernightHoursDecrement}
                      style={styles.counterButton}
                      disabled={overnightHours === 0 || isDaySelected}
                    >
                      <Ionicons
                        name="remove"
                        size={18}
                        color={overnightHours === 0 || isDaySelected ? '#ccc' : '#d4af37'}
                      />
                    </TouchableOpacity>
                    <Text style={[
                      styles.counterValue,
                      isDaySelected && styles.disabledText
                    ]}>
                      {overnightHours === 10 ? 'OVERNIGHT' : overnightHours}
                    </Text>
                    <TouchableOpacity
                      onPress={handleOvernightHoursIncrement}
                      style={styles.counterButton}
                      disabled={overnightHours === 10 || isDaySelected}
                    >
                      <Ionicons
                        name="add"
                        size={18}
                        color={overnightHours === 10 || isDaySelected ? '#ccc' : '#d4af37'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.packageInfo}>
                <Text style={styles.packageTitle}>FULL DAY & NIGHT PACKAGE</Text>
                <Text style={styles.packageDescription}>
                  Includes 24-hour access to the entire resort, including all facilities and amenities.
                </Text>
              </View>
            )}

            <View style={styles.counterGroup}>
              <Text style={styles.inputLabel}>GUESTS</Text>
              <View style={styles.counter}>
                <TouchableOpacity
                  onPress={() => setGuests(Math.max(0, guests - 1))}
                  style={styles.counterButton}
                >
                  <Ionicons
                    name="remove"
                    size={18}
                    color={guests === 0 ? '#ccc' : '#d4af37'}
                  />
                </TouchableOpacity>
                <Text style={styles.counterValue}>{guests}</Text>
                <TouchableOpacity
                  onPress={() => setGuests(Math.min(maxGuests, guests + 1))}
                  style={styles.counterButton}
                  disabled={guests === maxGuests}
                >
                  <Ionicons
                    name="add"
                    size={18}
                    color={guests === maxGuests ? '#ccc' : '#d4af37'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.totalContainer}>
            <View style={styles.priceBreakdown}>
              {dayHours > 0 && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>DAY</Text>
                  <Text style={styles.priceValue}>₱{dayTotal.toLocaleString()}</Text>
                </View>
              )}
              {overnightHours > 0 && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>OVERNIGHT</Text>
                  <Text style={styles.priceValue}>₱{overnightTotal.toLocaleString()}</Text>
                </View>
              )}
              {isWholeResort && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>24-HOUR PACKAGE</Text>
                  <Text style={styles.priceValue}>₱{wholeResortPrice.toLocaleString()}</Text>
                </View>
              )}
              {selectedAmenities.map((amenity, index) => (
                <View key={index} style={styles.priceRow}>
                  <Text style={styles.priceLabel}>{amenity.name}</Text>
                  <Text style={styles.priceValue}>₱{amenity.price.toLocaleString()}</Text>
                </View>
              ))}
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalPrice}>₱{totalPrice.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.bookButton, !isReservationValid && styles.disabledButton]}
          onPress={handleReservePress}
          disabled={!isReservationValid}
        >
          <Text style={styles.bookButtonText}>RESERVE NOW</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Check-in Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendar}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity
                  onPress={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                >
                  <Ionicons name="chevron-back" size={20} color="#2c3e50" />
                </TouchableOpacity>

                <Text style={styles.monthText}>
                  {new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                >
                  <Ionicons name="chevron-forward" size={20} color="#2c3e50" />
                </TouchableOpacity>
              </View>

              <View style={styles.weekDays}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <Text key={day} style={styles.weekDayText}>{day}</Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {renderCalendarDays()}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.dateconfirmButton, !selectedDate && styles.disabledButton]}
              onPress={() => {
                if (selectedDate) {
                  setDate(selectedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }));
                }
                setShowDatePicker(false);
              }}
              disabled={!selectedDate}
            >
              <Text style={styles.dateconfirmButtonText}>
                {selectedDate ? 'Confirm Date' : 'Select a Date'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pastDay: {
    opacity: 0.3,
  },
  pastDayText: {
    color: '#ccc',
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
    flexDirection: 'column',
    marginTop: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  amenityText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 12,
    flex: 1,
  },
  amenityPrice: {
    fontSize: 14,
    color: '#555',
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
    backgroundColor: '#fff',
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
  detailsGrid: {},
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
  pricingList: {},
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