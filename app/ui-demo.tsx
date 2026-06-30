import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
  Icon,
  Input,
  Select,
  Skeleton,
  Spinner,
  Textarea,
  type SelectItem,
} from '@/components/ui';
import { C, F } from '@/components/landing/constants';

// Temporary primitive gallery (Phase 6) for eyeballing tokens, Manrope, press
// feedback, and hit areas at 360 / 414 / 768 / 1280 px. Not linked in nav.
// Remove this route once the primitives are confirmed.

const BRANCHES: SelectItem[] = [
  { label: 'Buru Buru', value: 'buruburu' },
  { label: 'Westlands', value: 'westlands' },
  { label: 'Kasarani', value: 'kasarani' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mt-8">
      <Text className="mb-3 text-sm uppercase text-muted-foreground" style={{ fontFamily: F.semibold }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function UIDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [branch, setBranch] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView>
        <View className="mx-auto w-full max-w-3xl px-5 pb-16 pt-6">
        <Text className="text-3xl text-foreground" style={{ fontFamily: F.bold }}>
          Primitives
        </Text>
        <Text className="mt-1 text-base text-muted-foreground" style={{ fontFamily: F.regular }}>
          Phase 6 design-system components, Manrope and brand tokens.
        </Text>

        <Section title="Buttons">
          <View className="flex-row flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </View>
          <View className="mt-3 flex-row flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </View>
          <View className="mt-3">
            <Button>
              <Text className="text-primary-foreground" style={{ fontFamily: F.semibold }}>
                With icon
              </Text>
              <Icon icon={ArrowRight} size="sm" color={C.white} />
            </Button>
          </View>
        </Section>

        <Section title="Card">
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Class B, Light Vehicle</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-sm text-muted-foreground" style={{ fontFamily: F.regular }}>
                NTSA-certified training with confident, road-ready instruction.
              </Text>
            </CardContent>
            <CardFooter>
              <Button size="sm">Enroll</Button>
              <Button size="sm" variant="outline">
                Details
              </Button>
            </CardFooter>
          </Card>
        </Section>

        <Section title="Inputs">
          <View className="gap-3">
            <Input placeholder="Full name" />
            <Select
              selectedValue={branch}
              onValueChange={setBranch}
              placeholder="Select a branch"
              items={BRANCHES}
            />
            <Textarea placeholder="Tell us anything else" />
          </View>
        </Section>

        <Section title="Badges">
          <View className="flex-row flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent">Popular</Badge>
            <Badge variant="outline">Outline</Badge>
          </View>
        </Section>

        <Section title="Skeleton and Spinner">
          <View className="gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-24 w-full" />
          </View>
          <View className="mt-4">
            <Spinner />
          </View>
        </Section>

        <Section title="Dialog">
          <Button onPress={() => setDialogOpen(true)}>Open dialog</Button>
        </Section>
        </View>
      </ScrollView>

      <Dialog visible={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogClose onPress={() => setDialogOpen(false)} />
        <DialogTitle>Start your enrollment</DialogTitle>
        <DialogDescription>
          This is the dialog primitive. Phase 11 rebuilds the lead form on it.
        </DialogDescription>
        <View className="mt-5 flex-row justify-end gap-3">
          <Button variant="outline" size="sm" onPress={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onPress={() => setDialogOpen(false)}>
            Confirm
          </Button>
        </View>
      </Dialog>
    </SafeAreaView>
  );
}
