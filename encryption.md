## Message Encryption

DIDComm supports two types of message encryption: Authenticated Sender Encryption and Anonymous Sender Encryption. Both forms are encrypted to the recipient, but only Authenticated Sender Encryption provides assurances of who the sender is. 

The encrypted form of a JWM is a JWE. The JOSE family defines [JSON Web Algorithms](https://tools.ietf.org/html/rfc7518) (JWAs) which standardize certain cryptographic operations that are related to preparing JOSE structures. For the purposes of interoperability, DIDComm messaging does not support all JWAs, rather it takes a subset of the supported algorithms that are applicable for the following cases around secure messaging. These supported algorithms are listed here.


### Sender Authenticated Encryption

When a sender would like to encrypt a message for a recipient or multiple recipients and also be authenticated such that the recipients can determine they were the party that encrypted the message, the JWA of `ECDH-1PU` defined by [draft](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-02) SHOULD be used within the structure of a JWE. 

For the keys involved in key agreement, the following elliptic curves MUST be supported.

| Curve  | Description                                                  |
| ------ | ------------------------------------------------------------ |
| X25519 | The underlying curve is actually `Curve25519`, however when used in the context of Diffie-Hellman the identifier of `X25519` is used |
| P-256  | NIST defined P-256 elliptic curve                            |

For content encryption of the message, the following algorithms MUST be supported.

| Algorithm(JWA) | Description                                           |
| -------------- | ----------------------------------------------------- |
| XC20P          | XChaCha20Poly1305                                     |
| AES-GCM        | Advanced Encryption Standard with galois/counter mode |

TODO: Include language about safe nonce considerations.

### Anonymous Encryption

When a sender would like to encrypt a message for a recipient or multiple recipients but not be authenticated by the recipients as the party who encrypted the message, the JWA of `ECDH-ES` defined by [RFC 7518](https://tools.ietf.org/html/rfc7518#section-4.6) SHOULD be used within the structure of a JWE. 

For the keys involved in key agreement, the following elliptic curves MUST be supported.

| Curve  | Description                                                  |
| ------ | ------------------------------------------------------------ |
| X25519 | The underlying curve is actually `Curve25519`, however when used in the context of Diffie-Hellman the identifier of `X25519` is used |
| P-256  | NIST defined P-256 elliptic curve                            |

For content encryption of the message, the following algorithms MUST be supported.

| Algorithm(JWA) | Description                                           |
| -------------- | ----------------------------------------------------- |
| XC20P          | XChaCha20Poly1305                                     |
| AES-GCM        | Advanced Encryption Standard with galois/counter mode |

TODO: Include language about safe nonce considerations.

### Examples

While the details of encrypting a JWM into a JWE are included in the [JWM spec](https://tools.ietf.org/html/draft-looker-jwm-01), a few examples are included here for clarity.

TODO: Add examples here