import { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save variables used in launching from external app or EMR in memory
// NOTE: this information is not stored to disk for security, so it will reset for each session 
type fhirContextType = {
  launchType: 'standalone' | 'app' | 'emr';
  setLaunchType: (type: 'standalone' | 'app' | 'emr') => Promise<void>;

  FHIRBaseURL: string;
  setFHIRBaseURL: (url: string) => Promise<void>;

  accessToken: string;
  setAccessToken: (id: string) => Promise<void>;

  patientId: string;
  setPatientId: (id: string) => Promise<void>;

  returnURL: string;
  setReturnURL: (url: string) => void;

  clientId: string;

  redirectUri: string;
};

const FHIRContext = createContext<fhirContextType | null>(null);

export const FHIRContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [launchType, saveLaunchType] = useState<'standalone' | 'app' | 'emr'>('standalone');
  const [FHIRBaseURL, saveFHIRBaseURL] = useState<string>('');
  const [accessToken, saveAccessToken] = useState<string>('');
  const [patientId, savePatientId] = useState<string>('');
  const [returnURL, saveReturnURL] = useState<string>('');
  const clientId = 'rrate-app'; // Replace with registered client_id after registering with EHR platform 
  const redirectUri = Platform.OS === 'web'
    ? "https://rrate.netlify.app/callback"
    : "rrate://callback";

  // USED FOR TESTING WITH EMR SANDBOX ON WEB
  // const redirectUri = Platform.OS === 'web'
  //   ? "http://localhost:8081/callback"
  //   : "rrate://callback";

  // AsyncStorage keys
  const keys = {
    launchType: 'launchType',
    FHIRBaseURL: 'FHIRBaseURL',
    returnURL: 'returnURL'
  };

  // Load persisted values
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [storedLaunchType, storedFHIRBaseURL, storedReturnURL] = await Promise.all([
          AsyncStorage.getItem(keys.launchType),
          AsyncStorage.getItem(keys.FHIRBaseURL),
          AsyncStorage.getItem(keys.returnURL),
        ]);

        if (storedLaunchType === 'standalone' || storedLaunchType === 'app' || storedLaunchType === 'emr') {
          saveLaunchType(storedLaunchType);
        }
        if (storedFHIRBaseURL) saveFHIRBaseURL(storedFHIRBaseURL);
        if (storedReturnURL) saveReturnURL(storedReturnURL);
      } catch (err) {
        console.error("Error loading FHIR settings:", err);
      }
    };
    loadSettings();
  }, []);


  // Persistent Setters
  // Persisted setters
  const setLaunchType = async (type: 'standalone' | 'app' | 'emr') => {
    try {
      await AsyncStorage.setItem(keys.launchType, type);
      saveLaunchType(type);
    } catch (err) {
      console.error("Error saving launchType:", err);
    }
  };

  const setFHIRBaseURL = async (url: string) => {
    try {
      await AsyncStorage.setItem(keys.FHIRBaseURL, url);
      saveFHIRBaseURL(url);
    } catch (err) {
      console.error("Error saving FHIRBaseURL:", err);
    }
  };

  const setReturnURL = async (url: string) => {
    try {
      await AsyncStorage.setItem(keys.returnURL, url);
      saveReturnURL(url);
    } catch (err) {
      console.error("Error saving returnURL:", err);
    }
  };

  // Memory-only setters
  const setAccessToken = async (token: string) => {
    saveAccessToken(token);
  };

  const setPatientId = async (id: string) => {
    savePatientId(id);
  };


  return (
    <FHIRContext.Provider
      value={{
        launchType,
        setLaunchType,
        FHIRBaseURL,
        setFHIRBaseURL,
        accessToken,
        setAccessToken,
        patientId,
        setPatientId,
        returnURL,
        setReturnURL,
        clientId,
        redirectUri
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
