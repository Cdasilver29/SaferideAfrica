import React, { useState } from 'react'
import { View, Pressable, Linking, Platform, StyleSheet, useWindowDimensions, DeviceEventEmitter } from 'react-native'
import { ChevronUp, X } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { COMPANY, SOCIALS } from '@/data/saferide'
import { WhatsAppIcon } from './SocialIcons'

const COLORS = {
  whatsapp: '#25D366',
  call: '#e11d2e',
  message: '#0a66c2', // standard blue
  scroll: '#333333'
}

const BUTTON_SIZE = 50
const ICON_SIZE = 24
const SUB_BUTTON_SIZE = 44
const SUB_ICON_SIZE = 20
const GAP = 12

const isWeb = Platform.OS === 'web'

export default function SocialFloat() {
  const { t } = useTranslation()
  const { width: winW } = useWindowDimensions()
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const scrollToTop = () => {
    if (isWeb) {
      // Scroll the document itself
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // Walk the entire DOM and scroll every element that has been scrolled down.
      // This catches React Native Web ScrollView containers regardless of their
      // generated class names or inline style formats.
      const all = document.querySelectorAll('*')
      all.forEach(el => {
        if (el.scrollTop > 0) {
          el.scrollTo({ top: 0, behavior: 'smooth' })
        }
      })
    }
    DeviceEventEmitter.emit('scrollToTop')
  }

  // Positioning
  const containerStyle = {
    position: (isWeb ? 'fixed' : 'absolute') as any,
    left: 20,
    bottom: 20,
    zIndex: 100,
    alignItems: 'center' as any,
  }

  const scrollUpStyle = {
    position: (isWeb ? 'fixed' : 'absolute') as any,
    right: 20,
    bottom: 20,
    zIndex: 100,
  }

  return (
    <>
      {/* Scroll Up Button - Bottom Right */}
      <View style={scrollUpStyle}>
        <Pressable onPress={scrollToTop} accessibilityRole="button" accessibilityLabel="Scroll to top">
          <View style={[
            styles.button,
            { backgroundColor: COLORS.scroll },
            !isWeb && { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
            isWeb && ({ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' } as any),
          ]}>
            <ChevronUp size={ICON_SIZE} color="#fff" />
          </View>
        </Pressable>
      </View>

      {/* Message / Contact Widget - Bottom Left */}
      <View style={containerStyle}>
        {isOpen && (
          <View style={{ paddingBottom: GAP, alignItems: 'center', gap: GAP }}>
            <Pressable
              onPress={() => Linking.openURL(SOCIALS.whatsapp)}
              accessibilityRole="link"
              accessibilityLabel="WhatsApp"
            >
              <View style={[
                styles.subButton,
                { backgroundColor: COLORS.whatsapp },
                !isWeb && { shadowColor: COLORS.whatsapp, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
                isWeb && ({ boxShadow: `0 4px 12px ${COLORS.whatsapp}` } as any),
              ]}>
                <WhatsAppIcon size={SUB_ICON_SIZE} />
              </View>
            </Pressable>

            <Pressable
              onPress={() => Linking.openURL(`tel:${COMPANY.primaryPhone.replace(/\s/g, '')}`)}
              accessibilityRole="link"
              accessibilityLabel={t('common.callNow')}
            >
              <View style={[
                styles.subButton,
                { backgroundColor: COLORS.call },
                !isWeb && { shadowColor: COLORS.call, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
                isWeb && ({ boxShadow: `0 4px 12px ${COLORS.call}` } as any),
              ]}>
                <Text style={{ fontSize: 20 }}>📞</Text>
              </View>
            </Pressable>
          </View>
        )}

        <Pressable onPress={toggleOpen} accessibilityRole="button" accessibilityLabel="Contact us">
          <View style={[
            styles.button,
            { backgroundColor: isOpen ? '#666' : COLORS.message },
            !isWeb && { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
            isWeb && ({ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' } as any),
          ]}>
            {isOpen ? <X size={ICON_SIZE} color="#fff" /> : <Text style={{ fontSize: 24 }}>💬</Text>}
          </View>
        </Pressable>
      </View>
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
  subButton: {
    width: SUB_BUTTON_SIZE,
    height: SUB_BUTTON_SIZE,
    borderRadius: SUB_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
