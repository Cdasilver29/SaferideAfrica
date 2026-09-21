import { Platform } from 'react-native';

/**
 * Class name for the styled container scrollbar, defined in global.css.
 *
 * Every route owns its own vertical scroller, so each one applies this to make
 * the browser paint the bold brand scrollbar instead of the default thin one.
 *
 * Web only, matching the .modal-scroll precedent: the rules behind it are
 * ::-webkit-scrollbar pseudo-elements and scrollbar-color, none of which mean
 * anything on native. NativeWind turns className into react-native-web's
 * { $$css: true } style object, which lands the name on the scrolling DOM node.
 *
 * Note this only shows up if the ScrollView does NOT set
 * showsVerticalScrollIndicator={false}: react-native-web answers that prop with
 * scrollbarWidth: 'none', which wins over everything here.
 */
export const APP_SCROLLBAR = Platform.OS === 'web' ? 'app-scrollbar' : undefined;
