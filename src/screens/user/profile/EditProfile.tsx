import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity, Switch, Image, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, TextField } from '@/components/atoms';
import { CityDropdown, Dropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './EditProfile.styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { firebaseFirestore, firebaseAuth } from '@/config/firebase';
import { launchImageLibrary, type Asset, type ImageLibraryOptions } from 'react-native-image-picker';
import { uploadProfilePhoto } from '@/services/storage/imageUpload';
import { useSignOut } from '@/hooks/useSignOut';
import { loadUser } from '@/store/slices/authSlice';

type EditProfileScreenNavigation = NativeStackNavigationProp<any>;

const serviceCategoryOptions = [
  { label: 'Plumber', value: 'Plumber' },
  { label: 'Electrician', value: 'Electrician' },
  { label: 'Carpenter', value: 'Carpenter' },
  { label: 'Handyman', value: 'Handyman' },
  { label: 'Tutor', value: 'Tutor' },
  { label: 'Quran Teacher', value: 'Quran Teacher' },
  { label: 'Arabic Teacher', value: 'Arabic Teacher' },
  { label: 'IT Support', value: 'IT Support' },
  { label: 'Accountant', value: 'Accountant' },
  { label: 'Legal Services', value: 'Legal Services' },
  { label: 'Event Catering', value: 'Event Catering' },
  { label: 'Photography', value: 'Photography' },
  { label: 'Cleaning', value: 'Cleaning' },
];


const pricingStyleOptions = [
  { label: 'Quote / Estimate', value: 'Quote / Estimate' },
  { label: 'Hourly Rate', value: 'Hourly Rate' },
  { label: 'Fixed Price', value: 'Fixed Price' },
];

interface ExpandableSectionProps {
  title: string;
  subtitle: string;
  iconName: string;
  iconColor: string;
  iconBackgroundColor: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  subtitle,
  iconName,
  iconColor,
  iconBackgroundColor,
  children,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <View style={styles.sectionCard}>
      <TouchableOpacity
        style={styles.sectionHeader}
        activeOpacity={0.9}
        onPress={() => setIsExpanded(!isExpanded)}>
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.sectionIcon, { backgroundColor: iconBackgroundColor }]}>
            <Ionicons name={iconName as any} size={18} color={iconColor} />
          </View>
          <View style={styles.sectionHeaderText}>
            <Text variant="md-semibold" style={styles.sectionTitle}>
              {title}
            </Text>
            <Text variant="sm-normal" style={styles.sectionSubtitle}>
              {subtitle}
            </Text>
          </View>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color={colors.text.secondary}
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

