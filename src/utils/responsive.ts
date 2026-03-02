import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const designWidth = 390;
const designHeight = 844;

export const PP = (size: number) => {
    const widthScale = screenWidth / designWidth;
    const heightScale = screenHeight / designHeight;
    const scaleRatio = Math.min(widthScale, heightScale);
    return size * scaleRatio;
};