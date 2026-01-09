import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from '@/components/atoms';
import { colors } from '@/theme';
import { createAllTestData } from '@/utils/createTestData';

/**
 * Development screen to create test data in Firestore
 * Only use this in development!
 */
const CreateTestDataScreen = ({ navigation }: any) => {
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateTestData = async () => {
        Alert.alert(
            'Create Test Data',
            'This will add sample businesses, services, marketplace items, and rooms to Firestore. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Create',
                    onPress: async () => {
                        setIsCreating(true);
                        try {
                            await createAllTestData();
                            Alert.alert(
                                'Success!',
                                'Test data created successfully. You can now see it in the app.',
                                [{ text: 'OK', onPress: () => navigation.goBack() }]
                            );
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to create test data');
                        } finally {
                            setIsCreating(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.dark }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text variant="xl-bold" style={{ marginBottom: 10 }}>
                    Create Test Data
                </Text>

                <Text variant="md-normal" style={{ marginBottom: 20, color: colors.text.secondary }}>
                    This will create sample data in your Firestore database:
                </Text>

                <View style={{ marginBottom: 20 }}>
                    <Text variant="md-semibold" style={{ marginBottom: 5 }}>
                        • 5 Businesses
                    </Text>
                    <Text variant="sm-normal" style={{ color: colors.text.secondary, marginLeft: 15 }}>
                        Restaurants, grocery, legal, pharmacy, school
                    </Text>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text variant="md-semibold" style={{ marginBottom: 5 }}>
                        • 4 Services
                    </Text>
                    <Text variant="sm-normal" style={{ color: colors.text.secondary, marginLeft: 15 }}>
                        Tutor, plumber, designer, electrician
                    </Text>
                </View>

                <View style={{ marginBottom: 20 }}>
                    <Text variant="md-semibold" style={{ marginBottom: 5 }}>
                        • 2 Marketplace Items
                    </Text>
                    <Text variant="sm-normal" style={{ color: colors.text.secondary, marginLeft: 15 }}>
                        Furniture, electronics
                    </Text>
                </View>

                <View style={{ marginBottom: 30 }}>
                    <Text variant="md-semibold" style={{ marginBottom: 5 }}>
                        • 2 Rooms
                    </Text>
                    <Text variant="sm-normal" style={{ color: colors.text.secondary, marginLeft: 15 }}>
                        Single and double rooms
                    </Text>
                </View>

                <Button
                    title={isCreating ? 'Creating...' : 'Create Test Data'}
                    onPress={handleCreateTestData}
                    disabled={isCreating}
                    variant="primary"
                    size="large"
                    fullWidth
                />

                {isCreating && (
                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.primary[500]} />
                        <Text variant="sm-normal" style={{ marginTop: 10, color: colors.text.secondary }}>
                            Creating test data...
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ marginTop: 20, padding: 15, alignItems: 'center' }}>
                    <Text variant="md-medium" style={{ color: colors.primary[500] }}>
                        Cancel
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateTestDataScreen;
