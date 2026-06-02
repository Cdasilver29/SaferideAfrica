import React from 'react';
import { Map, Marker } from 'pigeon-maps';
import { BRANCHES, BRANCH_COORDS } from '@/data/saferide';
import { Dimensions } from 'react-native';

interface BranchMapProps {
  activeBranchId: string;
  onMarkerPress:  (id: string) => void;
}

const mapHeight = Dimensions.get('window').width < 768 ? 280 : 420;

// Nairobi Eastlands centroid — keeps all 10 pins visible at zoom 12
const CENTER: [number, number] = [-1.286, 36.890];

export function BranchMap({ activeBranchId, onMarkerPress }: BranchMapProps) {
  return (
    <div style={{ height: mapHeight, borderRadius: 16, overflow: 'hidden' }}>
      <Map height={mapHeight} defaultCenter={CENTER} defaultZoom={12}>
        {(BRANCHES as readonly typeof BRANCHES[number][]).map(b => {
          const coords = BRANCH_COORDS[b.id];
          if (!coords) return null;
          const isActive = b.id === activeBranchId;
          return (
            <Marker
              key={b.id}
              anchor={coords}
              width={isActive ? 56 : 40}
              color={isActive ? '#d97706' : '#2563eb'}
              onClick={() => onMarkerPress(b.id)}
            />
          );
        })}
      </Map>
    </div>
  );
}
