import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({ style, lightColor, darkColor, type, children, ...otherProps }: ThemedViewProps) {
  // const theme = useTheme();

  return (
    <View style={style} {...otherProps}>
        {children}
    </View>
  );
}
