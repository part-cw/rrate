import { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, Pressable, Platform } from "react-native";
import { Button, Switch } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles as Style } from "../assets/styles";
import { useRouter } from "expo-router";
import { useGlobalVariables } from "../utils/globalContext";
import { Theme } from "../assets/theme";
import { loadREDCapDatabase, deleteREDCapDatabase } from "../utils/storeSessionData";
import { exportCSV, storedDataExists, storedREDCapDataExists } from "../utils/storeSessionData";
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

  const { REDCap, selectedLanguage, setSelectedLanguage, ageThresholdEnabled, setAgeThresholdEnabled, breathingAudioDuringEnabled, setBreathingAudioDuringEnabled, exportDataEnabled, setExportDataEnabled,
    breathingAudioAfterEnabled, setBreathingAudioAfterEnabled, endChimeEnabled, setEndChimeEnabled, cancelAlertEnabled, setCancelAlertEnabled, vibrationsDuringEnabled, setVibrationsDuringEnabled,
    vibrationsAfterEnabled, setVibrationsAfterEnabled, REDCapAPI, REDCapURL, LongitudinalStudyEvent, RepeatableEvent, RepeatableInstrument
  } = useGlobalVariables();

  const ageThresholdToggle = () => {
    setAgeThresholdEnabled(!ageThresholdEnabled);
  }
  const [response, setResponse] = useState<string>("");
  const [REDCapDataStored, setREDCapDataStored] = useState<boolean>(false);
  const [dataForExportStored, setDataForExportStored] = useState<boolean>(false);

  // ADD THIS FOR LATER VERSIONS THAT SUPPORT MULTIPLE LANGUAGES
  // const languages = [
  //   'Amharic', 'Aymara', 'Dinka', 'English', 'Español',
  //   'Français', 'Khmer', 'Luganda', 'Português', 'Quechua',
  // ];

  const languages = [
    'English'
  ];

  // On load, checks to see if REDCap data is stored in AsyncStorage or if there is data stored for export
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const checkREDCapData = async () => {
        const result = await storedREDCapDataExists();
        console.log("REDCap data stored: ", result);
        setREDCapDataStored(result);
        if (!result) {
          setResponse('No saved sessions for upload.');
        }
      };
      checkREDCapData();
    }

    // Check if stored data exists for export
    const checkStoredData = async () => {
      const result = await storedDataExists();
      setDataForExportStored(result);
    };
    checkStoredData();
  }, []);

  // Handles bulk upload of stored measurements to REDCap
  const handleBulkUpload = async () => {
    if (!REDCapURL || !REDCapAPI) {
      setResponse('Missing Info: Please enter your REDCap URL and API token in Settings first.');
      return;
    }

    try {
      // Access saved measurements that need to be uploaded to REDCap
      const db = await loadREDCapDatabase();
      const recordNums = Object.keys(db);

      if (recordNums.length === 0) {
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

      await deleteREDCapDatabase();
      setREDCapDataStored(false);
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
            <Text style={[Style.heading, { marginBottom: 10 }]}>Select Language </Text>
            <DropDown label={selectedLanguage} data={languages} onSelect={(val) => setSelectedLanguage(val)} />
          </View>

          {/* Patient Age Interpretation Dropdown */}
          <View style={Style.floatingContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={Style.heading}>Patient Age Interpretation </Text>
              <Switch value={ageThresholdEnabled}
                onValueChange={ageThresholdToggle} />
            </View>
            <View style={{ marginVertical: 20 }}>
              <Text style={[Style.text, { color: "#707070" }]}>Uses age-based thresholds to classify the respiratory rate as
                <Text style={{ color: Theme.colors.secondary, fontWeight: "bold" }}> normal</Text> or
                <Text style={{ color: Theme.colors.tertiary, fontWeight: "bold" }}> high.</Text> </Text>
            </View>
          </View>

          {/* Audio */}
          <View style={Style.floatingContainer}>
            <Text style={[Style.heading, { marginBottom: 10 }]}>Audio</Text>
            <View>
              <View style={{ margin: 10 }}>
                <Text style={Style.subheading}>Breathing Audio</Text>
                <Checkbox label="Play during measurement" checked={breathingAudioDuringEnabled} onChange={() => setBreathingAudioDuringEnabled(!breathingAudioDuringEnabled)} />
                <Checkbox label="Play after measurement" checked={breathingAudioAfterEnabled} onChange={() => setBreathingAudioAfterEnabled(!breathingAudioAfterEnabled)} />
              </View>
              <View style={{ margin: 10 }}>
                <Text style={Style.subheading}>Vibrations</Text>
                <Checkbox label="Vibrate during measurement" checked={vibrationsDuringEnabled} onChange={() => setVibrationsDuringEnabled(!vibrationsDuringEnabled)} />
                <Checkbox label="Vibrate after measurement" checked={vibrationsAfterEnabled} onChange={() => setVibrationsAfterEnabled(!vibrationsAfterEnabled)} />
              </View>
              <View style={{ margin: 10 }}>
                <Text style={Style.subheading}>Status Alert</Text>
                <Checkbox label="Sound alert when measurement is complete" checked={endChimeEnabled} onChange={() => setEndChimeEnabled(!endChimeEnabled)} />
                <Checkbox label="Sound alert when measurement has failed" checked={cancelAlertEnabled} onChange={() => setCancelAlertEnabled(!cancelAlertEnabled)} />
              </View>
            </View>
          </View>

          {/* Patient Model (Baby Animation) Selection */}
          <PatientModelPicker />

          {/* Upload to REDCap */}
          {Platform.OS !== 'web' && <View style={Style.floatingContainer}>
            <Text style={[Style.heading, { marginBottom: 10 }]}>Upload to REDCap</Text>
            <View >
              <Text style={[Style.text, { color: "#707070" }]}>Import all saved measurements to your REDCap project.</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
              {REDCapURL && REDCapAPI && REDCapDataStored &&
                <Button mode="contained" contentStyle={{ backgroundColor: Theme.colors.tertiary, width: 200 }} onPress={() => handleBulkUpload()}>Upload</Button>}
            </View>
            {response && (
              <View>
                <Text style={[Style.text, { marginTop: 10, textAlign: 'center' }]}>{response}</Text>
              </View>
            )}
          </View>}

          {/* Data Export */}
          {!REDCap && <View style={Style.floatingContainer}>
            <Text style={[Style.heading, { marginBottom: 10 }]}>Export Data</Text>
            <Text style={[Style.text, { color: "#707070" }]}>Download up to 200 measurements as a CSV file.</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch value={exportDataEnabled}
                onValueChange={setExportDataEnabled} />
              <Text style={[Style.text, { padding: 15 }]}>Save measurements for download.</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
              {dataForExportStored && <Button mode="contained" contentStyle={{ backgroundColor: Theme.colors.secondary, width: 200 }}
                onPress={() => {
                  exportCSV();
                  setDataForExportStored(false);
                }}>
                Export CSV</Button>}
            </View>
          </View>
          }

          {/* Configuration Settings */}
          <Pressable onPress={() => router.push('/passwordConfigSettings')}>
            <View style={[Style.floatingContainer, {
              flexDirection: 'row', alignItems: 'center'
            }]}>

              <EvilIcons name="lock" size={35} color="black" />
              <Text style={Style.heading}>Configuration Settings</Text>
            </View>
          </Pressable>

          <Copyright />

        </View>
      </ScrollView >
    </SafeAreaView >
  );
}