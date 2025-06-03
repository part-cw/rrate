import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import DropdownList from '../components/DropdownList';
import { GlobalStyles as Style } from '@/app/styles';

const ages = ['<2 months', '2–12 months', '>1 year'];

export default function RespiratoryRateCard() {
  const [age, setAge] = useState('');

  return (
    <View style={[Style.floatingContainer, { flexDirection: 'row' }]}>
      <View style={styles.leftColumn}>
        <Text style={styles.rateValue}>41</Text>
      </View>



      <View style={styles.rightColumn}>
        <Text style={styles.labelMain}>Respiratory Rate</Text>
        <Text style={styles.labelSub}>(breaths/min)</Text>

        <View style={styles.divider} />

        <View style={styles.dropdownContainer}>
          <Text style={styles.ageLabel}>Age</Text>
          <View style={styles.dropdownWrapper}>
            <DropdownList data={ages} />
          </View>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  leftColumn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 25,
  },
  rateValue: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc'
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  labelMain: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  labelSub: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ageLabel: {
    marginRight: 8,
    fontSize: 16,
  },
  dropdownWrapper: {
    flex: 1,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    elevation: 2,
  }
});
