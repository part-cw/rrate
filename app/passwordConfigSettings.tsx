import { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../assets/theme';
import { GlobalStyles as Style } from '../assets/styles';
import { useGlobalVariables } from '../utils/globalContext';
import useTranslation from '../utils/useTranslation';

// Page for entering the password to access configuration settings
export default function PasswordPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const { password, setConfigSettingsUnlocked } = useGlobalVariables();

  const [passwordField, setPasswordField] = useState('');
  const [error, setError] = useState('');

  // Handle password submission
  const handleSubmit = async () => {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      passwordField
    );
    if (hash === password) {
      setError('');
      setConfigSettingsUnlocked(true);
      router.replace('/configSettings');
    } else {
      setError(t("INCORRECT_PASS"));
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0} >
      <ScrollView contentContainerStyle={Style.redirectScreenContainer}>
        < View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={30}
            color={'#000'}
            style={{ marginBottom: 10 }}
          />
          <Text style={Style.pageTitle}>{t("CONFIG_SETT")}</Text>
          <Text style={[Style.text, { textAlign: 'center' }]}>{t("ADMIN_PASS")}</Text>
          <TextInput
            label={t("PASSWORD")}
            secureTextEntry
            value={passwordField}
            onChangeText={setPasswordField}
            error={!!error}
            style={{ marginTop: 20, width: 300 }}
          />
          {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
          <View style={Style.lightButtonContainer} >
            <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => router.back()}>
              {t("BACK")}
            </Button>
            <Button mode="contained" onPress={handleSubmit} style={{ marginHorizontal: 5 }} >
              {t("ACCESS_SETT")}
            </Button>
          </View>
        </View >
      </ScrollView >
    </KeyboardAvoidingView>
  );
}