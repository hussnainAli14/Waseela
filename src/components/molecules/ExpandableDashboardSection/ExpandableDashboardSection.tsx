import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import { styles } from './styles';

const ListingSeparator = () => <View style={styles.listingSeparator} />;

type ExpandableDashboardSectionProps<T> = {
  title: string;
  subtitle: string;
  iconName: string;
  iconColor: string;
  iconBackgroundColor: string;
  data: T[];
  renderItem: ({ item }: { item: T }) => React.ReactElement;
  keyExtractor: (item: T) => string;
  rightContent?: React.ReactNode;
  emptyMessage?: string;
};

function ExpandableDashboardSection<T>({
  title,
  subtitle,
  iconName,
  iconColor,
  iconBackgroundColor,
  data,
  renderItem,
  keyExtractor,
  rightContent,
  emptyMessage = 'No items found',
}: ExpandableDashboardSectionProps<T>) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dashboardCard}
        activeOpacity={0.9}
        onPress={toggleExpanded}>
        <View style={[styles.dashboardCardIcon, { backgroundColor: iconBackgroundColor }]}>
          <Ionicons name={iconName as any} size={20} color={iconColor} />
        </View>
        <View style={styles.dashboardCardContent}>
          <Text variant="md-semibold" style={styles.dashboardCardTitle}>
            {title}
          </Text>
          <Text variant="sm-normal" style={styles.dashboardCardSubtitle}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.dashboardCardRight}>
          {rightContent}
          <Ionicons
            name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={18}
            color={colors.text.secondary}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.listingsContainer}>
          {data.length > 0 ? (
            <FlatList
              data={data}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              scrollEnabled={false}
              ItemSeparatorComponent={ListingSeparator}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text variant="sm-normal" style={styles.emptyText}>
                {emptyMessage}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default ExpandableDashboardSection;

