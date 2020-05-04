# DIDComm Messaging

DIDComm messaging, is a secure messaging protocol built atop of [decentralized identifiers](https://w3c.github.io/did-core/). DIDComm messages are JSON based leveraging the secure messaging format of JWM (JSON Web Message) which is a [IETF draft](https://github.com/mattrglobal/jwm) to expand the [JOSE](https://datatracker.ietf.org/group/jose/documents/) (Javascript object signing and encryption) family of specifications for the purposes of secure messaging.

## Terminology

**Message Payload** In reference to JWMs, `message payload` refers to the [JWM Attribute Set](https://tools.ietf.org/html/draft-looker-jwm-01#section-1.2).

## JWM Profile

The following section defines a JWM profile for DIDComm messages. This profile defines the usage of the JWM attributes defined by the [specification](https://tools.ietf.org/html/draft-looker-jwm-01#section-3.1) as well as defines some attributes that are unique to DIDComm messaging.

- **id** - REQUIRED. Message ID. The `id` attribute value MUST be assigned in a manner that ensures that there is a negligible probability that the same value will be accidentally assigned to another DIDComm message.
- **type** - REQUIRED. Message Type. The `type` attribute value MUST be a valid [MTURI](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0003-protocols/uris.md#mturi), that when resolved gives human readable information about the message. The attributes value also informs the content of the message, for example the presence of other attributes and how they should be processed.
- **to** - OPTIONAL. Recipient(s) identifier. The `to` attribute MUST be an array of strings where each element is a valid [DID](https://w3c.github.io/did-core/#generic-did-syntax) which identifies the recipients of the message.
- **from** - OPTIONAL. Sender identifier. The `from` attribute MUST be a string that is a valid [DID](https://w3c.github.io/did-core/#generic-did-syntax) which identifies the sender of the message.
- **reply_url** - OPTIONAL. Reply url. The `reply_url` attribute value MUST be a string that is a valid [URL](https://tools.ietf.org/html/rfc3986) which identifies where the sender wishes the recipient(s) to send a reply.
- **reply_to** - OPTIONAL. Reply to. The `reply_to` attribute value MUST be an array of strings where each element is a valid [DID URL](https://w3c.github.io/did-core/#generic-did-syntax) which identifies the recipients of the reply to the message.
- **created_time** - OPTIONAL. Message Created Time. The `created_time` attribute is used for the sender to express when they created the message.
- **expires_time** - OPTIONAL. Message Expired Time. The `expires_time` attribute is used for the sender to express when they consider the message to be expired.

### Example JWM Message Payload

```
{
    "id":"ef5a7369-f0b9-4143-a49d-2b9c7ee51117",
    "type":"https://didcomm.org/didexchange/1.0/invitation",
    "from":"did:example:12345912948",
    "expires_time":1516239022,
    "created_time":1516269022,
    "reply_url": "https://agents-r-us.com/12345",
}
```

## Usage of JOSE headers

### Key Identifier (kid)

Usage of this field is REQUIRED, the value used in this field should be a valid [DID URL](https://w3c.github.io/did-core/#generic-did-syntax) which identifies the key(s) required to either decrypt and or verify a message.

Example `did:example:123#key1`

## JWA Usage

The JOSE family defines [JSON Web Algorithms](https://tools.ietf.org/html/rfc7518) (JWAs) which standardize certain cryptographic operations that are related to preparing JOSE structures. For the purposes of interoperability, DIDComm messaging does not support all JWAs, rather it takes a subset of the supported algorithms that are applicable for the following cases around secure messaging.

### Sender Authenticated Encryption

When a sender would like to encrypt a message for a recipient or multiple recipients and also be authenticated such that the recipients can determine they were the party that encrypted the message, the JWA of `ECDH-1PU` defined by [draft](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-02) SHOULD be used within the structure of a JWE. 

For the keys involved in key agreement, the following elliptic curves MUST be supported.

|Curve |Description                                                                                                                        |
|------|-----------------------------------------------------------------------------------------------------------------------------------|
|X25519|The underlying curve is actually `Curve25519`, however when used in the context of diffie helman the identifier of `X25519` is used|
|P-256 |NIST defined P-256 elliptic curve                                                                                                  |

For content encryption of the message, the following algorithms MUST be supported.

|Algorithm(JWA) |Description                                          |
|---------------|-----------------------------------------------------|
|C20P           |ChaCha20Poly1305                                     |
|AES-GCM        |Advanced Encryption Standard with galois/counter mode|

### Anonymous Encryption

When a sender would like to encrypt a message for a recipient or multiple recipients but not be authenticated by the recipients as the party who encrypted the message, the JWA of `ECDH-ES` defined by [RFC 7518](https://tools.ietf.org/html/rfc7518#section-4.6) SHOULD be used within the structure of a JWE. 

For the keys involved in key agreement, the following elliptic curves MUST be supported.

|Curve |Description                                                                                                                        |
|------|-----------------------------------------------------------------------------------------------------------------------------------|
|X25519|The underlying curve is actually `Curve25519`, however when used in the context of diffie helman the identifier of `X25519` is used|
|P-256 |NIST defined P-256 elliptic curve                                                                                                  |

For content encryption of the message, the following algorithms MUST be supported.

|Algorithm(JWA) |Description                                          |
|---------------|-----------------------------------------------------|
|C20P           |ChaCha20Poly1305                                     |
|AES-GCM        |Advanced Encryption Standard with galois/counter mode|

### Signing

When a sender would like for a message to feature a non-repudiable digital signature the JWA's defined below can be used within the structure of a JWS.

For digital signatures the following algorithms MUST be supported.

|Algorithm(JWA)               |Description                                                         |
|-----------------------------|--------------------------------------------------------------------|
|EdDSA (with crv=Ed25519)     |Elliptic curve digital signature with edwards curves and SHA-512    |
|ES256                        |Elliptic curve digital signature with NIST p-256 curve and SHA-256  |


## Signed and Encrypted

When a sender would like for their message to feature both a non-repudiable digital signature and be encrypted to a recipient or multiple recipients. They can combine the encryption and signing operations defined earlier in this section by creating a [nested JWM](https://tools.ietf.org/html/draft-looker-jwm-01#section-1.2).