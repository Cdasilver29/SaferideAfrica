import React from 'react'
import { View, Text, Pressable, Linking, Platform, StyleSheet, useWindowDimensions } from 'react-native'
import { useTranslation } from 'react-i18next'
import { SOCIALS } from '@/data/saferide'
import { F } from '@/components/landing/constants'
import { WhatsAppIcon } from './SocialIcons'

const WHATSAPP_GREEN = '#25D366'

// WhatsApp pill. 52px tall so the tap target clears the 44px floor with room
// to spare, and the radius is half the height for a true rounded-full edge.
const PILL_HEIGHT = 52
const PILL_ICON_SIZE = 24
const EDGE = 20 // distance from the viewport edge

// Space the pill's own chrome eats: left padding, icon, icon-to-text gap,
// right padding. Anything left over is what the label gets to use.
const PILL_CHROME = 16 + PILL_ICON_SIZE + 10 + 20
// Below this the label has too little room to read as a sentence, so the pill
// collapses to the icon alone in a circle.
const PILL_MIN_WIDTH = 210

const isWeb = Platform.OS === 'web'

export default function SocialFloat() {
  const { t } = useTranslation()
  const { width: winW } = useWindowDimensions()

  const label = t('common.whatsappHelp')

  // Widest the pill may grow before it would touch the opposite edge. Derived,
  // not guessed, so it holds at any width.
  const pillMaxWidth = winW - EDGE - EDGE
  const compact = pillMaxWidth < PILL_MIN_WIDTH

  const containerStyle = {
    position: (isWeb ? 'fixed' : 'absolute') as any,
    right: EDGE,
    bottom: EDGE,
    zIndex: 100,
    alignItems: 'flex-end' as any,
  }

  const shadow = !isWeb
    ? { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.22, shadowRadius: 8, elevation: 5 }
    : ({ boxShadow: '0 6px 16px rgba(0,0,0,0.20)' } as any)

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={() => Linking.openURL(SOCIALS.whatsapp)}
        accessibilityRole="link"
        accessibilityLabel={label}
        style={({ pressed }) => (pressed ? { opacity: 0.85 } : null)}
      >
        <View style={[
          compact ? styles.pillCompact : styles.pill,
          { backgroundColor: WHATSAPP_GREEN },
          !compact && { maxWidth: pillMaxWidth },
          shadow,
        ]}>
          <WhatsAppIcon size={PILL_ICON_SIZE} />
          {!compact && (
            <Text
              numberOfLines={1}
              style={[styles.pillLabel, { maxWidth: pillMaxWidth - PILL_CHROME }]}
            >
              {label}
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 20,
    gap: 10,
  },
  pillCompact: {
    width: PILL_HEIGHT,
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: {
    color: '#fff',
    fontFamily: F.medium,
    fontSize: 15,
    lineHeight: 20,
  },
})
