import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type BabyAnimationOption = 1 | 2 | 3 | 4 | 5 | 6;

// Defines types and variables for global variables used across the app. 
type globalContextType = {
  // GENERAL SETTINGS
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;

  ageThresholdEnabled: boolean;
  setAgeThresholdEnabled: (enabled: boolean) => void;

  babyAnimation: BabyAnimationOption;
  setBabyAnimation: (value: BabyAnimationOption) => void;

  exportDataEnabled: boolean;
  setExportDataEnabled: (enabled: boolean) => void;

  configSettingsUnlocked: boolean;
  setConfigSettingsUnlocked: (unlocked: boolean) => void;

  breathingAudioDuringEnabled: boolean;
  setBreathingAudioDuringEnabled: (value: boolean) => void;

  breathingAudioAfterEnabled: boolean;
  setBreathingAudioAfterEnabled: (value: boolean) => void;

  cancelAlertEnabled: boolean;
  setCancelAlertEnabled: (value: boolean) => void;

  endChimeEnabled: boolean;
  setEndChimeEnabled: (value: boolean) => void;

  vibrationsEnabled: boolean;
  setVibrationsEnabled: (value: boolean) => void;

  // REDCap SETTINGS
  REDCap: boolean;
  setREDCap: (value: boolean) => void;

  REDCapURL: string;
  setREDCapURL: (url: string) => void;

  REDCapAPI: string;
  setREDCapAPI: (api: string) => void;

  LongitudinalStudy: boolean;
  setLongitudinalStudy: (value: boolean) => void;

  LongitudinalStudyEvent: string;
  setLongitudinalStudyEvent: (value: string) => void;

  RepeatableEvent: boolean;
  setRepeatableEvent: (value: boolean) => void;

  UsingRepeatableInstruments: boolean;
  setUsingRepeatableInstruments: (value: boolean) => void;

  RepeatableInstrument: string;
  setRepeatableInstrument: (value: string) => void;

  UploadSingleRecord: boolean;
  setUploadSingleRecord: (value: boolean) => void;

  // CONFIG SETTINGS
  password: string;

  measurementMethod: string;
  setMeasurementMethod: (method: string) => void;

  consistencyThreshold: number; // e.g. 13 for 13%
  setConsistencyThreshold: (value: number) => void;

  tapCountRequired: number;
  setTapCountRequired: (value: number) => void;

  // MEASUREMENTS
  // rate is the integral breathing rate in breaths/minute as a string
  // time is the timestamp in seconds since epoch of when save was triggered
  // taps is a string corresponding to the start time followed by time elapsed since start for each tap, separated by semicolons
  rrate: string;
  setRRate: (value: string) => void;

  rrTime: string;
  setRRTime: (value: string) => void;

  rrTaps: string;
  setRRTaps: (value: string) => void;

  tapTimestamps: number[], // array of timestamps; not sent to REDCap
  setTapTimestaps: (value: number[]) => void;
};

const GlobalContext = createContext<globalContextType | null>(null);

// Keys for AsyncStorage
const STORAGE_KEYS = {
  selectedLanguage: 'selectedLanguage',
  ageThresholdEnabled: 'ageThresholdEnabled',
  babyAnimation: 'babyAnimation',
  exportDataEnabled: 'exportDataEnabled',
  breathingAudioDuringEnabled: 'breathingAudioDuringEnabled',
  breathingAudioAfterEnabled: 'breathingAudioAfterEnabled',
  endChimeEnabled: 'endChimeEnabled',
  cancelAlertEnabled: 'cancelAlertEnabled',
  vibrationsEnabled: 'vibrationsEnabled',
  measurementMethod: 'measurementMethod',
  consistencyThreshold: 'consistencyThreshold',
  tapCountRequired: 'tapCountRequired',
  REDCap: 'REDCap',
  REDCapURL: 'REDCapURL',
  LongitudinalStudy: 'LongitudinalStudy',
  LongitudinalStudyEvent: 'LongitudinalStudyEvent',
  RepeatableEvent: 'RepeatableEvent',
  UsingRepeatableInstruments: 'UsingRepeatableInstruments',
  RepeatableInstrument: 'RepeatableInstrument',
  UploadSingleRecord: 'UploadSingleRecord',
};

