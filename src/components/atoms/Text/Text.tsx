import { Text as RNText } from 'react-native';
import { FontVariants, TextProps } from './types';
import { styles } from './styles';

const VARIANT_STYLES = (v: FontVariants) => {
    switch (v) {
        case 'xs-normal':
            return styles.xsNormal;
        case 'xs-medium':
            return styles.xsMedium;
        case 'xs-semibold':
            return styles.xsSemibold;
        case 'xs-bold':
            return styles.xsBold;
        case 'sm-normal':
            return styles.smNormal;
        case 'sm-medium':
            return styles.smMedium;
        case 'sm-semibold':
            return styles.smSemibold;
        case 'sm-bold':
            return styles.smBold;
        case 'md-normal':
            return styles.mdNormal;
        case 'md-medium':
            return styles.mdMedium;
        case 'md-semibold':
            return styles.mdSemibold;
        case 'md-bold':
            return styles.mdBold;
        case 'lg-normal':
            return styles.lgNormal;
        case 'lg-medium':
            return styles.lgMedium;
        case 'lg-semibold':
            return styles.lgSemibold;
        case 'lg-bold':
            return styles.lgBold;
        case 'xl-normal':
            return styles.xlNormal;
        case 'xl-medium':
            return styles.xlMedium;
        case 'xl-semibold':
            return styles.xlSemibold;
        case 'xl-bold':
            return styles.xlBold;
        case '2xl-normal':
            return styles.xxlNormal;
        case '2xl-medium':
            return styles.xxlMedium;
        case '2xl-semibold':
            return styles.xxlSemibold;
        case '2xl-bold':
            return styles.xxlBold;
        case '3xl-normal':
            return styles.xxxlNormal;
        case '3xl-medium':
            return styles.xxxlMedium;
        case '3xl-semibold':
            return styles.xxxlSemibold;
        case '3xl-bold':
            return styles.xxxlBold;
        default:
            return styles.xsNormal;
    }
}


const Text = ({ children, style,variant, ...props }: TextProps) => {
   
    return (
        <RNText style={[VARIANT_STYLES(variant), style]} {...props}>
            {children}
        </RNText>
    )
}

export default Text;