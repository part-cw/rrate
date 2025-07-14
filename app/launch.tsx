import { useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFHIRContext } from '../utils/fhirContext';
import { fetchEndpoint } from '../utils/fhirFunctions';
import * as Crypto from 'expo-crypto';

export default function Launch() {
  const { iss, launch, redirectURI, fhirBase, patient, accessToken, returnURL } = useLocalSearchParams();
  const { launchType, setLaunchType, setPatientId, setReturnURL, setFHIRBaseURL } = useFHIRContext();
  const router = useRouter();


  // Encodes random string in in base64 URL with high entropy, as required by OAuth 2.0
  function base64URLEncode(str: string) {
    return str
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // creates a S256 hash of the code verifier
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
        await setLaunchType('emr');
        if (returnURL) setReturnURL(returnURL.toString()); // if EMR provides a return URL
        setReturnURL("https://hl7.org/fhir/smart-app-launch/app-launch.html#retrieve-well-knownsmart-configuration"); // temporarily hardcoded

        // authentication variables - HARD-CODED
        const clientId = "my-smart-app";
        const redirectUri = Platform.OS === 'web'
          ? "http://localhost:8081/callback"
          : "rrate://callback";

        const scope = "launch patient/Observation.write openid fhirUser";
        const simpleIss = Array.isArray(iss) ? iss[0] : iss; // sometimes iss is an array, handle that case

        // Retrieve authorization endpoint from the server 
        const endpoint = await fetchEndpoint(iss.toString());
        console.log("Endpoint:", endpoint);

        const authorizationEndpoint = endpoint.authorization_endpoint;
        const tokenEndpoint = endpoint.token_endpoint;
        sessionStorage.setItem('token_endpoint', tokenEndpoint);// save token endpoint for later use in callback.tsx

        // Generate code verifier and code challenge for PKCE
        var code_verifier = base64URLEncode(Crypto.getRandomBytes(32).toString());
        // Store codeVerifier securely for token exchange later
        sessionStorage.setItem('pkce_code_verifier', code_verifier);
        // Generate code challenge from code verifier
        var transformed_verifier = await generateCodeChallenger(code_verifier);
        var code_challenge = base64URLEncode(transformed_verifier);

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