// Initialzies each variable to a default value and provides a setter for each variable state
export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedLanguage, saveSelectedLanguage] = useState('English');
  const [ageThresholdEnabled, saveAgeThresholdEnabled] = useState(false);
  const [babyAnimation, saveBabyAnimation] = useState<BabyAnimationOption>(1);
  const [exportDataEnabled, saveExportDataEnabled] = useState(false);
  const [configSettingsUnlocked, setConfigSettingsUnlocked] = useState<boolean>(false);
  const password = "67d1514f9bb64c1adcec4ff70c012a40d675612d4403bfae978193547b751142";
  const [breathingAudioDuringEnabled, saveBreathingAudioDuringEnabled] = useState<boolean>(false);
  const [breathingAudioAfterEnabled, saveBreathingAudioAfterEnabled] = useState<boolean>(false);
  const [endChimeEnabled, saveEndChimeEnabled] = useState<boolean>(false);
  const [cancelAlertEnabled, saveCancelAlertEnabled] = useState<boolean>(false);
  const [vibrationsEnabled, saveVibrationsEnabled] = useState<boolean>(false);
  const [measurementMethod, saveMeasurementMethod] = useState<string>('tap');
  const [consistencyThreshold, saveConsistencyThreshold] = useState(13);
  const [tapCountRequired, saveTapCountRequired] = useState(5);
  const [rrate, setRRate] = useState('0');
  const [rrTime, setRRTime] = useState('');
  const [rrTaps, setRRTaps] = useState('');
  const [tapTimestamps, setTapTimestaps] = useState<number[]>([]);
  const [REDCap, saveREDCap] = useState(false);
  const [REDCapURL, saveREDCapURL] = useState('');
  const [REDCapAPI, saveREDCapAPI] = useState('');
  const [LongitudinalStudy, saveLongitudinalStudy] = useState(false);
  const [LongitudinalStudyEvent, saveLongitudinalStudyEvent] = useState('Event');
  const [RepeatableEvent, saveRepeatableEvent] = useState(false);
  const [UsingRepeatableInstruments, saveUsingRepeatableIntrument] = useState(false);
  const [RepeatableInstrument, saveRepeatableInstrument] = useState('Instrument');
  const [UploadSingleRecord, saveUploadSingleRecord] = useState(false);

  // Save and load to Expo SecureStore for REDCap API token
  const setREDCapAPI = async (token: string) => {
    saveREDCapAPI(token);
    if (Platform.OS === "web") {
      // Since Expo Secure Store is not available on web, use localStorage
      // NOTE: for security reasons, REDCap is only available on mobile. This is kept for testing on web.
      localStorage.setItem('apiToken', token);
      return;
    } else {
      try {
        await SecureStore.setItemAsync('apiToken', token);
      } catch (e) {
        console.error('Error saving API token:', e);
      }
    }

  };

  const loadREDCapAPI = async () => {
    // Since Expo Secure Store is not available on web, use localStorage
    if (Platform.OS === "web") {
      const token = localStorage.getItem('apiToken');
      saveREDCapAPI(token || '');
      return token;
    } else {
      try {
        const token = await SecureStore.getItemAsync('apiToken');
        saveREDCapAPI(token || '');
        return token;
      } catch (e) {
        console.error('Error retrieving API token:', e);
        saveREDCapAPI('');
        return null;
      }
    }
  };

  // Helper function that loads settings from AsyncStorage
  async function loadFromStorage<T>(
    key: string,
    setState: React.Dispatch<React.SetStateAction<T>>,
    parse: (value: string) => T = (v) => v as unknown as T
  ) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setState(parse(value));
      }
    } catch (e) {
      console.error(`Failed to load ${key}:`, e);
    }
  }

  // Load settings from AsyncStorage using helper function
  useEffect(() => {
    (async () => {
      await Promise.all([
        loadFromStorage<string>(STORAGE_KEYS.selectedLanguage, saveSelectedLanguage),
        loadFromStorage<boolean>(STORAGE_KEYS.ageThresholdEnabled, saveAgeThresholdEnabled, v => v === 'true'),
        loadFromStorage<BabyAnimationOption>(STORAGE_KEYS.babyAnimation, saveBabyAnimation, v => Number(v) as BabyAnimationOption),
        loadFromStorage<boolean>(STORAGE_KEYS.exportDataEnabled, saveExportDataEnabled, v => v === 'true'),
        loadFromStorage<boolean>(STORAGE_KEYS.breathingAudioDuringEnabled, saveBreathingAudioDuringEnabled, v => v === 'true'),
        loadFromStorage<boolean>(STORAGE_KEYS.breathingAudioAfterEnabled, saveBreathingAudioAfterEnabled, v => v === 'true'),
        loadFromStorage<boolean>(STORAGE_KEYS.endChimeEnabled, saveEndChimeEnabled, v => v === 'true'),
        loadFromStorage<boolean>(STORAGE_KEYS.cancelAlertEnabled, saveCancelAlertEnabled, v => v === 'true'),
        loadFromStorage<boolean>(STORAGE_KEYS.vibrationsEnabled, saveVibrationsEnabled, v => v === 'true'),
        loadFromStorage<string>(STORAGE_KEYS.measurementMethod, saveMeasurementMethod, v => v),
        loadFromStorage<number>(STORAGE_KEYS.consistencyThreshold, saveConsistencyThreshold, v => Number(v)),
        loadFromStorage<number>(STORAGE_KEYS.tapCountRequired, saveTapCountRequired, v => Number(v)),
        loadFromStorage<boolean>(STORAGE_KEYS.REDCap, saveREDCap, v => v === 'true'),
        loadFromStorage<string>(STORAGE_KEYS.REDCapURL, saveREDCapURL),
        loadFromStorage<boolean>(STORAGE_KEYS.LongitudinalStudy, saveLongitudinalStudy),
        loadFromStorage<string>(STORAGE_KEYS.LongitudinalStudyEvent, saveLongitudinalStudyEvent),
        loadFromStorage<boolean>(STORAGE_KEYS.RepeatableEvent, saveRepeatableEvent, v => v === 'true'),
        loadFromStorage<boolean>(STORAGE_KEYS.UsingRepeatableInstruments, saveUsingRepeatableIntrument, v => v === 'true'),
        loadFromStorage<string>(STORAGE_KEYS.RepeatableInstrument, saveRepeatableInstrument),
        loadFromStorage<boolean>(STORAGE_KEYS.UploadSingleRecord, saveUploadSingleRecord, v => v === 'true'),
        loadREDCapAPI()
      ]);
    })();
  }, []);

  // Helper function that tries to set a value in AsyncStorage
  function createPersistentSetter<T>(
    key: string,
    setState: React.Dispatch<React.SetStateAction<T>>,
    serialize: (value: T) => string = (value) => String(value)
  ): (value: T) => void {
    return async (value: T) => {
      setState(value);
      try {
        await AsyncStorage.setItem(key, serialize(value));
      } catch (e) {
        console.error(`Failed to persist ${key}:`, e);
      }
    };
  }

  // Apply setter to every setting needing to be saved to AsyncStorage
  const setSelectedLanguage = createPersistentSetter(STORAGE_KEYS.selectedLanguage, saveSelectedLanguage);
  const setAgeThresholdEnabled = createPersistentSetter(STORAGE_KEYS.ageThresholdEnabled, saveAgeThresholdEnabled, v => v.toString());
  const setBabyAnimation = createPersistentSetter(STORAGE_KEYS.babyAnimation, saveBabyAnimation, v => v.toString());
  const setExportDataEnabled = createPersistentSetter(STORAGE_KEYS.exportDataEnabled, saveExportDataEnabled, v => v.toString());
  const setBreathingAudioDuringEnabled = createPersistentSetter(STORAGE_KEYS.breathingAudioDuringEnabled, saveBreathingAudioDuringEnabled, v => v.toString());
  const setBreathingAudioAfterEnabled = createPersistentSetter(STORAGE_KEYS.breathingAudioAfterEnabled, saveBreathingAudioAfterEnabled, v => v.toString());
  const setEndChimeEnabled = createPersistentSetter(STORAGE_KEYS.endChimeEnabled, saveEndChimeEnabled, v => v.toString());
  const setCancelAlertEnabled = createPersistentSetter(STORAGE_KEYS.cancelAlertEnabled, saveCancelAlertEnabled, v => v.toString());
  const setVibrationsEnabled = createPersistentSetter(STORAGE_KEYS.vibrationsEnabled, saveVibrationsEnabled, v => v.toString());
  const setMeasurementMethod = createPersistentSetter(STORAGE_KEYS.measurementMethod, saveMeasurementMethod);
  const setConsistencyThreshold = createPersistentSetter(STORAGE_KEYS.consistencyThreshold, saveConsistencyThreshold);
  const setTapCountRequired = createPersistentSetter(STORAGE_KEYS.tapCountRequired, saveTapCountRequired);
  const setREDCap = createPersistentSetter(STORAGE_KEYS.REDCap, saveREDCap);
  const setREDCapURL = createPersistentSetter(STORAGE_KEYS.REDCapURL, saveREDCapURL);
  const setLongitudinalStudy = createPersistentSetter(STORAGE_KEYS.LongitudinalStudy, saveLongitudinalStudy);
  const setLongitudinalStudyEvent = createPersistentSetter(STORAGE_KEYS.LongitudinalStudyEvent, saveLongitudinalStudyEvent);
  const setRepeatableEvent = createPersistentSetter(STORAGE_KEYS.RepeatableEvent, saveRepeatableEvent, v => v.toString());
  const setUsingRepeatableInstruments = createPersistentSetter(STORAGE_KEYS.UsingRepeatableInstruments, saveUsingRepeatableIntrument);
  const setRepeatableInstrument = createPersistentSetter(STORAGE_KEYS.RepeatableInstrument, saveRepeatableInstrument);
  const setUploadSingleRecord = createPersistentSetter(STORAGE_KEYS.UploadSingleRecord, saveUploadSingleRecord)

  return (
    <GlobalContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        ageThresholdEnabled,
        setAgeThresholdEnabled,
        babyAnimation,
        setBabyAnimation,
        exportDataEnabled,
        setExportDataEnabled,
        configSettingsUnlocked,
        setConfigSettingsUnlocked,
        breathingAudioDuringEnabled,
        setBreathingAudioDuringEnabled,
        breathingAudioAfterEnabled,
        setBreathingAudioAfterEnabled,
        endChimeEnabled,
        setEndChimeEnabled,
        cancelAlertEnabled,
        setCancelAlertEnabled,
        vibrationsEnabled,
        setVibrationsEnabled,
        password,
        measurementMethod,
        setMeasurementMethod,
        consistencyThreshold,
        setConsistencyThreshold,
        tapCountRequired,
        setTapCountRequired,
        rrate,
        setRRate,
        rrTime,
        setRRTime,
        rrTaps,
        setRRTaps,
        tapTimestamps,
        setTapTimestaps,
        REDCap,
        setREDCap,
        REDCapURL,
        setREDCapURL,
        REDCapAPI,
        setREDCapAPI,
        LongitudinalStudy,
        setLongitudinalStudy,
        LongitudinalStudyEvent,
        setLongitudinalStudyEvent,
        RepeatableEvent,
        setRepeatableEvent,
        UsingRepeatableInstruments,
        setUsingRepeatableInstruments,
        RepeatableInstrument,
        setRepeatableInstrument,
        UploadSingleRecord,
        setUploadSingleRecord
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalVariables = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalVariables must be used within a SettingsProvider');
  return context;
};
