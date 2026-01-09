import React, { useState } from 'react';
import { FlatList, Share, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { YStack, XStack, Text, Input, Button, Card, Spinner, ScrollView } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { useUrls, useShortenUrl, useDeleteUrl } from '@/hooks/useUrl';
import { useTheme } from '@/hooks/useTheme';
import { format } from 'date-fns';
import { API_BASE_URL_PRODUCTION } from '@/config/constants';
import { Url } from '@/types';

export default function URLShortScreen() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [title, setTitle] = useState('');
    const { isDark } = useTheme();

    const { data: urlsData, isLoading, refetch } = useUrls();
    const shortenMutation = useShortenUrl();
    const deleteMutation = useDeleteUrl();

    const handleShorten = async () => {
        if (!originalUrl) return;
        try {
            // Basic client-side normalization
            let inputUrl = originalUrl.trim();
            if (!/^https?:\/\//i.test(inputUrl)) {
                inputUrl = `https://${inputUrl}`;
            }

            await shortenMutation.mutateAsync({ originalUrl: inputUrl, title });
            setOriginalUrl('');
            setTitle('');
            Alert.alert('Success', 'URL shortened successfully');
        } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to shorten URL');
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            'Delete URL',
            'Are you sure you want to delete this shortened URL?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteMutation.mutateAsync(id);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete URL');
                        }
                    },
                },
            ]
        );
    };

    const copyToClipboard = async (shortId: string) => {
        const shortUrl = `${API_BASE_URL_PRODUCTION}/url/${shortId}`;
        await Clipboard.setStringAsync(shortUrl);
        Alert.alert('Copied', 'Short URL copied to clipboard');
    };

    const handleShare = async (shortId: string) => {
        const shortUrl = `${API_BASE_URL_PRODUCTION}/url/${shortId}`;
        try {
            await Share.share({
                message: `Check out this link: ${shortUrl}`,
                url: shortUrl,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const renderUrlItem = ({ item }: { item: Url }) => (
        <Card
            bordered
            padding="$4"
            marginBottom="$3"
            backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}
            pressStyle={{ opacity: 0.9 }}
        >
            <YStack gap="$2">
                <XStack justifyContent="space-between" alignItems="flex-start">
                    <YStack flex={1}>
                        <Text fontSize="$5" fontWeight="bold" color="$color">
                            {item.title || 'Untitled'}
                        </Text>
                        <Text fontSize="$2" color="$gray10" numberOfLines={1}>
                            {item.originalUrl}
                        </Text>
                    </YStack>
                    <TouchableOpacity onPress={() => handleDelete(item._id)}>
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </XStack>

                <XStack
                    backgroundColor={isDark ? '#333' : '#f0f4ff'}
                    padding="$2"
                    borderRadius="$2"
                    justifyContent="space-between"
                    alignItems="center"
                    marginTop="$1"
                >
                    <Text fontSize="$3" fontWeight="600" color={isDark ? '#60a5fa' : '#2563eb'}>
                        {item.shortId}
                    </Text>
                    <XStack gap="$3">
                        <TouchableOpacity onPress={() => copyToClipboard(item.shortId)}>
                            <Ionicons name="copy-outline" size={20} color={isDark ? '#60a5fa' : '#2563eb'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleShare(item.shortId)}>
                            <Ionicons name="share-outline" size={20} color={isDark ? '#60a5fa' : '#2563eb'} />
                        </TouchableOpacity>
                    </XStack>
                </XStack>

                <XStack justifyContent="space-between" alignItems="center" marginTop="$1">
                    <XStack alignItems="center" gap="$1">
                        <Ionicons name="stats-chart" size={14} color="#10b981" />
                        <Text fontSize="$2" color="#10b981" fontWeight="600">
                            {item.clicks} clicks
                        </Text>
                    </XStack>
                    <Text fontSize="$2" color="$gray10">
                        {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </Text>
                </XStack>
            </YStack>
        </Card>
    );

    return (
        <ScreenLayout>
            <YStack flex={1} padding="$4" gap="$4">
                {/* Input Section */}
                <Card bordered padding="$4" backgroundColor={isDark ? '#1a1a1a' : '#ffffff'}>
                    <YStack gap="$3">
                        <Text fontSize="$6" fontWeight="bold" color="$color">
                            Shorten URL
                        </Text>
                        <Input
                            placeholder="Paste your long URL here"
                            value={originalUrl}
                            onChangeText={setOriginalUrl}
                            backgroundColor={isDark ? '#222' : '#f9fafb'}
                        />
                        <Input
                            placeholder="Title (optional)"
                            value={title}
                            onChangeText={setTitle}
                            backgroundColor={isDark ? '#222' : '#f9fafb'}
                        />
                        <Button
                            backgroundColor="#3b82f6"
                            color="white"
                            onPress={handleShorten}
                            disabled={shortenMutation.isPending}
                        >
                            {shortenMutation.isPending ? <Spinner color="white" /> : 'Shorten Link'}
                        </Button>
                    </YStack>
                </Card>

                {/* List Section */}
                <YStack flex={1} gap="$2">
                    <Text fontSize="$5" fontWeight="600" color="$color">
                        Your Links
                    </Text>
                    {isLoading ? (
                        <YStack flex={1} alignItems="center" justifyContent="center">
                            <Spinner size="large" color="#3b82f6" />
                        </YStack>
                    ) : (
                        <FlatList
                            data={urlsData?.data}
                            renderItem={renderUrlItem}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            ListEmptyComponent={
                                <YStack padding="$10" alignItems="center" opacity={0.5}>
                                    <Ionicons name="link-outline" size={48} color="$color" />
                                    <Text marginTop="$2">No links created yet</Text>
                                </YStack>
                            }
                            onRefresh={refetch}
                            refreshing={isLoading}
                        />
                    )}
                </YStack>
            </YStack>
        </ScreenLayout>
    );
}
