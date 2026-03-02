# Fixing Google Play Console Keystore Error

## Problem
Your App Bundle is signed with the wrong key. Google Play expects:
- **Expected SHA1**: `33:E7:37:BD:F5:D2:AD:AC:57:DD:45:52:55:49:B7:61:20:E6:D4:96`
- **Current SHA1**: `4F:31:0A:FF:96:CF:AC:B1:05:C0:21:13:18:6D:C3:1C:CE:B1:DE:82`

## Step 1: Find the Original Keystore

Run the search script:
```bash
cd /Users/rajahussnainali/Work/Projects/Anthony/Waseela/android
chmod +x find-keystore.sh
./find-keystore.sh
```

Or manually check keystore files:
```bash
# For each keystore file you find, check its SHA1:
keytool -list -v -keystore <keystore-file> -alias <alias> -storepass <password> -keypass <password> | grep SHA1
```

## Step 2: Check Google Play App Signing

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to **Setup** → **App signing**
4. Check if **Google Play App Signing** is enabled

### If Google Play App Signing is ENABLED:
- You can request to reset your upload key
- Go to **App signing** → **Upload key certificate** → **Request upload key reset**
- This allows you to use a new upload key

### If Google Play App Signing is DISABLED:
- You MUST use the original keystore
- If you lost it, you'll need to contact Google Play support

## Step 3: Update Configuration

Once you find the correct keystore, update `android/gradle.properties`:

```properties
MYAPP_UPLOAD_STORE_FILE=path/to/correct-keystore.keystore
MYAPP_UPLOAD_KEY_ALIAS=correct-alias-name
MYAPP_UPLOAD_STORE_PASSWORD=correct-store-password
MYAPP_UPLOAD_KEY_PASSWORD=correct-key-password
```

**Important**: Use an absolute path or a path relative to `android/app/` directory.

## Step 4: Rebuild and Upload

After updating the configuration:
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

The new bundle will be in: `android/app/build/outputs/bundle/release/app-release.aab`

## If You Cannot Find the Original Keystore

### Option 1: Request Upload Key Reset (Recommended if App Signing is enabled)
1. Go to Play Console → Setup → App signing
2. Click on "Upload key certificate"
3. Click "Request upload key reset"
4. Follow Google's instructions

### Option 2: Contact Google Play Support
- Explain that you lost your upload key
- Provide proof of app ownership
- They may help you reset it (complex process)

### Option 3: Create New App Listing (Last Resort)
- This requires changing your package name
- You'll lose all existing users and download history
- Not recommended unless absolutely necessary

## Prevention for Future

1. **Backup your keystore** in a secure location (password manager, encrypted drive)
2. **Document keystore details** (alias, passwords) in a secure password manager
3. **Enable Google Play App Signing** to allow upload key resets
4. **Store keystore** in version control (encrypted) or secure cloud storage
