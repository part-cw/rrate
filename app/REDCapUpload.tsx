import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import { uploadRecordToREDCap, getNextRecordID } from '../utils/redcap';
import { GlobalStyles as Style } from '../assets/styles';
import { TextInput } from 'react-native-paper';
import useTranslation from '../utils/useTranslation';
import { useGlobalVariables } from '../utils/globalContext';

// Page for testing upload to REDCap - NOT FOR PRODUCTION 
export default function REDCapUpload() {
  const [REDCapAPI, setREDCapAPI] = useState<string>("");
  const [REDCapURL, setREDCapURL] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { rrate, rrTime, rrTaps } = useGlobalVariables();

  const handleUpload = async () => {
    if (!REDCapURL || !REDCapAPI) {
      Alert.alert('Missing Info', 'Please enter your REDCap URL and API token in Settings first.');
      return;
    }

    try {
      setIsLoading(true);

      // Fetch the most recent record id 
      // const nextRecordId = await getNextRecordID({ apiUrl: REDCapURL, apiToken: REDCapAPI });

      // The new record to upload
      const record = [
        {
          record_id: '2',
          rrate_rate: rrate,
          rrate_time: rrTime,
          rrate_taps: rrTaps
        },
      ];

      const result = await uploadRecordToREDCap({
        apiUrl: 'https://rc-demo.bcchr.ca/redcap_demo/api/', // HARDCODED
        apiToken: '64E3843F0A1B388A4FEFEF29CE3F206E',
        recordData: record,
        event: 'practiceevent_arm_1',
        //practiceevent_arm_1
        recordID: '2',
        repeatableEvent: true,
        repeatInstrument: 'form_1',
      });
      setResponse('Upload successful!');
    } catch (error: any) {
      setResponse('Upload failed:\n' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[Style.screenContainer, { padding: 24 }]}>
      <Text style={{ fontSize: 20, marginBottom: 16, fontWeight: 'bold' }}>Upload to REDCap</Text>
      <TextInput
        label={t("URL")}
        value={REDCapURL}
        style={{ shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 3, elevation: 3, marginVertical: 10 }}
        onChangeText={text => setREDCapURL(text)}
        placeholder="/redcap/api/"
      />
      <TextInput
        label={t("TOKEN")}
        value={REDCapAPI}
        style={{ shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 3, elevation: 3, marginVertical: 10 }}
        onChangeText={text => setREDCapAPI(text)}
      />

      {/* Upload Button */}
      <Button title={isLoading ? 'Uploading...' : 'Upload Sample Record'} onPress={handleUpload} disabled={isLoading} />

      {response && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16 }}>{response}</Text>
        </View>
      )}
    </ScrollView>
  );
}
