import { createContext, useContext, useState } from 'react';

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
};

const FHIRContext = createContext<fhirContextType | null>(null);

export const FHIRContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [launchType, saveLaunchType] = useState<'standalone' | 'app' | 'emr'>('standalone');
  const [FHIRBaseURL, saveFHIRBaseURL] = useState<string>('');
  const [accessToken, saveAccessToken] = useState<string>('');
  const [patientId, savePatientId] = useState<string>('');
  const [returnURL, saveReturnURL] = useState<string>('');

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
