import React from 'react'
import { View, Text } from 'react-native'
import { C, F, IS_WEB, MAX_W } from './constants'

interface Props {
  overline: string
  title: string
}

// Compact sky-deep hero banner — just overline + title, no description.
export function PageHero({ overline, title }: Props) {
  return (
    <View style={{
      backgroundColor: C.skyDeep,
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.18)',
    }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>
        <Text style={{
          color: C.yellow,
          fontFamily: F.bold,
          fontSize: 10,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          marginBottom: 3,
        }}>
          {overline}
        </Text>
        <Text style={{
          color: C.white,
          fontFamily: F.bold,
          fontSize: IS_WEB ? 26 : 20,
          lineHeight: IS_WEB ? 34 : 28,
        }}>
          {title}
        </Text>
      </View>
    </View>
  )
}
