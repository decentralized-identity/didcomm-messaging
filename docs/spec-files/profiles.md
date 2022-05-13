## Negotiating Compatibility

When parties want to communicate via DIDComm, a number of mechanisms must align. These include:

1. The type of [service endpoint](#service-endpoint) used by each party
2. The [key types](#security) used for encryption and/or signing
3. The format of the [encryption](#didcomm-encrypted-messages) and/or [signing envelopes](#didcomm-signed-messages)
4. The encoding of [plaintext messages](#plaintext-message-structure)
5. The protocol used to [forward and route](#routing-protocol-20)
6. The [protocol](#protocols) embodied in the plaintext messages

Although DIDComm allows flexibility in each of these choices, it is not expected that a given DIDComm implementation will support many permutations. Rather, we expect a few sets of choices that commonly go together. We call a set of choices that work well together a **profile**. Profiles are identified by a string that matches the conventions of [IANA media types](https://www.rfc-editor.org/rfc/rfc6838.html), but they express choices about plaintext, encryption, signing, and routing in a single value. The following profile identifiers are defined in this version of the spec:

### Defined Profiles

* `didcomm/aip1`: The encryption envelope, signing mechanism, plaintext conventions, and routing algorithms embodied in [Aries AIP 1.0](https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0302-aries-interop-profile/README.md#aries-interop-profile-version-10), circa 2020.
* `didcomm/aip2;env=rfc19`: The signing mechanism, plaintext conventions, and routing algorithms embodied in [Aries AIP 2.0](https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0302-aries-interop-profile/README.md#aries-interop-profile-version-20), circa 2021 &mdash; with the old-style encryption envelope from [Aries RFC 0019](https://github.com/hyperledger/aries-rfcs/tree/b3a3942ef052039e73cd23d847f42947f8287da2/features/0019-encryption-envelope#aries-rfc-0019-encryption-envelope). This legal variant of AIP 2.0 minimizes differences with codebases that shipped AIP 1.0 support.
* `didcomm/aip2;env=rfc587`: The signing mechanism, plaintext conventions, and routing algorithms embodied in [Aries AIP 2.0](https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0302-aries-interop-profile/README.md#aries-interop-profile-version-20), circa 2021 &mdash; with the new-style encryption envelope from [Aries RFC 0587](https://github.com/hyperledger/aries-rfcs/tree/b3a3942ef052039e73cd23d847f42947f8287da2/features/0587-encryption-envelope-v2). This legal variant of AIP 2.0 lays the foundation for DIDComm v2 support by anticipating the eventual envelope change.
* `didcomm/v2`: The encryption envelope, signing mechanism, plaintext conventions, and routing algorithms embodied in this spec.

Profiles are named in the `accept` section of a [DIDComm service endpoint](#service-endpoint) and in an [out-of-band message](#out-of-band-messages). When Alice declares that she accepts `didcomm/v2`, she is making a declaration about more than her own endpoint. She is saying that all publicly visible steps in an inbound route to her will use the `didcomm/v2` profile, such that a sender only has to use `didcomm/v2` choices to get the message from Alice's outermost mediator to Alice's edge. It is up to Alice to select and configure [mediators](#roles) and internal routing in such a way that this is true for the sender.

### Incompatible Profiles

When two parties attempt to communicate but discover that they are using incompatible profiles, each SHOULD attempt to use a profile that both support. This could require a more advanced peer to fall back, or a less advanced peer to move forward. There is no negotiation mechanism for this, since it would create a recursive versioning problem of its own. Ideally, a failure to find compatibility would trigger a [problem report](#problem-reports) that uses the conventions of whatever party will receive it. However, this may be difficult for software that intentionally avoids dependencies. Hard-coding a tiny slice of functionality from another DIDComm profile, just to receive or emit problem reports from incompatible parties, is a possible solution.
