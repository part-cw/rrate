import { Stack } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { Theme } from "../assets/theme";


export default function RootLayout() {
  return (
    <PaperProvider theme={Theme}>
      <Stack
        screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
