/**
 * Navigation Hooks
 * Type-safe navigation hooks for use in components
 */

import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  AuthStackParamList,
  MainStackParamList,
  AuthScreenProps,
  MainScreenProps,
} from '@/navigation/types';

/**
 * Hook for type-safe navigation in Auth screens
 * @param _screenName - Screen name for type inference (unused at runtime)
 */
export function useAuthNavigation<T extends keyof AuthStackParamList>(
  _screenName: T,
) {
  const navigation = useNavigation<AuthScreenProps<T>['navigation']>();
  return navigation;
}

/**
 * Hook for type-safe navigation in Main screens
 * @param _screenName - Screen name for type inference (unused at runtime)
 */
export function useMainNavigation<T extends keyof MainStackParamList>(
  _screenName: T,
) {
  const navigation = useNavigation<MainScreenProps<T>['navigation']>();
  return navigation;
}

/**
 * Hook for type-safe route params in Auth screens
 * @param _screenName - Screen name for type inference (unused at runtime)
 */
export function useAuthRoute<T extends keyof AuthStackParamList>(
  _screenName: T,
) {
  const route = useRoute<AuthScreenProps<T>['route']>();
  return route;
}

/**
 * Hook for type-safe route params in Main screens
 * @param _screenName - Screen name for type inference (unused at runtime)
 */
export function useMainRoute<T extends keyof MainStackParamList>(
  _screenName: T,
) {
  const route = useRoute<MainScreenProps<T>['route']>();
  return route;
}

