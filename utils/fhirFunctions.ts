import { getFHIRObservation } from "./fhirObservation";
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Variables for storing FHIR Observation 
const FHIR_DB_KEY = 'fhir_observations.json';

type FHIRObservation = ReturnType<typeof getFHIRObservation>;

type FHIRDatabase = {
  [patientId: string]: FHIRObservation[];
};

// Send the FHIR observation to the FHIR sever and redirect back to PARA if successful
export async function sendFHIRObservation(fhirBaseUrl: string, patientId: string, rrate: string, accessToken: string) {
  const timestamp = new Date().toISOString();
  console.log("Access token:", accessToken);
  const result = await fetch(`${fhirBaseUrl}/Observation`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/fhir+json'
    },
    body: JSON.stringify(getFHIRObservation({
      patientId,
      rrate,
      timestamp
    })),
  });

  if (result.ok) {
    console.log('FHIR Observation uploaded successfully');
  } else {
    const errorText = await result.text();
    console.error('FHIR Observation upload failed:', errorText);
    throw new Error(`Failed to send FHIR Observation: ${result.status} ${result.statusText}`);
  }
}

// Encode FHIR Observation in Expo file system and send as string to external app (e.g. PARA) 
export async function sendFHIRObservationToApp(patientId: string, rrate: string, returnURL: string) {
  const observation = getFHIRObservation({
    patientId,
    rrate,
    timestamp: new Date().toISOString(),
  });

  const encoded = encodeURIComponent(JSON.stringify(observation));

  // send the observation back via the return URL 
  const fullUrl = `${returnURL}?observation=${encoded}`;

  return fullUrl;
}

// Retrieves the endpoint from the FHIR server's .well-known/smart-configuration, allowing access to metadata including the 
// authorization endpoint and token endpoint
export async function fetchEndpoint(iss: string) {
  try {
    const response = await fetch(`${iss}/.well-known/smart-configuration`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        }
      }
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching endpoint:', error);
    return null;
  }
};

