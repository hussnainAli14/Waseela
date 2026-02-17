import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { LogBox } from 'react-native';

// Suppress Firebase deprecation warnings
// These warnings are informational only - the code still works perfectly
LogBox.ignoreLogs([
  'This method is deprecated',
  'React Native Firebase',
  'namespaced API',
]);

// Firebase configuration is automatically loaded from google-services.json / GoogleService-Info.plist
// No need to manually configure or initialize it in JS

// Export Firebase services
export const firebaseAuth: FirebaseAuthTypes.Module = auth();
export const firebaseFirestore: FirebaseFirestoreTypes.Module = firestore();

