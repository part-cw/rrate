import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import { useGlobalVariables } from '../app/globalContext';
import { uploadRecordToREDCap } from '../services/redcap';
import { GlobalStyles as Style } from '../assets/styles';

export default function testREDCapUpload() {
  const { REDCapAPI, REDCapURL } = useGlobalVariables();
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!REDCapURL || !REDCapAPI) {
      Alert.alert('Missing Info', 'Please enter your REDCap URL and API token in Settings first.');
      return;
    }

    const record = [
      {
        age: 3,
        rrate: 42,
        timestamp: new Date().toISOString(),
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
      setResponse('Uploasd failed:\n' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[Style.screenContainer, { padding: 24 }]}>
      <Text style={{ fontSize: 20, marginBottom: 16, fontWeight: 'bold' }}>Upload to REDCap</Text>

      <Button title={isLoading ? 'Uploading...' : 'Upload Sample Record'} onPress={handleUpload} disabled={isLoading} />

      {response && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16 }}>{response}</Text>
        </View>
      )}
    </ScrollView>
  );
}
