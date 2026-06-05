import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming, interpolateColor,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { CLASS_SERIES, REFRESHER_LESSONS, PAYMENT, SeriesCode, DriveClass, CLASSES } from '@/data/saferide';
import { useEnrollModal } from '@/context/EnrollModalContext';
import { C, F, IS_WEB, MAX_W } from './constants';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const KSH = (n: number) =>
  n === 0 ? '—' : 'Ksh ' + n.toLocaleString('en-KE');

const SERIES_COLORS: Record<SeriesCode, string> = {
  A:    C.skyLight, // motorcycles — sky-light
  B:    C.skyDeep,  // standard — sky-deep (primary)
  C:    C.dark,     // heavy vehicles — black
  D:    C.yellow,   // minibus/PSV — accent
  EXEC: C.yellow,   // executive — accent
};

// ─── Zoom-out animated button pair ───────────────────────────────────────────

function ZoomBtn({
  onPress, style, children,
}: {
  onPress: () => void;
  style: object;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const onIn  = () => { scale.value = withSpring(1.08, { damping: 6, stiffness: 220 }); };
  const onOut = () => { scale.value = withSpring(1,    { damping: 8, stiffness: 200 }); };

  return (
    <Animated.View style={[IS_WEB ? { flex: 1 } : {}, animStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onIn}
        onPressOut={onOut}
        {...(IS_WEB ? ({ onMouseEnter: onIn, onMouseLeave: onOut } as any) : {})}
        activeOpacity={0.9}
        style={style}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

function ZoomButtons({
  accentColor, classCode, isBright,
  detailsLabel, enrolLabel, onDetails, onEnrol,
}: {
  accentColor: string; classCode: string; isBright: boolean;
  detailsLabel: string; enrolLabel: string;
  onDetails: () => void; onEnrol: () => void;
}) {
  return (
    <View style={IS_WEB
      ? { flexDirection: 'row', gap: 10, marginTop: 14 }
      : { gap: 8, marginTop: 14 }
    }>
      <ZoomBtn
        onPress={onDetails}
        style={IS_WEB
          ? { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' as const, borderWidth: 1, borderColor: accentColor }
          : { paddingVertical: 12, borderRadius: 10, alignItems: 'center' as const, borderWidth: 1, borderColor: accentColor }
        }
      >
        <Text style={{ color: accentColor, fontFamily: F.semibold, fontSize: 13 }}>{detailsLabel}</Text>
      </ZoomBtn>
      <ZoomBtn
        onPress={onEnrol}
        style={IS_WEB
          ? { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' as const, backgroundColor: accentColor }
          : { paddingVertical: 12, borderRadius: 10, alignItems: 'center' as const, backgroundColor: accentColor }
        }
      >
        <Text style={{ color: isBright ? C.dark : '#ffffff', fontFamily: F.bold, fontSize: 13 }}>{enrolLabel}</Text>
      </ZoomBtn>
    </View>
  );
}

// ─── Class row with expandable breakdown ─────────────────────────────────────

function ClassRow({ cls, isDark }: { cls: DriveClass; isDark: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const { t }    = useTranslation();
  const { open } = useEnrollModal();
  const accentColor = SERIES_COLORS[cls.series];

  const blink = useSharedValue(0);
  const blinkStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      blink.value,
      [0, 1],
      [isDark ? C.darkBorder : 'rgba(34,31,32,0.1)', C.yellow],
    ),
  }));

  const triggerBlink = () => {
    blink.value = withSequence(
      withTiming(1, { duration: 120 }),
      withTiming(0, { duration: 120 }),
      withTiming(1, { duration: 120 }),
      withTiming(0, { duration: 220 }),
    );
  };

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(v => !v);
  };

  return (
    <Animated.View
      style={[
        {
          backgroundColor: isDark ? C.dark : C.white,
          borderRadius: 14,
          marginBottom: 10,
          borderWidth: 1,
          overflow: 'hidden',
        },
        blinkStyle,
      ]}
    >
      {/* Main row — tap to expand */}
      <TouchableOpacity
        onPress={toggle}
        onPressIn={triggerBlink}
        activeOpacity={0.8}
        {...(IS_WEB ? ({ onMouseEnter: triggerBlink } as any) : {})}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          gap: 12,
        }}
      >
        {/* Colour bar */}
        <View style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, backgroundColor: accentColor }} />

        {/* Name + lessons */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: isDark ? C.white : C.heading, fontFamily: F.semibold, fontSize: 14, lineHeight: 20 }}>
            {cls.name}
          </Text>
          {cls.lessons !== null && (
            <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 11, marginTop: 2 }}>
              {cls.lessons} {t('courses.lessonsLabel')}
            </Text>
          )}
          {cls.lessons === null && cls.code !== 'EXECUTIVE' && (
            <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 11, marginTop: 2 }}>
              {t('courses.testOnly')}
            </Text>
          )}
        </View>

        {/* Total price */}
        <Text style={{ color: accentColor, fontFamily: F.bold, fontSize: 16 }}>
          {KSH(cls.total)}
        </Text>

        {/* Expand icon */}
        {expanded
          ? <ChevronUp size={16} color={isDark ? C.mutedDark : C.muted} />
          : <ChevronDown size={16} color={isDark ? C.mutedDark : C.muted} />}
      </TouchableOpacity>

      {/* Expanded breakdown */}
      {expanded && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 16,
            borderTopWidth: 1,
            borderTopColor: isDark ? C.darkBorder : 'rgba(34,31,32,0.06)',
          }}
        >
          <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.semibold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12, marginTop: 12 }}>
            {t('courses.whatsIncluded')}
          </Text>

          {[
            { label: t('courses.schoolFees'), value: cls.fees },
            { label: t('courses.pdlFee'),     value: cls.pdl },
            { label: t('courses.examsFee'),    value: cls.exams },
            { label: t('courses.defensiveFee'),value: cls.defensive },
          ].map(({ label, value }) => (
            <View
              key={label}
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}
            >
              <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 13 }}>{label}</Text>
              <Text style={{ color: isDark ? C.white : C.heading, fontFamily: F.medium, fontSize: 13 }}>{KSH(value)}</Text>
            </View>
          ))}

          {/* Divider + total */}
          <View style={{ height: 1, backgroundColor: isDark ? C.darkBorder : 'rgba(34,31,32,0.1)', marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: isDark ? C.white : C.heading, fontFamily: F.bold, fontSize: 14 }}>
              {t('courses.totalLabel')}
            </Text>
            <Text style={{ color: accentColor, fontFamily: F.bold, fontSize: 18 }}>
              {KSH(cls.total)}
            </Text>
          </View>

          <ZoomButtons
            accentColor={accentColor}
            classCode={cls.code}
            isBright={cls.series === 'EXEC'}
            detailsLabel={t('courses.readMore') || 'Details'}
            enrolLabel={t('courses.enrolNow')}
            onDetails={() => router.push(`/classes/${cls.code}`)}
            onEnrol={() => open(cls.code)}
          />
        </View>
      )}
    </Animated.View>
  );
}

