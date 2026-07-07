import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, ArrowRight, Search, X } from 'lucide-react-native';
import { BranchMap } from './BranchMap';
import { BRANCHES, Branch } from '@/data/saferide';
import { useTheme } from '@/lib/theme';
import { Card, Button, Input, Badge, Icon, cn } from '@/components/ui';
import { F, IS_WEB, MAX_W } from './constants';
import { SectionIntro } from './SectionIntro';

// ─── Compact branch card (rebuilt on the Card primitive) ────────────────────────
function BranchCard({ branch, isSelected, onPress }: { branch: Branch; isSelected: boolean; onPress: () => void }) {
  const Th = useTheme();
  const { t } = useTranslation();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" className="active:scale-[0.99]">
      <Card className={cn(isSelected ? 'border-[1.5px] border-primary bg-primary/5' : 'border-border')}>
        <View className="mb-2 flex-row items-center gap-2">
          <Text style={{ fontFamily: F.bold }} className={cn('flex-1 text-sm', isSelected ? 'text-primary' : 'text-foreground')}>
            {branch.name}
          </Text>
          {branch.isHQ && (
            <Badge variant="accent" className="px-[7px] py-0.5" textClassName="text-[10px] uppercase tracking-wide">
              {t('home.branchesPreview.hqBadge')}
            </Badge>
          )}
        </View>
        <View className="mb-1 flex-row items-center gap-1.5">
          <Text style={{ fontSize: 12 }}>📍</Text>
          <Text style={{ fontFamily: F.regular }} className="flex-1 text-xs text-muted-foreground">{branch.address}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text style={{ fontSize: 12 }}>📞</Text>
          <Text style={{ fontFamily: F.regular }} className="text-xs text-muted-foreground">{branch.phone}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

export default function BranchesPreview() {
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
        <SectionIntro
          badge={t('home.branchesPreview.badge')}
          title={t('home.branchesPreview.title')}
          description={t('home.branchesPreview.description')}
        />

        {/* Search field */}
        <View className="relative mb-6 self-center" style={IS_WEB ? { maxWidth: 520, width: '100%' } : undefined}>
          <View className="absolute bottom-0 left-4 top-0 z-10 justify-center">
            <Icon icon={Search} size="sm" color={Th.mutedForeground} />
          </View>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder={t('home.branchesPreview.searchPlaceholder')}
            accessibilityLabel={t('home.branchesPreview.searchPlaceholder')}
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
          <View className="mb-9 items-center px-6 py-8">
            <View className="mb-3.5 h-12 w-12 items-center justify-center rounded-pill bg-primary/10">
              <Icon icon={Search} size="md" color={Th.primary} />
            </View>
            <Text style={{ fontFamily: F.semibold }} className="text-center text-sm text-muted-foreground">
              {t('home.branchesPreview.searchPrompt')}
            </Text>
          </View>
        ) : matches.length === 0 ? (
          <View className="mb-9 items-center px-6 py-8">
            <Text style={{ fontFamily: F.semibold }} className="text-center text-sm text-muted-foreground">
              {t('home.branchesPreview.noResults')}
            </Text>
          </View>
        ) : !isMobile ? (
          <View className="mb-9 flex-row items-start gap-7">
            <View style={{ flex: 3 }}>
              <BranchMap activeBranchId={activeId} branches={matches} onMarkerPress={(id) => setSelectedId(id)} />
            </View>
            <View style={{ flex: 2 }} className="gap-3">
              {matches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} isSelected={branch.id === activeId} onPress={() => setSelectedId(branch.id)} />
              ))}
            </View>
          </View>
        ) : (
          <View className="mb-9">
            <View className="mb-4">
              <BranchMap activeBranchId={activeId} branches={matches} onMarkerPress={(id) => setSelectedId(id)} />
            </View>
            <View className="gap-3">
              {matches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} isSelected={branch.id === activeId} onPress={() => setSelectedId(branch.id)} />
              ))}
            </View>
          </View>
        )}

        {/* CTA */}
        <Button variant="primary" size="md" className="self-center rounded-pill px-7" onPress={() => router.push('/branches')}>
          <Text style={{ fontFamily: F.semibold }} className="text-sm text-primary-foreground">{t('common.findAllBranches')}</Text>
          <Icon icon={ArrowRight} size="sm" color={Th.primaryFg} />
        </Button>
      </View>
    </View>
  );
}
