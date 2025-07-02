import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Text, View, ActivityIndicator } from 'react-native';

const TOKEN_ENDPOINT = 'https://r4.smarthealthit.org/token';
const REDIRECT_URI = 'http://localhost:19006/callback'; // or yourapp://callback
const CLIENT_ID = 'my-smart-app'; // match your registered client_id

// This screen handles the OAuth callback after the user has authenticated
export default function CallbackScreen() {
  const router = useRouter();
  const { code, state } = useLocalSearchParams();

  useEffect(() => {
    if (!code) return;

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
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
          }).toString(),
        });

        const tokenJson = await response.json();

        if (!response.ok) {
          console.error('Token error:', tokenJson);
          throw new Error(tokenJson.error_description || 'Token exchange failed');
        }

        const { access_token, patient, id_token, scope } = tokenJson;

        // Store what you need
        await SecureStore.setItemAsync('accessToken', access_token);
        if (patient) {
          await SecureStore.setItemAsync('patientId', patient);
        }

        // Navigate to main app screen
        router.replace('/');

      } catch (err) {
        console.error('OAuth error:', err);
        // Handle gracefully or show an error message
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
