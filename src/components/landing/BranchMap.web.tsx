import React from 'react';
import { Map, Marker } from 'pigeon-maps';
import { useTranslation } from 'react-i18next';
import { BRANCHES, BRANCH_COORDS, type Branch } from '@/data/saferide';
import { useWindowDimensions } from 'react-native';
import { C } from '@/components/landing/constants';

interface BranchMapProps {
  activeBranchId: string;
  onMarkerPress:  (id: string) => void;
  branches?:      readonly Branch[];
}

// Nairobi Eastlands centroid — keeps the pins visible at zoom 12
const CENTER: [number, number] = [-1.286, 36.890];

export function BranchMap({ activeBranchId, onMarkerPress, branches = BRANCHES }: BranchMapProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const mapHeight = width < 768 ? 280 : 420;
  return (
    <div style={{ height: mapHeight, borderRadius: 16, overflow: 'hidden' }}>
      {/* metaWheelZoom lets a plain wheel event through to the page, so
          scrolling past a map no longer zooms it instead of scrolling. The map
          zooms only while ctrl or cmd is held, and the warning overlay says so
          the first time someone tries. pigeon-maps swaps the literal META in
          that string for the platform key, so the token has to survive
          translation. */}
      <Map
        height={mapHeight}
        defaultCenter={CENTER}
        defaultZoom={12}
        metaWheelZoom
        metaWheelZoomWarning={t('common.mapZoomHint')}
      >
        {(branches as readonly Branch[]).map(b => {
          const coords = BRANCH_COORDS[b.id];
          if (!coords) return null;
          const isActive = b.id === activeBranchId;
          return (
            <Marker
              key={b.id}
              anchor={coords}
              width={isActive ? 56 : 40}
              color={isActive ? C.yellow : C.skyDeep}
              onClick={() => onMarkerPress(b.id)}
            />
          );
        })}
      </Map>
    </div>
  );
}
