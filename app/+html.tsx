import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// Static HTML shell rendered around every route by `expo export` (web.output:
// static). This holds only the global head: charset, viewport, fonts, favicon,
// the react-native-web scroll reset, and shared preloads. Per-route title,
// description, canonical, og, twitter, and JSON-LD are injected by PageHead
// (expo-router/head) so each page ships unique metadata in its static source.

const FONT_AND_RESET_CSS = `
@font-face { font-family: 'Manrope-Regular';  src: url('/fonts/Manrope-Regular.ttf')  format('truetype'); font-display: swap; }
@font-face { font-family: 'Manrope-Medium';   src: url('/fonts/Manrope-Medium.ttf')   format('truetype'); font-display: swap; }
@font-face { font-family: 'Manrope-SemiBold'; src: url('/fonts/Manrope-SemiBold.ttf') format('truetype'); font-display: swap; }
@font-face { font-family: 'Manrope-Bold';     src: url('/fonts/Manrope-Bold.ttf')     format('truetype'); font-display: swap; }
#root { flex: 1; }
/* Manrope is the default family for any unstyled web text */
body { font-family: 'Manrope-Regular', system-ui, sans-serif; }
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <meta name="theme-color" content="#01a5f0" />
        <meta name="author" content="Safe Ride Africa Driving School" />
        <meta
          name="keywords"
          content="driving school Nairobi, NTSA driving lessons Kenya, driving license Nairobi, Safe Ride Africa, defensive driving, Smart DL Kenya, driving school near me"
        />

        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />

        {/* Hero image preload speeds up LCP on the home page */}
        <link rel="preload" as="image" href="/DSC_2116.webp" />

        {/* Fonts fetched before JS so text renders immediately */}
        <link rel="preload" href="/fonts/Manrope-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Manrope-Medium.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Manrope-SemiBold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Manrope-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />

        {/* react-native-web root reset (height/overflow/flex) */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: FONT_AND_RESET_CSS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
