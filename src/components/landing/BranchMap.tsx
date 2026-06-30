// Fallback — Metro resolves BranchMap.web.tsx (web) and BranchMap.native.tsx (iOS/Android)
// before reaching this file. This stub exists only to satisfy TypeScript's module resolution
// and provides a WebView fallback for any other platform.
import { Dimensions, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { BRANCHES, BRANCH_COORDS, type Branch } from '@/data/saferide';

interface BranchMapProps {
  activeBranchId: string;
  onMarkerPress:  (id: string) => void;
  branches?:      readonly Branch[];
}

const mapHeight = Dimensions.get('window').width < 768 ? 280 : 420;

export function BranchMap({ activeBranchId }: BranchMapProps) {
  const branch = (BRANCHES as readonly typeof BRANCHES[number][]).find(b => b.id === activeBranchId);
  const coords = branch ? BRANCH_COORDS[branch.id] : BRANCH_COORDS['donholm'];
  const query  = coords
    ? `${coords[0]},${coords[1]}`
    : encodeURIComponent(branch?.mapsQuery ?? 'Nairobi');

  const src = `https://www.google.com/maps?q=${query}&output=embed`;

  return (
    <View style={{ width: '100%', height: mapHeight, borderRadius: 16, overflow: 'hidden' }}>
      <WebView source={{ uri: src }} style={{ flex: 1 }} />
    </View>
  );
}
