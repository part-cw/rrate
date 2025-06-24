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

  RepeatableInstruments: boolean;
  setRepeatableInstruments: (value: boolean) => void;

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
  REDCap: 'REDCap',
  REDCapHost: 'REDCapHost',
  REDCapURL: 'REDCapURL',
  REDCapAPI: 'REDCapAPI',
  LongitudinalStudy: 'LongitudinalStudy',
  LongitudinalStudyEvent: 'LongitudinalStudyEvent',
  RepeatableInstruments: 'RepeatableInstruments',
  RepeatableInstrument: 'RepeatableInstrument',
  UploadSingleRecord: 'UploadSingleRecord',
};

const GlobalContext = createContext<globalContextType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState('English');
  const [ageThresholdEnabled, setAgeThresholdEnabled] = useState(false);
  const [babyAnimation, setBabyAnimation] = useState<BabyAnimationOption>(1);
  const password = "1234";
  const [measurementMethod, setMeasurementMethod] = useState<MeasurementMethod>('tap');
  const [consistencyThreshold, setConsistencyThreshold] = useState(13);
  const [tapCountRequired, setTapCountRequired] = useState(5);
  const [rrate, setRRate] = useState('0');
  const [rr_time, set_rrTime] = useState('');
  const [rr_taps, set_rrTaps] = useState('');
  const [tapTimestamps, setTapTimestaps] = useState<number[]>([]);
  const [REDCap, setREDCap] = useState(false);
  const [REDCapHost, setREDCapHost] = useState('');
  const [REDCapURL, setREDCapURL] = useState('');
  const [REDCapAPI, setREDCapAPI] = useState('');
  const [LongitudinalStudy, setLongitudinalStudy] = useState(false);
  const [LongitudinalStudyEvent, setLongitudinalStudyEvent] = useState('Event');
  const [RepeatableInstruments, setRepeatableInstruments] = useState(false);
  const [RepeatableInstrument, setRepeatableInstrument] = useState('Instrument');
  const [UploadSingleRecord, setUploadSingleRecord] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEYS.selectedLanguage);
        if (saved) setSelectedLanguageState(saved);
      } catch (e) {
        console.error('Failed to load language:', e);
      }
    };
    loadLanguage();
  }, []);

  const setSelectedLanguage = async (lang: string) => {
    setSelectedLanguageState(lang);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.selectedLanguage, lang);
    } catch (e) {
      console.error('Failed to save language:', e);
    }
  };

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
        RepeatableInstruments,
        setRepeatableInstruments,
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
