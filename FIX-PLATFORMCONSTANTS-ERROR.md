# Fixing PlatformConstants Error - Complete Guide

## The Problem
The error `'PlatformConstants' could not be found` with `Bridgeless mode: true` typically indicates:
1. Expo Go app version mismatch with your SDK version
2. Native module initialization issue
3. Cache corruption

## Solution 1: Update Expo Go App (Most Common Fix)

**If you're using Expo Go app on your phone:**

1. **Update Expo Go to the latest version:**
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Uninstall and reinstall Expo Go** (if update doesn't work)

3. **Clear Expo Go cache:**
   - Android: Settings > Apps > Expo Go > Storage > Clear Cache
   - iOS: Delete and reinstall the app

4. **Restart your phone**

5. **Start Expo with cleared cache:**
   ```bash
   npx expo start --clear
   ```

## Solution 2: Use Development Build (Recommended for Production)

If you're using native modules like `react-native-reanimated` and `react-native-gesture-handler`, you should use a development build instead of Expo Go:

### For Android:
```bash
# Install EAS CLI (if not installed)
npm install -g eas-cli

# Build and run on Android
npx expo run:android
```

### For iOS:
```bash
# Build and run on iOS
npx expo run:ios
```

## Solution 3: Complete Clean Rebuild

1. **Stop the Expo server** (Ctrl+C)

2. **Clear everything:**
   ```bash
   # Windows PowerShell
   Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force .expo-shared -ErrorAction SilentlyContinue
   
   # Or manually delete:
   # - .expo folder
   # - node_modules/.cache folder
   # - .expo-shared folder
   ```

3. **Reinstall dependencies:**
   ```bash
   npm install
   ```

4. **Start fresh:**
   ```bash
   npx expo start --clear
   ```

## Solution 4: Check Expo SDK Compatibility

Your current setup:
- Expo SDK: ~54.0.0
- React Native: 0.74.5
- React: 18.2.0

Make sure your Expo Go app supports SDK 54. If not:
1. Update Expo Go app
2. Or downgrade to a compatible SDK version

## Solution 5: Verify Configuration Files

I've already updated:
- ✅ `app/_layout.tsx` - Added GestureHandlerRootView at root
- ✅ `app.json` - Added reanimated plugin
- ✅ `babel.config.js` - Has reanimated plugin (must be last)
- ✅ `metro.config.js` - Created basic config

## Solution 6: Try Web Version First

To verify the code works:
```bash
npx expo start --web
```

If web works but mobile doesn't, it's definitely a native module/Expo Go issue.

## Solution 7: Check Your Phone

1. **Restart your phone**
2. **Check available storage** (low storage can cause issues)
3. **Check internet connection** (needed for initial bundle download)
4. **Try a different network** (WiFi vs Mobile Data)

## Most Likely Solution

Since you're getting this error consistently, **try Solution 1 first** (update/reinstall Expo Go), then **Solution 2** (use development build).

The development build approach (`npx expo run:android` or `npx expo run:ios`) is more reliable for apps using native modules like reanimated and gesture-handler.

## Still Not Working?

If none of the above works, the issue might be:
1. Your Expo SDK version is too new for your Expo Go app
2. You need to create a development build (not use Expo Go)
3. There's a bug in the Expo SDK version you're using

In that case, consider:
- Downgrading to Expo SDK 51 or 52 (more stable)
- Or creating a proper development build
