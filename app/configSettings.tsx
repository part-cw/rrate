import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, Platform, InteractionManager } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from 'react-native-paper';
import { GlobalStyles as Style } from "../assets/styles";
import { Theme } from "../assets/theme";
import { useRouter } from "expo-router";
import { useGlobalVariables } from "../utils/globalContext";
import useTranslation from '../utils/useTranslation';
import { uploadRecordToREDCap } from "../utils/redcap";
import { loadDatabase, deleteDatabase } from "../utils/storeSessionData";
import Copyright from "../components/Copyright";
import RadioButtonGroup from "../components/RadioButtonGroup";
import Checkbox from "../components/Checkbox";
import Slider from "@react-native-community/slider";

// The configSettings page contains settings that should only be changed for research purposes, such as the measurement method, number of taps required, and the consistency threshold.
export default function ConfigSettings() {
  const router = useRouter();
  const { t } = useTranslation();

  const { measurementMethod, setMeasurementMethod, tapCountRequired, setTapCountRequired, consistencyThreshold, setConsistencyThreshold,
    configSettingsUnlocked, setConfigSettingsUnlocked, REDCap, setREDCap, REDCapURL, setREDCapURL, REDCapAPI, setREDCapAPI,
    LongitudinalStudy, setLongitudinalStudy, LongitudinalStudyEvent, RepeatableEvent, setRepeatableEvent, UsingRepeatableInstruments, setUsingRepeatableInstruments,
    RepeatableInstrument, UploadSingleRecord, setUploadSingleRecord, setLongitudinalStudyEvent, setRepeatableInstrument
  } = useGlobalVariables();
  const [measurementMethodRadioButton, setmeasurementMethodRadioButton] = measurementMethod == "tap" ? useState('tap') : useState('timer');
  const [response, setResponse] = useState<string>("");

  // Only allow access if config settings are unlocked; prevents unauthorized access through URL manipulation.
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      if (!configSettingsUnlocked) {
        router.replace('/passwordConfigSettings');
        console.log("You must enter the password to access the configuration settings.")
      }
    });

    return () => task.cancel();
  }, [configSettingsUnlocked]);

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
      setResponse('Upload failed:\n' + error.message);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={Style.screenContainer}>
        <View style={Style.innerContainer}>
          <View style={{ alignItems: 'flex-start', width: 350 }}>
            <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => {
              setConfigSettingsUnlocked(false);
              router.back();
            }}>
              {t("BACK")}
            </Button>
          </View>

          {/* REDCap Settings - only display on mobile due to lack of secure web storage for API token */}
          {Platform.OS !== 'ios' && (
            <View style={Style.floatingContainer}>
              <Text style={Style.heading}> REDCap</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                <Checkbox label={t("REDCAP_USE")} checked={REDCap} onChange={() => { setREDCap(!REDCap) }} />
              </View>

              {REDCap && (
                <View >
                  <TextInput label={t("URL")} value={REDCapURL} style={Style.textField} onChangeText={text => setREDCapURL(text)} />
                  <TextInput
                    label={t("TOKEN")}
                    value={REDCapAPI}
                    style={Style.textField}
                    onChangeText={text => {
                      setREDCapAPI(text);
                    }}
                  />

                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Checkbox label={t("LONGITUDINAL")} checked={LongitudinalStudy} onChange={() => setLongitudinalStudy(!LongitudinalStudy)} />
                    </View>
                    {LongitudinalStudy && (
                      <TextInput
                        label="Event"
                        value={LongitudinalStudyEvent}
                        onChangeText={text => setLongitudinalStudyEvent(text)} />)}
                  </View>

                  {LongitudinalStudy && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                      <Checkbox label={t("REP_EVENTS")} checked={RepeatableEvent} onChange={() => {
                        setRepeatableEvent(!RepeatableEvent);
                        if (UsingRepeatableInstruments) setUsingRepeatableInstruments(false);
                      }} />
                    </View>
                  )}

                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Checkbox label={t("REP_FORMS")} checked={UsingRepeatableInstruments} onChange={() => {
                        setUsingRepeatableInstruments(!UsingRepeatableInstruments);
                        if (RepeatableEvent) setRepeatableEvent(false);
                      }} />
                    </View>
                    {UsingRepeatableInstruments && (
                      <TextInput label="Instrument" value={RepeatableInstrument} onChangeText={text => setRepeatableInstrument(text)} />)}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox label="Upload After Each Measurement" checked={UploadSingleRecord} onChange={() => setUploadSingleRecord(!UploadSingleRecord)} />
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                    {!UploadSingleRecord && REDCapURL && REDCapAPI && (
                      <Button mode="contained" contentStyle={{ backgroundColor: Theme.colors.tertiary }} onPress={() => handleBulkUpload()}>Upload to REDCap</Button>)}
                    {response && (
                      <View >
                        <Text style={{ fontSize: 16 }}>{response}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Measurement Method Selection*/}
          <View style={[Style.floatingContainer]}>
            <Text style={Style.heading}> Measurement Method </Text>
            <RadioButtonGroup
              options={[
                { label: t("CHECK"), value: 'tap' },
                { label: t("ONEMIN"), value: 'timer' },
              ]}
              selected={measurementMethodRadioButton}
              onSelect={(value) => {
                setmeasurementMethodRadioButton(value);
                setMeasurementMethod(value);
                console.log("Measurement Method set to: " + measurementMethod);
              }}
            />
          </View>

          {/* Number of Taps Selection*/}
          <View style={Style.floatingContainer}>
            <Text style={Style.heading}>Taps </Text>
            <View style={{ paddingVertical: 20 }}>
              <Text>{t("CONSISTENCY_NUM_TAPS")}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Slider
                style={{ width: 300, height: Platform.OS == "web" ? 50 : 60 }}
                minimumValue={3}
                maximumValue={6}
                step={1}
                value={tapCountRequired}
                thumbTintColor={Theme.colors.primary}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#000000"
                tapToSeek={true}
                StepMarker={({ stepMarked, index }) => (
                  <View style={[Style.marker]}>
                    <Text style={[stepMarked && Style.markerActive]}>{index}</Text>
                  </View>
                )}
                onValueChange={(value) => setTapCountRequired(value)}
              />
            </View>
          </View>

          {/* Consistency Threshold Selection*/}
          <View style={Style.floatingContainer}>
            <Text style={Style.heading}>Consistency Threshold </Text>
            <View style={{ paddingVertical: 20 }}>
              <Text>{t("CONSISTENCY_THRESH")}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Slider
                style={{ width: 300, height: Platform.OS == "web" ? 50 : 60 }}
                minimumValue={10}
                maximumValue={14}
                value={consistencyThreshold}
                step={1}
                thumbTintColor={Theme.colors.primary}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#000000"
                tapToSeek={true}
                StepMarker={({ stepMarked, index }) => (
                  <View style={[Style.marker]}>
                    <Text style={[stepMarked && Style.markerActive]}>{index}%</Text>
                  </View>
                )}
                onValueChange={(value) => setConsistencyThreshold(value)}
              />
            </View>
          </View>

          <Copyright />

        </View>
      </ScrollView >
    </SafeAreaView>
  );
}