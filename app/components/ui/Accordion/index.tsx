import React, { forwardRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View, type ViewStyle, type TextStyle, Text } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { createStyles } from './utils';

// Types
export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  isExpanded?: boolean;
  onPress?: () => void;
}

const AnimatedView = Animated.View;

const AccordionItem = forwardRef<View, AccordionItemProps>(
  ({
    title,
    children,
    style,
    headerStyle,
    contentStyle,
    titleStyle,
    isExpanded: isExpandedProp,
    onPress: onPressProp,
  }, ref) => {
    const { colors, spacing } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const animatedHeight = React.useRef(new Animated.Value(0)).current;
    const contentRef = React.useRef<View>(null);
    const [contentHeight, setContentHeight] = React.useState(0);
    const [isMeasuring, setIsMeasuring] = React.useState(true);

    const isControlled = isExpandedProp !== undefined;
    const expanded = isControlled ? isExpandedProp : isExpanded;

    const toggleAccordion = () => {
      if (onPressProp) {
        onPressProp();
      } else if (!isControlled) {
        setIsExpanded(!expanded);
      }
    };

    React.useEffect(() => {
      if (contentRef.current && isMeasuring) {
        contentRef.current.measure((_x, _y, _width, height) => {
          setContentHeight(height);
          setIsMeasuring(false);
          
          // Initialize height
          if (expanded) {
            animatedHeight.setValue(height);
          } else {
            animatedHeight.setValue(0);
          }
        });
      }
    }, [isMeasuring, contentHeight]);

    React.useEffect(() => {
      if (!isMeasuring) {
        Animated.timing(animatedHeight, {
          toValue: expanded ? contentHeight : 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    }, [expanded, contentHeight, isMeasuring]);

    const rotate = animatedHeight.interpolate({
      inputRange: [0, contentHeight],
      outputRange: ['0deg', '180deg'],
      extrapolate: 'clamp',
    });

    const styles = StyleSheet.create({
      item: {
        overflow: 'hidden',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
      },
      content: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
      },
      icon: {
        marginLeft: spacing.sm,
      },
    });

    return (
      <View style={[styles.item, style]} ref={ref}>
        <TouchableOpacity 
          style={[styles.header, headerStyle]} 
          onPress={toggleAccordion}
          activeOpacity={0.7}
        >
          <Text style={[{ flex: 1 }, titleStyle]}>{title}</Text>
          <AnimatedView style={[styles.icon, { transform: [{ rotate }] }]}>
            <ChevronDown size={20} color={colors.textPrimary} />
          </AnimatedView>
        </TouchableOpacity>
        
        <AnimatedView 
          style={[styles.content, { height: isMeasuring ? undefined : animatedHeight }, contentStyle]}
        >
          <View 
            ref={contentRef} 
            onLayout={isMeasuring ? undefined : () => {}}
            style={{ opacity: isMeasuring ? 0 : 1 }}
          >
            {children}
          </View>
        </AnimatedView>
      </View>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';

// Main Accordion component
type AccordionProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  allowMultiple?: boolean;
};

const Accordion = ({ children, style, allowMultiple = false }: AccordionProps) => {
  const [expandedItems, setExpandedItems] = React.useState<number[]>([]);

  const handleItemPress = (index: number) => {
    if (allowMultiple) {
      setExpandedItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setExpandedItems(prev => 
        prev.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <View style={style}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === AccordionItem) {
          return React.cloneElement(child as React.ReactElement<AccordionItemProps>, {
            isExpanded: expandedItems.includes(index),
            onPress: () => handleItemPress(index),
          });
        }
        return child;
      })}
    </View>
  );
};

Accordion.Item = AccordionItem;

export { Accordion };
