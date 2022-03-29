#!/bin/sh

# Decrypt the file
mkdir $HOME/secrets
# --batch to prevent interactive command --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$PASS" \
--output $HOME/secrets/settings.json settings.json.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$PASS" \
--output $HOME/secrets/token.json token.json.gpg
