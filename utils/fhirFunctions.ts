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

  try {
    const encoded = encodeURIComponent(JSON.stringify(observation));

    // send the observation back via the return URL 
    const fullUrl = `${returnURL}?observation=${encoded}`;

    await Linking.openURL(fullUrl);
  } catch (error) {
    console.error('Failed to send observation to app:', error);
    saveFHIRObservationLocally(patientId, rrate);
  }
}

// Load from AsyncStorage or return empty database
export async function loadFHIRDatabase(): Promise<FHIRDatabase> {
  try {
    const data = await AsyncStorage.getItem(FHIR_DB_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to load FHIR database:', error);
    return {};
  }
}

// Save entire database to AsyncStorage
export async function saveFHIRDatabase(db: FHIRDatabase): Promise<void> {
  try {
    const json = JSON.stringify(db, null, 2);
    await AsyncStorage.setItem(FHIR_DB_KEY, json);
  } catch (error) {
    console.error('Failed to save FHIR database:', error);
  }
}

// Add new observation to the database
export async function saveFHIRObservationLocally(patientId: string, rrate: string): Promise<void> {
  const db = await loadFHIRDatabase();
  const timestamp = new Date().toISOString();

  const observation = getFHIRObservation({
    patientId,
    rrate,
    timestamp,
  });

  const existing = db[patientId] ?? [];
  db[patientId] = [...existing, observation];

  await saveFHIRDatabase(db);
}

// Delete the entire FHIR observation database
export async function deleteFHIRDatabase(): Promise<void> {
  try {
    const exists = await AsyncStorage.getItem(FHIR_DB_KEY);
    if (exists !== null) {
      await AsyncStorage.removeItem(FHIR_DB_KEY);
      console.log('FHIR database deleted.');
    } else {
      console.log('No FHIR database found to delete.');
    }
  } catch (error) {
    console.error('Failed to delete FHIR database:', error);
  }
}

