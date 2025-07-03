import { getFHIRObservation } from "./fhirObservation";
import * as Linking from 'expo-linking';

// Send the FHIR observation to the FHIR sever and redirect back to PARA if successful
export async function sendFHIRObservation(fhirBaseUrl: string, patientId: string, rrate: string) {
  const timestamp = new Date().toISOString();

  const result = await fetch(`${fhirBaseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json'
    },
    body: JSON.stringify(getFHIRObservation({
      patientId,
      rrate,
      timestamp
    })),
  });

  if (result.ok) {
    // go back to Para
    // Linking.openURL({PARA_CUSTOM_URL});
    console.log('FHIR Observation uploaded successfully');
  } else {
    const errorText = await result.text();
    console.error('FHIR Observation upload failed:', errorText);
    throw new Error(`Failed to send FHIR Observation: ${result.status} ${result.statusText}`);
  }
}