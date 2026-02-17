#!/bin/bash

# Script to download react-native-vector-icons fonts
# These fonts are required for icons to display properly on iOS

FONTS_DIR="node_modules/react-native-vector-icons/Fonts"
FONTS_URL="https://github.com/oblador/react-native-vector-icons/raw/master/Fonts"

# Create Fonts directory if it doesn't exist
mkdir -p "$FONTS_DIR"

# List of required fonts
FONTS=(
  "Ionicons.ttf"
  "MaterialCommunityIcons.ttf"
  "MaterialIcons.ttf"
  "AntDesign.ttf"
  "Entypo.ttf"
  "EvilIcons.ttf"
  "Feather.ttf"
  "FontAwesome.ttf"
  "FontAwesome5_Brands.ttf"
  "FontAwesome5_Regular.ttf"
  "FontAwesome5_Solid.ttf"
  "FontAwesome6_Brands.ttf"
  "FontAwesome6_Regular.ttf"
  "FontAwesome6_Solid.ttf"
  "Fontisto.ttf"
  "Foundation.ttf"
  "Octicons.ttf"
  "SimpleLineIcons.ttf"
  "Zocial.ttf"
)

echo "Downloading react-native-vector-icons fonts..."

for font in "${FONTS[@]}"; do
  if [ ! -f "$FONTS_DIR/$font" ]; then
    echo "Downloading $font..."
    curl -k -L -o "$FONTS_DIR/$font" "$FONTS_URL/$font" 2>/dev/null || {
      echo "Failed to download $font, trying alternative method..."
      # Try using wget if curl fails
      wget --no-check-certificate -O "$FONTS_DIR/$font" "$FONTS_URL/$font" 2>/dev/null || echo "Failed to download $font"
    }
  else
    echo "$font already exists, skipping..."
  fi
done

echo "Font download complete!"
echo "Next steps:"
echo "1. Run: cd ios && pod install"
echo "2. Clean and rebuild in Xcode"
