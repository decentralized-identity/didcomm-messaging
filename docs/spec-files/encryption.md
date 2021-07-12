# Message Encryption

DIDComm supports two types of message encryption: Authenticated Sender Encryption and Anonymous Sender Encryption. Both forms are encrypted to the recipient, but only Authenticated Sender Encryption provides assurances of who the sender is.

The encrypted form of a JWM is a JWE. The JOSE family defines [JSON Web Algorithms](https://tools.ietf.org/html/rfc7518) (JWAs) which standardize certain cryptographic operations that are related to preparing JOSE structures. For the purposes of interoperability, DIDComm messaging does not support all JWAs, rather it takes a subset of the supported algorithms that are applicable for the following cases around secure messaging. These supported algorithms are listed here.

## Sender Authenticated Encryption

For an encrypted DIDComm Message, the JWA of `ECDH-1PU` defined by [draft](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-04) MUST be used within the structure of a JWE.

## Anonymous Encryption

When a sender would like to encrypt a message for a recipient or multiple recipients but not be authenticated by the recipients as the party who encrypted the message, the JWA of `ECDH-ES` defined by [RFC 7518](https://tools.ietf.org/html/rfc7518#section-4.6) SHOULD be used within the structure of a JWE.

Anonymous Encryption removes authenticated encryption, a significant benefit of the DIDComm specification. Use of Anonymous Encryption SHOULD NOT be paired with a method of message authentication other than Authenticated Encryption as defined in this specification. Further discussion of message authentication can be found in the Implementation Guide.

## Curves and Content Encryption Algorithms

For the keys involved in key agreement, the following elliptic curves MUST be supported.

| Curve  | Description                                                  |
| ------ | ------------------------------------------------------------ |
| X25519 | The underlying curve is actually `Curve25519`, however when used in the context of Diffie-Hellman the identifier of `X25519` is used |
| P-384  | NIST defined P-384 elliptic curve                            |
| P-256  | NIST defined P-256 elliptic curve - deprecated in favor of P-384 |

For content encryption of the message, the following algorithms MUST be supported.

| Algorithm(JWA) | Description                | Authcrypt/Anoncrypt            |
| -------------- | -------------------------- |------------------------------- |
| XC20P          | XChaCha20Poly1305 with a 256 bit key | Anoncrypt |
| A256GCM        | AES256-GCM with a 256 bit key | Anoncrypt |
| A256CBC-HS512  | AES256-CBC + HMAC-SHA512 with a 512 bit key | Authcrypt/Anoncrypt |

TODO: Include language about safe nonce considerations.

## Key Wrapping Algorithms

| KW Algorithm    | Curve (epk crv) | key type (epk kty) | Description                                                  |
| --------------- | --------------- | ------------------ | ------------------------------------------------------------ |
| ECDH-ES+A256KW  | P-256           | EC                 | ECDH-ES key wrapping using key with NIST defined P-256 elliptic curve to create a 256 bits key as defined in [7518](https://tools.ietf.org/html/rfc7518#section-4.6.2)                                                                                  |
| ECDH-ES+A256KW  | P-384           | EC                 | ECDH-ES key wrapping using key with NIST defined P-384 elliptic curve to create a 256 bits key as defined in [7518](https://tools.ietf.org/html/rfc7518#section-4.6.2)                                                                                  |
| ECDH-ES+A256KW  | P-521           | EC                 | ECDH-ES key wrapping using key with NIST defined P-521 elliptic curve to create a 256 bits key as defined in [7518](https://tools.ietf.org/html/rfc7518#section-4.6.2)                                                                                  |
| ECDH-ES+A256KW  | X25519          | OKP                | ECDH-ES with X25519 ([RFC7748 section 5](https://tools.ietf.org/html/rfc7748#section-5)) to create a 256 bits key. The underlying curve is actually `Curve25519`, however when used in the context of Diffie-Hellman the identifier of `X25519` is used |
| ECDH-1PU+A256KW | P-256           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-256 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-04#section-2) |
| ECDH-1PU+A256KW | P-384           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-384 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-04#section-2) |
| ECDH-1PU+A256KW | P-521           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-521 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-04#section-2) |
| ECDH-1PU+A256KW | X25519          | OKP                | ECDH-1PU X25519 ([RFC7748 section 5](https://tools.ietf.org/html/rfc7748#section-5)) to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-04#section-2) |

## Perfect Forward Secrecy

Due to the triple Key Derivation algorithm used in ECDH-1PU, all messages sent via DIDComm have weak perfect forward secrecy without any additional security added by the transport layer. In ECDH-1PU this is achieved by encrypting the content encryption key with the output of the hash of the Ze (ECDH of ephemeral key and recipient static key) and Zs (ECDH of static sender key and recipient static key). With Ze bringing the changed derived secret in each message and Zs bringing the repudiable authenticity of each message, the resulting Z (hash of Ze and Zs) carries the properties of weak perfect forward secrecy and repudiable authenticity for each message as well.

## Key IDs `kid` and `skid` headers references in the DID document

Keys used by DIDComm envelopes MUST be sourced from the DIDs exchanged between two agents. Specifically, both sender and recipients keys MUST be retrieved from the DID document's `KeyAgreement` verification section as per the [DID Document Keys](https://identity.foundation/didcomm-messaging/spec/#did-document-keys) definition.

When Alice is preparing an envelope intended for Bob, the packing process should use a key from both hers and Bob's DID document's `KeyAgreement` section.

Assuming Alice has a DID Doc with the following `KeyAgreement` definition (source: [DID V1 Example 17](https://www.w3.org/TR/did-core/#example-17-key-agreement-property-containing-two-verification-methods)):
```jsonc
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:123456789abcdefghi",
  ...
  "keyAgreement": [
    // this method can be used to perform key agreement as did:...fghi
    "did:example:123456789abcdefghi#keys-1",
    // this method is *only* approved for key agreement usage, it will not
    // be used for any other verification relationship, so its full description is
    // embedded here rather than using only a reference
    {
      "id": "did:example:123#zC9ByQ8aJs8vrNXyDhPHHNNMSHPcaSgNpjjsBYpMMjsTdS",
      "type": "X25519KeyAgreementKey2019", // external (property value)
      "controller": "did:example:123",
      "publicKeyBase58": "9hFgmPVfmBZwRvFEyniQDBkz9LmV7gDEqytWyGZLmDXE"
    }
  ],
  ...
}
```

The envelope packing process MUST set the `skid` header with value `did:example:123456789abcdefghi#keys-1` in the envelope's protected headers and fetch the underlying key to execute ECDH-1PU key derivation for content key wrapping.

Assuming she also has Bob's DID document which happens to include the following `KeyAgreement` section:

```jsonc
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:jklmnopqrstuvwxyz1",
  ...
  "keyAgreement": [
    {
      "id": "did:example:jklmnopqrstuvwxyz1#key-1",
      "type": "X25519KeyAgreementKey2019", // external (property value)
      "controller": "did:example:jklmnopqrstuvwxyz1",
      "publicKeyBase58": "9hFgmPVfmBZwRvFEyniQDBkz9LmV7gDEqytWyGZLmDXE"
    }
  ],
  ...
}
```

There should be only 1 entry in the recipients of the envelope, representing Bob. The corresponding `kid` header for this recipient MUST have `did:example:jklmnopqrstuvwxyz1#key-1` as value. The packing process MUST extract the public key bytes found in `publicKeyBase58` of Bob's DID Doc `KeyAgreement[0]` to execute the ECDH-1PU key derivation for content key wrapping.

When Bob receives the envelope, the unpacking process on his end MUST resolve the `skid` protected header value using Alice's DID doc's `KeyAgreement[0]` in order to extract her public key. In Alice's DID Doc example above, `KeyAgreement[0]` is a reference id, it MUST be resolved from the main `VerificationMethod[]` of Alice's DID document (not shown in the example).

Once resolved, the unpacker will then execute ECDH-1PU key derivation using this key and Bob's own recipient key found in the envelope's `recipients[0]` to unwrap the content encryption key.

## Protecting the `skid` header
When the `skid` cannot be revealed in a plain-text JWE header (to avoid potentially leaking sender's key id), the `skid` MAY be encrypted for each recipient. In this case, instead of having a `skid` protected header in the envelope, each recipient MAY include an `encrypted_skid` header with a value based on the encryption of `skid` using ECDH-ES `Z` computation of the `epk` and the recipient's key as the encryption key.

For applications that don't require this protection, they MAY use `skid` protected header directly without any additional recipient headers.

Applications MUST use either `skid` protected header or `encrypted_skid` recipients header but not both in the same envelope.

## ECDH-1PU key wrapping and common protected headers
When using authcrypt, the 1PU draft [requires](https://datatracker.ietf.org/doc/html/draft-madden-jose-ecdh-1pu-04#section-2.1) mandates the use of AES_CBC_HMAC_SHA family of content encryption algorithms. To meet this requirement, JWE messages MUST use common `epk`, `apu`, `apv` and `alg` headers for all recipients. They MUST be set in the `protected` headers JWE section.

As per this requirement, the JWE building must first encrypt the payload then use the resulting `tag` as part of the key derivation process when wrapping the `cek`.

To meet this requirement, the above headers must be defined as follows:
* `epk`: generated once for all recipients. It MUST be of the same type and curve as all recipient keys since kdf with the sender key must be on the same curve.
  - Example: `"epk": {"kty": "EC","crv": "P-256","x": "BVDo69QfyXAdl6fbK6-QBYIsxv0CsNMtuDDVpMKgDYs","y": "G6bdoO2xblPHrKsAhef1dumrc0sChwyg7yTtTcfygHA"}`
* `apu`: similar to `skid`, this is the producer (sender) identifier, it MUST contain the `skid` value base64 RawURL (no padding) encoded. Note: this is base64URL(`skid` value).
  - Example for `skid` mentioned in an earlier [section](#key-ids-kid-and-skid-headers-references-in-the-did-document) above: `ZGlkOmV4YW1wbGU6MTIzNDU2Nzg5YWJjZGVmZ2hpI2tleXMtMQ`
* `apv`: this represents the recipients' `kid` list. The list must be alphanumerically sorted, `kid` values will then be concatenated with a `.` and the final result MUST be base64 URL (no padding) encoding of the SHA256 hash of concatenated list.
* `alg`: this is the key wrapping algorithm, ie: `ECDH-1PU+A256KW`.

A final note about `skid` header: since the 1PU draft [does not require](https://datatracker.ietf.org/doc/html/draft-madden-jose-ecdh-1pu-04#section-2.2.1) this header, authcrypt implementations MUST be able to resolve the sender kid from the `APU` header if `skid` is not set.

## Examples

While the details of encrypting a JWM into a JWE are included in the [JWM spec](https://tools.ietf.org/html/draft-looker-jwm-01), a few examples are included here for clarity.

TODO: Add examples here