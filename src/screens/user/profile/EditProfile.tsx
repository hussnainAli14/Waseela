import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, TextField } from '@/components/atoms';
import { Dropdown } from '@/components/molecules';
import { colors } from '@/theme';
import { styles } from './EditProfile.styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

const cityOptions = [
  { label: 'London', value: 'London' },
  { label: 'Birmingham', value: 'Birmingham' },
  { label: 'Manchester', value: 'Manchester' },
  { label: 'Liverpool', value: 'Liverpool' },
  { label: 'Leeds', value: 'Leeds' },
  { label: 'Sheffield', value: 'Sheffield' },
  { label: 'Bristol', value: 'Bristol' },
  { label: 'Newcastle', value: 'Newcastle' },
  { label: 'Leicester', value: 'Leicester' },
  { label: 'Nottingham', value: 'Nottingham' },
  { label: 'Cardiff', value: 'Cardiff' },
  { label: 'Glasgow', value: 'Glasgow' },
  { label: 'Edinburgh', value: 'Edinburgh' },
  { label: 'Bradford', value: 'Bradford' },
  { label: 'Southampton', value: 'Southampton' },
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
  const [formData, setFormData] = useState({
    fullName: 'Ali Hassan',
    email: 'ali.hassan@example.com',
    phoneNumber: '+44 7700 900000',
    city: 'London',
  });

  const [privacySettings, setPrivacySettings] = useState({
    showPhonePublicly: false,
    allowWhatsApp: true,
    allowEmail: true,
  });

  const [serviceProviderData, setServiceProviderData] = useState({
    serviceTitle: 'Professional Plumbing Services',
    serviceCategory: 'Plumber',
    serviceDescription: 'Experienced plumber offering residential and commercial services.',
    availability: 'Mon-Fri, 9am-6pm',
    emergencyService: true,
    pricingStyle: 'Quote / Estimate',
    qualifications: 'City & Guilds Level 3 Plumbing',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    appNotifications: true,
    emailUpdates: true,
    communityAnnouncements: true,
  });

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
              <Ionicons name="person-outline" size={50} color={colors.common.white} />
            </View>
            <TouchableOpacity style={styles.changePhotoButton} activeOpacity={0.9}>
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
            leftIcon={<Ionicons name="mail-outline" size={20} color={colors.text.secondary} />}
            rightIcon={
              <Ionicons name="checkmark-circle" size={20} color={colors.status.success} />
            }
            containerStyle={styles.inputField}
          />
          <View style={styles.emailVerificationNote}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.accent.blue} />
            <Text variant="xs-normal" style={styles.emailVerificationText}>
              Email changes require verification
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
            <Dropdown
              options={cityOptions}
              selectedValue={formData.city}
              onSelect={value => handleInputChange('city', value)}
              placeholder="Select city"
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

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.9}>
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
            onPress={() => navigation.goBack()}>
            <Text variant="md-semibold" style={styles.cancelButtonText}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.9}>
            <Ionicons name="save-outline" size={18} color={colors.common.white} />
            <Text variant="md-semibold" style={styles.saveButtonText}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

