import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';
import { BRANCHES, BRANCH_COORDS, type Branch } from '@/data/saferide';
import { C } from '@/components/landing/constants';

interface BranchMapProps {
  activeBranchId: string;
  onMarkerPress:  (id: string) => void;
  branches?:      readonly Branch[];
}

// Nairobi Eastlands centroid — keeps the pins visible
const INITIAL_REGION = {
  latitude:      -1.286,
  longitude:      36.890,
  latitudeDelta:  0.08,
  longitudeDelta: 0.08,
};

const COLOR_ACTIVE   = C.yellow;   // accent
const COLOR_INACTIVE = C.skyDeep;  // primary

export function BranchMap({ activeBranchId, onMarkerPress, branches = BRANCHES }: BranchMapProps) {
  const { width } = useWindowDimensions();
  const mapHeight = width < 768 ? 280 : 420;
  return (
    <MapView
      style={{ width: '100%', height: mapHeight, borderRadius: 16 }}
      initialRegion={INITIAL_REGION}
    >
      {(branches as readonly Branch[]).map(b => {
        const coords = BRANCH_COORDS[b.id];
        if (!coords) return null;
        const [latitude, longitude] = coords;
        const isActive = b.id === activeBranchId;
        return (
          <Marker
            key={b.id}
            coordinate={{ latitude, longitude }}
            onPress={() => onMarkerPress(b.id)}
          >
            <View style={{ alignItems: 'center' }}>
              <MapPin
                size={isActive ? 44 : 32}
                color={isActive ? COLOR_ACTIVE : COLOR_INACTIVE}
                fill={isActive ? C.yellow : 'transparent'}
              />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
