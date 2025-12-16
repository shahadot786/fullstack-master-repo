import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTheme } from '@hooks/useTheme';

/**
 * Custom Bottom Sheet Component
 * 
 * A reusable bottom sheet component using @gorhom/bottom-sheet.
 * Supports theme, custom snap points, and backdrop.
 * 
 * Usage:
 * const bottomSheetRef = useRef<BottomSheet>(null);
 * 
 * <CustomBottomSheet ref={bottomSheetRef} snapPoints={['25%', '50%', '90%']}>
 *   <Text>Bottom sheet content</Text>
 * </CustomBottomSheet>
 * 
 * // To open:
 * bottomSheetRef.current?.snapToIndex(0);
 * 
 * // To close:
 * bottomSheetRef.current?.close();
 */

interface CustomBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  index?: number;
  onClose?: () => void;
}

const CustomBottomSheet = forwardRef<BottomSheet, CustomBottomSheetProps>(
  ({ children, snapPoints = ['50%', '90%'], enablePanDownToClose = true, index = -1, onClose }, ref) => {
    const { isDark } = useTheme();

    // Memoize snap points for performance
    const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    // Render backdrop
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={ref}
        index={index}
        snapPoints={memoizedSnapPoints}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={[
          styles.bottomSheetBackground,
          isDark && styles.bottomSheetBackground_dark,
        ]}
        handleIndicatorStyle={[
          styles.handleIndicator,
          isDark && styles.handleIndicator_dark,
        ]}
        onClose={onClose}
      >
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

CustomBottomSheet.displayName = 'CustomBottomSheet';

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetBackground_dark: {
    backgroundColor: '#262626',
  },
  handleIndicator: {
    backgroundColor: '#d4d4d4',
  },
  handleIndicator_dark: {
    backgroundColor: '#525252',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
});

export default CustomBottomSheet;
