import { getFHIRObservation } from "./fhirObservation";
import { useGlobalVariables } from "./globalContext";
import * as Linking from 'expo-linking';

export async function sendFHIRObservation(fhirBaseUrl: string, accessToken: string, patientId: string) {
  const { rrate, rrTime } = useGlobalVariables();

  const result = await fetch(`${fhirBaseUrl}/Observation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/fhir+json',
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
    },
    body: JSON.stringify(getFHIRObservation({
      patientId,
      rrate,
      timestamp: rrTime,
    })),
  });

  if (result.ok) {
    // go back to Para
    // Linking.openURL({PARA_CUSTOM_URL});
  } else {
    const errorText = await result.text();
    console.error('FHIR Observation upload failed:', errorText);
    throw new Error(`Failed to send FHIR Observation: ${result.status} ${result.statusText}`);
  }
}