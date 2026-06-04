import '../src/i18n';
import { useEffect } from 'react';
import { Platform, View, LogBox } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'nativewind';
import '../global.css';
import { AuthProvider } from '../src/context/AuthContext';
import { EnrollModalProvider } from '../src/context/EnrollModalContext';
import EnrollModal from '../src/components/EnrollModal';
import SocialFloat from '../src/components/SocialFloat';
import { C } from '../src/components/landing/constants';

SplashScreen.preventAutoHideAsync();

const IS_WEB = Platform.OS === 'web';

// Suppress RNW deprecation noise — runs once at first render
let _warnPatched = false;
function suppressRNWWarnings() {
  if (_warnPatched || Platform.OS !== 'web') return;
  _warnPatched = true;
  const orig = console.warn.bind(console);
  console.warn = (...args: any[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (msg.includes('"shadow*"') || msg.includes('props.pointerEvents')) return;
    orig(...args);
  };
}

export default function RootLayout() {
  suppressRNWWarnings();

  const [fontsLoaded] = useFonts({
    'WorkSans-Regular':  require('../assets/fonts/WorkSans-Regular.ttf'),
    'WorkSans-Medium':   require('../assets/fonts/WorkSans-Medium.ttf'),
    'WorkSans-SemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf'),
    'WorkSans-Bold':     require('../assets/fonts/WorkSans-Bold.ttf'),
  });
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <EnrollModalProvider>
          {/* Outer gutter — light skyDeep tint on web */}
          <View style={{ flex: 1, backgroundColor: isDark ? C.dark : 'rgba(1,165,240,0.04)' }}>
            {/* Inner card — max 1280 px on web, edge-to-edge on mobile */}
            <View
              style={{
                flex: 1,
                width: '100%',
                ...(IS_WEB ? {
                  maxWidth: 1280,
                  marginHorizontal: 'auto' as any,
                  borderRadius: 20,
                  overflow: 'hidden',
                  backgroundColor: isDark ? C.dark : C.white,
                  shadowColor: C.dark,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 24,
                  marginVertical: 16,
                } : {
                  backgroundColor: isDark ? C.dark : C.white,
                }),
              }}
            >
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="about" />
                <Stack.Screen name="courses" />
                <Stack.Screen name="services" />
                <Stack.Screen name="branches" />
                <Stack.Screen name="contact" />
                <Stack.Screen name="gallery" />
                <Stack.Screen name="blog" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
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
            </View>
          </View>
          {/* Single enrollment modal — accessible from any screen */}
          <EnrollModal />
        </EnrollModalProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
