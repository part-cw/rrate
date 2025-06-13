import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { GlobalStyles as Style } from '@/assets/styles';

export default function Timer({ time }: { time: number }) {
  const timeFormatted = time < 10 ? `0${time}` : time;

  return (
    <View style={[Style.floatingContainer, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 48 }}>0:{timeFormatted}</Text>
    </View>
  );
}