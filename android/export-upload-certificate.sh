#!/bin/bash

# Script to export the upload certificate for Google Play Console
# This certificate is needed when requesting an upload key reset

KEYSTORE_NAME="waseela-upload-key.keystore"
KEY_ALIAS="waseela-upload-key"
CERTIFICATE_FILE="upload_certificate.pem"

echo "Exporting upload certificate for Google Play Console"
echo "===================================================="
echo ""

if [ ! -f "$KEYSTORE_NAME" ]; then
    echo "Error: Keystore file '$KEYSTORE_NAME' not found"
    echo "Please create the keystore first using create-new-upload-key.sh"
    exit 1
fi

read -sp "Enter keystore password: " KEYSTORE_PASSWORD
echo ""

# Export certificate
keytool -export -rfc -keystore "$KEYSTORE_NAME" -alias "$KEY_ALIAS" \
    -file "$CERTIFICATE_FILE" -storepass "$KEYSTORE_PASSWORD"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Certificate exported successfully!"
    echo ""
    echo "Certificate file: $CERTIFICATE_FILE"
    echo ""
    echo "This certificate file should be uploaded to Google Play Console when requesting an upload key reset."
    echo ""
    echo "To view the certificate details:"
    echo "  keytool -printcert -file $CERTIFICATE_FILE"
else
    echo ""
    echo "✗ Failed to export certificate"
    exit 1
fi
