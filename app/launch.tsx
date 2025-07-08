import { useEffect } from 'react';
import { Platform, Linking, InteractionManager } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFHIRContext } from '../utils/fhirContext';

export default function Launch() {
  const { iss, launch, launchType, fhirBase, patient, accessToken } = useLocalSearchParams(); // e.g., from EMR or PARA
  const { setFHIRBaseURL, setLaunchType, setPatientId } = useFHIRContext();
  const router = useRouter();

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      // Launched from EMR
      if (iss && launch) {
        setLaunchType('emr');
        // authentication variables
        const clientId = "my-smart-app";
        const redirectUri =
          Platform.OS === 'web'
            ? "https://rrate.netlify.app/callback"
            : "rrate://callback";

        const scope = "launch patient/Observation.write openid fhirUser";
        const simpleIss = Array.isArray(iss) ? iss[0] : iss; // sometimes iss is an array, handle that case

        // const fhirBase = iss[0].replace(/\/fhir\/?$/, ''); // removes /fhir from iss, so url is in correct directory for authorization
        const fhirBase = 'https://launch.smarthealthit.org/v/r4';

        const authorizeUrl = `${fhirBase}/auth/authorize?` +
          `response_type=code&` +
          `client_id=${encodeURIComponent(clientId)}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=${encodeURIComponent(scope)}&` +
          `aud=${encodeURIComponent(simpleIss)}&` +
          `launch=${launch}`;

        if (Platform.OS === 'web') {
          window.location.href = authorizeUrl;
        } else {
          Linking.openURL(authorizeUrl);
        }
      }

      // Launched from PARA 
      if (launchType === 'para' && fhirBase && patient) {
        setLaunchType('para');
        setPatientId(patient ? patient.toString() : '');
        setFHIRBaseURL(fhirBase[0]);
        router.replace('/');
      }
    });

    return () => task.cancel();
  }, [iss, launch, launchType, patient, accessToken]);

  return null;
}
