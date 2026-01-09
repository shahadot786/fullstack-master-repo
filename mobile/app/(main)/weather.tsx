import React, { useState } from 'react';
import { YStack, Text, XStack, Card, ScrollView, Input, Button, Spinner } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { ScreenLayout } from '@/components/common/ScreenLayout';
import { useWeather } from '@/hooks/useWeather';
import { WeatherForecast } from '@/types';
import { format } from 'date-fns';
import { RefreshControl } from 'react-native';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

export default function WeatherScreen() {
    const [city, setCity] = useState('Dhaka');
    const [inputCity, setInputCity] = useState('Dhaka');
    const { data: weather, isLoading, error, refetch } = useWeather(city);

    const handleSearch = () => {
        if (inputCity.trim()) {
            setCity(inputCity);
        }
    };

    const getWeatherIcon = (condition: string, size = 32) => {
        const cond = condition.toLowerCase();
        if (cond.includes('clear')) return <Ionicons name="sunny" size={size} color="#eab308" />;
        if (cond.includes('cloud')) return <Ionicons name="cloud" size={size} color="#60a5fa" />;
        if (cond.includes('rain')) return <Ionicons name="rainy" size={size} color="#3b82f6" />;
        if (cond.includes('thunderstorm')) return <Ionicons name="thunderstorm" size={size} color="#8b5cf6" />;
        if (cond.includes('snow')) return <Ionicons name="snow" size={size} color="#93c5fd" />;
        return <Ionicons name="partly-sunny" size={size} color="#06b6d4" />;
    };

    return (
        <ScreenLayout>
            <YStack padding="$4" gap="$4" flex={1}>
                {/* Search Bar */}
                <XStack gap="$2" alignItems="center">
                    <Input
                        flex={1}
                        placeholder="Search city..."
                        value={inputCity}
                        onChangeText={setInputCity}
                        borderRadius="$4"
                        backgroundColor="$gray3"
                        size="$4"
                    />
                    <Button
                        onPress={handleSearch}
                        circular
                        icon={<Ionicons name="search" size={20} color="white" />}
                        backgroundColor="$blue10"
                        size="$4"
                    />
                </XStack>

                {isLoading ? (
                    <YStack flex={1} alignItems="center" justifyContent="center">
                        <Spinner size="large" color="$blue10" />
                        <Text marginTop="$2" color="$gray10">Updating weather...</Text>
                    </YStack>
                ) : error ? (
                    <YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
                        <Ionicons name="alert-circle-outline" size={64} color="$red10" />
                        <Text textAlign="center" color="$gray10">
                            Failed to load weather data. Please try another city.
                        </Text>
                        <Button onPress={() => refetch()}>Try Again</Button>
                    </YStack>
                ) : weather ? (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                        }
                    >
                        <YStack gap="$4" paddingBottom="$10">
                            {/* Main Card */}
                            <Card
                                elevate
                                bordered
                                padding="$6"
                                borderRadius="$6"
                                overflow="hidden"
                            >
                                <ExpoLinearGradient
                                    colors={['#3b82f6', '#1d4ed8'] as any}
                                    start={[0, 0]}
                                    end={[1, 1]}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                    }}
                                />
                                <YStack gap="$2" position="relative" zIndex={1}>
                                    <XStack justifyContent="space-between" alignItems="flex-start">
                                        <YStack>
                                            <Text color="white" fontSize="$8" fontWeight="bold">
                                                {weather.city}
                                            </Text>
                                            <Text color="rgba(255,255,255,0.8)" fontSize="$4">
                                                {weather.country}
                                            </Text>
                                        </YStack>
                                        <Text color="white" fontSize="$4">
                                            {format(new Date(weather.dt * 1000), 'EEE, MMM d')}
                                        </Text>
                                    </XStack>

                                    <XStack alignItems="center" justifyContent="space-between" marginTop="$4">
                                        <YStack>
                                            <Text color="white" fontSize={64} fontWeight="900">
                                                {Math.round(weather.temp)}°
                                            </Text>
                                            <Text color="rgba(255,255,255,0.9)" fontSize="$4" fontWeight="600" textTransform="capitalize">
                                                {weather.description}
                                            </Text>
                                        </YStack>
                                        <YStack backgroundColor="rgba(255,255,255,0.2)" padding="$4" borderRadius="$5">
                                            {getWeatherIcon(weather.condition, 64)}
                                        </YStack>
                                    </XStack>

                                    <XStack gap="$4" marginTop="$4" borderTopWidth={1} borderTopColor="rgba(255,255,255,0.1)" paddingTop="$4">
                                        <YStack>
                                            <Text color="rgba(255,255,255,0.6)" fontSize="$2" fontWeight="bold">FEELS LIKE</Text>
                                            <Text color="white" fontWeight="bold">{Math.round(weather.feelsLike)}°</Text>
                                        </YStack>
                                        <YStack>
                                            <Text color="rgba(255,255,255,0.6)" fontSize="$2" fontWeight="bold">HUMIDITY</Text>
                                            <Text color="white" fontWeight="bold">{weather.humidity}%</Text>
                                        </YStack>
                                        <YStack>
                                            <Text color="rgba(255,255,255,0.6)" fontSize="$2" fontWeight="bold">WIND</Text>
                                            <Text color="white" fontWeight="bold">{weather.windSpeed} km/h</Text>
                                        </YStack>
                                    </XStack>
                                </YStack>
                            </Card>

                            {/* Details Grid */}
                            <XStack gap="$3">
                                <Card flex={1} padding="$4" bordered backgroundColor="$background">
                                    <YStack alignItems="center" gap="$2">
                                        <Ionicons name="sunny-outline" size={24} color="$yellow10" />
                                        <Text color="$gray10" fontSize="$2" fontWeight="bold">SUNRISE</Text>
                                        <Text fontWeight="bold">{format(new Date(weather.sunrise * 1000), 'p')}</Text>
                                    </YStack>
                                </Card>
                                <Card flex={1} padding="$4" bordered backgroundColor="$background">
                                    <YStack alignItems="center" gap="$2">
                                        <Ionicons name="moon-outline" size={24} color="$orange10" />
                                        <Text color="$gray10" fontSize="$2" fontWeight="bold">SUNSET</Text>
                                        <Text fontWeight="bold">{format(new Date(weather.sunset * 1000), 'p')}</Text>
                                    </YStack>
                                </Card>
                            </XStack>

                            {/* Forecast */}
                            <Text fontSize="$5" fontWeight="bold" marginTop="$2" color="$color">
                                5-Day Forecast
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <XStack gap="$3">
                                    {weather.forecast?.map((day: WeatherForecast, idx: number) => (
                                        <Card key={idx} padding="$4" bordered width={110} alignItems="center" backgroundColor="$background">
                                            <Text color="$gray10" fontSize="$2" fontWeight="bold" marginBottom="$2">
                                                {idx === 0 ? 'TOMORROW' : format(new Date(day.dt * 1000), 'EEE').toUpperCase()}
                                            </Text>
                                            {getWeatherIcon(day.condition, 24)}
                                            <Text fontSize="$5" fontWeight="bold" marginTop="$2">
                                                {Math.round(day.temp)}°
                                            </Text>
                                            <Text fontSize="$1" color="$gray9" marginTop="$1" textTransform="capitalize">
                                                {day.condition}
                                            </Text>
                                        </Card>
                                    ))}
                                </XStack>
                            </ScrollView>
                        </YStack>
                    </ScrollView>
                ) : null}
            </YStack>
        </ScreenLayout>
    );
}
