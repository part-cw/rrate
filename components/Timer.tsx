import React from 'react';
import { View, Text } from 'react-native';
import { GlobalStyles as Style } from '@/assets/styles';

// Shows a timer that counts from 0 to 60 secs
export default function Timer({ time }: { time: number }) {
  const timeFormatted = time < 10 ? `0${time}` : time;

  return (
    <View style={[Style.floatingContainer, { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 35 }]}>
      <Text style={{ fontSize: 48 }}>0:{timeFormatted}</Text>
    </View>
  );
}