const EditProfile = () => {
  const navigation = useNavigation<EditProfileScreenNavigation>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { handleSignOut } = useSignOut();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<Asset | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    city: '',
  });

  const [privacySettings, setPrivacySettings] = useState({
    showPhonePublicly: false,
    allowWhatsApp: true,
    allowEmail: true,
  });

  const [serviceProviderData, setServiceProviderData] = useState({
    serviceTitle: '',
    serviceCategory: '',
    serviceDescription: '',
    availability: '',
    emergencyService: false,
    pricingStyle: '',
    qualifications: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    appNotifications: true,
    emailUpdates: true,
    communityAnnouncements: true,
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) {
        setIsLoadingData(false);
        return;
      }

      try {
        setIsLoadingData(true);
        const userDoc = await firebaseFirestore.collection('users').doc(user.uid).get();
        const userData = userDoc.data();

        if (userData) {
          setFormData({
            fullName: userData.displayName || user?.displayName || '',
            email: userData.email || user?.email || '',
            phoneNumber: userData.phone || '',
            city: userData.location || '',
          });

          setProfilePhotoUrl(userData.photoURL || user?.photoURL || null);

          // Load privacy settings if they exist
          if (userData.privacySettings) {
            setPrivacySettings({
              showPhonePublicly: userData.privacySettings.showPhonePublicly || false,
              allowWhatsApp: userData.privacySettings.allowWhatsApp !== undefined ? userData.privacySettings.allowWhatsApp : true,
              allowEmail: userData.privacySettings.allowEmail !== undefined ? userData.privacySettings.allowEmail : true,
            });
          }

          // Load notification settings if they exist
          if (userData.notificationSettings) {
            setNotificationSettings({
              appNotifications: userData.notificationSettings.appNotifications !== undefined ? userData.notificationSettings.appNotifications : true,
              emailUpdates: userData.notificationSettings.emailUpdates !== undefined ? userData.notificationSettings.emailUpdates : true,
              communityAnnouncements: userData.notificationSettings.communityAnnouncements !== undefined ? userData.notificationSettings.communityAnnouncements : true,
            });
          }

          // Load service provider data if it exists
          if (userData.serviceProviderData) {
            setServiceProviderData({
              serviceTitle: userData.serviceProviderData.serviceTitle || '',
              serviceCategory: userData.serviceProviderData.serviceCategory || '',
              serviceDescription: userData.serviceProviderData.serviceDescription || '',
              availability: userData.serviceProviderData.availability || '',
              emergencyService: userData.serviceProviderData.emergencyService || false,
              pricingStyle: userData.serviceProviderData.pricingStyle || '',
              qualifications: userData.serviceProviderData.qualifications || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load profile data. Please try again.');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceProviderChange = (field: string, value: string) => {
    setServiceProviderData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyToggle = (field: string) => {
    setPrivacySettings(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleNotificationToggle = (field: string) => {
    setNotificationSettings(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handlePickPhoto = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    };
    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel || !result.assets?.length) {
        return;
      }
      setProfilePhoto(result.assets[0]);
      setProfilePhotoUrl(result.assets[0].uri || null);
    } catch (error: any) {
      Alert.alert('Upload failed', error.message || 'Unable to select photo right now. Please try again.');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Validation Error', 'Please select your city.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.uid) {
      Alert.alert('Error', 'User not authenticated. Please sign in again.');
      return;
    }

    setIsLoading(true);
    try {
      let photoUrl = profilePhotoUrl;

      // Upload new profile photo if selected
      if (profilePhoto?.uri) {
        try {
          photoUrl = await uploadProfilePhoto(profilePhoto.uri, user.uid);
          setProfilePhotoUrl(photoUrl);
        } catch (error) {
          console.error('Error uploading profile photo:', error);
          Alert.alert('Warning', 'Profile photo upload failed, but other changes will be saved.');
        }
      }

      // Update Firebase Auth displayName if changed
      const currentUser = firebaseAuth.currentUser;
      if (currentUser && currentUser.displayName !== formData.fullName) {
        try {
          await currentUser.updateProfile({ displayName: formData.fullName });
        } catch (error) {
          console.error('Error updating auth displayName:', error);
        }
      }

      // Update Firestore user document
      const updateData: any = {
        displayName: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber || null,
        location: formData.city,
        updatedAt: new Date().toISOString(),
        privacySettings,
        notificationSettings,
        serviceProviderData,
      };

      if (photoUrl) {
        updateData.photoURL = photoUrl;
      }

      await firebaseFirestore.collection('users').doc(user.uid).update(updateData);

      // Also refresh auth user in Redux so Profile header shows latest name/photo
      if (firebaseAuth.currentUser) {
        try {
          await dispatch(loadUser(firebaseAuth.currentUser)).unwrap();
        } catch (e) {
          console.warn('Failed to refresh auth user after profile update', e);
        }
      }

      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    handleSignOut();
  };

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.9}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.common.white} />
          </TouchableOpacity>
          <Text variant="xl-bold" style={styles.headerTitle}>
            Edit Profile
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.secondary[500]} />
          <Text variant="sm-normal" style={{ marginTop: 10, color: colors.text.secondary }}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.common.white} />
        </TouchableOpacity>
        <Text variant="xl-bold" style={styles.headerTitle}>
          Edit Profile
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ExpandableSection
          title="Basic Information"
          subtitle="Your profile details"
          iconName="person-outline"
          iconColor={colors.secondary[500]}
          iconBackgroundColor={colors.secondary[50]}>
          <View style={styles.profilePictureSection}>
            <View style={styles.profilePictureContainer}>
              {profilePhotoUrl ? (
                <Image
                  source={{ uri: profilePhotoUrl }}
                  style={{ width: 120, height: 120, borderRadius: 60 }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person-outline" size={50} color={colors.common.white} />
              )}
            </View>
            <TouchableOpacity
              style={styles.changePhotoButton}
              activeOpacity={0.9}
              onPress={handlePickPhoto}
              disabled={isLoading}>
              <Ionicons name="cloud-upload-outline" size={18} color={colors.secondary[500]} />
              <Text variant="sm-medium" style={styles.changePhotoText}>
                Change Photo
              </Text>
            </TouchableOpacity>
            <Text variant="xs-normal" style={styles.photoHint}>
              JPG, PNG or GIF, max 5MB
            </Text>
          </View>

          <TextField
            label="Full Name *"
            value={formData.fullName}
            onChangeText={value => handleInputChange('fullName', value)}
            leftIcon={<Ionicons name="person-outline" size={20} color={colors.text.secondary} />}
            containerStyle={styles.inputField}
          />

          <TextField
            label="Email Address *"
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false}
            leftIcon={<Ionicons name="mail-outline" size={20} color={colors.text.secondary} />}
            rightIcon={
              <Ionicons name="checkmark-circle" size={20} color={colors.status.success} />
            }
            containerStyle={styles.inputField}
          />
          <View style={styles.emailVerificationNote}>
            <Ionicons name="information-circle-outline" size={14} color={colors.accent.blue} />
            <Text variant="xs-normal" style={styles.emailVerificationText}>
              Email cannot be changed from here. Contact support if needed.
            </Text>
          </View>

          <TextField
            label="Phone Number (Optional)"
            value={formData.phoneNumber}
            onChangeText={value => handleInputChange('phoneNumber', value)}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={20} color={colors.text.secondary} />}
            containerStyle={styles.inputField}
          />

          <View style={styles.dropdownContainer}>
            <Text variant="sm-medium" style={styles.dropdownLabel}>
              City / Town *
            </Text>
            <CityDropdown
              selectedValue={formData.city}
              onSelect={value => handleInputChange('city', value)}
              placeholder="Select city"
              includeAllOption={false}
              valueFormat="capitalized"
              buttonStyle={styles.dropdownField}
              buttonTextStyle={styles.dropdownValue}
            />
          </View>
        </ExpandableSection>

        <ExpandableSection
          title="Privacy & Visibility"
          subtitle="Control what others can see"
          iconName="eye-outline"
          iconColor={colors.accent.blue}
          iconBackgroundColor={colors.accent.blue + '20'}>
          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Text variant="md-medium" style={styles.toggleLabel}>
                Show phone number publicly
              </Text>
              <Text variant="xs-normal" style={styles.toggleDescription}>
                Your phone will be visible on your listings and profile
              </Text>
            </View>
            <Switch
              value={privacySettings.showPhonePublicly}
              onValueChange={() => handlePrivacyToggle('showPhonePublicly')}
              trackColor={{ false: colors.border.light, true: colors.secondary[500] }}
              thumbColor={colors.common.white}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Text variant="md-medium" style={styles.toggleLabel}>
                Allow WhatsApp contact
              </Text>
              <Text variant="xs-normal" style={styles.toggleDescription}>
                Users can contact you via WhatsApp button
              </Text>
            </View>
            <Switch
              value={privacySettings.allowWhatsApp}
              onValueChange={() => handlePrivacyToggle('allowWhatsApp')}
              trackColor={{ false: colors.border.light, true: colors.secondary[500] }}
              thumbColor={colors.common.white}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Text variant="md-medium" style={styles.toggleLabel}>
                Allow email contact
              </Text>
              <Text variant="xs-normal" style={styles.toggleDescription}>
                Users can send you messages via email
              </Text>
            </View>
            <Switch
              value={privacySettings.allowEmail}
              onValueChange={() => handlePrivacyToggle('allowEmail')}
              trackColor={{ false: colors.border.light, true: colors.secondary[500] }}
              thumbColor={colors.common.white}
            />
          </View>
        </ExpandableSection>

        <ExpandableSection
          title="User Role"
          subtitle="Your account type"
          iconName="person-outline"
          iconColor={colors.accent.purple}
          iconBackgroundColor={colors.accent.purple + '20'}
          defaultExpanded={true}>
          <TouchableOpacity style={styles.roleButton} activeOpacity={0.9}>
            <Text variant="md-semibold" style={styles.roleButtonText}>
              Service Provider
            </Text>
          </TouchableOpacity>
          <View style={styles.infoNote}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.accent.blue} />
            <Text variant="xs-normal" style={styles.infoNoteText}>
              Role changes require admin approval. Contact support if you need to change your role.
            </Text>
          </View>
        </ExpandableSection>

        <ExpandableSection
          title="Service Provider Details"
          subtitle="Your service information"
          iconName="briefcase-outline"
          iconColor={colors.accent.orange}
          iconBackgroundColor={colors.accent.orange + '20'}
          defaultExpanded={true}>
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={18} color={colors.status.warning} />
            <Text variant="sm-normal" style={styles.warningText}>
              Edits to services require admin approval before going live.
            </Text>
          </View>

          <TextField
            label="Service Title *"
            value={serviceProviderData.serviceTitle}
            onChangeText={value => handleServiceProviderChange('serviceTitle', value)}
            containerStyle={styles.inputField}
          />

          <View style={styles.dropdownContainer}>
            <Text variant="sm-medium" style={styles.dropdownLabel}>
              Service Category *
            </Text>
            <Dropdown
              options={serviceCategoryOptions}
              selectedValue={serviceProviderData.serviceCategory}
              onSelect={value => handleServiceProviderChange('serviceCategory', value)}
              placeholder="Select service category"
              buttonStyle={styles.dropdownField}
              buttonTextStyle={styles.dropdownValue}
            />
          </View>

          <TextField
            label="Service Description *"
            value={serviceProviderData.serviceDescription}
            onChangeText={value => handleServiceProviderChange('serviceDescription', value)}
            multiline
            numberOfLines={4}
            containerStyle={styles.inputField}
          />

          <TextField
            label="Availability"
            value={serviceProviderData.availability}
            onChangeText={value => handleServiceProviderChange('availability', value)}
            leftIcon={<Ionicons name="time-outline" size={20} color={colors.text.secondary} />}
            containerStyle={styles.inputField}
          />

          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Text variant="md-medium" style={styles.toggleLabel}>
                Emergency / Same-day Service
              </Text>
              <Text variant="xs-normal" style={styles.toggleDescription}>
                Offer urgent same-day services
              </Text>
            </View>
            <Switch
              value={serviceProviderData.emergencyService}
              onValueChange={value =>
                setServiceProviderData(prev => ({ ...prev, emergencyService: value }))
              }
              trackColor={{ false: colors.border.light, true: colors.secondary[500] }}
              thumbColor={colors.common.white}
            />
          </View>

          <View style={styles.dropdownContainer}>
            <Text variant="sm-medium" style={styles.dropdownLabel}>
              Pricing Style
            </Text>
            <Dropdown
              options={pricingStyleOptions}
              selectedValue={serviceProviderData.pricingStyle}
              onSelect={value => handleServiceProviderChange('pricingStyle', value)}
              placeholder="Select pricing style"
              buttonStyle={styles.dropdownField}
              buttonTextStyle={styles.dropdownValue}
            />
          </View>

          <TextField
            label="Qualifications / Licences (Optional)"
            value={serviceProviderData.qualifications}
            onChangeText={value => handleServiceProviderChange('qualifications', value)}
            multiline
            numberOfLines={3}
            containerStyle={styles.inputField}
          />

          <View style={styles.servicePhotosSection}>
            <Text variant="sm-medium" style={styles.servicePhotosLabel}>
              Service Photos / Logo
            </Text>
            <TouchableOpacity style={styles.uploadButton} activeOpacity={0.9}>
              <Ionicons name="cloud-upload-outline" size={20} color={colors.text.primary} />
              <Text variant="md-medium" style={styles.uploadButtonText}>
                Upload Photos
              </Text>
            </TouchableOpacity>
            <Text variant="xs-normal" style={styles.uploadHint}>
              Add photos of your work or business logo
            </Text>
          </View>
        </ExpandableSection>

        <ExpandableSection
          title="Notifications & Preferences"
          subtitle="Manage your alerts"
          iconName="notifications-outline"
          iconColor={colors.status.warning}
          iconBackgroundColor={colors.status.warningLight}
          defaultExpanded={true}>
          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Text variant="md-medium" style={styles.toggleLabel}>
                App notifications
              </Text>
              <Text variant="xs-normal" style={styles.toggleDescription}>
                Push notifications for messages and updates
              </Text>
            </View>
            <Switch
              value={notificationSettings.appNotifications}
              onValueChange={() => handleNotificationToggle('appNotifications')}
              trackColor={{ false: colors.border.light, true: colors.secondary[500] }}
              thumbColor={colors.common.white}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Text variant="md-medium" style={styles.toggleLabel}>
                Email updates
              </Text>
              <Text variant="xs-normal" style={styles.toggleDescription}>
                Receive updates about your listings via email
              </Text>
            </View>
            <Switch
              value={notificationSettings.emailUpdates}
              onValueChange={() => handleNotificationToggle('emailUpdates')}
              trackColor={{ false: colors.border.light, true: colors.secondary[500] }}
              thumbColor={colors.common.white}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <Text variant="md-medium" style={styles.toggleLabel}>
                Community announcements
              </Text>
              <Text variant="xs-normal" style={styles.toggleDescription}>
                Important community news and updates
              </Text>
            </View>
            <Switch
              value={notificationSettings.communityAnnouncements}
              onValueChange={() => handleNotificationToggle('communityAnnouncements')}
              trackColor={{ false: colors.border.light, true: colors.secondary[500] }}
              thumbColor={colors.common.white}
            />
          </View>
        </ExpandableSection>

        <ExpandableSection
          title="Account & Security"
          subtitle="Manage your account"
          iconName="lock-closed-outline"
          iconColor={colors.status.error}
          iconBackgroundColor={colors.status.errorLight}
          defaultExpanded={true}>
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.9}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.text.primary} />
            <Text variant="md-medium" style={styles.actionItemText}>
              Change Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.9} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.text.primary} />
            <Text variant="md-medium" style={styles.actionItemText}>
              Log Out
            </Text>
          </TouchableOpacity>
        </ExpandableSection>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View
                style={[
                  styles.sectionIcon,
                  { backgroundColor: colors.status.errorLight },
                ]}>
                <Ionicons name="warning-outline" size={18} color={colors.status.error} />
              </View>
              <View style={styles.sectionHeaderText}>
                <Text variant="md-semibold" style={[styles.sectionTitle, styles.dangerTitle]}>
                  Danger Zone
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.sectionContent}>
            <Text variant="sm-normal" style={styles.dangerText}>
              Once you delete your account, there is no going back. Please be certain.
            </Text>
            <TouchableOpacity style={styles.deleteButton} activeOpacity={0.9}>
              <Ionicons name="warning-outline" size={18} color={colors.status.error} />
              <Text variant="md-semibold" style={styles.deleteButtonText}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.9}
            onPress={() => navigation.goBack()}
            disabled={isLoading}>
            <Text variant="md-semibold" style={styles.cancelButtonText}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && { opacity: 0.6 }]}
            activeOpacity={0.9}
            onPress={handleSave}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.common.white} />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color={colors.common.white} />
                <Text variant="md-semibold" style={styles.saveButtonText}>
                  Save Changes
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

