#!/bin/bash

# Script to check keystore SHA1 fingerprint
# Usage: ./check-keystore.sh <keystore-path> <alias> <store-password> <key-password>

KEYSTORE=$1
ALIAS=$2
STORE_PASS=$3
KEY_PASS=$4

if [ -z "$KEYSTORE" ] || [ -z "$ALIAS" ] || [ -z "$STORE_PASS" ] || [ -z "$KEY_PASS" ]; then
    echo "Usage: ./check-keystore.sh <keystore-path> <alias> <store-password> <key-password>"
    exit 1
fi

echo "Checking keystore: $KEYSTORE"
echo "Alias: $ALIAS"
echo ""

keytool -list -v -keystore "$KEYSTORE" -alias "$ALIAS" -storepass "$STORE_PASS" -keypass "$KEY_PASS" | grep -A 2 "Certificate fingerprints"

echo ""
echo "Expected SHA1: 33:E7:37:BD:F5:D2:AD:AC:57:DD:45:52:55:49:B7:61:20:E6:D4:96"
echo "Uploaded SHA1: 4F:31:0A:FF:96:CF:AC:B1:05:C0:21:13:18:6D:C3:1C:CE:B1:DE:82"
