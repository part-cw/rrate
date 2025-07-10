import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View, ActivityIndicator, Platform } from 'react-native';
import { useFHIRContext } from '../utils/fhirContext';

const TOKEN_ENDPOINT = 'https://launch.smarthealthit.org/v/r2/auth/token';
const CLIENT_ID = 'my-smart-app'; // Replace with your actual client_id

export default function CallbackScreen() {
  const router = useRouter();
  const { code, state } = useLocalSearchParams();
  const { launchType, setAccessToken, setPatientId } = useFHIRContext();

  useEffect(() => {
    if (!code) return;

    const redirectUri =
      Platform.OS === 'web'
        ? "http://localhost:8081/callback"
        : "rrate://callback";

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

        console.log("Luanch type:", launchType);
        const tokenJson = await response.json();

        if (!response.ok) {
          console.error('Token error:', tokenJson);
          throw new Error(tokenJson.error_description || tokenJson.error || 'Token exchange failed');
        }

        const { access_token, patient } = tokenJson;

        // Store access token and patient ID
        setAccessToken(access_token);
        setPatientId(patient);

        // Navigate to home screen
        router.replace('/');

      } catch (err) {
        console.error('OAuth error:', err);
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
