import { View, Text, Image, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { useGlobalVariables } from '../utils/globalContext';
import { Theme } from '../assets/theme';
import { useRouter } from 'expo-router';
import useTranslation from '../utils/useTranslation';
import { uploadRecordToREDCap } from '../utils/redcap';
import { GlobalStyles as Style } from '@/assets/styles';
import { saveSession, loadDatabase, deleteDatabase } from '../utils/storeSessionData';

// Page for saving single measurement to REDCap
export default function SaveDataToREDCap() {
  const router = useRouter();
  const { t } = useTranslation();
  const [response, setResponse] = useState<string | null>(null);
  const [recordID, setRecordID] = useState<string>("");
  const [isRecordSaved, setIsRecordSaved] = useState<boolean>(false);

  const { REDCapAPI, REDCapURL, LongitudinalStudyEvent, RepeatableEvent, RepeatableInstrument, rrTaps, rrate, rrTime, tapTimestamps } = useGlobalVariables();

  // Load the database of saved sessions when the page loads
  useEffect(() => {
    async function debugDB() {
      const db = await loadDatabase();
      console.log('Current DB contents:', JSON.stringify(db, null, 2));
    }

    debugDB();
  }, []);

  // Handles upload of record ID, rate, time, and tap string to REDCap
  const handleUpload = async () => {
    if (!REDCapURL || !REDCapAPI) {
      Alert.alert('Missing Info', 'Please enter your REDCap URL and API token in Settings first.');
      return;
    }

    try {
      // Access saved measurements that need to be uploaded to REDCap
      const db = await loadDatabase();
      const recordNums = Object.keys(db);

      if (recordNums.length === 0) {
        setResponse('No saved sessions requiring upload.');
      }

      for (const recordNum of recordNums) {
        const sessions = db[recordNum];
        const session = sessions[0];

        if (!session) {
          continue; // Skip if no session data
        }

        // The new record to upload
        const record = [
          {
            record_id: recordID,
            rrate_rate: session.rr_rate,
            rrate_time: session.rr_time,
            rrate_taps: session.rr_taps
          },
        ];

        const result = await uploadRecordToREDCap({
          apiUrl: REDCapURL,
          apiToken: REDCapAPI,
          recordData: record,
          recordID,
          event: LongitudinalStudyEvent,
          repeatableEvent: RepeatableEvent,
          repeatInstrument: RepeatableInstrument,
        });

        console.log('Upload result for Record ID ' + recordID + ':' + result);
      }

      await deleteDatabase();
      setResponse('All sessions uploaded successfully and local database cleared.');
    } catch (error: any) {
      setResponse('Upload failed:\n' + error.message);
    }
  };

  return (
    <View style={Style.redirectScreenContainer}>
      <View style={{ alignItems: 'center', justifyContent: 'center', width: 350 }}>
        <Image
          source={require('../assets/images/REDCap-icon.png')}
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
          {isRecordSaved ?
            <Button icon="upload" buttonColor={Theme.colors.secondary} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => handleUpload()}>
              {t("UPLOAD")}
            </Button> :
            <Button icon="upload" buttonColor={Theme.colors.secondary} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => {
              try {
                saveSession(recordID, rrate, rrTime, rrTaps);
                setResponse("Session saved.");
                setIsRecordSaved(true);
              } catch (error: any) {
                setResponse("Error saving session: " + error.message);
              }
            }}>
              {t("SAVE")}
            </Button>
          }
        </View>
        {response && (
          <View >
            <Text style={{ fontSize: 16 }}>{response}</Text>
          </View>
        )}
      </View>
    </View>
  )
}