import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, SafeAreaView, ScrollView, Linking, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { MapPin, Phone, Clock, Navigation, ArrowRight, MessageCircle, Search, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { PageHero } from '@/components/landing/PageHero';
import Navbar     from '@/components/landing/Navbar';
import { BranchMap } from '@/components/landing/BranchMap';
import Footer     from '@/components/landing/Footer';

import { BRANCHES, Branch } from '@/data/saferide';
import { Card, Button, Input, Badge, Icon, cn } from '@/components/ui';
import { F, IS_WEB, MAX_W } from '@/components/landing/constants';
import { useTheme } from '@/lib/theme';

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
    <Pressable onPress={onSelect} accessibilityRole="button">
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

// ─── Empty / prompt state ───────────────────────────────────────────────────────
function PromptState({ icon, title, hint }: { icon: typeof Search; title: string; hint: string }) {
  const Th = useTheme();
  return (
    <View className="items-center px-6 py-12">
      <View className="mb-4 h-14 w-14 items-center justify-center rounded-pill bg-primary/10">
        <Icon icon={icon} size="lg" color={Th.primary} />
      </View>
      <Text style={{ fontFamily: F.bold }} className="mb-1.5 text-center text-base text-foreground">{title}</Text>
      <Text style={{ fontFamily: F.regular }} className="max-w-[300px] text-center text-sm leading-5 text-muted-foreground">{hint}</Text>
    </View>
  );
}

// ─── Search-gated directory ─────────────────────────────────────────────────────
function BranchDirectory() {
  const Th = useTheme();
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || (IS_WEB && winW < 768);

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      q.length === 0
        ? []
        : (BRANCHES as readonly Branch[]).filter(
            (b) => b.name.toLowerCase().includes(q) || b.address.toLowerCase().includes(q),
          ),
    [q],
  );
  const activeId = matches.find((b) => b.id === selectedId)?.id ?? matches[0]?.id ?? '';

  return (
    <View style={{ backgroundColor: Th.background }} className="px-6 py-14">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        {/* Search field */}
        <View className="relative mb-6 self-center" style={IS_WEB ? { maxWidth: 520, width: '100%' } : undefined}>
          <View className="absolute bottom-0 left-4 top-0 z-10 justify-center">
            <Icon icon={Search} size="sm" color={Th.mutedForeground} />
          </View>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder={t('branchesPage.searchPlaceholder')}
            accessibilityLabel={t('branchesPage.searchPlaceholder')}
            autoCorrect={false}
            className="rounded-pill pl-11 pr-11"
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              className="absolute bottom-0 right-1 top-0 z-10 w-11 items-center justify-center"
            >
              <Icon icon={X} size="sm" color={Th.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Results / prompt */}
        {q.length === 0 ? (
          <PromptState icon={Search} title={t('branchesPage.searchPrompt')} hint={t('branchesPage.searchPromptHint')} />
        ) : matches.length === 0 ? (
          <PromptState icon={MapPin} title={t('branchesPage.noResults')} hint={t('branchesPage.noResultsHint')} />
        ) : !isMobile ? (
          <View className="flex-row items-start gap-7">
            <View style={{ flex: 3, position: 'sticky' as any, top: 80 }}>
              <BranchMap activeBranchId={activeId} branches={matches} onMarkerPress={(id) => setSelectedId(id)} />
            </View>
            <View style={{ flex: 2 }} className="gap-3">
              {matches.map((branch) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  isSelected={branch.id === activeId}
                  onSelect={() => setSelectedId(branch.id)}
                />
              ))}
            </View>
          </View>
        ) : (
          <View>
            <View className="mb-4">
              <BranchMap activeBranchId={activeId} branches={matches} onMarkerPress={(id) => setSelectedId(id)} />
            </View>
            <View className="gap-3">
              {matches.map((branch) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  isSelected={branch.id === activeId}
                  onSelect={() => setSelectedId(branch.id)}
                />
              ))}
            </View>
          </View>
        )}
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
