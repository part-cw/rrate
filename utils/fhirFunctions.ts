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

// Save FHIR Observation to local device storage to be accessed by PARA later
export async function saveFHIRObservationToFile(patientId: string, rrate: string) {
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

  const link = `PARA_CUSTOM_URL://observation?uri=${encodeURIComponent(fileUri)}`; // Put in PARA URL!

  Linking.openURL(link);
}
