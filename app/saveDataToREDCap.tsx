import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { GlobalStyles as Style } from '../assets/styles';
import { useGlobalVariables } from './globalContext';
import { Theme } from '../assets/theme';
import { useRouter } from 'expo-router';
import useTranslation from '@/hooks/useTranslation';

// Page for saving single measurement to REDCap
export default function SaveDataToREDCap() {
  const { rrate, tapTimestamps } = useGlobalVariables();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={Style.screenContainer}>
      <View style={Style.innerContainer}>
        <View style={{ alignItems: 'flex-start' }}>
          <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.back()}>
            {t("BACK")}
          </Button>
        </View>
        <Text style={Style.heading}>Save Data to REDCap</Text>
        <Text> {rrate} breaths/min </Text>
        <Text> Number of taps: {tapTimestamps.length} </Text>
      </View>
    </View>
  )
}