//PaymentStep.js
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentStep = ({ selectedPayment, setSelectedPayment }) => {
  const paymentMethods = [
    { name: 'PayPal', icon: 'logo-paypal', color: '#003087' }, // PayPal Blue
    { name: 'GCash', icon: 'wallet-outline', color: '#0275d8' }, // GCash Blue
  ];

  return (
    <View>
      <Text style={styles.sectionTitleReservation}>Select Payment Method</Text>

      {paymentMethods.map((method) => (
        <PaymentOption
          key={method.name}
          method={method}
          selected={selectedPayment === method.name}
          onPress={() => setSelectedPayment(method.name)}
        />
      ))}
    </View>
  );
};

// 🌀 Animated Payment Option
const PaymentOption = ({ method, selected, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selected) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [selected]);

  return (
    <TouchableOpacity
      style={[styles.paymentOption, selected && styles.selectedPaymentOption]}
      onPress={onPress}
    >
      {/* Radio Button */}
      <View style={styles.radioContainer}>
        <View style={styles.radioOuter}>
          {selected && (
            <Animated.View
              style={[styles.radioInner, { transform: [{ scale: scaleAnim }] }]}
            />
          )}
        </View>
      </View>

      {/* Ionicon logo */}
      <Ionicons
        name={method.icon}
        size={26}
        color={selected ? method.color : '#555'}
        style={{ marginRight: 10 }}
      />

      {/* Text */}
      <Text style={styles.paymentText}>{method.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sectionTitleReservation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedPaymentOption: {
    borderColor: '#d4af37',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  radioContainer: {
    marginRight: 15,
  },
  radioOuter: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#d4af37',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#d4af37',
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PaymentStep;
