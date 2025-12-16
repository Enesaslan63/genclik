import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Bus, QrCode, MessageSquare, User } from 'lucide-react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';

const ICONS = {
  Home,
  Transport: Bus,
  GencKart: QrCode,
  Assistant: MessageSquare,
  Profile: User,
};

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={90} tint="dark" style={styles.blurView}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const Icon = ICONS[route.name as keyof typeof ICONS];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabButton}
            >
              <View style={[styles.iconContainer, isFocused ? styles.iconFocused : {}]}>
                <Icon color={isFocused ? Colors.primary.indigo : '#9ca3af'} size={28} />
              </View>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
  },
  blurView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  iconFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    overflow: 'hidden',
  },
});

export default CustomTabBar;
