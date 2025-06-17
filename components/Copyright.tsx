import { View, Text, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function Copyright() {
  return (
    <View style={{ margin: 50, alignItems: 'center' }}>

      <Image style={{ width: 80, height: 80 }} source={require('../assets/images/ubc-logo.png')} />

      <Text style={{ fontWeight: 'bold', padding: 5 }}> RRate v 3.0 </Text>
      <Text style={{ padding: 5 }}> University of British Columbia </Text>
      <Text> Copyright 2018 </Text>
    </View >
  );
}