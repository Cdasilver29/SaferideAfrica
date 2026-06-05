import { useWindowDimensions } from 'react-native';

export const BP = { sm: 640, md: 768, lg: 1024, xl: 1280 };

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    isMobile:  width < BP.sm,   // < 640  — phone
    isTablet:  width >= BP.sm && width < BP.lg,  // 640–1024
    isDesktop: width >= BP.lg,  // 1024+
    isSmall:   width < BP.md,   // < 768  — narrow: stack all columns
  };
}
