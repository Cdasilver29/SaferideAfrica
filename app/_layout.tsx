import '../src/i18n';
import { useEffect } from 'react';
import { Platform, View, LogBox, Pressable, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Archivo_700Bold, Archivo_600SemiBold } from '@expo-google-fonts/archivo';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { useColorScheme } from 'nativewind';
import { Sun, Moon } from 'lucide-react-native';
import '../global.css';
import { EnrollModalProvider, useEnrollModal } from '../src/context/EnrollModalContext';
import EnrollModal from '../src/components/EnrollModal';
import SocialFloat from '../src/components/SocialFloat';
import RouteSplash from '../src/components/animations/RouteSplash';
import { C } from '../src/components/landing/constants';
import { HeaderV3 } from '../src/components/landing/HeaderV3';
import LanguageSwitcher from '../src/components/landing/LanguageSwitcher';
import {
  WhatsAppIcon, FacebookIcon, TwitterXIcon, TikTokIcon, InstagramIcon, YouTubeIcon,
} from '../src/components/SocialIcons';
import { COMPANY, SOCIALS } from '../src/data/saferide';
import { brand } from '../src/lib/tokens';

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

// Persistent site header. Lives inside EnrollModalProvider so useEnrollModal
// resolves, and reads the nativewind colour scheme for the theme toggle. All
// the props HeaderV3 needs are assembled here rather than in any one route.
function SiteHeader() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { open: openEnrollModal } = useEnrollModal();

  const socials = [
    { label: 'WhatsApp',  url: SOCIALS.whatsapp,  Icon: WhatsAppIcon },
    { label: 'Facebook',  url: SOCIALS.facebook,  Icon: FacebookIcon },
    { label: 'X',         url: SOCIALS.twitter,   Icon: TwitterXIcon },
    { label: 'TikTok',    url: SOCIALS.tiktok,    Icon: TikTokIcon },
    { label: 'Instagram', url: SOCIALS.instagram, Icon: InstagramIcon },
    { label: 'YouTube',   url: SOCIALS.youtube,   Icon: YouTubeIcon },
  ];

  const themeToggle = (
    <Pressable
      onPress={toggleColorScheme}
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      className="h-11 w-11 items-center justify-center rounded-pill"
    >
      {isDark
        ? <Sun size={18} color={brand.accent} />
        : <Moon size={18} color={brand.onPrimary} />}
    </Pressable>
  );

  const onCallNow = () => Linking.openURL(`tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`);
  const onEnrol = () => openEnrollModal();

  return (
    <HeaderV3
      logoSource={require('../assets/images/saferide-logo.jpg')}
      socials={socials}
      languageSwitcher={<LanguageSwitcher />}
      themeToggle={themeToggle}
      onCallNow={onCallNow}
      onEnrol={onEnrol}
    />
  );
}

export default function RootLayout() {
  suppressRNWWarnings();

  // Web-only smooth view transitions removed so RouteSplash triggers properly


  // UI System v2 typefaces (Archivo display, Inter body). Loaded via the
  // @expo-google-fonts packages on every platform since, unlike Manrope, they
  // have no CSS @font-face fallback in public/index.html.
  const uiV2Fonts = {
    Archivo_700Bold,
    Archivo_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  };

  // Web: CSS @font-face in public/index.html handles Manrope natively, so only
  // the UI v2 fonts need the JS loader there.
  // Native: expo-font loads the Manrope TTF files from assets/fonts/.
  const [fontsLoaded, fontError] = useFonts(
    IS_WEB
      ? uiV2Fonts
      : {
          'Manrope-Regular':  require('../assets/fonts/Manrope-Regular.ttf'),
          'Manrope-Medium':   require('../assets/fonts/Manrope-Medium.ttf'),
          'Manrope-SemiBold': require('../assets/fonts/Manrope-SemiBold.ttf'),
          'Manrope-Bold':     require('../assets/fonts/Manrope-Bold.ttf'),
          ...uiV2Fonts,
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
          <View style={{ flex: 1, backgroundColor: isDark ? C.dark : C.white }}>
            {/* Inner card — edge-to-edge on all platforms */}
            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: isDark ? C.dark : C.white,
              }}
            >
              <SiteHeader />
              <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="about" />
                <Stack.Screen name="about/story" />
                <Stack.Screen name="about/values" />
                <Stack.Screen name="about/why-us" />
                <Stack.Screen name="about/how-we-work" />
                <Stack.Screen name="about/faq" />
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
