import '../src/i18n';
import { useEffect } from 'react';
import { Platform, View, LogBox } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'nativewind';
import '../global.css';
import { EnrollModalProvider } from '../src/context/EnrollModalContext';
import EnrollModal from '../src/components/EnrollModal';
import SocialFloat from '../src/components/SocialFloat';
import RouteSplash from '../src/components/animations/RouteSplash';
import { C } from '../src/components/landing/constants';
import { useViewTransitions } from '../src/lib/viewTransitions';

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

  // Web-only: smooth cross-fade on route changes (no-op on native, when
  // unsupported, or under reduce-motion).
  useViewTransitions();

  // Web: CSS @font-face in public/index.html handles font loading natively —
  // passing {} resolves fontsLoaded=true immediately, no JS font loader needed.
  // Native: expo-font loads the TTF files from assets/fonts/.
  const [fontsLoaded, fontError] = useFonts(
    IS_WEB
      ? {}
      : {
          'Manrope-Regular':  require('../assets/fonts/Manrope-Regular.ttf'),
          'Manrope-Medium':   require('../assets/fonts/Manrope-Medium.ttf'),
          'Manrope-SemiBold': require('../assets/fonts/Manrope-SemiBold.ttf'),
          'Manrope-Bold':     require('../assets/fonts/Manrope-Bold.ttf'),
        }
  );
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Dismiss splash screen once fonts are ready OR if they fail — never leave
  // the splash overlay up, which would show as a white screen on web.
  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  // Default to light mode regardless of OS preference
  useEffect(() => { setColorScheme('light'); }, []);

  return (
    <SafeAreaProvider>
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
<Stack.Screen name="services/[code]" />
                <Stack.Screen name="blog/[id]" />
                <Stack.Screen name="classes/index" />
                <Stack.Screen name="classes/[code]/index" />
              </Stack>
              <SocialFloat />
            </View>
          </View>
          {/* Route-change splash: brand overlay with the logo, about 1s, then
              fades to the page. No-op under reduce-motion and on first load. */}
          <RouteSplash />
          {/* Single enrollment modal — accessible from any screen */}
          <EnrollModal />
        </EnrollModalProvider>
    </SafeAreaProvider>
  );
}
