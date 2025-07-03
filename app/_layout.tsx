import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { Theme } from "../assets/theme";
import { SettingsProvider } from "../utils/globalContext";
import { FHIRContextProvider } from "@/utils/fhirContext";

// Project root
export default function RootLayout() {
  return (
    <PaperProvider theme={Theme}>
      <FHIRContextProvider>
        <SettingsProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'none',
            }} />
        </SettingsProvider>
      </FHIRContextProvider>
    </PaperProvider>
  );
}
