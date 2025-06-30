import { View, Text, Image, Alert } from 'react-native';
import { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { useGlobalVariables } from '../utils/globalContext';
import { Theme } from '../assets/theme';
import { useRouter } from 'expo-router';
import useTranslation from '../utils/useTranslation';
import { uploadRecordToREDCap } from '../utils/redcap';
import { GlobalStyles as Style } from '@/assets/styles';

// Page for saving single measurement to REDCap
export default function SaveDataToREDCap() {
  const router = useRouter();
  const { t } = useTranslation();
  const [response, setResponse] = useState<string | null>(null);
  const [recordID, setRecordID] = useState<string>("");

  const { REDCapAPI, REDCapURL, rrTaps, rrate, rrTime, tapTimestamps } = useGlobalVariables();

  const handleUpload = async () => {
    if (!REDCapURL || !REDCapAPI) {
      Alert.alert('Missing Info', 'Please enter your REDCap URL and API token in Settings first.');
      return;
    }

    try {
      // The new record to upload
      const record = [
        {
          record_id: recordID,
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
    <View style={Style.redirectScreenContainer}>
      <View style={{ alignItems: 'center', justifyContent: 'center', width: 350 }}>
        <Image
          source={require('@/assets/images/REDCap-icon.png')}
          style={{ width: 67, height: 70, marginBottom: 20 }}
        />
        <Text style={Style.pageTitle}>Save Data to REDCap</Text>
        <Text style={{ paddingBottom: 10, fontSize: 16 }}><Text style={{ fontWeight: 'bold', fontSize: 16 }}>Rate:</Text> {rrate} breaths/min </Text>
        <Text style={{ fontSize: 16 }}> <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Number of taps:</Text> {tapTimestamps.length} </Text>
        <TextInput
          label="Record ID"
          value={recordID}
          style={[Style.textField, { marginTop: 15, marginBottom: 0 }]}
          onChangeText={text => setRecordID(text)}
        />
        <View style={Style.lightButtonContainer}>
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
    </View>
  )
}