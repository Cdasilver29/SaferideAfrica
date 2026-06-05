import React, { useState, useEffect } from 'react'
import { View, Pressable, Linking, Platform, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated'
import Svg, { Path, Rect, Circle } from 'react-native-svg'

const SOCIALS = {
  whatsapp:  'https://wa.me/254712045710?text=Hi%20SafeRide%2C%20I%20want%20to%20enquire%20about%20driving%20classes',
  facebook:  'https://www.facebook.com/safrideafrica',
  twitter:   'https://twitter.com/safrideafrica',
  tiktok:    'https://www.tiktok.com/@saferide254',
  instagram: 'https://www.instagram.com/safe_rideafrica',
  youtube:   'https://www.youtube.com/@saferide254',
}

const COLORS = {
  whatsapp:  '#25D366',
  facebook:  '#1877F2',
  twitter:   '#000000',
  tiktok:    '#000000',
  instagram: '#E4405F',
  youtube:   '#FF0000',
}

const WA_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'

const TT_PATH =
  'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.16a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-1.59z'

const BUTTON_SIZE = 38
const ICON_SIZE = 16
const SPACING = 48
const TOTAL_HEIGHT = BUTTON_SIZE + SPACING * 5

const isWeb = Platform.OS === 'web'

function WhatsAppIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill={color} d={WA_PATH} />
    </Svg>
  )
}

function TikTokIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill={color} d={TT_PATH} />
    </Svg>
  )
}

// Brand icons removed from lucide-react-native v1+; using inline SVG paths instead.
function InstagramIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="2" />
      <Circle cx="17.5" cy="6.5" r="1.5" fill={color} />
    </Svg>
  )
}

function FacebookIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill={color} d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </Svg>
  )
}

function TwitterXIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill={color} d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </Svg>
  )
}

function YouTubeIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill={color} d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </Svg>
  )
}

type SpreadConfig = {
  key: keyof typeof SOCIALS
  color: string
  spreadIndex: number
  icon: React.ReactElement
}

const SPREAD_ICONS: SpreadConfig[] = [
  { key: 'instagram', color: COLORS.instagram, spreadIndex: 1, icon: <InstagramIcon size={ICON_SIZE} /> },
  { key: 'tiktok',   color: COLORS.tiktok,    spreadIndex: 2, icon: <TikTokIcon size={ICON_SIZE} /> },
  { key: 'twitter',  color: COLORS.twitter,   spreadIndex: 3, icon: <TwitterXIcon size={ICON_SIZE} /> },
  { key: 'facebook', color: COLORS.facebook,  spreadIndex: 4, icon: <FacebookIcon size={ICON_SIZE} /> },
  { key: 'youtube',  color: COLORS.youtube,   spreadIndex: 5, icon: <YouTubeIcon size={ICON_SIZE} /> },
]

function SpreadItem({
  config,
  pulse,
  spreadProgress,
  interactive,
}: {
  config: SpreadConfig
  pulse: SharedValue<number>
  spreadProgress: SharedValue<number>
  interactive: boolean
}) {
  // Outer: handles position within container + spread movement + fade
  const posStyle = useAnimatedStyle(() => ({
    opacity: interpolate(spreadProgress.value, [0, 0.4], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(spreadProgress.value, [0, 1], [0, -(SPACING * config.spreadIndex)]) },
    ],
  }))

  // Inner: handles pulse scale + glow
  const glowStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [1, 1.04])
    const r = interpolate(pulse.value, [0, 1], [8, 18])
    const o = interpolate(pulse.value, [0, 1], [0.2, 0.5])
    if (isWeb) {
      return { transform: [{ scale }], boxShadow: `0 0 ${r}px ${config.color}` } as any
    }
    return { transform: [{ scale }], shadowRadius: r, shadowOpacity: o }
  })

  return (
    <Animated.View
      pointerEvents={interactive ? 'auto' : 'none'}
      style={[styles.absoluteBase, posStyle]}
    >
      <Pressable onPress={() => Linking.openURL(SOCIALS[config.key])}>
        <Animated.View
          style={[
            styles.button,
            { backgroundColor: config.color },
            !isWeb && { shadowColor: config.color, shadowOffset: { width: 0, height: 0 } },
            glowStyle,
          ]}
        >
          {config.icon}
        </Animated.View>
      </Pressable>
    </Animated.View>
  )
}

function WhatsAppButton({
  pulse,
  onPress,
}: {
  pulse: SharedValue<number>
  onPress: () => void
}) {
  const glowStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [1, 1.08])
    const r = interpolate(pulse.value, [0, 1], [10, 24])
    const o = interpolate(pulse.value, [0, 1], [0.5, 1.0])
    if (isWeb) {
      return { transform: [{ scale }], boxShadow: `0 0 ${r}px ${COLORS.whatsapp}` } as any
    }
    return { transform: [{ scale }], shadowRadius: r, shadowOpacity: o }
  })

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: COLORS.whatsapp },
          !isWeb && { shadowColor: COLORS.whatsapp, shadowOffset: { width: 0, height: 0 } },
          glowStyle,
        ]}
      >
        <WhatsAppIcon size={ICON_SIZE} />
      </Animated.View>
    </Pressable>
  )
}

export default function SocialFloat() {
  const [open, setOpen] = useState(false)
  const spreadProgress = useSharedValue(0)
  const pulse = useSharedValue(0)

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1400 }), -1, true)
  }, [])

  useEffect(() => {
    spreadProgress.value = withSpring(open ? 1 : 0, { damping: 14, stiffness: 180 })
  }, [open])

  // Web: hover the entire widget area to spread; click WA to open link
  // Native: tap WA to toggle spread; tap individual icons to open their links
  const webHoverProps = isWeb
    ? { onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false) }
    : {}

  const handleWaPress = isWeb
    ? () => Linking.openURL(SOCIALS.whatsapp)
    : () => setOpen(o => !o)

  const containerStyle = {
    position: (isWeb ? 'fixed' : 'absolute') as any,
    right: 20,
    // Web: 62% pushes WhatsApp clear of the hero scroll-down chevron at the bottom of the hero.
    // Native: 50% centres the WA button vertically on screen.
    top: (isWeb ? '62%' : '50%') as any,
    transform: [{ translateY: isWeb ? -(TOTAL_HEIGHT / 2) : -(BUTTON_SIZE / 2) }],
    zIndex: 100,
    width: BUTTON_SIZE,
    // Web container spans full expanded height so hover area covers all icons.
    height: isWeb ? TOTAL_HEIGHT : BUTTON_SIZE,
    justifyContent: 'flex-end' as const,
  }

  return (
    <View style={containerStyle} {...(webHoverProps as any)}>
      {SPREAD_ICONS.map(config => (
        <SpreadItem
          key={config.key}
          config={config}
          pulse={pulse}
          spreadProgress={spreadProgress}
          interactive={open}
        />
      ))}
      <WhatsAppButton pulse={pulse} onPress={handleWaPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  absoluteBase: {
    position: 'absolute',
    bottom: 0,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
