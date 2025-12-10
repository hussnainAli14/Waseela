# Navigation Structure

This directory contains the navigation setup for the React Native app using React Navigation.

## Structure

```
navigation/
├── types.ts              # TypeScript type definitions for navigation
├── RootNavigator.tsx     # Top-level navigator (switches between Auth/Main)
├── AuthNavigator.tsx      # Authentication flow navigator
├── MainNavigator.tsx     # Main app navigator (authenticated users)
├── navigationRef.ts      # Navigation reference for programmatic navigation
└── index.ts              # Central export point

Note: Navigation hooks are located in @/hooks/useNavigation.ts
```

## Usage

### Basic Navigation in Screens

```typescript
import { AuthScreenProps } from '@/navigation';

type LoginScreenProps = AuthScreenProps<'Login'>;

const Login = ({ navigation, route }: LoginScreenProps) => {
  // Navigate to another screen
  navigation.navigate('Signup');
  
  // Navigate with params
  navigation.navigate('ForgotPassword');
  
  // Go back
  navigation.goBack();
  
  return <View>...</View>;
};
```

### Using Navigation Hooks

```typescript
import { useAuthNavigation } from '@/hooks';

const Login = () => {
  const navigation = useAuthNavigation('Login');
  
  const handlePress = () => {
    navigation.navigate('Signup');
  };
  
  return <View>...</View>;
};
```

### Programmatic Navigation (Outside Components)

```typescript
import { navigate, goBack, reset } from '@/navigation';

// Navigate from anywhere (e.g., API calls, utils)
navigate('Main', { screen: 'Home' });

// Go back
goBack();

// Reset navigation stack
reset('Auth');
```

## Adding New Screens

1. **Add screen component** in `src/screens/`
2. **Update types** in `types.ts`:
   ```typescript
   export type AuthStackParamList = {
     Login: undefined;
     NewScreen: { param1: string }; // Add here
   };
   ```
3. **Add to navigator** in `AuthNavigator.tsx` or `MainNavigator.tsx`:
   ```typescript
   <Stack.Screen name="NewScreen" component={NewScreen} />
   ```

## Best Practices

- ✅ Always use typed navigation props (`AuthScreenProps`, `MainScreenProps`)
- ✅ Use navigation hooks for type safety
- ✅ Keep navigation logic in components, not in business logic
- ✅ Use `navigationRef` for programmatic navigation outside components
- ✅ Update types when adding new screens or params
- ✅ Group related screens in the same navigator

## Authentication Flow

The `RootNavigator` switches between `AuthNavigator` and `MainNavigator` based on authentication state. Update the `isAuthenticated` variable in `RootNavigator.tsx` to connect with your auth system.

