import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Button, Divider, Avatar } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
    };

    if (!user) return null;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Avatar.Text size={80} label={user.name.charAt(0).toUpperCase()} />
                <List.Item
                    title={user.name}
                    description={user.email}
                    titleStyle={styles.name}
                    descriptionStyle={styles.email}
                />
            </View>

            <Divider />

            <List.Section>
                <List.Subheader>Account Information</List.Subheader>
                <List.Item
                    title="Email Verified"
                    description={user.isEmailVerified ? 'Verified' : 'Not Verified'}
                    left={(props) => <List.Icon {...props} icon="email-check" />}
                    right={(props) => (
                        <List.Icon
                            {...props}
                            icon={user.isEmailVerified ? 'check-circle' : 'alert-circle'}
                            color={user.isEmailVerified ? '#10b981' : '#f59e0b'}
                        />
                    )}
                />
                <List.Item
                    title="Member Since"
                    description={new Date(user.createdAt).toLocaleDateString()}
                    left={(props) => <List.Icon {...props} icon="calendar" />}
                />
            </List.Section>

            <Divider />

            <View style={styles.actions}>
                <Button
                    mode="contained"
                    onPress={handleLogout}
                    icon="logout"
                    style={styles.logoutButton}
                    buttonColor="#ef4444"
                >
                    Logout
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 24,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 12,
    },
    email: {
        textAlign: 'center',
        color: '#6b7280',
    },
    actions: {
        padding: 20,
        marginTop: 20,
    },
    logoutButton: {
        paddingVertical: 6,
    },
});
