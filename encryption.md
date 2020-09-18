## Message Encryption

DIDComm supports two types of message encryption: Authenticated Sender Encryption and Anonymous Sender Encryption. Both forms are encrypted to the recipient, but only Authenticated Sender Encryption provides assurances of who the sender is. 

The encrypted form of a JWM is a JWE. The JOSE family defines [JSON Web Algorithms](https://tools.ietf.org/html/rfc7518) (JWAs) which standardize certain cryptographic operations that are related to preparing JOSE structures. For the purposes of interoperability, DIDComm messaging does not support all JWAs, rather it takes a subset of the supported algorithms that are applicable for the following cases around secure messaging. These supported algorithms are listed here.


### Sender Authenticated Encryption

When a sender would like to encrypt a message for a recipient or multiple recipients and also be authenticated such that the recipients can determine they were the party that encrypted the message, the JWA of `ECDH-1PU` defined by [draft](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03) SHOULD be used within the structure of a JWE. 

For the keys involved in key agreement, the following elliptic curves MUST be supported.

| Curve  | Description                                                  |
| ------ | ------------------------------------------------------------ |
| X25519 | The underlying curve is actually `Curve25519`, however when used in the context of Diffie-Hellman the identifier of `X25519` is used |
| P-256  | NIST defined P-256 elliptic curve                            |

For content encryption of the message, the following algorithms MUST be supported.

| Algorithm(JWA) | Description                |
| -------------- | -------------------------- |
| XC20P          | XChaCha20Poly1305          |
| A256GCM        | AES-GCM with a 256 bit key |

TODO: Include language about safe nonce considerations.

### Anonymous Encryption

When a sender would like to encrypt a message for a recipient or multiple recipients but not be authenticated by the recipients as the party who encrypted the message, the JWA of `ECDH-ES` defined by [RFC 7518](https://tools.ietf.org/html/rfc7518#section-4.6) SHOULD be used within the structure of a JWE. 

For the keys involved in key agreement, the following elliptic curves MUST be supported.

| Curve  | Description                                                  |
| ------ | ------------------------------------------------------------ |
| X25519 | The underlying curve is actually `Curve25519`, however when used in the context of Diffie-Hellman the identifier of `X25519` is used |
| P-256  | NIST defined P-256 elliptic curve                            |

For content encryption of the message, the following algorithms MUST be supported.

| Algorithm(JWA) | Description                |
| -------------- | -------------------------- |
| XC20P          | XChaCha20Poly1305          |
| A256GCM        | AES-GCM with a 256 bit key |

TODO: Include language about safe nonce considerations.

### Key Wrapping Algorithms

| KW Algorithm    | Curve (epk crv) | key type (epk kty) | Description                                                                                                                                                                                                                                             |
| --------------- | --------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ECDH-ES+A256KW  | P-256           | EC                 | ECDH-ES key wrapping using key with NIST defined P-256 elliptic curve to create a 256 bits key as defined in [7518](https://tools.ietf.org/html/rfc7518#section-4.6.2)                                                                                  |
| ECDH-ES+A256KW  | P-384           | EC                 | ECDH-ES key wrapping using key with NIST defined P-384 elliptic curve to create a 256 bits key as defined in [7518](https://tools.ietf.org/html/rfc7518#section-4.6.2)                                                                                  |
| ECDH-ES+A256KW  | P-521           | EC                 | ECDH-ES key wrapping using key with NIST defined P-521 elliptic curve to create a 256 bits key as defined in [7518](https://tools.ietf.org/html/rfc7518#section-4.6.2)                                                                                  |
| ECDH-ES+A256KW  | X25519          | OKP                | ECDH-ES with X25519 ([RFC7748 section 5](https://tools.ietf.org/html/rfc7748#section-5)) to create a 256 bits key. The underlying curve is actually `Curve25519`, however when used in the context of Diffie-Hellman the identifier of `X25519` is used |
| ECDH-1PU+A256KW | P-256           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-256 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03#section-2.2)                                                         |
| ECDH-1PU+A256KW | P-384           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-384 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03#section-2.2)                                                         |
| ECDH-1PU+A256KW | P-521           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-521 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03#section-2.2)                                                         |
| ECDH-1PU+A256KW | X25519          | OKP                | ECDH-1PU X25519 ([RFC7748 section 5](https://tools.ietf.org/html/rfc7748#section-5)) to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03#section-2.2)                                           |

### Examples

While the details of encrypting a JWM into a JWE are included in the [JWM spec](https://tools.ietf.org/html/draft-looker-jwm-01), a few examples are included here for clarity.

TODO: Add examples here