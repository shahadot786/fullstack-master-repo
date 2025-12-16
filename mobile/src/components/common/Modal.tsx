import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';

/**
 * Custom Modal Component
 * 
 * A reusable modal component with backdrop and close button.
 * Supports theme and custom content.
 * 
 * Usage:
 * const [visible, setVisible] = useState(false);
 * 
 * <CustomModal
 *   visible={visible}
 *   onClose={() => setVisible(false)}
 *   title="Modal Title"
 * >
 *   <Text>Modal content</Text>
 * </CustomModal>
 */

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export default function CustomModal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
}: CustomModalProps) {
  const { isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContainer, isDark && styles.modalContainer_dark]}>
              {/* Header */}
              {(title || showCloseButton) && (
                <View style={styles.header}>
                  {title && (
                    <Text style={[styles.title, isDark && styles.title_dark]}>
                      {title}
                    </Text>
                  )}
                  {showCloseButton && (
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                      <Ionicons
                        name="close"
                        size={24}
                        color={isDark ? '#f5f5f5' : '#262626'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Content */}
              <View style={styles.content}>
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalContainer_dark: {
    backgroundColor: '#262626',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
    flex: 1,
    fontFamily: 'JetBrainsMono-Bold',
  },
  title_dark: {
    color: '#f5f5f5',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
});
