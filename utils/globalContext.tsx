import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

type MeasurementMethod = 'tap' | 'timer';
type BabyAnimationOption = 1 | 2 | 3 | 4 | 5 | 6;

type globalContextType = {
  // GENERAL SETTINGS
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;

  ageThresholdEnabled: boolean;
  setAgeThresholdEnabled: (enabled: boolean) => void;

  babyAnimation: BabyAnimationOption;
  setBabyAnimation: (value: BabyAnimationOption) => void;

  configSettingsUnlocked: boolean;
  setConfigSettingsUnlocked: (unlocked: boolean) => void;

  // REDCap SETTINGS
  REDCap: boolean;
  setREDCap: (value: boolean) => void;

  REDCapHost: string;
  setREDCapHost: (host: string) => void;

  REDCapURL: string;
  setREDCapURL: (url: string) => void;

  REDCapAPI: string;
  setREDCapAPI: (api: string) => void;

  LongitudinalStudy: boolean;
  setLongitudinalStudy: (value: boolean) => void;

  LongitudinalStudyEvent: string;
  setLongitudinalStudyEvent: (value: string) => void;

  UsingRepeatableInstruments: boolean;
  setUsingRepeatableInstruments: (value: boolean) => void;

  RepeatableInstrument: string;
  setRepeatableInstrument: (value: string) => void;

  UploadSingleRecord: boolean;
  setUploadSingleRecord: (value: boolean) => void;

  // CONFIG SETTINGS
  password: string;

  measurementMethod: MeasurementMethod;
  setMeasurementMethod: (method: MeasurementMethod) => void;

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

const STORAGE_KEYS = {
  selectedLanguage: 'selectedLanguage',
  ageThresholdEnabled: 'ageThresholdEnabled',
  babyAnimation: 'babyAnimation',
  measurementMethod: 'measurementMethod',
  consistencyThreshold: 'consistencyThreshold',
  tapCountRequired: 'tapCountRequired',
  REDCap: 'REDCap',
  REDCapHost: 'REDCapHost',
  REDCapURL: 'REDCapURL',
  LongitudinalStudy: 'LongitudinalStudy',
  LongitudinalStudyEvent: 'LongitudinalStudyEvent',
  UsingRepeatableInstruments: 'UsingRepeatableInstruments',
  RepeatableInstrument: 'RepeatableInstrument',
  UploadSingleRecord: 'UploadSingleRecord',
};

const GlobalContext = createContext<globalContextType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedLanguage, saveSelectedLanguage] = useState('English');
  const [ageThresholdEnabled, saveAgeThresholdEnabled] = useState(false);
  const [babyAnimation, saveBabyAnimation] = useState<BabyAnimationOption>(1);
  const [configSettingsUnlocked, setConfigSettingsUnlocked] = useState<boolean>(false);
  const password = "1234";
  const [measurementMethod, saveMeasurementMethod] = useState<MeasurementMethod>('tap');
  const [consistencyThreshold, saveConsistencyThreshold] = useState(13);
  const [tapCountRequired, saveTapCountRequired] = useState(5);
  const [rrate, setRRate] = useState('0');
  const [rrTime, setRRTime] = useState('');
  const [rrTaps, setRRTaps] = useState('');
  const [tapTimestamps, setTapTimestaps] = useState<number[]>([]);
  const [REDCap, saveREDCap] = useState(false);
  const [REDCapHost, saveREDCapHost] = useState('');
  const [REDCapURL, saveREDCapURL] = useState('');
  const [REDCapAPI, saveREDCapAPI] = useState('');
  const [LongitudinalStudy, saveLongitudinalStudy] = useState(false);
  const [LongitudinalStudyEvent, saveLongitudinalStudyEvent] = useState('Event');
  const [UsingRepeatableInstruments, saveUsingRepeatableIntrument] = useState(false);
  const [RepeatableInstrument, saveRepeatableInstrument] = useState('Instrument');
  const [UploadSingleRecord, saveUploadSingleRecord] = useState(false);

  // Save and load to Expo SecureStore for REDCap API token
  const setREDCapAPI = async (token: string) => {
    saveREDCapAPI(token);
    try {
      await SecureStore.setItemAsync('apiToken', token);
    } catch (e) {
      console.error('Error saving API token:', e);
    }
  };

  const loadREDCapAPI = async () => {
    try {
      const token = await SecureStore.getItemAsync('apiToken');
      saveREDCapAPI(token || '');
      return token;
    } catch (e) {
      console.error('Error retrieving API token:', e);
      saveREDCapAPI('');
      return null;
    }
  };


  // Helper function that loads settings from AsyncStorage, and defaults to fallback value if not found
  async function loadWithFallback<T>(
    key: string,
    setState: React.Dispatch<React.SetStateAction<T>>,
    fallback: T,
    parse: (value: string) => T = (v) => v as unknown as T
  ) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setState(parse(value));
      } else {
        setState(fallback);
      }
    } catch (e) {
      console.error(`Failed to load ${key}:`, e);
      setState(fallback);
    }
  }

  // Load settings from AsyncStorage using helper function
  useEffect(() => {
    (async () => {
      await Promise.all([
        loadWithFallback<string>(STORAGE_KEYS.selectedLanguage, saveSelectedLanguage, 'English'),
        loadWithFallback<boolean>(STORAGE_KEYS.ageThresholdEnabled, saveAgeThresholdEnabled, false, v => v === 'true'),
        loadWithFallback<BabyAnimationOption>(STORAGE_KEYS.babyAnimation, saveBabyAnimation, 1, v => Number(v) as BabyAnimationOption),
        loadWithFallback<MeasurementMethod>(STORAGE_KEYS.measurementMethod, saveMeasurementMethod, 'tap', v => v as MeasurementMethod),
        loadWithFallback<number>(STORAGE_KEYS.consistencyThreshold, saveConsistencyThreshold, 13, v => Number(v)),
        loadWithFallback<number>(STORAGE_KEYS.tapCountRequired, saveTapCountRequired, 5, v => Number(v)),
        loadWithFallback<boolean>(STORAGE_KEYS.REDCap, saveREDCap, false, v => v === 'true'),
        loadWithFallback<string>(STORAGE_KEYS.REDCapHost, saveREDCapHost, ''),
        loadWithFallback<string>(STORAGE_KEYS.REDCapURL, saveREDCapURL, ''),
        loadWithFallback<boolean>(STORAGE_KEYS.LongitudinalStudy, saveLongitudinalStudy, false, v => v === 'true'),
        loadWithFallback<string>(STORAGE_KEYS.LongitudinalStudyEvent, saveLongitudinalStudyEvent, 'Event'),
        loadWithFallback<boolean>(STORAGE_KEYS.UsingRepeatableInstruments, saveUsingRepeatableIntrument, false, v => v === 'true'),
        loadWithFallback<string>(STORAGE_KEYS.RepeatableInstrument, saveRepeatableInstrument, 'Instrument'),
        loadWithFallback<boolean>(STORAGE_KEYS.UploadSingleRecord, saveUploadSingleRecord, false, v => v === 'true'),
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
  const setMeasurementMethod = createPersistentSetter(STORAGE_KEYS.measurementMethod, saveMeasurementMethod);
  const setConsistencyThreshold = createPersistentSetter(STORAGE_KEYS.consistencyThreshold, saveConsistencyThreshold);
  const setTapCountRequired = createPersistentSetter(STORAGE_KEYS.tapCountRequired, saveTapCountRequired);
  const setREDCap = createPersistentSetter(STORAGE_KEYS.REDCap, saveREDCap);
  const setREDCapHost = createPersistentSetter(STORAGE_KEYS.REDCapHost, saveREDCapHost);
  const setREDCapURL = createPersistentSetter(STORAGE_KEYS.REDCapURL, saveREDCapURL);
  const setLongitudinalStudy = createPersistentSetter(STORAGE_KEYS.LongitudinalStudy, saveLongitudinalStudy);
  const setLongitudinalStudyEvent = createPersistentSetter(STORAGE_KEYS.LongitudinalStudyEvent, saveLongitudinalStudyEvent);
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
        configSettingsUnlocked,
        setConfigSettingsUnlocked,
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
        REDCapHost,
        setREDCapHost,
        REDCapURL,
        setREDCapURL,
        REDCapAPI,
        setREDCapAPI,
        LongitudinalStudy,
        setLongitudinalStudy,
        LongitudinalStudyEvent,
        setLongitudinalStudyEvent,
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
