import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type fhirContextType = {
  launchType: 'standalone' | 'app' | 'emr';
  setLaunchType: (type: 'standalone' | 'app' | 'emr') => Promise<void>;

  fhirBaseURL: string;
  setFHIRBaseURL: (url: string) => Promise<void>;

  accessToken: string;
  setAccessToken: (id: string) => Promise<void>;

  patientId: string;
  setPatientId: (id: string) => Promise<void>;

  returnURL: string;
  setReturnURL: (url: string) => void;
};

const FHIRContext = createContext<fhirContextType | null>(null);

const STORAGE_KEYS = {
  FHIR_LAUNCH_TYPE: 'fhirLaunchType',
  FHIR_BASE_URL: 'fhirBaseURL',
  FHIR_PATIENT_ID: 'fhirPatientId',
  FHIR_RETURN_URL: 'fhirReturnURL',
};

export const FHIRContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [launchType, saveLaunchType] = useState<'standalone' | 'app' | 'emr'>('standalone');
  const [fhirBaseURL, saveFHIRBaseURL] = useState<string>('');
  const [accessToken, saveAccessToken] = useState<string>('');
  const [patientId, savePatientId] = useState<string>('');
  const [returnURL, saveReturnURL] = useState<string>('');

  // Persistent setters
  const setLaunchType = async (type: 'standalone' | 'app' | 'emr') => {
    saveLaunchType(type);
    await AsyncStorage.setItem(STORAGE_KEYS.FHIR_LAUNCH_TYPE, type);
  };

  const setFHIRBaseURL = async (url: string) => {
    saveFHIRBaseURL(url);
    await AsyncStorage.setItem(STORAGE_KEYS.FHIR_BASE_URL, url);
  };

  // Don't save access token to async storage for security reasons
  const setAccessToken = async (token: string) => {
    saveAccessToken(token);
  };

  const setPatientId = async (id: string) => {
    savePatientId(id);
    await AsyncStorage.setItem(STORAGE_KEYS.FHIR_PATIENT_ID, id);
  };

  const setReturnURL = async (url: string) => {
    saveReturnURL(url);
    await AsyncStorage.setItem(STORAGE_KEYS.FHIR_RETURN_URL, url);
  };

  // Load initial values from storage
  useEffect(() => {
    const loadInitialValues = async () => {
      const storedLaunchType = await AsyncStorage.getItem(STORAGE_KEYS.FHIR_LAUNCH_TYPE);
      const storedBaseURL = await AsyncStorage.getItem(STORAGE_KEYS.FHIR_BASE_URL);
      const storedPatientId = await AsyncStorage.getItem(STORAGE_KEYS.FHIR_PATIENT_ID);
      const storedReturnURL = await AsyncStorage.getItem(STORAGE_KEYS.FHIR_RETURN_URL);

      if (storedLaunchType) saveLaunchType(storedLaunchType as 'standalone' | 'app' | 'emr');
      if (storedBaseURL) saveFHIRBaseURL(storedBaseURL);
      if (storedPatientId) savePatientId(storedPatientId);
      if (storedReturnURL) saveReturnURL(storedReturnURL);
    };

    loadInitialValues();
  }, []);

  return (
    <FHIRContext.Provider
      value={{
        launchType,
        setLaunchType,
        fhirBaseURL,
        setFHIRBaseURL,
        accessToken,
        setAccessToken,
        patientId,
        setPatientId,
        returnURL,
        setReturnURL,
      }}
    >
      {children}
    </FHIRContext.Provider>
  );
};

export const useFHIRContext = () => {
  const context = useContext(FHIRContext);
  if (!context) throw new Error('useFHIRContext must be used within a FHIRContextProvider');
  return context;
};
