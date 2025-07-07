import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View, ActivityIndicator, Platform } from 'react-native';
import { useFHIRContext } from '@/utils/fhirContext';

const TOKEN_ENDPOINT = 'https://launch.smarthealthit.org/v/r4/token';
const CLIENT_ID = 'my-smart-app'; // match your registered client_id

// This screen handles the OAuth callback after the user has authenticated
export default function CallbackScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams();
  const { setAccessToken, setPatientId } = useFHIRContext();

  useEffect(() => {
    if (!code) return;

    const redirectUri =
      Platform.OS === 'web'
        ? "http://localhost:8081/callback"
        : "rrate://callback";

    // const tokenUrl = `${iss}/token`;

    async function exchangeCodeForToken() {
      try {
        const response = await fetch(TOKEN_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code.toString(),
            redirect_uri: redirectUri,
            client_id: CLIENT_ID,
          }).toString(),
        });

        const tokenJson = await response.json();

        if (!response.ok) {
          console.error('Token error:', tokenJson);
          throw new Error(tokenJson.error_description || 'Token exchange failed');
        }

        const { access_token, patient } = tokenJson;

        // Store relevant FHIR variables
        setAccessToken(access_token);
        setPatientId(patient);

        // Navigate to main app screen
        router.replace('/');

      } catch (err) {
        console.error('OAuth error:', err);
        // Pop-up here?
      }
    }

    exchangeCodeForToken();
  }, [code]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Finalizing login...</Text>
    </View>
  );
}
