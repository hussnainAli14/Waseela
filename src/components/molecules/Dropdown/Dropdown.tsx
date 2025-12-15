import React, { useMemo, useRef, useState, useCallback } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  FlatList,
  LayoutRectangle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@/components/atoms';
import { colors } from '@/theme';
import { DropdownOption, DropdownProps } from './types';
import { styles } from './styles';

type OptionRowProps = {
  item: DropdownOption;
  selected: boolean;
  onPress: () => void;
  optionItemStyle?: any;
  optionTextStyle?: any;
};

const OptionRow: React.FC<OptionRowProps> = ({
  item,
  selected,
  onPress,
  optionItemStyle,
  optionTextStyle,
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    style={[styles.optionItem, optionItemStyle]}
    onPress={onPress}>
    <Text
      variant="md-medium"
      style={[
        styles.optionText,
        optionTextStyle,
        selected && styles.optionTextActive,
      ]}>
      {item.label}
    </Text>
    {selected && (
      <Ionicons
        name="checkmark-circle"
        size={18}
        color={colors.secondary[500]}
      />
    )}
  </TouchableOpacity>
);

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select',
  buttonStyle,
  buttonTextStyle,
  optionTextStyle,
  optionItemStyle,
  modalProps,
  dropdownOffset = 8,
}) => {
  const [open, setOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState<LayoutRectangle | null>(null);
  const anchorRef = useRef<View>(null);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  const handleSelect = useCallback(
    (value: string) => {
      setOpen(false);
      onSelect(value);
    },
    [onSelect],
  );

  const dropdownPositionStyle = useMemo(() => {
    if (!buttonLayout) {
      return {};
    }
    return {
      top: buttonLayout.y + buttonLayout.height + dropdownOffset,
      left: 16,
      right: 16,
    };
  }, [buttonLayout, dropdownOffset]);

  const renderOption = useCallback(
    ({ item }: { item: DropdownOption }) => (
      <OptionRow
        item={item}
        selected={item.value === selectedValue}
        onPress={() => handleSelect(item.value)}
        optionItemStyle={optionItemStyle}
        optionTextStyle={optionTextStyle}
      />
    ),
    [handleSelect, optionItemStyle, optionTextStyle, selectedValue],
  );

  const renderSeparator = useCallback(
    () => <View style={styles.optionSeparator} />,
    [],
  );

  return (
    <View ref={anchorRef} collapsable={false}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.button, buttonStyle]}
        onPress={() => setOpen(true)}
        onLayout={event => setButtonLayout(event.nativeEvent.layout)}>
        <View style={styles.buttonContent}>
          <Text variant="md-medium" style={[styles.buttonText, buttonTextStyle]}>
            {selectedOption?.label ?? placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={colors.text.secondary} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        {...modalProps}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={() => setOpen(false)}>
          <View style={[styles.dropdownCard, dropdownPositionStyle]}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={renderOption}
              ItemSeparatorComponent={renderSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.optionList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Dropdown;

