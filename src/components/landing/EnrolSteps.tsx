import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ClipboardList, MessageCircle, GraduationCap, BadgeCheck } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { C, F, IS_WEB, MAX_W } from './constants';
import { Card, Icon } from '@/components/ui';
import { SectionIntro } from './SectionIntro';

// Homepage "how enrolment works" strip (home restructure Phase 4). The four
// steps are assembled from copy already published on the site: the course
// catalogue, the WhatsApp and email lead form, NTSA-certified instructors on
// the NTSA curriculum, and Smart DL guidance via eCitizen. No pricing, no
// lesson counts. Entrance motion comes from the Reveal wrapper in app/index.tsx.

const STEP_ICONS: LucideIcon[] = [ClipboardList, MessageCircle, GraduationCap, BadgeCheck];

type Step = { title: string; desc: string };

export default function EnrolSteps() {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const isMobile = !IS_WEB || winW < 768;
  const isWide = IS_WEB && winW >= 1024;

  const steps = t('home.enrolSteps.steps', { returnObjects: true }) as Step[];

  return (
    <View className="bg-background px-6 py-14">
      <View style={IS_WEB ? { maxWidth: MAX_W, width: '100%', alignSelf: 'center' } : undefined}>
        <SectionIntro
          badge={t('home.enrolSteps.badge')}
          title={t('home.enrolSteps.title')}
          description={t('home.enrolSteps.description')}
        />

        {/* Single column on phones, 2x2 on tablet, 4 across on desktop */}
        <View className={isMobile ? 'gap-3' : 'flex-row flex-wrap gap-4'}>
          {steps.map((step, i) => (
            <Card
              key={step.title}
              className="p-5"
              style={isMobile ? undefined : isWide ? { flex: 1 } : { width: '47%', flexGrow: 1 }}
            >
              <View className="mb-3 flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-pill bg-primary/10">
                  <Text style={{ fontFamily: F.bold }} className="text-sm text-primary">
                    {i + 1}
                  </Text>
                </View>
                <Icon icon={STEP_ICONS[i] ?? ClipboardList} size="lg" color={C.skyDeep} />
              </View>
              <Text style={{ fontFamily: F.bold }} className="mb-1 text-base text-foreground">
                {step.title}
              </Text>
              <Text style={{ fontFamily: F.regular }} className="text-sm leading-[22px] text-muted-foreground">
                {step.desc}
              </Text>
            </Card>
          ))}
        </View>
      </View>
    </View>
  );
}
