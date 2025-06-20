import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { GlobalStyles as Style } from '../assets/styles';
import { useGlobalVariables } from './globalContext';


export default function SaveDataToREDCap() {

  const { rrate, tapTimestamps } = useGlobalVariables();
  return (
    <View>
      <Text style={Style.heading}>Save Data to REDCap</Text>
    </View>
  )
}