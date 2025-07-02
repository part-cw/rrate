// TO-DO: use for FHIR launch
import { useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function LaunchScreen() {
  const { iss, launch } = useLocalSearchParams(); // e.g., from EMR or SMART Launcher
  const router = useRouter();

  useEffect(() => {
    if (!iss) return;

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
  }, [iss, launch]);

  return null;
}
