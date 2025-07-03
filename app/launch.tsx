import { useEffect } from 'react';
import { Platform, Linking, InteractionManager } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFHIRContext } from '../utils/fhirContext';

export default function Launch() {
  const { iss, launch, launchType, fhirBase, patient, accessToken } = useLocalSearchParams(); // e.g., from EMR or PARA
  const router = useRouter();
  const { setFHIRBaseURL, setLaunchType, setPatientId, setAccessToken } = useFHIRContext();

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      // Launched from EMR
      if (iss && launch) {
        setLaunchType('emr');

        // authentication 
        const clientId = "my-smart-app";
        const redirectUri =
          Platform.OS === 'web'
            ? "http://localhost:19006/callback"
            : "myapp://callback";

        const scope = "launch openid fhirUser patient/*.read patient/Observation.write";

        const params = new URLSearchParams({
          response_type: "code",
          client_id: clientId,
          redirect_uri: redirectUri,
          scope,
          aud: Array.isArray(iss) ? iss[0] : iss,
        });

        if (launch) {
          params.set("launch", launch.toString());
        }

        const authorizeUrl = `${iss}/auth/authorize?${params.toString()}`;

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
