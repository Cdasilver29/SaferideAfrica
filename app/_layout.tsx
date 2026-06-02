import '../src/i18n';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';
import '../global.css';
import { AuthProvider } from '../src/context/AuthContext';
import SocialFloat from '../src/components/SocialFloat';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="about" />
          <Stack.Screen name="services/[code]" />
          <Stack.Screen name="blog/[id]" />
          <Stack.Screen name="account/index" />
          <Stack.Screen name="classes/index" />
          <Stack.Screen name="classes/[code]/index" />
          <Stack.Screen name="classes/[code]/enrol" />
          <Stack.Screen name="enrollments/[id]/pay" />
          <Stack.Screen name="admin/index" />
        </Stack>
        <SocialFloat />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
