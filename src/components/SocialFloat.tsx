import React from 'react'
import { View, Pressable, Linking, Platform, StyleSheet, useWindowDimensions } from 'react-native'
import { Phone } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { COMPANY, SOCIALS } from '@/data/saferide'
import { WhatsAppIcon } from './SocialIcons'

// Phase B: the floating widget is a single WhatsApp button (the social spread
// moved to the footer). One tap opens the chat. Mobile keeps the call button
// below it since the navbar Call Now control is desktop-only.

const COLORS = {
  whatsapp: '#25D366', // WhatsApp brand green
  call:     '#e11d2e',
}

const BUTTON_SIZE = 44
const ICON_SIZE = 20
const CALL_GAP = 12

const isWeb = Platform.OS === 'web'

export default function SocialFloat() {
  const { t } = useTranslation()
  const { width: winW } = useWindowDimensions()
  const isMobile = !isWeb || winW < 768

  const waStyle = {
    position: (isWeb ? 'fixed' : 'absolute') as any,
    right: 20,
    // Web: 62% keeps WhatsApp clear of the hero scroll-down chevron.
    // Native: 50% centres it vertically on screen.
    top: (isWeb ? '62%' : '50%') as any,
    transform: [{ translateY: -(BUTTON_SIZE / 2) }],
    zIndex: 100,
  }

  const callStyle = {
    position: (isWeb ? 'fixed' : 'absolute') as any,
    right: 20,
    top: (isWeb ? '62%' : '50%') as any,
    transform: [{ translateY: BUTTON_SIZE / 2 + CALL_GAP }],
    zIndex: 100,
  }

  return (
    <>
      <View style={waStyle}>
        <Pressable
          onPress={() => Linking.openURL(SOCIALS.whatsapp)}
          accessibilityRole="link"
          accessibilityLabel="WhatsApp"
        >
          <View
            style={[
              styles.button,
              { backgroundColor: COLORS.whatsapp },
              !isWeb && { shadowColor: COLORS.whatsapp, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12 },
              isWeb && ({ boxShadow: `0 0 16px ${COLORS.whatsapp}` } as any),
            ]}
          >
            <WhatsAppIcon size={ICON_SIZE} />
          </View>
        </Pressable>
      </View>

      {isMobile && (
        <View style={callStyle}>
          <Pressable
            onPress={() => Linking.openURL(`tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`)}
            accessibilityRole="link"
            accessibilityLabel={t('common.callNow')}
          >
            <View
              style={[
                styles.button,
                { backgroundColor: COLORS.call },
                !isWeb && { shadowColor: COLORS.call, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 10 },
                isWeb && ({ boxShadow: `0 0 14px ${COLORS.call}` } as any),
              ]}
            >
              <Phone size={ICON_SIZE} color="#fff" />
            </View>
          </Pressable>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
