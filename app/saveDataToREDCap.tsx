import { View, Text, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { useGlobalVariables } from '../utils/globalContext';
import { Theme } from '../assets/theme';
import { useRouter } from 'expo-router';
import useTranslation from '../utils/useTranslation';
import { uploadRecordToREDCap } from '../utils/redcap';
import { GlobalStyles as Style } from '@/assets/styles';
import { saveREDCapSession } from '../utils/storeSessionData';

// Page for saving single measurement to REDCap
export default function SaveDataToREDCap() {
  const router = useRouter();
  const { t } = useTranslation();

  // LOCAL VARIABLES
  const [response, setResponse] = useState<string | null>(null);
  const [recordID, setRecordID] = useState<string>("");
  // Variables used for button logic
  const [isRecordSaved, setIsRecordSaved] = useState<boolean>(false);
  const [isRecordUploaded, setIsRecordUploaded] = useState<boolean>(false);

  const { REDCapAPI, REDCapURL, LongitudinalStudyEvent, RepeatableEvent, RepeatableInstrument, UploadSingleRecord,
    rrTaps, rrate, rrTime, tapTimestamps } = useGlobalVariables();

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

      setIsRecordUploaded(true);
      console.log('Upload result for Record ID ' + recordID + ':' + result);
      setResponse('Upload successful!');

    } catch (error: any) {
      setResponse(`Upload failed:\nPlease check your REDCap settings and try again.`);
      console.log(`Error uploading to REDCap:\n`, error.message || error);
    }
  };

  // Handles saving most recent session to REDCap storage
  const handleSingleSave = async () => {
    try {
      await saveREDCapSession(recordID, rrate, rrTime, rrTaps);
      setResponse("Session saved.");
      setIsRecordSaved(true);

    } catch (error: any) {
      setResponse(`Error saving session:\n` + error.message);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0} >
      <View style={Style.redirectScreenContainer}>
        <View style={{ alignItems: 'center', justifyContent: 'center', width: 350 }}>
          <Image
            source={require('../assets/images/REDCap-icon.png')}
            style={{ width: 67, height: 70, marginBottom: 20 }}
          />
          <Text style={Style.pageTitle}>Save Data to REDCap</Text>
          <Text style={[Style.text, { paddingBottom: 10 }]}><Text style={{ fontWeight: 'bold' }}>Rate:</Text> {rrate} breaths/min </Text>
          <Text style={[Style.text, { paddingBottom: 10 }]}><Text style={{ fontWeight: 'bold' }}>Number of taps:</Text> {tapTimestamps.length} </Text>
          <View style={{ width: '50%' }}>
            <TextInput
              label="Record ID"
              value={recordID}
              style={[Style.textField, { marginBottom: 0 }]}
              onChangeText={text => setRecordID(text)}
            />
          </View>
          <View style={Style.lightButtonContainer}>
            {/* Record is not saved */}
            {!isRecordSaved &&
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" style={{ marginHorizontal: 5 }}
                  onPress={() => router.push({ pathname: "/results", params: { rrateConfirmed: 'true', isRecordSaved: `${isRecordSaved}` } })}>
                  {t("BACK")}
                </Button>
                <Button icon="arrow-collapse-down" buttonColor={Theme.colors.secondary} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => handleSingleSave()}>
                  {t("SAVE")}
                </Button>
              </View>}
            {/* Record is saved but not uploaded; use column layout to fit well on mobile */}
            {isRecordSaved && !isRecordUploaded && UploadSingleRecord &&
              <View style={{ flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <Button icon="upload" buttonColor={Theme.colors.secondary} mode="contained" style={{ marginHorizontal: 5, }} onPress={() => handleSingleUpload()}>
                  {t("UPLOAD")}
                </Button>
                <Button icon="arrow-u-right-bottom" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.push("/")} style={{ width: '100%' }}>
                  {t("RESTART")} </Button>
              </View>}
            {/* Record is uploaded or saved*/}
            {isRecordUploaded || isRecordSaved && !UploadSingleRecord &&
              <Button icon="arrow-u-right-bottom" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.push("/")} style={{ width: '100%' }}>
                {t("RESTART")} </Button>}
          </View>
          {response && (
            <View style={{ justifyContent: 'center', alignItems: 'center', width: 300 }}>
              <Text style={{ fontSize: 16, textAlign: 'center' }}>{response}</Text>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}