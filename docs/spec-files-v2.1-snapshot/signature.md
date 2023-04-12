### Message Signing

A DIDComm message can be signed, either in conjunction with encryption, or independently (e.g., if the message will remain unencrypted).

If a message is signed and encrypted to add non-repudiation, it MUST be signed prior to encryption. This is known as a [nested JWM](https://tools.ietf.org/html/draft-looker-jwm-01#section-1.2).

#### Algorithms

When a sender would like for a message to feature a non-repudiable digital signature, the JWAs defined below can be used within the structure of a JWS.

Implementations MUST be able to verify all of the following algorithms and MUST support signing with at least one.

| Algorithm(JWA)           | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| EdDSA (with crv=Ed25519) | Elliptic curve digital signature with Edwards curves and SHA-512 |
| ES256                    | Elliptic curve digital signature with NIST p-256 curve and SHA-256 (deprecated) |
| ES256K                   | Elliptic curve digital signature with Secp256k1 keys.        |

#### Construction

Construct a JWS with a header like the following (substituting an appropriate `kid` value that encodes a key from the [`authentication` section of the signer's DID document](https://www.w3.org/TR/did-core/#authentication)):

```json
   {"typ":"JWM",
    "kid":"did:example:123#DhPHHNNMSHPcaSgNpjjsBYpMMjsTdSzC9ByQ8aJs8vrNXy",
    "alg":"ES256"}
```

The `kid` MUST be a DID URI that refers to a key specified as an authorization key.

The JWS payload (not shown above) is the Base64url encoded JWM.

When transmitted in a normal JWM fashion, the JSON Serialization MUST be used. Either the General or Flattened form of a JWS is valid. Message recipients MUST be able to process both forms. Message senders using signed messages MAY use either form. Flatted form is sufficient, as only the message sender's signature is valid, and a single signature may be fully represented in flattened form.

#### Verification

When verifying the signature, an additional check must be performed (ideally, before verifying the JWS). The key used in the signature must be authorized to authenticate the sender by appearing in the `authentication` section of the document resolved from the DID in the `from` attribute. If this check fails, the signature is inappropriate and MUST be rejected, regardless of its cryptographic correctness.

#### Uses of Signatures

* Non-Repudiation: DIDComm Encrypted messages are repudiable. If non-repudiation is required for a particular protocol message, the message MUST be signed before encryption. 

* Tamper Resistance: Messages that are shared without encrypting (e.g., [Out of Band Invitations](#invitation)) may be signed to provide tamper resistance.

* DID Anchoring: Some types of cryptographic keys support signing but not encrypting. Signed DIDComm messages allow the use of DIDs that are controlled with such keys.

See section [Appendix C.2.](#c2-didcomm-signed-messages) for examples.

### DID Rotation

DIDComm Messaging is based on [DIDs](https://www.w3.org/TR/did-core/) and their associated [DID Documents](https://www.w3.org/TR/did-core/#dfn-did-documents). Changes to keys and endpoints are the concern of each DID method and are utilized but not managed by DIDComm Messaging. DID Rotation serves a very specific and narrow need to switch from one DID method to another. This is very common at the beginning of a new DIDComm Messaging relationship when a public DID or a temporary DID passed unencrypted is rotated out for a DID chosen for the relationship. As rotation between one DID and another is outside the scope of any DID method, the details of DID Rotation are handled within DIDComm Messaging itself.

A DID is rotated by sending a message of any type to the recipient to be notified of the rotation. The message MUST be encrypted, MUST use the new DID, and MUST include one additional attribute as a message header:

- **from_prior**: REQUIRED. A JWT, with `sub`: new DID and `iss`: prior DID, with a signature from a key authorized by prior DID. Standard [JWT](https://datatracker.ietf.org/doc/html/rfc7519) Practices for creating and signing the JWT MUST be followed.

Care should be taken when choosing when to rotate from one DID to another. The timing of the rotation may cause some lost messages if messages are arriving rapidly. Coordination must also be made with other agents representing the same DID. Rotating at the very beginning of a relationship or during a quiet period in communication is optimal.

When a message is received from an unknown DID, the recipient SHOULD check for existence of the `from_prior` header. The JWT in the`from_prior` attribute is used to extract the prior DID (`iss`) and is checked to verify the validity of the rotation. The recipient then associates the message with context related to the known sender. The new DID and associated DID Document information MUST be used for further communication. The asynchronous and best-effort nature of DIDComm Messaging MAY result in a message sent prior to the rotation being received after the rotation. The message recipient MUST ignore those messages to lower security risk in the case of rotation from a potentially compromised key.

The validity of the DID Rotation is verified by checking the JWT signature against the key indicated in the `kid` header parameter. The indicated key MUST be authorized in the DID Document of the prior DID (`iss`).

The `from_prior` attribute MUST be included in messages sent until the party rotating receives a message sent to the new DID. After the first rotation header is processed, the `from` header no longer contains an unknown DID on subsequent messages. As such, no further processing of the `from_prior` header is necessary; the header may then be ignored.

#### JWT Details

The JWT used in the `from_prior` header is constructed as follows, with appropriate values changed.

**Header**:

```json
{
  "typ": "JWT",
  "alg": "EdDSA",
  "crv": "ED25519",
  "kid": "<key id authorized in prior DID>"
}
```

**Payload**:

The Issued At (`iat`) JWT property MUST be the datetime of the DID rotation, not of the message being sent.

```jsonc
{
  "sub": "<new DID URI>",
  "iss": "<prior DID URI>",
  "iat": 1516239022 
}
```

#### Example Message Rotating DID

```json
{
  "id": "1234567890",
  "type": "<message-type-uri>",
  "from": "did:example:alice2",
  "from_prior": "<JWT with sub:did:example:alice2 and iss:did:example:alice>",
  "to": ["did:example:bob"],
  "created_time": 1516269022,
  "expires_time": 1516385931,
  "body": {
    "messagespecificattribute": "and its value"
  }
}
```

#### Rotation Limitations

- This rotation method does not cover cases where a multi-sig is required. Rotations with such requirements should use a more expressive protocol.

- This rotation method only supports the case where a new [DID](https://www.w3.org/TR/did-core/) is used, replacing an old DID which is no longer used within the relationship. Adjustments to DIDs used between different parties that does not fit this narrow use are expected to define a separate protocol to do so. Updates to the already known DID SHOULD use an update to the associated DID Document to convey that information.

#### Ending a Relationship

A relationship may be ended by rotating the DID used in the relationship to nothing. This works the same way as described above, with the following differences:

- Omit 'sub' in the `from_prior` JWT.
- Send the message without a `from` attribute of the message.
