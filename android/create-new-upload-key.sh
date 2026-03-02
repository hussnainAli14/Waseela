#!/bin/bash

# Script to create a new upload keystore for Google Play App Signing
# This should only be used if Google Play App Signing is enabled

KEYSTORE_NAME="waseela-upload-key.keystore"
KEY_ALIAS="waseela-upload-key"
KEYSTORE_PASSWORD=""
KEY_PASSWORD=""

echo "Creating new upload keystore for Google Play App Signing"
echo "========================================================"
echo ""

# Prompt for passwords
read -sp "Enter keystore password (min 6 characters): " KEYSTORE_PASSWORD
echo ""
if [ ${#KEYSTORE_PASSWORD} -lt 6 ]; then
    echo "Error: Password must be at least 6 characters"
    exit 1
fi

read -sp "Enter key password (press Enter to use same as keystore): " KEY_PASSWORD
echo ""
if [ -z "$KEY_PASSWORD" ]; then
    KEY_PASSWORD="$KEYSTORE_PASSWORD"
fi

# Create the keystore
keytool -genkeypair -v -storetype PKCS12 -keystore "$KEYSTORE_NAME" -alias "$KEY_ALIAS" \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass "$KEYSTORE_PASSWORD" -keypass "$KEY_PASSWORD" \
    -dname "CN=Waseela, OU=Mobile, O=Waseela, L=City, ST=State, C=US"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Keystore created successfully!"
    echo ""
    echo "Keystore file: $KEYSTORE_NAME"
    echo "Key alias: $KEY_ALIAS"
    echo ""
    echo "Certificate fingerprint (SHA1):"
    keytool -list -v -keystore "$KEYSTORE_NAME" -alias "$KEY_ALIAS" \
        -storepass "$KEYSTORE_PASSWORD" -keypass "$KEY_PASSWORD" | grep "SHA1:" | head -1
    echo ""
    echo "Next steps:"
    echo "1. Save this keystore file and passwords in a secure location"
    echo "2. Go to Google Play Console → Setup → App signing"
    echo "3. Click 'Upload key certificate' → 'Request upload key reset'"
    echo "4. Upload the certificate from this keystore"
    echo "5. Update android/gradle.properties with the new keystore details"
else
    echo ""
    echo "✗ Failed to create keystore"
    exit 1
fi
