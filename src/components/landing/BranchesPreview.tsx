import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, ArrowRight, Search, X } from 'lucide-react-native';
import { BRANCHES, Branch } from '@/data/saferide';
import { useTheme } from '@/lib/theme';
import { Card, Button, Input, Badge, Icon, cn } from '@/components/ui';
import { F, IS_WEB, MAX_W } from './constants';
import { SectionIntro } from './SectionIntro';
import { SECTION_PY } from '@/lib/spacing';

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
          <Icon icon={MapPin} size={13} color={Th.mutedForeground} />
          <Text style={{ fontFamily: F.regular }} className="flex-1 text-xs text-muted-foreground">{branch.address}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Icon icon={Phone} size={13} color={Th.mutedForeground} />
          <Text style={{ fontFamily: F.regular }} className="text-xs text-muted-foreground">{branch.phone}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

// Shortcut chips for the areas people look up most. The labels are not written
// out here: each name is resolved against BRANCHES, so a chip can only ever
// exist for a branch that exists, and pressing one always matches the filter.
// A name that stops matching drops out of the row instead of filtering to zero.
const POPULAR_AREA_NAMES = ['Buruburu', 'Donholm', 'Kayole', 'Embakasi', 'Kagundo Road'];
const POPULAR_AREAS = POPULAR_AREA_NAMES
  .map((name) => (BRANCHES as readonly Branch[]).find((b) => b.name === name))
  .filter((b): b is Branch => Boolean(b));

export default function BranchesPreview() {
  const Th = useTheme();
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();

  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
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
  const isSearching = q.length > 0;
  const activeId = matches.find((b) => b.id === selectedId)?.id ?? matches[0]?.id ?? '';

  // Results grid, same 1/2/3 column rule the branches page uses. Without a map
  // beside them the cards get the full column, so they lay out across it
  // rather than stacking in one narrow strip. Gap is 16px (gap-4), so each
  // card subtracts its share of the gaps.
  const cols = winW < 640 ? 1 : winW < 1024 ? 2 : 3;
  const cardWidth: any =
    cols === 1 ? '100%'
    : cols === 2 ? (IS_WEB ? 'calc(50% - 8px)' : '48%')
    : (IS_WEB ? 'calc(33.333% - 11px)' : '48%');

  return (
    <View style={{ backgroundColor: Th.background, paddingVertical: SECTION_PY }} className="px-6">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionIntro
          badge={t('home.branchesPreview.badge')}
          title={t('home.branchesPreview.title')}
          description={t('home.branchesPreview.description')}
        />

        {/* Search field. The focus ring is driven by state rather than the
            primitive's focus: class so the border and the glow agree on
            native too. The glow colour is the primary token with an alpha
            suffix, not a separate hue. */}
        <View
          className="relative mb-4 self-center rounded-pill"
          style={[
            IS_WEB ? { maxWidth: 560, width: '100%' } : undefined,
            focused
              ? IS_WEB
                ? ({ boxShadow: `0 6px 22px ${Th.primary}33` } as any)
                : { shadowColor: Th.primary, shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 }
              : null,
          ]}
        >
          <View className="absolute bottom-0 left-5 top-0 z-10 justify-center">
            <Icon icon={Search} size="sm" color={focused ? Th.primary : Th.mutedForeground} />
          </View>
          <Input
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={t('home.branchesPreview.searchPlaceholder')}
            accessibilityLabel={t('home.branchesPreview.searchPlaceholder')}
            autoCorrect={false}
            className={cn('h-14 rounded-pill border-[1.5px] pl-12 pr-12', focused ? 'border-primary' : 'border-border')}
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              className="absolute bottom-0 right-1.5 top-0 z-10 w-11 items-center justify-center"
            >
              <Icon icon={X} size="sm" color={Th.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Area shortcuts. Only while the field is empty: once someone is
            searching they have already told us the area. */}
        {q.length === 0 && POPULAR_AREAS.length > 0 && (
          <View className="mb-6 self-center" style={IS_WEB ? { maxWidth: 560, width: '100%' } : undefined}>
            <Text style={{ fontFamily: F.semibold }} className="mb-2 text-center text-xs text-muted-foreground">
              {t('home.branchesPreview.popularAreas')}
            </Text>
            <View className="flex-row flex-wrap justify-center gap-2">
              {POPULAR_AREAS.map((b) => (
                <Pressable
                  key={b.id}
                  onPress={() => setQuery(b.name)}
                  accessibilityRole="button"
                  accessibilityLabel={b.name}
                  className="h-11 items-center justify-center rounded-pill bg-primary/10 px-4 active:bg-primary/20"
                >
                  <Text style={{ fontFamily: F.semibold }} className="text-sm text-primary">{b.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Results. The map lives on the branches page now, so this section
            stays a search and a list. Nothing renders until someone searches,
            beyond the prompt that points at the chips. */}
        {!isSearching ? (
          // The chips above carry the call to action, so this block sits back:
          // a small mark and a hint that points at them.
          <View className="mb-9 items-center px-6 py-6">
            <View className="mb-3 h-10 w-10 items-center justify-center rounded-pill bg-primary/10">
              <Icon icon={Search} size="sm" color={Th.primary} />
            </View>
            <Text style={{ fontFamily: F.semibold }} className="text-center text-sm text-foreground">
              {t('home.branchesPreview.searchPrompt')}
            </Text>
            <Text style={{ fontFamily: F.regular }} className="mt-1 text-center text-xs text-muted-foreground">
              {t('home.branchesPreview.searchPromptHint')}
            </Text>
          </View>
        ) : matches.length === 0 ? (
          <View className="mb-9 items-center px-6 py-8">
            <Text style={{ fontFamily: F.semibold }} className="text-center text-sm text-muted-foreground">
              {t('home.branchesPreview.noResults')}
            </Text>
          </View>
        ) : (
          <View className="mb-9 flex-row flex-wrap justify-center gap-4">
            {matches.map((branch) => (
              <View key={branch.id} style={{ width: cardWidth }}>
                <BranchCard
                  branch={branch}
                  isSelected={branch.id === activeId}
                  onPress={() => setSelectedId(branch.id)}
                />
              </View>
            ))}
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
