# Message Encryption

The encrypted form of a JWM is a JWE. The JOSE family defines [JSON Web Algorithms](https://tools.ietf.org/html/rfc7518) (JWAs) which standardize certain cryptographic operations that are related to preparing JOSE structures. For the purposes of interoperability, DIDComm messaging does not support all JWAs, rather it takes a subset of the supported algorithms that are applicable for the following cases around secure messaging. These supported algorithms are listed here.

For an encrypted DIDComm Message, the JWA of `ECDH-1PU` defined by [draft](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03) MUST be used within the structure of a JWE.

For the keys involved in key agreement, the following elliptic curves MUST be supported.

| Curve  | Description                                                  |
| ------ | ------------------------------------------------------------ |
| X25519 | The underlying curve is actually `Curve25519`, however when used in the context of Diffie-Hellman the identifier of `X25519` is used |
| P-384  | NIST defined P-384 elliptic curve                            |
| P-256  | NIST defined P-256 elliptic curve - deprecated in favor of P-384 |

For content encryption of the message, the following algorithms MUST be supported.

| Algorithm(JWA) | Description                |
| -------------- | -------------------------- |
| XC20P          | XChaCha20Poly1305          |
| A256GCM        | AES-GCM with a 256 bit key |

TODO: Include language about safe nonce considerations.

## Key Wrapping Algorithms

| KW Algorithm    | Curve (epk crv) | key type (epk kty) | Description                                                  |
| --------------- | --------------- | ------------------ | ------------------------------------------------------------ |
| ECDH-1PU+A256KW | P-256           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-256 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03#section-2.2) |
| ECDH-1PU+A256KW | P-384           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-384 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03#section-2.2) |
| ECDH-1PU+A256KW | P-521           | EC                 | ECDH-1PU key wrapping using key with NIST defined P-521 elliptic curve to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03#section-2.2) |
| ECDH-1PU+A256KW | X25519          | OKP                | ECDH-1PU X25519 ([RFC7748 section 5](https://tools.ietf.org/html/rfc7748#section-5)) to create a 256 bits key as defined in [ecdh-1pu](https://tools.ietf.org/html/draft-madden-jose-ecdh-1pu-03#section-2.2) |

## Anonymous Messages

When the sender wishes to remain anonymous, they should identify themselves as a sender using a newly minted DID that's never been seen before. When the sender is done with the interaction, they can abandon further use of that DID. 

## Media Types

The media type of the envelope MUST be set in the `typ` [property](https://tools.ietf.org/html/rfc7516#section-4.1.11) of the JWE and the media type of the payload MUST be set in the `cty` [property](https://tools.ietf.org/html/rfc7516#section-4.1.12) of the JWE. The [message types](#message-types) section provides general discussion of the media types.

For example, following the guidelines of [message types](#message-types), an encrypted envelope with a plaintext DIDComm payload contains the `typ` property with the value `application/didcomm-encrypted+json` and `cty` property with the value `application/didcomm-plain+json`.

## Perfect Forward Secrecy

Due to the triple Key Derivation algorithm used in ECDH-1PU, all messages sent via DIDComm have weak perfect forward secrecy without any additional security added by the transport layer. In ECDH-1PU this is achieved by encrypting the content encryption key with the output of the hash of the Ze (ECDH of ephemeral key and recipient static key) and Zs (ECDH of static sender key and recipient static key). With Ze bringing the changed derived secret in each message and Zs bringing the repudiable authenticity of each message, the resulting Z (hash of Ze and Zs) carries the properties of weak perfect forward secrecy and repudiable authenticity for each message as well.

## Examples

While the details of encrypting a JWM into a JWE are included in the [JWM spec](https://tools.ietf.org/html/draft-looker-jwm-01), a few examples are included here for clarity.

TODO: Add examples here
