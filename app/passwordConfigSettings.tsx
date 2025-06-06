import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GlobalStyles as Style } from '@/app/styles';
import { Theme } from '../assets/theme';

export default function PasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (password === '1234') {
      setError('');
      router.replace('/configSettings');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center', flex: 1 }}>

      <View style={{ justifyContent: 'center', alignItems: 'center', margin: 40 }}>
        <MaterialCommunityIcons
          name="lock-outline"
          size={30}
          color={'#000'}
          style={{ marginBottom: 10 }}
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Configuration Settings</Text>
        <Text> Please enter the admin password to access these settings. </Text>
      </View>
      <TextInput
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        error={!!error}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <View style={{ flexDirection: 'row', margin: 20 }} >
        <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => router.push('/settings')}>
          Back
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={{ marginHorizontal: 5 }} >
          Access Settings
        </Button>
      </View>
    </View >
  );
}
