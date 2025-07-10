import { useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFHIRContext } from '../utils/fhirContext';

export default function Launch() {
  const { iss, launch, redirectURI, fhirBase, patient, accessToken, returnURL } = useLocalSearchParams();
  const { setFHIRBaseURL, launchType, setLaunchType, setPatientId, setReturnURL } = useFHIRContext();
  const router = useRouter();

  useEffect(() => {
    const handleLaunch = async () => {
      // Launched from EMR
      if (iss && launch) {
        await setLaunchType('emr');
        if (returnURL) setReturnURL(returnURL.toString());
        setReturnURL("https://hl7.org/fhir/smart-app-launch/app-launch.html#retrieve-well-knownsmart-configuration"); // temporary hardcoded

        // authentication variables
        const clientId = "my-smart-app";
        const redirectUri = Platform.OS === 'web'
          ? "http://localhost:8081/callback"
          : "rrate://callback";

        const scope = "launch patient/Observation.write openid fhirUser";
        const simpleIss = Array.isArray(iss) ? iss[0] : iss; // sometimes iss is an array, handle that case
        const base = simpleIss.replace(/\/fhir\/?$/, ''); // removes /fhir from iss, so url is in correct directory to find fhir base url
        await setFHIRBaseURL(`${iss}`);

        const authorizeUrl = `${base}/auth/authorize?` +
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
        return;
      }

      // Launched from external app (e.g. PARA)  
      if (fhirBase && patient) {
        await setLaunchType('app');
        await setPatientId(typeof patient === 'string' ? patient : patient[0]);
        await setFHIRBaseURL(Array.isArray(fhirBase) ? fhirBase[0] : fhirBase);
        setReturnURL(returnURL?.toString() ?? '');
        router.replace('/');
      }
    };

    handleLaunch();
  }, [iss, launch, launchType, redirectURI, fhirBase, patient, accessToken, returnURL]);

  return null;
}

