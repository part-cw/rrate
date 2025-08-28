import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { Button, Switch } from 'react-native-paper';
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
import ToggleButton from "../components/ToggleButton";

// Displays all general settings for the app, including language selection, age interpretation, REDCap settings, and configuration settings.
export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();

  const { REDCap, selectedLanguage, setSelectedLanguage, ageThresholdEnabled, setAgeThresholdEnabled, exportDataEnabled, setExportDataEnabled,
    sensoryFeedbackAfterMeasurement, setSensoryFeedbackAfterMeasurement, sensoryFeedbackDuringMeasurement, setSensoryFeedbackDuringMeasurement, endChimeEnabled,
    setEndChimeEnabled, cancelAlertEnabled, setCancelAlertEnabled, sensoryFeedbackMethod, setSensoryFeedbackMethod, REDCapAPI, REDCapURL, LongitudinalStudyEvent,
    RepeatableEvent, RepeatableInstrument
  } = useGlobalVariables();

  const ageThresholdToggle = () => {
    setAgeThresholdEnabled(!ageThresholdEnabled);
  }
  const [response, setResponse] = useState<string>("");
  const [REDCapDataStored, setREDCapDataStored] = useState<boolean>(false);
  const [dataForExportStored, setDataForExportStored] = useState<boolean>(false);

  // ADD THIS FOR LATER VERSIONS THAT SUPPORT MULTIPLE LANGUAGES
  const languages = [
    'Amharic', 'Aymara', 'Dinka', 'English', 'Español',
    'Français', 'Khmer', 'Luganda', 'Português', 'Quechua',
  ];

  // const languages = [
  //   'English'
  // ];

  const audioOptions = [t("AUDIO"), t("VIBRATE")];

  // On load, checks to see if REDCap data is stored in AsyncStorage or if there is data stored for export
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const checkREDCapData = async () => {
        const result = await storedREDCapDataExists();
        setREDCapDataStored(result);
        if (!result) {
          setResponse(t("NO_SAVED_SESSIONS"));
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
      setResponse(`${t("MISSING_INFO")}:\n ${t("MISSING_REDCAP")}`);
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
      setResponse(t("ALL_SESSIONS_SAVED"));
    } catch (error: any) {
      setResponse(`${t("UPLOAD_FAILED")}:\n${t("MISSING_REDCAP")}`);
      console.log('Error uploading to REDCap:', error.message || error);
    }
  };

  return (
    <ScrollView contentContainerStyle={Style.screenContainer}>
      <View style={Style.innerContainer}>
        <View style={{ alignItems: 'flex-start' }}>
          <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.back()}>
            {t("BACK")}
          </Button>
        </View>

        {/* Language Selection */}
        <View style={[Style.floatingContainer, { zIndex: 100 }]}>
          <Text style={[Style.heading, { marginBottom: 10 }]}>{t("SLCT_LANGUAGE")}</Text>
          <DropDown label={selectedLanguage} data={languages} onSelect={(val) => setSelectedLanguage(val)} />
        </View>

        {/* Patient Age Interpretation Dropdown */}
        <View style={Style.floatingContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={Style.heading}>{t("AGE_INTRP")}</Text>
            <Switch value={ageThresholdEnabled}
              onValueChange={ageThresholdToggle} />
          </View>
          <View style={{ marginVertical: 20 }}>
            <Text style={[Style.text, { color: "#707070" }]}>{t("AGE_INTRP_DESC")}
              <Text style={{ color: Theme.colors.secondary, fontWeight: "bold" }}> {t("NORMAL")}</Text> {t("OR")}
              <Text style={{ color: Theme.colors.tertiary, fontWeight: "bold" }}> {t("HIGH")}</Text> </Text>
          </View>
        </View>

        {/* Sensory Feedback - Audio and Vibrations */}
        <View style={Style.floatingContainer}>
          {Platform.OS !== 'web' ? <Text style={[Style.heading, { marginBottom: 10 }]}>{t("SENS_FEEDBACK")}</Text> :
            <Text style={[Style.heading, { marginBottom: 10 }]}>{t("AUDIO")}</Text>}
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {/* Only allow vibrations on mobile */}
            {Platform.OS !== "web" &&
              <ToggleButton values={audioOptions} selectedValue={sensoryFeedbackMethod} iconNames={["volume-high", "vibrate"]} onChange={(value) => setSensoryFeedbackMethod(value)} />}
          </View>
          <View style={{ margin: 10 }}>
            <Checkbox label={t("BREATHING_DURING")} checked={sensoryFeedbackDuringMeasurement} onChange={() => setSensoryFeedbackDuringMeasurement(!sensoryFeedbackDuringMeasurement)} />
            <Checkbox label={t("BREATHING_AFTER")} checked={sensoryFeedbackAfterMeasurement} onChange={() => setSensoryFeedbackAfterMeasurement(!sensoryFeedbackAfterMeasurement)} />
            <Checkbox label={t("ALERT_COMPLETE")} checked={endChimeEnabled} onChange={() => setEndChimeEnabled(!endChimeEnabled)} />
            <Checkbox label={t("ALERT_FAILED")} checked={cancelAlertEnabled} onChange={() => setCancelAlertEnabled(!cancelAlertEnabled)} />
          </View>
        </View>

        {/* Patient Model (Baby Animation) Selection */}
        <PatientModelPicker />

        {/* Upload to REDCap */}
        {Platform.OS !== 'web' && REDCap && <View style={Style.floatingContainer}>
          <Text style={[Style.heading, { marginBottom: 10 }]}>{t("UPLOAD_REDCAP")}</Text>
          <View >
            <Text style={[Style.text, { color: "#707070" }]}>{t("IMPORT_REDCAP")}</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
            {REDCapDataStored &&
              <Button mode="contained" contentStyle={{ backgroundColor: Theme.colors.tertiary, width: 200 }} onPress={() => handleBulkUpload()}>{t("UPLOAD_SIMPLE")}</Button>}
          </View>
          {response && (
            <View>
              <Text style={[Style.text, { marginTop: 10, textAlign: 'center' }]}>{response}</Text>
            </View>
          )}
        </View>}

        {/* Data Export */}
        {!REDCap && <View style={Style.floatingContainer}>
          <Text style={[Style.heading, { marginBottom: 10 }]}>{t("EXPORT")}</Text>
          <Text style={[Style.text, { color: "#707070" }]}>{t("DOWNLOAD")}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Switch value={exportDataEnabled}
              onValueChange={setExportDataEnabled} />
            <Text style={[Style.text, { paddingHorizontal: 20, paddingVertical: 10 }]}>{t("SAVE_DOWNLOAD")}</Text>
          </View>
          {dataForExportStored && <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
            <Button mode="contained" contentStyle={{ backgroundColor: Theme.colors.secondary, width: 200 }}
              onPress={() => {
                exportCSV();
                setDataForExportStored(false);
              }}>
              {t("EXPORT_CSV")}</Button>
          </View>}
        </View>
        }

        {/* Configuration Settings */}
        <Pressable onPress={() => router.push('/passwordConfigSettings')}>
          <View style={[Style.floatingContainer, {
            flexDirection: 'row', alignItems: 'center'
          }]}>

            <EvilIcons name="lock" size={35} color="black" />
            <Text style={Style.heading}>{t("CONFIG_SETT")}</Text>
          </View>
        </Pressable>

        <Copyright />

      </View>
    </ScrollView >
  );
}