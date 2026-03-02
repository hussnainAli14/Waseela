#!/bin/bash

# Script to find and check keystore files for the correct SHA1 fingerprint
# Expected SHA1: 33:E7:37:BD:F5:D2:AD:AC:57:DD:45:52:55:49:B7:61:20:E6:D4:96

EXPECTED_SHA1="33:E7:37:BD:F5:D2:AD:AC:57:DD:45:52:55:49:B7:61:20:E6:D4:96"
EXPECTED_SHA1_CLEAN=$(echo "$EXPECTED_SHA1" | tr -d ':')

echo "Searching for keystore files with SHA1: $EXPECTED_SHA1"
echo "=========================================="
echo ""

# Common locations to search
SEARCH_DIRS=(
    "$HOME"
    "$HOME/Documents"
    "$HOME/Desktop"
    "$HOME/Downloads"
    "$HOME/Android"
    "$HOME/.android"
    "$(pwd)"
    "$(pwd)/.."
    "$(pwd)/../.."
)

# Function to check a keystore file
check_keystore() {
    local keystore_file="$1"
    local alias_name="$2"
    local store_pass="$3"
    local key_pass="$4"
    
    if [ ! -f "$keystore_file" ]; then
        return 1
    fi
    
    # Try to get SHA1 fingerprint
    local sha1_output=$(keytool -list -v -keystore "$keystore_file" -alias "$alias_name" -storepass "$store_pass" -keypass "$key_pass" 2>/dev/null | grep "SHA1:" | head -1)
    
    if [ -z "$sha1_output" ]; then
        return 1
    fi
    
    local sha1=$(echo "$sha1_output" | awk '{print $2}' | tr -d ':')
    
    if [ "$sha1" = "$EXPECTED_SHA1_CLEAN" ]; then
        echo "✓ FOUND MATCHING KEYSTORE!"
        echo "  File: $keystore_file"
        echo "  Alias: $alias_name"
        echo "  SHA1: $(echo "$sha1_output" | awk '{print $2}')"
        return 0
    fi
    
    return 1
}

# Search for .keystore and .jks files
echo "Searching for keystore files..."
echo ""

FOUND_FILES=()

for dir in "${SEARCH_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        while IFS= read -r -d '' file; do
            FOUND_FILES+=("$file")
        done < <(find "$dir" -maxdepth 3 -type f \( -name "*.keystore" -o -name "*.jks" \) -print0 2>/dev/null)
    fi
done

if [ ${#FOUND_FILES[@]} -eq 0 ]; then
    echo "No keystore files found in common locations."
    echo ""
    echo "Please check:"
    echo "  1. Backup drives or cloud storage (Dropbox, Google Drive, etc.)"
    echo "  2. Password managers (may have stored the keystore)"
    echo "  3. Team members who might have the original keystore"
    echo "  4. Previous computers or development machines"
    echo ""
    exit 1
fi

echo "Found ${#FOUND_FILES[@]} keystore file(s). Checking fingerprints..."
echo ""

# Common aliases and passwords to try
ALIASES=("my-key-alias" "key0" "upload" "release" "android" "waseela")
PASSWORDS=("123456" "" "android" "password")

MATCH_FOUND=false

for keystore in "${FOUND_FILES[@]}"; do
    echo "Checking: $keystore"
    
    for alias in "${ALIASES[@]}"; do
        for store_pass in "${PASSWORDS[@]}"; do
            for key_pass in "${PASSWORDS[@]}"; do
                if check_keystore "$keystore" "$alias" "$store_pass" "$key_pass"; then
                    MATCH_FOUND=true
                    echo ""
                    echo "To use this keystore, update android/gradle.properties with:"
                    echo "  MYAPP_UPLOAD_STORE_FILE=$(realpath "$keystore" 2>/dev/null || echo "$keystore")"
                    echo "  MYAPP_UPLOAD_KEY_ALIAS=$alias"
                    echo "  MYAPP_UPLOAD_STORE_PASSWORD=$store_pass"
                    echo "  MYAPP_UPLOAD_KEY_PASSWORD=$key_pass"
                    echo ""
                    exit 0
                fi
            done
        done
    done
done

if [ "$MATCH_FOUND" = false ]; then
    echo ""
    echo "✗ No matching keystore found with the expected SHA1 fingerprint."
    echo ""
    echo "If you cannot find the original keystore, you have these options:"
    echo ""
    echo "1. CONTACT GOOGLE PLAY SUPPORT:"
    echo "   - Request a key reset (this is a complex process)"
    echo "   - You'll need to prove ownership of the app"
    echo ""
    echo "2. CREATE A NEW APP LISTING:"
    echo "   - This means starting fresh with a new package name"
    echo "   - You'll lose existing users and download history"
    echo ""
    echo "3. CHECK GOOGLE PLAY CONSOLE:"
    echo "   - Go to: Play Console > Setup > App signing"
    echo "   - Check if Google Play App Signing is enabled"
    echo "   - If enabled, you might be able to use a different upload key"
    exit 1
fi
