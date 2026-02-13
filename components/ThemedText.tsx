import React from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export type ThemedTextProps = TextProps & {
  variant?: 'default' | 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  fontFamily?: 'outfit' | 'dmsans';
  weight?: 'regular' | 'medium' | 'bold';
  color?: string;
};

export function ThemedText({
  style,
  variant = 'default',
  fontFamily = 'outfit',
  weight,
  color,
  ...rest
}: ThemedTextProps) {
  
  const getFontFamily = () => {
    if (fontFamily === 'dmsans') {
      if (weight === 'bold') return 'DMSans_700Bold';
      if (weight === 'medium') return 'DMSans_500Medium';
      return 'DMSans_400Regular';
    }
    // Default to Outfit
    if (weight === 'bold') return 'Outfit_700Bold';
    if (weight === 'medium') return 'Outfit_500Medium';
    return 'Outfit_400Regular';
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'heading':
        return styles.heading;
      case 'subheading':
        return styles.subheading;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      case 'label':
        return styles.label;
      default:
        return styles.default;
    }
  };

  return (
    <Text
      style={[
        { 
          fontFamily: getFontFamily(),
          color: color || Colors.textDark 
        },
        getVariantStyle(),
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  heading: {
    fontSize: 24,
    lineHeight: 32,
  },
  subheading: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
});
