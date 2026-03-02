import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PP } from '@/utils/responsive';

const BottomNavigator: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const basePadding = PP(10);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            paddingTop: basePadding,
            paddingBottom: basePadding + insets.bottom * 0.5,
          },
        ]}>
        {state.routes
          .filter(
            route =>
              route.name !== 'BuySell' &&
              route.name !== 'RoomFinder' &&
              route.name !== 'ProfessionalNetwork',
          )
          .map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);
          const color = isFocused ? colors.secondary[500] : colors.text.secondary;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const icon =
            options.tabBarIcon?.({
              focused: isFocused,
              color,
              size: PP(24),
            }) ?? null;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              activeOpacity={0.8}>
              <View
                style={[
                  styles.tabInner,
                  isFocused && styles.tabInnerActive,
                ]}>
                {icon}
                <Text
                  variant="sm-medium"
                  style={[
                    styles.tabLabel,
                    isFocused && styles.tabLabelActive,
                    { color },
                  ]}>
                  {label as string}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavigator;

