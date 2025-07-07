import { useEffect } from 'react';
import { Platform, Linking, InteractionManager } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFHIRContext } from '../utils/fhirContext';

export default function Launch() {
  const { iss, launch, launchType, fhirBase, patient, accessToken } = useLocalSearchParams(); // e.g., from EMR or PARA
  const { setFHIRBaseURL, setLaunchType, setPatientId, setAccessToken } = useFHIRContext();
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
            ? "http://localhost:8081/callback"
            : "rrate://callback";

        const scope = "launch patient/Observation.write openid fhirUser";

        const authorizeUrl = `${iss}/auth/authorize?` +
          `response_type=code&` +
          `client_id=${encodeURIComponent(clientId)}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=${encodeURIComponent(scope)}&` +
          `aud=${encodeURIComponent(iss[0])}&` +
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
