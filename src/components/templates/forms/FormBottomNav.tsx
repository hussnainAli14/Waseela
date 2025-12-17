import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainStackParamList } from '@/navigation/types';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './FormBottomNav.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabKey = 'Home' | 'Directory' | 'Services' | 'Profile';

type Props = {
  activeTab?: TabKey;
};

const tabs: Array<{
  key: TabKey;
  label: string;
  icon: (focused: boolean) => JSX.Element;
}> = [
  {
    key: 'Home',
    label: 'Home',
    icon: focused => (
      <Ionicons
        name={focused ? 'home' : 'home-outline'}
        size={24}
        color={focused ? colors.secondary[500] : colors.text.secondary}
      />
    ),
  },
  {
    key: 'Directory',
    label: 'Directory',
    icon: focused => (
      <Ionicons
        name={focused ? 'storefront' : 'storefront-outline'}
        size={24}
        color={focused ? colors.secondary[500] : colors.text.secondary}
      />
    ),
  },
  {
    key: 'Services',
    label: 'Services',
    icon: focused => (
      <Ionicons
        name={focused ? 'briefcase' : 'briefcase-outline'}
        size={24}
        color={focused ? colors.secondary[500] : colors.text.secondary}
      />
    ),
  },
  {
    key: 'Profile',
    label: 'Profile',
    icon: focused => (
      <Ionicons
        name={focused ? 'person' : 'person-outline'}
        size={24}
        color={focused ? colors.secondary[500] : colors.text.secondary}
      />
    ),
  },
];

const FormBottomNav: React.FC<Props> = ({ activeTab }) => {
  const navigation = useNavigation<BottomTabNavigationProp<MainStackParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const resolvedActive =
    activeTab ??
    (route.name === 'SellItem' || route.name === 'PostRoom' ? 'Profile' : 'Home');

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.container}>
        {tabs.map(tab => {
          const focused = tab.key === resolvedActive;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(tab.key)}>
              <View style={[styles.tabInner, focused && styles.tabInnerActive]}>
                {tab.icon(focused)}
                <Text
                  variant="sm-medium"
                  style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default FormBottomNav;


