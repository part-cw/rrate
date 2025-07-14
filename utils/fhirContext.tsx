import { createContext, useContext, useState } from 'react';

// save variables used in launching from external app or EMR in memory
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

  codeVerifier: string;
  setCodeVerifier: (url: string) => Promise<void>;
};

const FHIRContext = createContext<fhirContextType | null>(null);

export const FHIRContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [launchType, saveLaunchType] = useState<'standalone' | 'app' | 'emr'>('standalone');
  const [FHIRBaseURL, saveFHIRBaseURL] = useState<string>('');
  const [accessToken, saveAccessToken] = useState<string>('');
  const [patientId, savePatientId] = useState<string>('');
  const [returnURL, saveReturnURL] = useState<string>('');
  const [codeVerifier, saveCodeVerifier] = useState<string>('');

  // Memory-only setters
  const setLaunchType = async (type: 'standalone' | 'app' | 'emr') => {
    saveLaunchType(type);
  };

  const setFHIRBaseURL = async (url: string) => {
    saveFHIRBaseURL(url);
  };

  const setAccessToken = async (token: string) => {
    saveAccessToken(token);
  };

  const setPatientId = async (id: string) => {
    savePatientId(id);
  };

  const setReturnURL = async (url: string) => {
    saveReturnURL(url);
  };

  const setCodeVerifier = async (code: string) => {
    saveCodeVerifier(code);
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
        codeVerifier,
        setCodeVerifier
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
