import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import Card from '@components/common/Card';
import Button from '@components/common/Button';

/**
 * Settings Screen
 * 
 * Displays user settings and app preferences.
 * Includes theme toggle, user profile, and logout.
 */
export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { mode, toggleTheme, isDark } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.container_dark]}>
      <View style={styles.content}>
        {/* User Profile */}
        <Card style={styles.section}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.name, isDark && styles.name_dark]}>
                {user?.name || 'User'}
              </Text>
              <Text style={[styles.email, isDark && styles.email_dark]}>
                {user?.email || 'email@example.com'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Appearance */}
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitle_dark]}>
          Appearance
        </Text>
        <Card style={styles.section}>
          <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={24}
                color={isDark ? '#3b82f6' : '#2563eb'}
              />
              <Text style={[styles.settingText, isDark && styles.settingText_dark]}>
                Theme
              </Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, isDark && styles.settingValue_dark]}>
                {mode === 'dark' ? 'Dark' : 'Light'}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={isDark ? '#737373' : '#a3a3a3'}
              />
            </View>
          </TouchableOpacity>
        </Card>

        {/* App Info */}
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitle_dark]}>
          About
        </Text>
        <Card style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color={isDark ? '#3b82f6' : '#2563eb'}
              />
              <Text style={[styles.settingText, isDark && styles.settingText_dark]}>
                Version
              </Text>
            </View>
            <Text style={[styles.settingValue, isDark && styles.settingValue_dark]}>
              1.0.0
            </Text>
          </View>
        </Card>

        {/* Logout */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          fullWidth
          style={styles.logoutButton}
        />

        <Text style={[styles.footer, isDark && styles.footer_dark]}>
          Made with ❤️ using React Native
        </Text>
      </View>
    </ScrollView>
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#737373',
    marginBottom: 8,
    marginTop: 8,
    textTransform: 'uppercase',
    fontFamily: 'JetBrainsMono-Medium',
  },
  sectionTitle_dark: {
    color: '#a3a3a3',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'JetBrainsMono-Bold',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 4,
    fontFamily: 'JetBrainsMono-Bold',
  },
  name_dark: {
    color: '#f5f5f5',
  },
  email: {
    fontSize: 14,
    color: '#737373',
    fontFamily: 'JetBrainsMono-Regular',
  },
  email_dark: {
    color: '#a3a3a3',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingText: {
    fontSize: 16,
    color: '#262626',
    fontFamily: 'JetBrainsMono-Regular',
  },
  settingText_dark: {
    color: '#f5f5f5',
  },
  settingValue: {
    fontSize: 14,
    color: '#737373',
    fontFamily: 'JetBrainsMono-Regular',
  },
  settingValue_dark: {
    color: '#a3a3a3',
  },
  logoutButton: {
    marginTop: 24,
  },
  footer: {
    fontSize: 12,
    color: '#a3a3a3',
    textAlign: 'center',
    marginTop: 32,
    fontFamily: 'JetBrainsMono-Regular',
  },
  footer_dark: {
    color: '#737373',
  },
});
