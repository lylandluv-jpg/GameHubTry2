# Fixing PlatformConstants Error

This error occurs when there's a mismatch between JavaScript and native modules. Follow these steps:

## Quick Fix (Try this first):

1. **Stop the Expo server** (Ctrl+C in terminal)

2. **Clear all caches:**
   ```bash
   npx expo start --clear
   ```

3. **If that doesn't work, try:**
   ```bash
   # Clear Metro bundler cache
   npx expo start -c
   
   # Or manually clear:
   rm -rf node_modules/.cache
   rm -rf .expo
   ```

4. **Restart Expo:**
   ```bash
   npx expo start
   ```

## If using Expo Go app:

1. **Close the Expo Go app completely** on your phone
2. **Clear the app cache** (Android: Settings > Apps > Expo Go > Clear Cache)
3. **Restart Expo server with cleared cache:**
   ```bash
   npx expo start --clear
   ```
4. **Scan the QR code again**

## If using Development Build:

1. **Rebuild the app:**
   ```bash
   # For Android
   npx expo run:android
   
   # For iOS
   npx expo run:ios
   ```

## Nuclear Option (if nothing else works):

```bash
# Remove all caches and reinstall
rm -rf node_modules
rm -rf .expo
rm -rf .expo-shared
npm install
npx expo start --clear
```

## Additional Notes:

- Make sure you're using the latest version of Expo Go app
- If the error persists, try restarting your phone
- Check that your Expo SDK version matches (currently ~54.0.0)
