import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AvailableRooms = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Rooms</Text>
      <Text>This would be your rooms listing page...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AvailableRooms;