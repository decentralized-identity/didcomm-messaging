## Message Signing

A DIDComm message can be signed, either in conjunction with encryption or independently if the message will remain unencrypted.

If a message is signed and encrypted to add non-repudiation, it must be signed prior to encryption. This is known as a [nested JWM](https://tools.ietf.org/html/draft-looker-jwm-01#section-1.2).

### Algorithms

When a sender would like for a message to feature a non-repudiable digital signature the JWA's defined below can be used within the structure of a JWS.

For digital signatures the following algorithms MUST be verifiable. At least one of the following curves MUST be supported for creating digital signatures.

| Algorithm(JWA)           | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| EdDSA (with crv=Ed25519) | Elliptic curve digital signature with edwards curves and SHA-512 |
| ES256                    | Elliptic curve digital signature with NIST p-256 curve and SHA-256 |
| ES256K                   | Elliptic curve digital signature with Secp256k1 keys.        |

### Construction

Construct a JWS with the following header:

```json
   {"typ":"JWM",
    "kid":"Ef1sFuyOozYm3CEY4iCdwqxiSyXZ5Br-eUDdQXk6jaQ",
    "alg":"ES256"}
```

The JWS payload is the Base64url encoded JWM.

When transmitted in a normal JWM fashion, the JSON Serialization MUST be used.

### Verification

When verifying the signature, an additional check must be performed after verifying the JWS. The key used in the signature must be authorized to do so in the Document resolved from the DID in the `from` attribute. If the key is not authorized for the signature, the signature is invalid.

### Application

#### Non-Repudiation

DIDComm Encrypted messages are repudiable. If non-repudiation is required for a particular protocol message, the message MUST be signed before encryption. 

#### Tamper Resistant OOB Messages

Out of Band Messages may be signed to provide tamper resistance.

#### DID Anchoring

Signing can allow DIDs to be anchored via keys not usable for encrypting DIDComm messages.

### Examples

TODO: Add examples here
