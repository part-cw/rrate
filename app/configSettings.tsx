import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, Platform, InteractionManager } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from 'react-native-paper';
import { GlobalStyles as Style } from "../assets/styles";
import { Theme } from "../assets/theme";
import { useRouter } from "expo-router";
import { useGlobalVariables } from "../utils/globalContext";
import useTranslation from '../utils/useTranslation';
import Copyright from "../components/Copyright";
import RadioButtonGroup from "../components/RadioButtonGroup";
import Checkbox from "../components/Checkbox";
import Slider from "@react-native-community/slider";

// The configSettings page contains settings that should only be changed for research purposes, such as the measurement method, number of taps required, and 
// the consistency threshold.
export default function ConfigSettings() {
  const router = useRouter();
  const { t } = useTranslation();

  const { measurementMethod, setMeasurementMethod, tapCountRequired, setTapCountRequired, consistencyThreshold, setConsistencyThreshold,
    configSettingsUnlocked, setConfigSettingsUnlocked, REDCap, setREDCap, REDCapHost, setREDCapHost, REDCapURL, setREDCapURL, REDCapAPI, setREDCapAPI,
    LongitudinalStudy, setLongitudinalStudy, RepeatableEvent, setRepeatableEvent, UsingRepeatableInstruments, setUsingRepeatableInstruments,
    UploadSingleRecord, setUploadSingleRecord, setLongitudinalStudyEvent, setRepeatableInstrument
  } = useGlobalVariables();
  const [measurementMethodRadioButton, setmeasurementMethodRadioButton] = measurementMethod == "tap" ? useState('tap') : useState('timer');

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

          {/* REDCap Settings */}
          <View style={Style.floatingContainer}>
            <Text style={Style.heading}> REDCap</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
              <Checkbox label={t("REDCAP_USE")} checked={REDCap} onChange={() => { setREDCap(!REDCap) }} />
            </View>

            {REDCap && (
              <View >
                <TextInput label={t("HOST")} value={REDCapHost} style={Style.textField} onChangeText={text => setREDCapHost(text)} />
                <TextInput label={t("URL")} value={REDCapURL} style={Style.textField} onChangeText={text => setREDCapURL(text)} placeholder="/redcap/api/" />
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
                    <TextInput label="Instrument" onChangeText={text => setRepeatableInstrument(text)} />)}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox label="Upload After Each Measurement" checked={UploadSingleRecord} onChange={() => setUploadSingleRecord(!UploadSingleRecord)} />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                  {!UploadSingleRecord && REDCapHost && REDCapURL && REDCapAPI && (
                    <Button mode="contained" contentStyle={{ backgroundColor: Theme.colors.tertiary }} onPress={() => console.log("Save to REDCap")} >Upload to REDCap</Button>)}
                </View>
              </View>
            )}
          </View>

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