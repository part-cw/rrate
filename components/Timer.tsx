import React from 'react';
import { View, Text, Platform } from 'react-native';
import { GlobalStyles as Style } from '@/assets/styles';

// Shows a timer that counts from 0 to 60 secs
export default function Timer({ time }: { time: number }) {
  const timeFormatted = time < 10 ? `0${time}` : time;

  return (
    <View style={[Style.floatingContainer, { justifyContent: 'center', alignItems: 'center', padding: Platform.OS == 'web' ? 30 : 20 }]}>
      <Text style={{ fontSize: 48 }}>0:{timeFormatted}</Text>
    </View>
  );
}