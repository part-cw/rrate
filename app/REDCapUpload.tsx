import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import { uploadRecordToREDCap } from '../services/redcap';
import { GlobalStyles as Style } from '../assets/styles';
import { TextInput } from 'react-native-paper';
import useTranslation from '@/hooks/useTranslation';

export default function REDCapUpload() {
  const [REDCapAPI, setREDCapAPI] = useState<string>("");
  const [REDCapURL, setREDCapURL] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [timestamps, setTimestamps] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleUpload = async () => {
    if (!REDCapURL || !REDCapAPI) {
      Alert.alert('Missing Info', 'Please enter your REDCap URL and API token in Settings first.');
      return;
    }

    const record = [
      {
        rr_rate: rate,
        rr_time: new Date().toISOString(),
        rr_taps: timestamps,
        notes: 'Test record from app',
      },
    ];

    try {
      setIsLoading(true);
      const result = await uploadRecordToREDCap({
        apiUrl: REDCapURL,
        apiToken: REDCapAPI,
        recordData: record,
      });
      setResponse('Upload successful:\n' + result);
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
      <TextInput
        label="Timestamps"
        value={timestamps}
        style={{ shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 3, elevation: 3, marginVertical: 10 }}
        onChangeText={text => setTimestamps(text)}
      />
      <TextInput
        label="Rate"
        value={rate}
        style={{ shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 3, elevation: 3, marginVertical: 10 }}
        onChangeText={text => setRate(text)}
      />

      <Button title={isLoading ? 'Uploading...' : 'Upload Sample Record'} onPress={handleUpload} disabled={isLoading} />


      {response && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16 }}>{response}</Text>
        </View>
      )}
    </ScrollView>
  );
}
