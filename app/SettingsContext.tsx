import React, { createContext, useContext, useState } from 'react';

type MeasurementMethod = 'tap' | 'timer';
type BabyAnimationOption = 1 | 2 | 3 | 4 | 5 | 6;

type SettingsContextType = {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;

  ageThresholdEnabled: boolean;
  setAgeThresholdEnabled: (enabled: boolean) => void;

  babyAnimation: BabyAnimationOption;
  setBabyAnimation: (value: BabyAnimationOption) => void;

  measurementMethod: MeasurementMethod;
  setMeasurementMethod: (method: MeasurementMethod) => void;

  consistencyThreshold: number; // e.g. 13 for 13%
  setConsistencyThreshold: (value: number) => void;

  tapCountRequired: number;
  setTapCountRequired: (value: number) => void;

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
        setTapTimestaps
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
