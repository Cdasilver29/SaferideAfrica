import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface BranchMapProps {
  query: string;
}

export function BranchMap({ query }: BranchMapProps) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  if (Platform.OS === 'web') {
    // @ts-expect-error — iframe is a valid web element under react-native-web
    return (
      <iframe
        src={src}
        style={{ border: 0, width: '100%', height: 420, borderRadius: 16 }}
        loading="lazy"
        title="Branch location map"
      />
    );
  }

  return (
    <View style={{ width: '100%', height: 420, borderRadius: 16, overflow: 'hidden' }}>
      <WebView source={{ uri: src }} style={{ flex: 1 }} />
    </View>
  );
}
