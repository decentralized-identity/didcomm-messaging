## Negotiating Compatibility

When parties want to communicate via DIDComm, a number of mechanisms must align. These include:

1. The type of service endpoint used by each party
2. The key types used for encryption and/or signing
3. The format of the encryption and/or signing envelopes
4. The encoding of plaintext messages
5. The protocol used to forward and route
6. The protocol embodied in the plaintext messages

Although DIDComm allows flexibility in each of these choices, it is not expected that a given DIDComm implementation will support many permutations. Rather, we expect a few sets of choices that commonly go together. We call a set of choices that work well together a __profile__. Profiles are identified by a string that matches the conventions of IANA media types, but they express choices about plaintext, encryption, signing, and routing in a single value. The following profile identifiers are defined in this version of the spec:

### Defined Profiles

* `didcomm/aip1`: The encryption envelope, signing mechanism, plaintext conventions, and routing algorithms embodied in Aries AIP 1.0, circa 2020.
* `didcomm/aip2;env=rfc19`: The signing mechanism, plaintext conventions, and routing algorithms embodied in Aries AIP 2.0, circa 2021 -- with the old-style encryption envelope from Aries RFC 0019. This legal variant of AIP 2.0 minimizes differences with codebases that shipped AIP 1.0 support.
* `didcomm/aip2;env=rfc587`: The signing mechanism, plaintext conventions, and routing algorithms embodied in Aries AIP 2.0, circa 2021 -- with the new-style encryption envelope from Aries RFC 0587. This legal variant of AIP 2.0 lays the foundation for DIDComm v2 support by anticipating the eventual envelope change.
* `didcomm/v2`: The encryption envelope, signing mechanism, plaintext conventions, and routing algorithms embodied in this spec.

Profiles are named in the `accept` section of a DIDComm service endpoint and in an out-of-band message. When Alice declares that she accepts `didcomm/v2`, she is making a declaration about more than her own endpoint. She is saying that all publicly visible steps in an inbound route to her will use the `didcomm/v2` profile, such that a sender only has to use `didcomm/v2` choices to get the message from Alice's outermost mediator to Alice's edge. It is up to Alice to select and configure mediators and internal routing in such a way that this is true for the sender.

