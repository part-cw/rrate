import { View, Text, Image, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { useGlobalVariables } from '../utils/globalContext';
import { Theme } from '../assets/theme';
import { useRouter } from 'expo-router';
import useTranslation from '../utils/useTranslation';
import { uploadRecordToREDCap } from '../utils/redcap';
import { GlobalStyles as Style } from '@/assets/styles';
import { saveSession, loadDatabase } from '../utils/storeSessionData';

// Page for saving single measurement to REDCap or to AsyncStorage
export default function SaveDataToREDCap() {
  const router = useRouter();
  const { t } = useTranslation();
  const [response, setResponse] = useState<string | null>(null);
  const [recordID, setRecordID] = useState<string>("");
  const [isRecordSaved, setIsRecordSaved] = useState<boolean>(false);

  const { REDCapAPI, REDCapURL, LongitudinalStudyEvent, RepeatableEvent, RepeatableInstrument, UploadSingleRecord, rrTaps, rrate, rrTime, tapTimestamps } = useGlobalVariables();

  // Load the database of saved measurements when the page loads
  useEffect(() => {
    async function debugDB() {
      const db = await loadDatabase();
      console.log('Current DB contents:', JSON.stringify(db, null, 2));
    }

    debugDB();
  }, []);

  // Handles upload of most recent session, posting record ID, rate, time, and tap string to REDCap
  const handleSingleUpload = async () => {
    if (!REDCapURL || !REDCapAPI) {
      setResponse('Please enter your REDCap URL and API token in Settings first.');
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
        recordID,
        event: LongitudinalStudyEvent,
        repeatableEvent: RepeatableEvent,
        repeatInstrument: RepeatableInstrument,
      });

      console.log('Upload result for Record ID ' + recordID + ':' + result);
      setResponse('Upload successful!');

      // Redirect to the main screen after 3 seconds
      setTimeout(() => {
        router.replace('/');
      }, 3000);


    } catch (error: any) {
      setResponse('Upload failed:\nPlease check your REDCap settings and try again.');
      console.log('Error uploading to REDCap:', error.message || error);
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
          {isRecordSaved && UploadSingleRecord ?
            <Button icon="upload" buttonColor={Theme.colors.secondary} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => handleSingleUpload()}>
              {t("UPLOAD")}
            </Button> :
            <Button icon="arrow-collapse-down" buttonColor={Theme.colors.secondary} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => {
              try {
                saveSession(recordID, rrate, rrTime, rrTaps);
                setResponse("Session saved.");
                setIsRecordSaved(true);
                if (!UploadSingleRecord) router.push({ pathname: "/results", params: { rrateConfirmed: 'true', isRecordSaved: 'true' } });

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