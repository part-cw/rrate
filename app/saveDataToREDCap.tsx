import { View, Text, Image } from 'react-native';
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
    <View style={{ margin: 30, paddingTop: 20, flexGrow: 1, justifyContent: 'center', alignItems: 'center', }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', width: 350 }}>
        <Image
          source={require('@/assets/images/REDCap-icon.png')}
          style={{ width: 67, height: 70, marginBottom: 20 }}
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Save Data to REDCap</Text>
        <Text style={{ paddingBottom: 10 }}><Text style={{ fontWeight: 'bold' }}>Rate:</Text> {rrate} breaths/min </Text>
        <Text> <Text style={{ fontWeight: 'bold' }}>Number of taps:</Text> {tapTimestamps.length} </Text>
        <View style={{ paddingVertical: 20, margin: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => router.back()}>
            {t("BACK")}
          </Button>
          <Button icon="upload" buttonColor={Theme.colors.secondary} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => console.log("Save to REDCap functionality not implemented yet")}>
            {t("SAVE")}
          </Button>
        </View>
      </View>
    </View >
  )
}