import React, { useMemo, useState } from 'react';
import { View, Text, Image, Pressable, SafeAreaView, ScrollView, Linking, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { MapPin, Phone, Clock, Navigation, ArrowRight, MessageCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import Navbar     from '@/components/landing/Navbar';
import { BranchMap } from '@/components/landing/BranchMap';
import Footer     from '@/components/landing/Footer';

import { BRANCHES, Branch } from '@/data/saferide';
import { Card, Button, Badge, Icon, cn } from '@/components/ui';
import { F, IS_WEB, MAX_W } from '@/components/landing/constants';
import { useTheme } from '@/lib/theme';
import { PageHead } from '@/components/PageHead';

const LOGO = require('../assets/images/saferide-logo.jpg');

// ─── Branch card (rebuilt on the Card primitive and tokens) ─────────────────────
function BranchCard({
  branch,
  isSelected,
  onSelect,
}: {
  branch: Branch;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Th = useTheme();
  const { t } = useTranslation();
  const isHQ = branch.isHQ;

  return (
    <Pressable onPress={onSelect} accessibilityRole="button" className="active:scale-[0.99]">
      <Card
        className={cn(
          'p-[18px]',
          isSelected
            ? 'border-[1.5px] border-primary bg-primary/5'
            : isHQ
              ? 'border-2 border-accent'
              : 'border-border',
        )}
      >
        {/* Name + HQ badge */}
        <View className="mb-2.5 flex-row items-center gap-2">
          <Text
            style={{ fontFamily: F.bold }}
            className={cn('flex-1 text-[15px]', isSelected ? 'text-primary' : 'text-foreground')}
          >
            {branch.name}
          </Text>
          {isHQ && (
            <Badge variant="accent" className="px-2 py-[3px]" textClassName="text-[10px] uppercase tracking-wide">
              {t('branchesPage.hqBadge')}
            </Badge>
          )}
        </View>

        {/* Info */}
        <View className="mb-3.5 gap-1.5">
          <View className="flex-row items-start gap-2">
            <View className="mt-px"><Icon icon={MapPin} size={13} color={Th.primary} /></View>
            <Text style={{ fontFamily: F.regular }} className="flex-1 text-xs leading-[18px] text-muted-foreground">
              {branch.address}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon icon={Phone} size={13} color={Th.primary} />
            <Text style={{ fontFamily: F.regular }} className="text-xs text-muted-foreground">{branch.phone}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon icon={Clock} size={13} color={Th.primary} />
            <Text style={{ fontFamily: F.regular }} className="text-xs text-muted-foreground">{branch.hours}</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.mapsQuery)}`,
              )
            }
          >
            <Icon icon={Navigation} size={12} color={Th.primaryFg} />
            <Text style={{ fontFamily: F.semibold }} className="text-xs text-primary-foreground">{t('branchesPage.getDirections')}</Text>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-primary"
            onPress={() => Linking.openURL(`tel:${branch.phone.replace(/\s/g, '')}`)}
          >
            <Icon icon={Phone} size={12} color={Th.primary} />
            <Text style={{ fontFamily: F.semibold }} className="text-xs text-primary">{t('branchesPage.call')}</Text>
          </Button>
        </View>
      </Card>
    </Pressable>
  );
}

// ─── Branch directory: map + always-visible responsive card grid ────────────────
function BranchDirectory() {
  const Th = useTheme();
  const { width: winW } = useWindowDimensions();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // HQ first, then the remaining branches in their listed order.
  const branches = useMemo(
    () => [...(BRANCHES as readonly Branch[])].sort((a, b) => Number(b.isHQ) - Number(a.isHQ)),
    [],
  );
  const activeId = branches.find((b) => b.id === selectedId)?.id ?? branches[0]?.id ?? '';

  // Responsive grid: 1 col on phones, 2 on tablets, 3 on desktop. Gap is 16px
  // (gap-4), so each card subtracts its share of the gaps from its width.
  const cols = winW < 640 ? 1 : winW < 1024 ? 2 : 3;
  const cardWidth: any =
    cols === 1 ? '100%'
    : cols === 2 ? (IS_WEB ? 'calc(50% - 8px)' : '48%')
    : (IS_WEB ? 'calc(33.333% - 11px)' : '48%');

  // Watermark stays inside the viewport on narrow screens.
  const markSize = Math.min(420, winW * 0.8);

  return (
    <View style={{ backgroundColor: Th.background }} className="overflow-hidden px-6 py-14">
      {/* Subtle SafeRide watermark behind the grid; decorative, non-interactive */}
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        aria-hidden
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        }}
      >
        <Image
          source={LOGO}
          resizeMode="contain"
          style={{ width: markSize, height: markSize, borderRadius: markSize / 2, opacity: 0.05 }}
        />
      </View>

      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        {/* Map */}
        <View className="mb-6">
          <BranchMap activeBranchId={activeId} branches={branches} onMarkerPress={(id) => setSelectedId(id)} />
        </View>

        {/* Branch listing */}
        <View className="flex-row flex-wrap gap-4">
          {branches.map((branch) => (
            <View key={branch.id} style={{ width: cardWidth }}>
              <BranchCard
                branch={branch}
                isSelected={branch.id === activeId}
                onSelect={() => setSelectedId(branch.id)}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Contact CTA ─────────────────────────────────────────────────────────────
function ContactCTA() {
  const Th = useTheme();
  const { t } = useTranslation();
  return (
    <View style={{ backgroundColor: Th.card }} className="items-center px-6 py-10">
      <Button variant="outline" size="md" className="border-[1.5px] border-primary rounded-pill px-7" onPress={() => router.push('/contact')}>
        <Icon icon={MessageCircle} size="sm" color={Th.primary} />
        <Text style={{ fontFamily: F.semibold }} className="text-sm text-primary">{t('branchesPage.contactCta')}</Text>
        <Icon icon={ArrowRight} size="sm" color={Th.primary} />
      </Button>
    </View>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function BranchesPage() {
  const Th = useTheme();
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Th.background }}>
      <PageHead
        title="Our Branches Across Nairobi | Safe Ride Africa"
        description="Find a Safe Ride Africa driving school branch near you across Nairobi. Browse all branches with directions, hours, and contact details."
        path="/branches"
      />
      <Navbar />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <PageHero overline={t('branchesPage.pageOverline')} title={t('branchesPage.pageTitle')} />
        <BranchDirectory />
        <ContactCTA />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
