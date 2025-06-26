import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  rr_time: string;
  set_rrTime: (value: string) => void;

  rr_taps: string;
  set_rrTaps: (value: string) => void;

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
  const [selectedLanguage, _setSelectedLanguage] = useState('English');
  const [ageThresholdEnabled, _setAgeThresholdEnabled] = useState(false);
  const [babyAnimation, _setBabyAnimation] = useState<BabyAnimationOption>(1);
  const password = "1234";
  const [measurementMethod, _setMeasurementMethod] = useState<MeasurementMethod>('tap');
  const [consistencyThreshold, _setConsistencyThreshold] = useState(13);
  const [tapCountRequired, _setTapCountRequired] = useState(5);
  const [rrate, setRRate] = useState('0');
  const [rr_time, set_rrTime] = useState('');
  const [rr_taps, set_rrTaps] = useState('');
  const [tapTimestamps, setTapTimestaps] = useState<number[]>([]);
  const [REDCap, _setREDCap] = useState(false);
  const [REDCapHost, _setREDCapHost] = useState('');
  const [REDCapURL, _setREDCapURL] = useState('');
  const [REDCapAPI, setREDCapAPI] = useState('');
  const [LongitudinalStudy, _setLongitudinalStudy] = useState(false);
  const [LongitudinalStudyEvent, _setLongitudinalStudyEvent] = useState('Event');
  const [UsingRepeatableInstruments, _setUsingRepeatableInstruments] = useState(false);
  const [RepeatableInstrument, _setRepeatableInstrument] = useState('Instrument');
  const [UploadSingleRecord, _setUploadSingleRecord] = useState(false);

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
        loadWithFallback<string>(STORAGE_KEYS.selectedLanguage, _setSelectedLanguage, 'English'),
        loadWithFallback<boolean>(STORAGE_KEYS.ageThresholdEnabled, _setAgeThresholdEnabled, false, v => v === 'true'),
        loadWithFallback<BabyAnimationOption>(STORAGE_KEYS.babyAnimation, _setBabyAnimation, 1, v => Number(v) as BabyAnimationOption),
        loadWithFallback<MeasurementMethod>(STORAGE_KEYS.measurementMethod, _setMeasurementMethod, 'tap', v => v as MeasurementMethod),
        loadWithFallback<number>(STORAGE_KEYS.consistencyThreshold, _setConsistencyThreshold, 13, v => Number(v)),
        loadWithFallback<number>(STORAGE_KEYS.tapCountRequired, _setTapCountRequired, 5, v => Number(v)),
        loadWithFallback<boolean>(STORAGE_KEYS.REDCap, _setREDCap, false, v => v === 'true'),
        loadWithFallback<string>(STORAGE_KEYS.REDCapHost, _setREDCapHost, ''),
        loadWithFallback<string>(STORAGE_KEYS.REDCapURL, _setREDCapURL, ''),
        loadWithFallback<boolean>(STORAGE_KEYS.LongitudinalStudy, _setLongitudinalStudy, false, v => v === 'true'),
        loadWithFallback<string>(STORAGE_KEYS.LongitudinalStudyEvent, _setLongitudinalStudyEvent, 'Event'),
        loadWithFallback<boolean>(STORAGE_KEYS.UsingRepeatableInstruments, _setUsingRepeatableInstruments, false, v => v === 'true'),
        loadWithFallback<string>(STORAGE_KEYS.RepeatableInstrument, _setRepeatableInstrument, 'Instrument'),
        loadWithFallback<boolean>(STORAGE_KEYS.UploadSingleRecord, _setUploadSingleRecord, false, v => v === 'true'),
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
  const setSelectedLanguage = createPersistentSetter(STORAGE_KEYS.selectedLanguage, _setSelectedLanguage);
  const setAgeThresholdEnabled = createPersistentSetter(STORAGE_KEYS.ageThresholdEnabled, _setAgeThresholdEnabled, v => v.toString());
  const setBabyAnimation = createPersistentSetter(STORAGE_KEYS.babyAnimation, _setBabyAnimation, v => v.toString());
  const setMeasurementMethod = createPersistentSetter(STORAGE_KEYS.measurementMethod, _setMeasurementMethod);
  const setConsistencyThreshold = createPersistentSetter(STORAGE_KEYS.consistencyThreshold, _setConsistencyThreshold);
  const setTapCountRequired = createPersistentSetter(STORAGE_KEYS.tapCountRequired, _setTapCountRequired);
  const setREDCap = createPersistentSetter(STORAGE_KEYS.REDCap, _setREDCap);
  const setREDCapHost = createPersistentSetter(STORAGE_KEYS.REDCapHost, _setREDCapHost);
  const setREDCapURL = createPersistentSetter(STORAGE_KEYS.REDCapURL, _setREDCapURL);
  const setLongitudinalStudy = createPersistentSetter(STORAGE_KEYS.LongitudinalStudy, _setLongitudinalStudy);
  const setLongitudinalStudyEvent = createPersistentSetter(STORAGE_KEYS.LongitudinalStudyEvent, _setLongitudinalStudyEvent);
  const setUsingRepeatableInstruments = createPersistentSetter(STORAGE_KEYS.UsingRepeatableInstruments, _setUsingRepeatableInstruments);
  const setRepeatableInstrument = createPersistentSetter(STORAGE_KEYS.RepeatableInstrument, _setRepeatableInstrument);
  const setUploadSingleRecord = createPersistentSetter(STORAGE_KEYS.UploadSingleRecord, _setUploadSingleRecord)

  return (
    <GlobalContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        ageThresholdEnabled,
        setAgeThresholdEnabled,
        babyAnimation,
        setBabyAnimation,
        password,
        measurementMethod,
        setMeasurementMethod,
        consistencyThreshold,
        setConsistencyThreshold,
        tapCountRequired,
        setTapCountRequired,
        rrate,
        setRRate,
        rr_time,
        set_rrTime,
        rr_taps,
        set_rrTaps,
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
