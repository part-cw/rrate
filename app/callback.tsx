import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View, ActivityIndicator, Platform } from 'react-native';
import { useFHIRContext } from '../utils/fhirContext';

const CLIENT_ID = 'my-smart-app'; // Replace with your actual client_id

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

    async function exchangeCodeForToken() {
      try {
        const tokenEndpoint = sessionStorage.getItem('token_endpoint');
        const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
        if (!tokenEndpoint) {
          throw new Error('Token endpoint is missing from sessionStorage');
        }
        const response = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code.toString(),
            redirect_uri: redirectUri,
            client_id: CLIENT_ID,
            code_verifier: codeVerifier || ''
          }).toString(),
        });

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
