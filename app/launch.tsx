import { useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFHIRContext } from '../utils/fhirContext';
import { fetchEndpoint } from '../utils/fhirFunctions';
import * as Crypto from 'expo-crypto';

// Handles initial launch of the app from either an external app (like PARA) or from an EMR. Follows OAuth 2.0 authentication protocol, with additional PKCE security.
export default function Launch() {
  const { iss, launch, redirectURI, patient, accessToken, returnURL } = useLocalSearchParams();
  const { launchType, setLaunchType, setPatientId, setReturnURL, setFHIRBaseURL, clientId, redirectUri } = useFHIRContext();
  const router = useRouter();

  // Encodes random string in in base64 URL with high entropy, as required by OAuth 2.0
  function base64URLEncode(str: string) {
    return str
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Creates a S256 hash of the code verifier
  async function generateCodeChallenger(verifier: string) {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      verifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );
  }

  useEffect(() => {
    const handleLaunch = async () => {
      // Launched from EMR
      if (iss && launch) {
        setLaunchType('emr');
        setReturnURL(returnURL?.toString() || ''); // if EMR provides a return URL; if not, use empty string to replace previous return url in AsyncStorage
        setFHIRBaseURL(iss.toString());
        const simpleIss = Array.isArray(iss) ? iss[0] : iss; // sometimes iss is an array, handle that case

        // Retrieve authorization endpoint from the server 
        const endpoint = await fetchEndpoint(iss.toString());

        const authorizationEndpoint = endpoint.authorization_endpoint;
        const tokenEndpoint = endpoint.token_endpoint;
        sessionStorage.setItem('token_endpoint', tokenEndpoint); // save token endpoint for later use in callback.tsx; use sessionStorage to avoid lag in async setters

        var code_verifier = base64URLEncode(Crypto.getRandomBytes(32).toString()); // Generate code verifier and code challenge for PKCE
        sessionStorage.setItem('pkce_code_verifier', code_verifier); // again, save verifier for later use in callback.tsx; use sessionStorage to avoid lag in async setters
        var transformed_verifier = await generateCodeChallenger(code_verifier); // Generate code challenge from code verifier
        var code_challenge = base64URLEncode(transformed_verifier);

        const scope = "launch patient/Observation.write openid fhirUser";

        // Authorization URL uses PKCE security 
        const authorizeUrl = authorizationEndpoint +
          `?response_type=code&` +
          `client_id=${encodeURIComponent(clientId)}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=${encodeURIComponent(scope)}&` +
          `aud=${encodeURIComponent(simpleIss)}&` +
          `launch=${launch}&` +
          `code_challenge=${encodeURIComponent(code_challenge)}&` +
          `code_challenge_method=S256`;

        if (Platform.OS === 'web') {
          window.location.href = authorizeUrl;
        } else {
          Linking.openURL(authorizeUrl);
        }
        return;
      }

      // Launched from external app (e.g. PARA)  
      if (patient && returnURL) {
        await setLaunchType('app');
        await setPatientId(typeof patient === 'string' ? patient : patient[0]);
        setReturnURL(decodeURIComponent(returnURL[0]));
        router.replace('/');
      }
    };

    handleLaunch();
  }, [iss, launch, launchType, redirectURI, patient, accessToken, returnURL]);

  return null;
}

