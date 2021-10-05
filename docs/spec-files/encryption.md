## Message Encryption

DIDComm supports two types of message encryption: Authenticated Sender Encryption and Anonymous Sender Encryption. Both forms are encrypted to the recipient, but only Authenticated Sender Encryption provides assurances of who the sender is.

The encrypted form of a JWM is a JWE. The JOSE family defines [JSON Web Algorithms](https://tools.ietf.org/html/rfc7518) (JWAs) which standardize certain cryptographic operations that are related to preparing JOSE structures. For the purposes of interoperability, DIDComm messaging does not support all JWAs, rather it takes a subset of the supported algorithms that are applicable for the following cases around secure messaging. These supported algorithms are listed here.

### Sender Authenticated Encryption

For an encrypted DIDComm Message, the JWA of `ECDH-1PU` defined by [draft](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-04) MUST be used within the structure of a JWE.

### Anonymous Encryption

When a sender would like to encrypt a message for a recipient or multiple recipients but not be authenticated by the recipients as the party who encrypted the message, the JWA of `ECDH-ES` defined by [RFC 7518](https://tools.ietf.org/html/rfc7518#section-4.6) SHOULD be used within the structure of a JWE.

Anonymous Encryption removes authenticated encryption, a significant benefit of the DIDComm specification. Use of Anonymous Encryption SHOULD NOT be paired with a method of message authentication other than Authenticated Encryption as defined in this specification. Further discussion of message authentication can be found in the Implementation Guide.

### Curves and Content Encryption Algorithms

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

### Key Wrapping Algorithms

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

### Perfect Forward Secrecy

A cryptographic method exhibits perfect forward secrecy (PFS) if the compromise of long-term keys does not allow an attacker to read old messages. The secrecy of the old messages persists forward in time. See [the Wikipedia article](https://en.wikipedia.org/wiki/Forward_secrecy). *This property is valuable to the extent that comm channels are long-lasting and carry many interactions.*

Whether DIDComm exhibits this property depends on how we define the concept of "long-term keys" and "session keys" with respect to DIDComm. The answer is not obvious, since DIDComm lacks a session construct. 

In TLS, session keys are symmetric keys negotiated during a Diffie-Hellman handshake at the beginning of a [series of request-response interactions that cluster together](https://www.cloudflare.com/learning/ssl/what-is-a-session-key/). Browsers running HTTPS &mdash; the most familiar embodiment of TLS &mdash; typically do a new DH exchange each time a tab is opened to a site's initial page, but not for subsequent requests to fetch graphics, scripts, CSS files, or the content and collateral of subsequent pages. Cryptographic sessions (not to be confused with cookie-based login sessions) may be re-established whenever a socket is re-opened (possibly at intervals only a few seconds apart), or may use techniques like [TLS Session Resumption](https://www.venafi.com/blog/tls-session-resumption) to last for hours or even days.  

A simple analysis of DIDComm might map PFS "session keys" to the ephemeral symmetric keys negotiated by the ECDH-1PU key agreement algorithm; this might imply that the static keys in Alice's DID doc would be the "long-term keys" from the PFS definition. In this framing, DIDComm does NOT exhibit PFS, because an attacker that possesses a key from Alice's DID doc can decrypt any old messages sent to that key.

But this analysis misses two important insights:

1. The ephemeral symmetric keys in TLS are two-way and reusable. It makes sense to call them "session" keys. In contrast, the ephemeral symmetric keys negotiated by ECDH-1PU in DIDComm are one-way and single-use only. Calling a one-way delivery of a single message a "session" seems a bit odd. The natural unit of clustered interaction in DIDComm &mdash; what we use "sessions" for in TLS, and what lasts seconds to minutes or hours &mdash; is a single protocol or group of protocols that accomplish one goal for the parties. This is a higher level of abstraction that a single DIDComm message.

2. Only one compromise is contemplated by normal PFS &mdash; the compromise of a single long-term key. But DIDComm is more dynamic. It supports two types of rotation &mdash; rotation of DID doc keys and rotation of DIDs themselves. Moreover, DIDComm supports multiple devices per party, and it encourages the use of pairwise DIDs with a limited lifespan, often not exceeding a single interaction. It is the *value of historic communication* that makes PFS valuable. If DIDComm throws away DIDs after a single brief interaction, then PFS is irrelevant. If DIDComm rotates DIDs on the same time scales as static key rotation in TLS, then it is a *DID's* comm history, not *Alice's* (DID-spanning) comm history, that's endangered by a compromise. And if Alice has a stable DID but updates her DID doc regularly to track an evolving collection of devices, then her vulnerability to long-term key compromise doesn't map very well to the simpler PFS model.

Here is an alternate analysis of DIDComm's PFS features: "sessions" have the same scope as DIDs, and "long-term keys" have the same scope as a multi-DID-spanning connection between two parties. A compromise of the second "long-term key" (DID and associated keys for all her devices) used by Alice in her relationship with Bob allows an attacker to read everything sent to Alice in *that session* (while she was using DID #2). However, it doesn't let the attacker read anything sent to Alice in the previous sessions (with previous DID values). DIDComm thus exhibits perfect forward secrecy.

Here is another alternate analysis: "sessions" have the same scope as a single snapshot of the key agreement keys in a DID doc, and "long-term keys" are the signing keys that authorize updates to a new set of key agreement keys. A compromise of long-term keys does not allow the attacker to decrypt any historical communication at all. DIDComm thus exhibits perfect forward secrecy.

The point here is not to argue that the alternate analysis is true. Rather, it is to highlight the importance of assumptions. What is the lifespan of a DID? How often are its keys rotated &mdash; and with what purposes? DIDComm allows various answers to these questions; depending on the answers, it may or may not provide enough built-in protection of old communication at the point of a future compromise. To achieve the same post-compromise safety as perfect forward secrecy, enforce safe assumptions.   

### Key IDs `kid` and `skid` headers references in the DID document

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

Unless previously coordinated in a layer above DIDComm, the default recipients of the envelope MUST include all the `KeyAgreement` entries, representing Bob. The corresponding `kid` header for this recipient MUST have a DID URL pointing to a corresponding verification method in the DID document. This verification method MUST be associated with the `KeyAgreement` verification relationship and the verification material MUST be retrieved from the DID document to execute the ECDH-1PU key derivation for content key wrapping.

When Bob receives the envelope, the unpacking process on his end MUST resolve the `skid` protected header value using Alice's DID doc's `KeyAgreement[0]` in order to extract her public key. In Alice's DID Doc example above, `KeyAgreement[0]` is a reference id, it MUST be resolved from the main `VerificationMethod[]` of Alice's DID document (not shown in the example).

Once resolved, the unpacker will then execute ECDH-1PU key derivation using this key and Bob's own recipient key found in the envelope's `recipients[0]` to unwrap the content encryption key.

### Protecting the Sender Identity

When employing authenticated encryption, the header of the encrypted message envelope must necessarily reveal the key identifier used by the sender of the message (the `skid`). This is used by recipients to resolve the sender's public key material in order to decrypt the message. In the case of communication between two public DIDs, this may allow outside parties to directly correlate the sender of an encrypted message to a known identity.

If two communicating parties establish single-purpose DIDs (peer DIDs) for secure communication, then the correlation to any publicly known identities may be limited, although multiple messages referencing the same DIDs will still provide an opportunity for correlation.

A layer of anonymous encryption (employing ECDH-ES) may be applied around an authenticated encryption envelope (employing ECDH-1PU), obscuring the sender's identity for all but the recipient of the inner envelope. In the case of a message forwarded via mediators, anonymous encryption is automatic.

### ECDH-1PU key wrapping and common protected headers
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

### Examples

While the details of encrypting a JWM into a JWE are included in the [JWM spec](https://tools.ietf.org/html/draft-looker-jwm-01), a few examples are included here for clarity.

TODO: Add examples here