import React, { createContext, useContext, useState } from 'react';

type MeasurementMethod = 'tap' | 'timer';
type BabyAnimationOption = 1 | 2 | 3 | 4 | 5 | 6;

type SettingsContextType = {
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

  RepeatableInstruments: boolean;
  setRepeatableInstruments: (value: boolean) => void;

  UploadOnSave: boolean;
  setUploadOnSave: (value: boolean) => void;

  // CONFIG SETTINGS
  measurementMethod: MeasurementMethod;
  setMeasurementMethod: (method: MeasurementMethod) => void;

  consistencyThreshold: number; // e.g. 13 for 13%
  setConsistencyThreshold: (value: number) => void;

  tapCountRequired: number;
  setTapCountRequired: (value: number) => void;

  // MEASUREMENTS
  rrate: number;
  setRRate: (value: number) => void;

  tapTimestamps: number[],
  setTapTimestaps: (value: number[]) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [ageThresholdEnabled, setAgeThresholdEnabled] = useState(false);
  const [babyAnimation, setBabyAnimation] = useState<BabyAnimationOption>(1);
  const [measurementMethod, setMeasurementMethod] = useState<MeasurementMethod>('tap');
  const [consistencyThreshold, setConsistencyThreshold] = useState(13);
  const [tapCountRequired, setTapCountRequired] = useState(5);
  const [rrate, setRRate] = useState(0);
  const [tapTimestamps, setTapTimestaps] = useState<number[]>([]);
  const [REDCap, setREDCap] = useState(false);
  const [REDCapHost, setREDCapHost] = useState('');
  const [REDCapURL, setREDCapURL] = useState('');
  const [REDCapAPI, setREDCapAPI] = useState('');
  const [LongitudinalStudy, setLongitudinalStudy] = useState(false);
  const [RepeatableInstruments, setRepeatableInstruments] = useState(false);
  const [UploadOnSave, setUploadOnSave] = useState(false);

  return (
    <SettingsContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        ageThresholdEnabled,
        setAgeThresholdEnabled,
        babyAnimation,
        setBabyAnimation,
        measurementMethod,
        setMeasurementMethod,
        consistencyThreshold,
        setConsistencyThreshold,
        tapCountRequired,
        setTapCountRequired,
        rrate,
        setRRate,
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
        RepeatableInstruments,
        setRepeatableInstruments,
        UploadOnSave,
        setUploadOnSave
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
