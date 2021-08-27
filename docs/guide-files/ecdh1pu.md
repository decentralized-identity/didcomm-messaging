## ECDH-1PU

### Introduction

This article explains what ECDH-1PU is and why it's useful in the DIDComm protocol.

As described in [Message Encryption](https://identity.foundation/didcomm-messaging/spec/#message-encryption), DIDComm protocol requires protecting a message using either Anonymous Encryption (aka `Anoncrypt`) or Sender Authenticated Encryption (aka `Authcrypt`). 

The former has no sender key involved and is intended for only the recipients of the message. This mechanism requires using encryption with a content encryption key (aka `cek`) being wrapped with a key agreement mechanism using `ECDH-ES` for each recipient. We use key wrapping mode with [ECDH-ES](https://datatracker.ietf.org/doc/html/rfc7518#section-4.6) to ensure only the intended recipients can decrypt the final message. The benefit of using `ECDH-ES` is that it's widely used and available in many crypto libraries for most modern languages. Building JWE envelopes using this type of encryption should be relatively easy using existing JOSE libraries in your preferred language.

The latter however requires a sender key to encrypt the message for the sender to be authenticated. This encryption mechanism uses ECDH-1PU, the main topic of this article. 

### Z in ECDH-ES, first step in understanding ECDH-1PU

To understand how ECDH-1PU works, knowledge about the internals of ECDH-ES is required. The way ECDH-ES key agreement works is for the sender to execute the following steps for each recipient to derive the key used to wrap the `cek`:
1. Generate an [ephemeral key](https://datatracker.ietf.org/doc/html/rfc7518#section-4.6.1.1) (aka `epk`).
2. Build `apu`, the producer (sender) identity. For Anoncrypt, this will represent the X value of `epk` base64URL encoded.
3. Build `apv`, the receiver (recipient) identity. It can optionally contain the recipient `kid` base64URL encoded.
4. Compute `Z`, the [key derivation](https://datatracker.ietf.org/doc/html/rfc7518#section-4.6.2) process output of ECDH for each recipient using the above values with the **private** `epk` key and the recipients **public** key on the sender side. An example is found in ietf rfc7518 [appendix C](https://datatracker.ietf.org/doc/html/rfc7518#appendix-C). The recipient on their end will get the **public** `epk` and therefore does the same computation with their **private** key.

In this case, ECDH-ES uses an ephemeral key and the recipient's public key (a static long-lived key) to compute the key derivation `Z`, hence the ES notation means Ephemeral-Static in ECDH-ES. This derivation fits perfectly the requirement to protect messages for recipients without revealing the sender's identity (ie: no static sender key is used in the key derivation process when the recipient derives `Z`).

Finally, the computed derived key is used to wrap the `cek`, the symmetric key used to encrypt/decrypt the payload content (the `ciphertext` section) of the JWE envelope .

### Need to Authcrypt, key derivation beyond ECDH-ES

In the previous section, key derivation using an ephemeral key does not reveal who sent the message. This is useful for messages requiring anonymity of the author, eg a router agent receiving a message does not need to authenticate the sender, its only purpose is to route the message to an end recipient. For this router agent, using Anoncrypt messages is perfectly fine.

In most cases, an end recipient requires authenticating the original sender. This means recipients will need to hold the sender's public key prior to receiving their messages in order to authenticate them. Since ECDH-ES does not involve the sender key, the only way to authenticate a sender is to nest a JWS in a JWE message which is heavier than a plain JWE only message. Another, newer, option would be to use a new key derivation process that involves the sender's key. [ECDH-1PU](https://datatracker.ietf.org/doc/html/draft-madden-jose-ecdh-1pu-04) was introduced for this specific purpose, it uses the sender's static key in the key derivation process. The following section is dedicated to this process.

The Advantages in using ECDH-1PU are described in the [Introduction](https://datatracker.ietf.org/doc/html/draft-madden-jose-ecdh-1pu-04#section-1) section of the draft:

```
The advantages of public key authenticated encryption with ECDH-1PU
compared to using nested signed-then-encrypted documents include the
following:

   o  The resulting message size is more compact as an additional layer
      of headers and base64url-encoding is avoided.  A 500-byte payload
      when encrypted and authenticated with ECDH-1PU (with P-256 keys
      and "A256GCM" Content Encryption Method) results in a 1087-byte
      JWE in Compact Encoding.  An equivalent nested signed-then-
      encrypted JOSE message using the same keys and encryption method
      is 1489 bytes (37% larger).

   o  The same primitives are used for both confidentiality and
      authenticity, providing savings in code size for constrained
      environments.

   o  The generic composition of signatures and public key encryption
      involves a number of subtle details that are essential to security
      [PKAE].  Providing a dedicated algorithm for public key
      authenticated encryption reduces complexity for users of JOSE
      libraries.

   o  ECDH-1PU provides only authenticity and not the stronger security
      properties of non-repudiation or third-party verifiability.  This
      can be an advantage in applications where privacy, anonymity, or
      plausible deniability are goals.

```


### ECDH-1PU for sender authentication

Similar to ECDH-ES, the 1PU process executes key derivation to compute a `Z` value used for key wrapping, but has 2 computations instead of only 1 with a final result being the concatenation of the two as described [here](https://datatracker.ietf.org/doc/html/draft-madden-jose-ecdh-1pu-04#section-2.3), they're defined as:

1. The first is called `Ze`, which is the exact same key derivation as ECDH-ES using a private `epk` and the public recipient key on the sender side. (The recipient side will involve the public `epk` and the private recipient key).
2. The second is called `Zs`, in this second computation, we use the sender's static key instead of `epk`. So on the sender side we derive `Zs` by using the sender's private key and the recipient's public key. (The recipient side will use the sender's public key and the recipient's private key on their end).

The final `Z` is the concatenation of `Ze` and `Zs` which is then used in the key wrapping the same way as in ECDH-ES.

There are special considerations in the process to protect sender impersonation as described [2.1](https://datatracker.ietf.org/doc/html/draft-madden-jose-ecdh-1pu-04#section-2.1) of the draft:
```
   In Key Agreement with Key Wrapping mode, the JWE Authentication Tag
   is included in the input to the Key Derivation Function as described
   in section Section 2.3.  This ensures that the content of the JWE was
   produced by the original sender and not by another recipient, as
   described in section Section 4.

   Key Agreement with Key Wrapping mode MUST only be used with content
   encryption algorithms that are compactly committing AEADs as
   described in [ccAEAD].  The AES_CBC_HMAC_SHA2 algorithms described in
   section 5.2 of [RFC7518] are compactly committing and can be used
   with ECDH-1PU in Key Agreement with Key Wrapping mode.  Other content
   encryption algorithms MUST be rejected.  In Direct Key Agreement
   mode, any JWE content encryption algorithm MAY be used.

   The requirement to include the JWE Authentication Tag in the input to
   the Key Derivation Function implies an adjustment to the order of
   operations performed during JWE Message Encryption described in
   section 5.1 of [RFC7516].  Steps 3-8 are deferred until after step
   15, using the randomly generated CEK from step 2 for encryption of
   the message content.
```

To sum up, these considerations require:
1. The use of the `AES_CBC_HMAC_SHA` family of content encryption algorithms to encrypt the payload. Currently, JWE supports the following three algorithms in this family:
   1. A128CBC-HS256
   2. A192CBC-HS384
   3. A256CBC-HS512
   
    But the spec only mandates [iii](https://identity.foundation/didcomm-messaging/spec/#curves-and-content-encryption-algorithms) as required to minimize interoperability issues in the protocol.
2. Encrypt the payload prior to wrapping `cek` with the derived `Z`. The output is `ciphertext` and `tag`
3. Use the resulting `tag` in item 2 above as the value `len(tag)`+`tag` set in `cctag` in the keys derivations of `Ze` and `Zs`.


Additionally, the `skid` protected header is also introduced as a kid to reference the sender key. This will help recipients resolve the key behind `skid` and execute the ECDH-1PU process explained in the previous section. 

For the sake of consistency, `apu` and `apv` must be set to the values mentioned in [section 5.8](https://identity.foundation/didcomm-messaging/spec/#ecdh-1pu-key-wrapping-and-common-protected-headers) of the DIDComm Messaging protocol to further restrain and protect the message.

Finally, ECDH-1PU is a key derivation process that allows for sender authenticity and abiding by the Perfect Forward Secrecy mechanism for short and relatively lighter messages than JWS nested messages in a JWE envelope. This article explained how ECDH-ES works, explained how it lacks sender identity authentication and how it can be done using nested messages (JWS in JWE) and finally explained how ECDH-1PU met the need to authenticate the sender. This helps maintain the use of a single JWE message (no JWS) to meet the need for low capacity agents (eg: iot devices) by reducing their communication footprint.