// ─── Series tab bar ───────────────────────────────────────────────────────────

function SeriesTabs({
  active,
  onChange,
  isDark,
}: {
  active: SeriesCode;
  onChange: (c: SeriesCode) => void;
  isDark: boolean;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingHorizontal: IS_WEB ? 0 : 4, paddingBottom: 4 }}
      style={{ marginBottom: 20 }}
    >
      {CLASS_SERIES.map(s => {
        const isActive = s.code === active;
        const color    = SERIES_COLORS[s.code];
        return (
          <TouchableOpacity
            key={s.code}
            onPress={() => onChange(s.code)}
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 9,
              borderRadius: 20,
              backgroundColor: isActive ? color : isDark ? C.dark : 'rgba(34,31,32,0.06)',
              borderWidth: isActive ? 0 : 1,
              borderColor: isDark ? C.darkBorder : 'rgba(34,31,32,0.1)',
            }}
          >
            <Text style={{ color: isActive ? (s.code === 'EXEC' ? C.dark : '#ffffff') : (isDark ? C.mutedDark : C.muted), fontFamily: isActive ? F.bold : F.medium, fontSize: 13 }}>
              {s.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Refresher section ────────────────────────────────────────────────────────

function RefresherSection({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation();
  return (
    <View style={{ marginTop: 36 }}>
      <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
        {t('courses.refresherTitle')}
      </Text>
      <View style={IS_WEB ? { flexDirection: 'row', gap: 12 } : { gap: 12 }}>
        {REFRESHER_LESSONS.map(r => (
          <View
            key={r.code}
            style={{
              flex: IS_WEB ? 1 : undefined,
              backgroundColor: isDark ? C.dark : C.white,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: isDark ? C.darkBorder : 'rgba(34,31,32,0.1)',
            }}
          >
            <Text style={{ color: isDark ? C.white : C.heading, fontFamily: F.semibold, fontSize: 14, marginBottom: 6 }}>
              {r.name}
            </Text>
            <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 20, marginBottom: 2 }}>
              {KSH(r.perLesson)}
            </Text>
            <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 12 }}>
              {t('courses.perLesson')}
            </Text>
            <Text style={{ color: isDark ? C.mutedDark : C.muted, fontFamily: F.regular, fontSize: 11, marginTop: 6 }}>
              {t('courses.minLessons', { count: r.minLessons })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Payment notice ───────────────────────────────────────────────────────────

function PaymentNotice({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation();
  return (
    <View
      style={{
        marginTop: 32,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(225,29,46,0.40)',
      }}
    >
      {/* Warning bar — red */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(225,29,46,0.12)', paddingHorizontal: 16, paddingVertical: 10 }}>
        <AlertTriangle size={15} color={C.red} />
        <Text style={{ color: C.red, fontFamily: F.bold, fontSize: 12, letterSpacing: 0.8 }}>
          {PAYMENT.notice}
        </Text>
      </View>

      {/* Payment methods — yellow background so red text is fully visible */}
      <View style={[{ paddingHorizontal: 16, paddingVertical: 14, backgroundColor: C.yellow }, IS_WEB ? { flexDirection: 'row', gap: 24 } : { gap: 12 }]}>
        {/* M-Pesa */}
        <View style={{ flex: IS_WEB ? 1 : undefined }}>
          <Text style={{ color: C.red, fontFamily: F.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            {t('courses.paymentMpesa')}
          </Text>
          <View style={{ gap: 4 }}>
            <Text style={{ color: C.red, fontFamily: F.regular, fontSize: 13 }}>
              Paybill: <Text style={{ fontFamily: F.bold }}>{PAYMENT.mpesaPaybill}</Text>
            </Text>
            <Text style={{ color: C.red, fontFamily: F.regular, fontSize: 13 }}>
              Account: <Text style={{ fontFamily: F.bold }}>{PAYMENT.mpesaAccountName}</Text>
            </Text>
          </View>
        </View>

        {IS_WEB && <View style={{ width: 1, backgroundColor: 'rgba(225,29,46,0.20)' }} />}

        {/* KCB */}
        <View style={{ flex: IS_WEB ? 1 : undefined }}>
          <Text style={{ color: C.red, fontFamily: F.bold, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            {t('courses.paymentKcb')}
          </Text>
          <View style={{ gap: 4 }}>
            <Text style={{ color: C.red, fontFamily: F.regular, fontSize: 13 }}>
              {PAYMENT.bankName}
            </Text>
            <Text style={{ color: C.red, fontFamily: F.regular, fontSize: 13 }}>
              Account: <Text style={{ fontFamily: F.bold }}>{PAYMENT.kcbAccount}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Courses() {
  const { t } = useTranslation();
  const [activeSeries, setActiveSeries] = useState<SeriesCode>('B');
  const isDark = false; // courses section always uses the dark amber background

  const seriesClasses = CLASSES.filter(c => c.series === activeSeries);
  const activeMeta    = CLASS_SERIES.find(s => s.code === activeSeries)!;

  return (
    <View style={{ backgroundColor: C.skyDeep, paddingVertical: 72, paddingHorizontal: 24 }}>
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : {}}>

        {/* Section header */}
        <View style={{ alignItems: 'center', marginBottom: 36 }}>
          <Text style={{ color: C.yellow, fontFamily: F.bold, fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10 }}>
            {t('courses.overline')}
          </Text>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: IS_WEB ? 34 : 26, textAlign: 'center', lineHeight: IS_WEB ? 44 : 34, marginBottom: 12 }}>
            {t('courses.heading')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ height: 2, width: 40, backgroundColor: 'rgba(255,216,0,0.5)', borderRadius: 2 }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.yellow }} />
            <View style={{ height: 2, width: 40, backgroundColor: 'rgba(255,216,0,0.5)', borderRadius: 2 }} />
          </View>
        </View>

        {/* Series tabs */}
        <SeriesTabs active={activeSeries} onChange={setActiveSeries} isDark />

        {/* Series subtitle */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: '#ffffff', fontFamily: F.bold, fontSize: 17 }}>{activeMeta.label}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontFamily: F.regular, fontSize: 13, marginTop: 2 }}>{activeMeta.subtitle}</Text>
        </View>

        {/* Class rows */}
        {seriesClasses.map(cls => (
          <ClassRow key={cls.code} cls={cls} isDark />
        ))}

        {/* Payment notice */}
        <PaymentNotice isDark />

        {/* Refresher lessons */}
        <RefresherSection isDark />

      </View>
    </View>
  );
}
