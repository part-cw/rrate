import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

// Types used for FHIR context and authentication
type fhirContextType = {
  launchType: 'standalone' | 'para' | 'emr' | null;
  setLaunchType: (type: 'standalone' | 'para' | 'emr' | null) => void;

  fhirBaseURL: string;
  setFHIRBaseURL: (url: string) => void;

  accessToken: string;
  setAccessToken: (token: string) => void;

  patientId: string;
  setPatientId: (id: string) => void;
}

const FHIRContext = createContext<fhirContextType | null>(null);

// Storage keys used to load and set values in SecureStore
const STORAGE_KEYS = {
  FHIR_LAUNCH_TYPE: 'fhirLaunchType',
  FHIR_BASE_URL: 'fhirBaseURL',
  FHIR_ACCESS_TOKEN: 'fhirAccessToken',
  FHIR_PATIENT_ID: 'fhirPatientId',
}

export const FHIRContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [launchType, setLaunchType] = useState<'standalone' | 'para' | 'emr' | null>(null);
  const [fhirBaseURL, setFHIRBaseURL] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [patientId, setPatientId] = useState<string>('');

  // Load initial values from storage
  useEffect(() => {
    const loadInitialValues = async () => {
      const storedLaunchType = await SecureStore.getItem(STORAGE_KEYS.FHIR_LAUNCH_TYPE);
      const storedBaseURL = await SecureStore.getItem(STORAGE_KEYS.FHIR_BASE_URL);
      const storedAccessToken = await SecureStore.getItem(STORAGE_KEYS.FHIR_ACCESS_TOKEN);
      const storedPatientId = await SecureStore.getItem(STORAGE_KEYS.FHIR_PATIENT_ID);

      if (storedLaunchType) setLaunchType(storedLaunchType as 'standalone' | 'para' | 'emr');
      if (storedBaseURL) setFHIRBaseURL(storedBaseURL);
      if (storedAccessToken) setAccessToken(storedAccessToken);
      if (storedPatientId) setPatientId(storedPatientId);
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
        setPatientId
      }
      }>
      {children}
    </FHIRContext.Provider>
  );
}


export const useFHIRContext = () => {
  const context = useContext(FHIRContext);
  if (!context) throw new Error('useFHIRContext must be used within a FHIRContextProvider');
  return context;
}