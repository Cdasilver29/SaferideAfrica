import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AnimatedRN, {
  useSharedValue, useAnimatedStyle,
  withSpring, withSequence, withTiming, withDelay,
  interpolate,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme';
import { ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { SERVICES, ServiceItem } from '@/data/saferide';
import { C, F, IS_WEB, MAX_W } from './constants';

function ServiceCard({
  svc,
  readMore,
  entranceDelay,
}: {
  svc: ServiceItem;
  readMore: string;
  entranceDelay: number;
}) {
  const T = useTheme();

  // Entrance
  const enterOp = useSharedValue(0);
  const enterY  = useSharedValue(24);

  // Hover / press — zoom-out (scale > 1) + sway
  const zoom   = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    enterOp.value = withDelay(entranceDelay, withTiming(1, { duration: 500 }));
    enterY.value  = withDelay(entranceDelay, withTiming(0, { duration: 500 }));
  }, []);

  const onEnter = () => {
    // Zoom out = card expands toward viewer (scale > 1)
    zoom.value   = withSpring(1, { damping: 7, stiffness: 200 });
    // Quick tilt left → spring sway right
    rotate.value = withSequence(
      withTiming(-2, { duration: 85 }),
      withSpring(2, { damping: 5, stiffness: 180 }),
    );
  };

  const onLeave = () => {
    zoom.value   = withSpring(0, { damping: 10, stiffness: 200 });
    rotate.value = withSpring(0, { damping: 8,  stiffness: 200 });
  };

  const animStyle = useAnimatedStyle(() => {
    const glowOp   = interpolate(zoom.value, [0, 1], [0.08, 0.85]);
    const shadowR  = interpolate(zoom.value, [0, 1], [10, 30]);
    const borderOp = interpolate(zoom.value, [0, 1], [0.10, 1.0]);

    return {
      opacity:   enterOp.value,
      transform: [
        { translateY: enterY.value },
        // Zoom OUT — card grows toward the viewer
        { scale:      interpolate(zoom.value, [0, 1], [1, 1.07]) },
        { translateY: interpolate(zoom.value, [0, 1], [0, -8]) },
        { rotate:     `${rotate.value}deg` },
      ],
      // Round shiny yellow coat
      borderColor:   `rgba(255,216,0,${borderOp})`,
      shadowColor:   C.yellow,
      shadowOpacity: interpolate(zoom.value, [0, 1], [0.07, 0.75]),
      shadowRadius:  shadowR,
      shadowOffset:  { width: 0, height: 4 },
      elevation:     interpolate(zoom.value, [0, 1], [2, 18]),
      ...(IS_WEB && {
        // @ts-ignore web-only
        boxShadow: `0 0 ${shadowR}px rgba(255,216,0,${glowOp}), 0 4px 20px rgba(255,216,0,${(glowOp * 0.45).toFixed(2)})`,
      }),
    };
  });

  return (
    <AnimatedRN.View
      style={[
        {
          flex: 1,
          backgroundColor: T.card,
          borderRadius: 18,
          borderWidth: 1.5,
        },
        animStyle,
      ]}
    >
      <TouchableOpacity
        onPress={() => router.push(`/services/${svc.code}` as any)}
        onPressIn={onEnter}
        onPressOut={onLeave}
        {...(IS_WEB ? ({ onMouseEnter: onEnter, onMouseLeave: onLeave } as any) : {})}
        activeOpacity={0.92}
        style={{
          flex: 1,
          padding: 20,
          alignItems: 'center',
          borderRadius: 18,
        }}
      >
        {/* Yellow accent bar */}
        <View style={{ width: 24, height: 3, borderRadius: 2, backgroundColor: C.yellow, marginBottom: 10 }} />

        <Text style={{
          color: T.foreground, fontFamily: F.bold, fontSize: 14,
          textAlign: 'center', marginBottom: 7, lineHeight: 20,
        }}>
          {svc.name}
        </Text>

        <Text style={{
          color: T.mutedForeground, fontFamily: F.regular, fontSize: 12,
          lineHeight: 18, textAlign: 'center', marginBottom: 12, flex: 1,
        }}>
          {svc.shortDesc}
        </Text>

        {/* Read More link */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ color: C.red, fontFamily: F.semibold, fontSize: 12 }}>{readMore}</Text>
          <ChevronRight size={13} color={C.red} />
        </View>
      </TouchableOpacity>
    </AnimatedRN.View>
  );
}

export default function Services() {
  const { t } = useTranslation();
  const T     = useTheme();
  const readMore = t('services.readMore');

  const rows: ServiceItem[][] = [];
  for (let i = 0; i < SERVICES.length; i += 2) {
    rows.push(SERVICES.slice(i, i + 2));
  }

  return (
    <View style={{ backgroundColor: T.background, paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        <View style={{ alignItems: 'center', marginBottom: 44 }}>
          <Text style={{ color: C.blue, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('services.overline')}
          </Text>
          <Text style={{ color: T.foreground, fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34, marginBottom: 12 }}>
            {t('services.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue }} />
            <View style={{ height: 2, width: 40, backgroundColor: C.yellow, borderRadius: 2 }} />
          </View>
        </View>

        {IS_WEB ? (
          rows.map((pair, rowIdx) => (
            <View key={rowIdx} style={{ flexDirection: 'row', gap: 14, marginBottom: 14 }}>
              {pair.map((svc, colIdx) => (
                <ServiceCard
                  key={svc.code}
                  svc={svc}
                  readMore={readMore}
                  entranceDelay={(rowIdx * 2 + colIdx) * 60}
                />
              ))}
              {pair.length === 1 && <View style={{ flex: 1 }} />}
            </View>
          ))
        ) : (
          <View style={{ gap: 14 }}>
            {SERVICES.map((svc, idx) => (
              <ServiceCard
                key={svc.code}
                svc={svc}
                readMore={readMore}
                entranceDelay={idx * 60}
              />
            ))}
          </View>
        )}

      </View>
    </View>
  );
}
