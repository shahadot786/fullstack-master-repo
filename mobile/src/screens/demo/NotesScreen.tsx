import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import Card from '@components/common/Card';
import CustomBottomSheet from '@components/common/BottomSheet';
import CustomModal from '@components/common/Modal';
import Button from '@components/common/Button';
import BottomSheet from '@gorhom/bottom-sheet';

/**
 * Notes Demo Screen
 * 
 * A demo screen showcasing the Notes feature with:
 * - Sample notes list
 * - Bottom sheet for quick actions
 * - Modal for note details
 * 
 * This is a placeholder for the actual Notes feature.
 */

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

const DEMO_NOTES: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes',
    content: 'Discussed project timeline and deliverables for Q1 2024.',
    category: 'Work',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Shopping List',
    content: 'Milk, Eggs, Bread, Coffee, Fruits',
    category: 'Personal',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: 'Book Ideas',
    content: 'Research React Native best practices and design patterns.',
    category: 'Learning',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    title: 'Travel Plans',
    content: 'Plan trip to Japan - Tokyo, Kyoto, Osaka. Check flights and hotels.',
    category: 'Personal',
    createdAt: '2024-01-12',
  },
];

export default function NotesScreen() {
  const { isDark } = useTheme();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleNotePress = (note: Note) => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  const handleNoteLongPress = (note: Note) => {
    setSelectedNote(note);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      onPress={() => handleNotePress(item)}
      onLongPress={() => handleNoteLongPress(item)}
    >
      <Card style={styles.noteCard}>
        <View style={styles.noteHeader}>
          <Text style={[styles.noteTitle, isDark && styles.noteTitle_dark]}>
            {item.title}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        <Text
          style={[styles.noteContent, isDark && styles.noteContent_dark]}
          numberOfLines={2}
        >
          {item.content}
        </Text>
        <Text style={[styles.noteDate, isDark && styles.noteDate_dark]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.container_dark]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.headerTitle_dark]}>
          Notes (Demo)
        </Text>
        <Text style={[styles.headerSubtitle, isDark && styles.headerSubtitle_dark]}>
          This is a placeholder for the Notes feature
        </Text>
      </View>

      {/* Notes List */}
      <FlatList
        data={DEMO_NOTES}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => bottomSheetRef.current?.snapToIndex(0)}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Bottom Sheet for Quick Actions */}
      <CustomBottomSheet ref={bottomSheetRef} snapPoints={['35%', '60%']}>
        <Text style={[styles.sheetTitle, isDark && styles.sheetTitle_dark]}>
          Quick Actions
        </Text>
        <Text style={[styles.sheetSubtitle, isDark && styles.sheetSubtitle_dark]}>
          {selectedNote?.title || 'Create New Note'}
        </Text>

        <View style={styles.actionButtons}>
          <Button
            title="Edit Note"
            onPress={() => {
              bottomSheetRef.current?.close();
              // TODO: Navigate to edit screen
            }}
            variant="primary"
            fullWidth
          />
          <Button
            title="Share Note"
            onPress={() => {
              bottomSheetRef.current?.close();
              // TODO: Implement share
            }}
            variant="outline"
            fullWidth
          />
          <Button
            title="Delete Note"
            onPress={() => {
              bottomSheetRef.current?.close();
              // TODO: Implement delete
            }}
            variant="danger"
            fullWidth
          />
        </View>
      </CustomBottomSheet>

      {/* Modal for Note Details */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={selectedNote?.title}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{selectedNote?.category}</Text>
            </View>
            <Text style={[styles.modalDate, isDark && styles.modalDate_dark]}>
              {selectedNote?.createdAt &&
                new Date(selectedNote.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Text style={[styles.modalText, isDark && styles.modalText_dark]}>
            {selectedNote?.content}
          </Text>
          <Button
            title="Close"
            onPress={() => setModalVisible(false)}
            variant="outline"
            fullWidth
            style={{ marginTop: 20 }}
          />
        </View>
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container_dark: {
    backgroundColor: '#171717',
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 4,
    fontFamily: 'JetBrainsMono-Bold',
  },
  headerTitle_dark: {
    color: '#f5f5f5',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#737373',
    fontFamily: 'JetBrainsMono-Regular',
  },
  headerSubtitle_dark: {
    color: '#a3a3a3',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  noteCard: {
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
    flex: 1,
    marginRight: 8,
    fontFamily: 'JetBrainsMono-Medium',
  },
  noteTitle_dark: {
    color: '#f5f5f5',
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
    fontFamily: 'JetBrainsMono-Medium',
  },
  noteContent: {
    fontSize: 14,
    color: '#525252',
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: 'JetBrainsMono-Regular',
  },
  noteContent_dark: {
    color: '#a3a3a3',
  },
  noteDate: {
    fontSize: 12,
    color: '#737373',
    fontFamily: 'JetBrainsMono-Regular',
  },
  noteDate_dark: {
    color: '#737373',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 4,
    fontFamily: 'JetBrainsMono-Bold',
  },
  sheetTitle_dark: {
    color: '#f5f5f5',
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#737373',
    marginBottom: 20,
    fontFamily: 'JetBrainsMono-Regular',
  },
  sheetSubtitle_dark: {
    color: '#a3a3a3',
  },
  actionButtons: {
    gap: 12,
  },
  modalContent: {
    minHeight: 200,
  },
  modalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 12,
    color: '#737373',
    fontFamily: 'JetBrainsMono-Regular',
  },
  modalDate_dark: {
    color: '#a3a3a3',
  },
  modalText: {
    fontSize: 16,
    color: '#262626',
    lineHeight: 24,
    fontFamily: 'JetBrainsMono-Regular',
  },
  modalText_dark: {
    color: '#f5f5f5',
  },
});
