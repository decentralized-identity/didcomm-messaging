## Security

### Message Encryption

DIDComm Messages are encrypted with the keys of a single DID. A message being sent to multiple DIDs MUST be encrypted for each DID independently. If a single DID has multiple key types, the keys of each type must be used in a separate encryption of the message. 

DIDComm supports two types of message encryption: Authenticated Sender Encryption ("authcrypt") and Anonymous Sender Encryption ("anoncrypt"). Both forms are encrypted to the recipient DID. Only authcrypt provides direct assurances of who the sender is.

The encrypted form of a JWM is a JWE. The JOSE family defines [JSON Web Algorithms](https://tools.ietf.org/html/rfc7518) (JWAs) which standardize certain cryptographic operations that are related to preparing JOSE structures. For the purposes of interoperability, DIDComm messaging does not support all JWAs; rather, it takes a subset of the supported algorithms that are applicable for the following cases around secure messaging. These supported algorithms are listed here.

#### Sender Authenticated Encryption

For an encrypted DIDComm message, the JWA of [ECDH-1PU](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-04) MUST be used within the structure of a JWE.

#### Anonymous Encryption

When a sender would like to encrypt a message for a recipient DID or multiple recipient DIDs but not be authenticated by the recipients, the JWA of `ECDH-ES` defined by [RFC 7518](https://tools.ietf.org/html/rfc7518#section-4.6) SHOULD be used within the structure of a JWE.

Anonymous encryption removes authentication of the sender, which is a significant benefit of DIDComm Messaging; it may make sense, but should only be done thoughtfully, when the context of the use case justifies it. Pairing anonymous encryption with a method of message authentication other than authcrypt as defined in this specification is not generally recommended, as it may have unintended side effects. In particular, a signed message that is anonymously encrypted accomplishes authentication, but loses the repudiability of authcrypt. Further discussion of message authentication can be found in the [DIDComm Guidebook](https://didcomm.org/book/v2).

#### Curves and Content Encryption Algorithms

For the keys involved in key agreement, the following elliptic curves MUST be supported.

| Curve  | Description                                                  |
| ------ | ------------------------------------------------------------ |
| X25519 | The underlying curve is actually `Curve25519`, however when used in the context of Diffie-Hellman the identifier of `X25519` is used |
| P-384  | NIST defined P-384 elliptic curve                            |
| P-256  | NIST defined P-256 elliptic curve - deprecated in favor of P-384 |

For content encryption of the message, DIDComm inherits the implementation definitions from [JSON Web Algorithms](https://datatracker.ietf.org/doc/html/rfc7518#section-5.1) for AES 256-bit keys.
In addition, DIDComm defines optional implementation usage of the draft [XC20P](https://tools.ietf.org/id/draft-amringer-jose-chacha-02.html) algorithm.

| Algorithm(JWA) | Description                | Authcrypt/Anoncrypt            | Requirements                   |
| -------------- | -------------------------- |------------------------------- |------------------------------- |
| A256CBC-HS512  | AES256-CBC + HMAC-SHA512 with a 512 bit key | Authcrypt/Anoncrypt | Required |
| A256GCM        | AES256-GCM with a 256 bit key | Anoncrypt | Recommended |
| XC20P          | XChaCha20Poly1305 with a 256 bit key | Anoncrypt | Optional |

Implementations MUST choose nonces securely.

#### Key Wrapping Algorithms

| KW Algorithm    | Curve (epk crv) | key type (epk kty) | Description                                                  |
| --------------- | --------------- | ------------------ | ------------------------------------------------------------ |
| ECDH-ES+A256KW  | P-256           | EC                 | ECDH-ES key wrapping using key with NIST defined P-256 elliptic curve to create a 256 bits key as defined in [RFC 7518](https://tools.ietf.org/html/rfc7518#section-4.6.2)                                                                                  |
| ECDH-ES+A256KW  | P-384           | EC                 | ECDH-ES key wrapping using key with NIST defined P-384 elliptic curve to create a 256 bits key as defined in [RFC 7518](https://tools.ietf.org/html/rfc7518#section-4.6.2)                                                                                  |
| ECDH-ES+A256KW  | P-521           | EC                 | ECDH-ES key wrapping using key with NIST defined P-521 elliptic curve to create a 256 bits key as defined in [RFC 7518](https://tools.ietf.org/html/rfc7518#section-4.6.2)                                                                                  |
| ECDH-ES+A256KW  | X25519          | OKP                | ECDH-ES with X25519 ([RFC 7748 section 5](https://tools.ietf.org/html/rfc7748#section-5)) to create a 256 bits key. The underlying curve is actually `Curve25519`, however when used in the context of Diffie-Hellman the identifier of `X25519` is used |
| ECDH-1PU+A256KW | P-256           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-256 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-04#section-2) |
| ECDH-1PU+A256KW | P-384           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-384 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-04#section-2) |
| ECDH-1PU+A256KW | P-521           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-521 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-04#section-2) |
| ECDH-1PU+A256KW | X25519          | OKP                | ECDH-1PU X25519 ([RFC7748 section 5](https://tools.ietf.org/html/rfc7748#section-5)) to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-04#section-2) |

#### Perfect Forward Secrecy

The mapping of the Perfect Forward Secrecy concepts to DIDComm requires some discussion, due to the lack of a session construct. Please refer to the [DIDComm Guidebook](https://didcomm.org/book/v2/pfs) for details.

#### Man in the Middle

DIDComm Messaging's guarantees with respect to man-in-the-middle attacks are easily misunderstood, since DIDs rather than human identity are the concern of the algorithm. Please refer to the [DIDComm Guidebook](https://didcomm.org/book/v2/mitm) for details.

#### Key IDs `kid` and `skid` headers references in the DID document

Keys used by DIDComm envelopes MUST be sourced from the DIDs exchanged between two agents. Specifically, both sender and recipient encryption keys MUST be retrieved from the respective DID document's `keyAgreement` verification section as per the [DID Document Keys](https://identity.foundation/didcomm-messaging/spec/#did-document-keys) definition.

When Alice is preparing an envelope intended for Bob, the packing process should use a key from both hers and Bob's DID document's `keyAgreement` section.

Assuming Alice has a DID Doc with the following `keyAgreement` definition (source: [DID V1 Example 17](https://www.w3.org/TR/did-core/#example-17-key-agreement-property-containing-two-verification-methods)):
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

Assuming she also has Bob's DID document which happens to include the following `keyAgreement` section:

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

Unless previously coordinated in a layer above DIDComm, the default recipients of the envelope MUST include all the `keyAgreement` entries representing Bob. This allows Bob to decrypt his messages on any device he controls, without sharing keys. The corresponding `kid` header for this recipient MUST have a DID URL pointing to a corresponding verification method in the DID document. This verification method MUST be associated with the `keyAgreement` verification relationship and the verification material MUST be retrieved from the DID document to execute the ECDH-1PU key derivation for content key wrapping.

When Bob receives the envelope, the unpacking process on his end MUST resolve the `skid` protected header value using Alice's DID doc's `keyAgreement[0]` in order to extract her public key. In Alice's DID Doc example above, `keyAgreement[0]` is a reference id. It MUST be resolved from the main `verificationMethod[]` of Alice's DID document (not shown in the example).

Once resolved, the unpacker will then execute ECDH-1PU key derivation using this key and Bob's own recipient key found in the envelope's `recipients[0]` to unwrap the content encryption key.

#### Protecting the Sender Identity

When employing authenticated encryption, the header of the encrypted message envelope must necessarily reveal the key identifier used by the sender of the message (the `skid`). This is used by recipients to resolve the sender's public key material in order to decrypt the message. In the case of communication between two public DIDs, this may allow outside parties to directly correlate the sender of an encrypted message to a known identity.

If two communicating parties establish single-purpose DIDs (e.g., peer DIDs) for secure communication, then the correlation to any publicly known identities may be limited, although multiple messages referencing the same DIDs will still provide an opportunity for correlation.

A layer of anonymous encryption (employing ECDH-ES) may be applied around an authenticated encryption envelope (employing ECDH-1PU), obscuring the sender's identity for all but the recipient of the inner envelope. In the case of a message forwarded via mediators, anonymous encryption is automatic.

#### ECDH-1PU key wrapping and common protected headers
When using authcrypt, the 1PU draft [mandates](https://datatracker.ietf.org/doc/html/draft-madden-jose-ecdh-1pu-04#section-2.1) the use of the AES_CBC_HMAC_SHA family of content encryption algorithms. To meet this requirement, JWE messages MUST use common `epk`, `apu`, `apv` and `alg` headers for all recipient keys. They MUST be set in the `protected` headers JWE section.

As per this requirement, the JWE building must first encrypt the payload, then use the resulting `tag` as part of the key derivation process when wrapping the `cek`.

To meet this requirement, the above headers are defined as follows:

* `epk`: generated once for all recipient keys. It MUST be of the same type and curve as all recipient keys since kdf with the sender key must be on the same curve.
  - Example: `"epk": {"kty": "EC","crv": "P-256","x": "BVDo69QfyXAdl6fbK6-QBYIsxv0CsNMtuDDVpMKgDYs","y": "G6bdoO2xblPHrKsAhef1dumrc0sChwyg7yTtTcfygHA"}`
* `apu`: similar to `skid`, this is the producer (sender) identifier, it MUST contain the `skid` value base64 RawURL (no padding) encoded. Note: this is base64URL(`skid` value).
  - Example for `skid` mentioned in an earlier [section](#key-ids-kid-and-skid-headers-references-in-the-did-document) above: `ZGlkOmV4YW1wbGU6MTIzNDU2Nzg5YWJjZGVmZ2hpI2tleXMtMQ`
* `apv`: this represents the recipients' `kid` list. The list must be alphanumerically sorted, `kid` values will then be concatenated with a `.` and the final result MUST be base64 URL (no padding) encoding of the SHA256 hash of concatenated list.
* `alg`: this is the key wrapping algorithm, ie: `ECDH-1PU+A256KW`.

A final note about `skid` header: since the 1PU draft [does not require](https://datatracker.ietf.org/doc/html/draft-madden-jose-ecdh-1pu-04#section-2.2.1) this header, authcrypt implementations MUST be able to resolve the sender kid from the `APU` header if `skid` is not set.

#### Examples

While the details of encrypting a JWM into a JWE are included in the [JWM spec](https://tools.ietf.org/html/draft-looker-jwm-01), a few examples are included here for clarity. See section [Appendix C.3](#c3-didcomm-encrypted-messages).
