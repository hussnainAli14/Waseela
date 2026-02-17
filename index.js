/**
 * @format
 */

import { AppRegistry } from 'react-native';
// Import Firebase app module to trigger auto-initialization
// React Native Firebase auto-initializes from GoogleService-Info.plist/google-services.json
import '@react-native-firebase/app';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
