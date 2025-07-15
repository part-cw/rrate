import { useState } from "react";
import { View, Text, ScrollView, Alert, Pressable, Platform } from "react-native";
import { Button, Switch } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles as Style } from "../assets/styles";
import { useRouter } from "expo-router";
import { useGlobalVariables } from "../utils/globalContext";
import { Theme } from "../assets/theme";
import { loadDatabase, deleteDatabase } from "../utils/storeSessionData";
import { uploadRecordToREDCap } from "../utils/redcap";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import useTranslation from '../utils/useTranslation';
import DropDown from "../components/DropdownList";
import Copyright from "../components/Copyright";
import Checkbox from "../components/Checkbox";
import PatientModelPicker from "../components/PatientModelPicker";

// Displays all general settings for the app, including language selection, age interpretation, REDCap settings, and configuration settings.
export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();

  const { selectedLanguage, setSelectedLanguage, ageThresholdEnabled, setAgeThresholdEnabled, breathingAudioDuringEnabled, setBreathingAudioDuringEnabled,
    breathingAudioAfterEnabled, setBreathingAudioAfterEnabled, endChimeEnabled, setEndChimeEnabled, vibrationsEnabled, setVibrationsEnabled,
    REDCapAPI, REDCapURL, LongitudinalStudyEvent, RepeatableEvent, RepeatableInstrument
  } = useGlobalVariables();

  const ageThresholdToggle = () => {
    setAgeThresholdEnabled(!ageThresholdEnabled);
  }
  const [response, setResponse] = useState<string>("");

  // ADD THIS FOR LATER VERSIONS THAT SUPPORT MULTIPLE LANGUAGES
  // const languages = [
  //   'Amharic', 'Aymara', 'Dinka', 'English', 'Español',
  //   'Français', 'Khmer', 'Luganda', 'Português', 'Quechua',
  // ];

  const languages = [
    'English'
  ];

  // Handles bulk upload of stored measurements to REDCap
  const handleBulkUpload = async () => {
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
        return;
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
            record_id: session.record_id,
            rrate_rate: session.rr_rate,
            rrate_time: session.rr_time,
            rrate_taps: session.rr_taps
          },
        ];

        const result = await uploadRecordToREDCap({
          apiUrl: REDCapURL,
          apiToken: REDCapAPI,
          recordData: record,
          recordID: session.record_id,
          event: LongitudinalStudyEvent,
          repeatableEvent: RepeatableEvent,
          repeatInstrument: RepeatableInstrument,
        });

        console.log('Upload result for Record ID ' + session.record_id + ':' + result);
      }

      await deleteDatabase();
      setResponse('All sessions uploaded successfully and local database cleared.');
    } catch (error: any) {
      setResponse('Upload failed:\nPlease check your REDCap settings and try again.');
      console.log('Error uploading to REDCap:', error.message || error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={Style.screenContainer}>
        <View style={Style.innerContainer}>
          <View style={{ alignItems: 'flex-start' }}>
            <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.back()}>
              {t("BACK")}
            </Button>
          </View>

          {/* Language Selection */}
          <View style={Style.floatingContainer}>
            <Text style={[Style.heading, { marginBottom: 10 }]}> Select Language </Text>
            <DropDown label={selectedLanguage} data={languages} onSelect={(val) => setSelectedLanguage(val)} />
          </View>

          {/* Patient Age Interpretation Dropdown */}
          <View style={Style.floatingContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={Style.heading}> Patient Age Interpretation </Text>
              <Switch value={ageThresholdEnabled}
                onValueChange={ageThresholdToggle} />
            </View>
            <View style={{ marginVertical: 20 }}>
              <Text style={{ color: "#707070" }}>Uses age-based thresholds to classify the respiratory rate as
                <Text style={{ color: Theme.colors.secondary, fontWeight: "bold" }}> normal</Text> or
                <Text style={{ color: Theme.colors.tertiary, fontWeight: "bold" }}> high.</Text> </Text>
            </View>
          </View>

          {/* Audio */}
          <View style={Style.floatingContainer}>
            <Text style={[Style.heading, { marginBottom: 10 }]}> Audio </Text>
            <View>
              <Checkbox label="Breathing audio during measurement" checked={breathingAudioDuringEnabled} onChange={() => setBreathingAudioDuringEnabled(!breathingAudioDuringEnabled)} />
              <Checkbox label="Breathing audio after measurement" checked={breathingAudioAfterEnabled} onChange={() => setBreathingAudioAfterEnabled(!breathingAudioAfterEnabled)} />
              <Checkbox label="Vibration on inhalation" checked={vibrationsEnabled} onChange={() => setVibrationsEnabled(!vibrationsEnabled)} />
              <Checkbox label="Sound alert when measurement is complete" checked={endChimeEnabled} onChange={() => setEndChimeEnabled(!endChimeEnabled)} />
            </View>
          </View>

          {/* Patient Model (Baby Animation) Selection */}
          <PatientModelPicker />

          {/* Upload to REDCap */}
          {Platform.OS !== 'web' && <View style={Style.floatingContainer}>
            <Text style={[Style.heading, { marginBottom: 10 }]}>Upload to REDCap</Text>
            <View >
              <Text style={{ color: "#707070" }}>Import all saved measurements to your REDCap project.</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
              {REDCapURL && REDCapAPI ? (
                <Button mode="contained" contentStyle={{ backgroundColor: Theme.colors.tertiary, width: 200 }} onPress={() => handleBulkUpload()}>Upload</Button>) :
                (<Text style={{ color: Theme.colors.tertiary }}>No sessions to upload.</Text>)}
            </View>
            {response && (
              <View>
                <Text style={{ fontSize: 16, marginTop: 10, textAlign: 'center' }}>{response}</Text>
              </View>
            )}
          </View>}

          {/* Configuration Settings */}
          <Pressable onPress={() => router.push('/passwordConfigSettings')}>
            <View style={[Style.floatingContainer, {
              flexDirection: 'row', alignItems: 'center'
            }]}>

              <EvilIcons name="lock" size={35} color="black" />
              <Text style={Style.heading}> Configuration Settings</Text>
            </View>
          </Pressable>

          <Copyright />

        </View>
      </ScrollView >
    </SafeAreaView>
  );
}