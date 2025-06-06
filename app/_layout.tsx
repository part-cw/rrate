import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { Theme } from "../assets/theme";
import { SettingsProvider } from "./SettingsContext";


export default function RootLayout() {
  return (
    <PaperProvider theme={Theme}>
      <SettingsProvider>
        <Stack
          screenOptions={{ headerShown: false }} />
      </SettingsProvider>
    </PaperProvider>
  );
}
