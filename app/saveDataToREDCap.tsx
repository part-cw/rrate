import { View, Text, Image, Alert } from 'react-native';
import { useState } from 'react';
import { Button } from 'react-native-paper';
import { useGlobalVariables } from './globalContext';
import { Theme } from '../assets/theme';
import { useRouter } from 'expo-router';
import useTranslation from '../utils/useTranslation';
import { uploadRecordToREDCap, getNextRecordID } from '../utils/redcap';

// Page for saving single measurement to REDCap
export default function SaveDataToREDCap() {
  const router = useRouter();
  const { t } = useTranslation();
  const [response, setResponse] = useState<string | null>(null);

  const { REDCapAPI, REDCapURL, rrTaps, rrate, rrTime, tapTimestamps } = useGlobalVariables();

  const handleUpload = async () => {
    if (!REDCapURL || !REDCapAPI) {
      Alert.alert('Missing Info', 'Please enter your REDCap URL and API token in Settings first.');
      return;
    }

    try {
      // Fetch the most recent record id 
      const nextRecordId = await getNextRecordID({ apiUrl: REDCapURL, apiToken: REDCapAPI });

      // The new record to upload
      const record = [
        {
          record_id: nextRecordId,
          rrate_rate: rrate,
          rrate_time: rrTime,
          rrate_taps: rrTaps
        },
      ];

      const result = await uploadRecordToREDCap({
        apiUrl: REDCapURL,
        apiToken: REDCapAPI,
        recordData: record,
      });
      setResponse('Upload successful!');
    } catch (error: any) {
      setResponse('Upload failed:\n' + error.message);
    }
  };

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
          <Button icon="upload" buttonColor={Theme.colors.secondary} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => handleUpload()}>
            {t("SAVE")}
          </Button>
        </View>
        {response && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16 }}>{response}</Text>
          </View>
        )}
      </View>
    </View >
  )
}