import { View, Text, Image } from 'react-native';

// Shows copyright information for the app and UBC logo.
export default function Copyright() {
  return (
    <View style={{ margin: 50, alignItems: 'center' }}>
      <Image style={{ width: 120, height: 80, margin: 0 }} source={require('../assets/images/IGH-logo.png')} />
      <Text style={{ fontWeight: 'bold', padding: 5 }}>RRate v 4.0</Text>
      <Text style={{ padding: 5 }}>Institute for Global Health</Text>
      <Text> Copyright 2025 </Text>
    </View >
  );
}