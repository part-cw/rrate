import { getFHIRObservation } from "./fhirObservation";
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';

// Send the FHIR observation to the FHIR sever and redirect back to PARA if successful
export async function sendFHIRObservation(fhirBaseUrl: string, patientId: string, rrate: string, authToken?: string) {
  const timestamp = new Date().toISOString();

  const result = await fetch(`${fhirBaseUrl}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
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
export async function sendFHIRObservationToApp(patientId: string, rrate: string, redirectURI: string) {
  const filename = `RRate-FHIRObservation-${Date.now()}.json`;
  const fileUri = FileSystem.documentDirectory + filename;
  const observation = getFHIRObservation({
    patientId,
    rrate,
    timestamp: new Date().toISOString(),
  });

  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(observation), {
    encoding: FileSystem.EncodingType.UTF8,
  });

  Linking.openURL(redirectURI);
}
