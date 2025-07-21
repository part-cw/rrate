import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { Theme } from "../assets/theme";
import { SettingsProvider } from "../utils/globalContext";
import { FHIRContextProvider } from "@/utils/fhirContext";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from "react-native-safe-area-context";

// Project root
export default function RootLayout() {
  return (
    <PaperProvider theme={Theme}>
      <FHIRContextProvider>
        <SettingsProvider>
          <StatusBar style="dark" backgroundColor="#fff" />
          <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(242, 242, 242)' }} edges={['top', 'bottom', 'left', 'right']}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'none',
              }} />
          </SafeAreaView>
        </SettingsProvider>
      </FHIRContextProvider>
    </PaperProvider>
  );
}
