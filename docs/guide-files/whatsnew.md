## What's New?

The version of DIDComm incubated in the Hyperledger Aries community is referred to as Version 1 (V1). This spec describes the next version, referred to as Version 2 (V2). This section will describe the changes between V1 and V2, useful to members of the Aries community.

### Summary of Changes

- Formalization of methods used in V1
  - JWM based envelope
  - ECDH-1PU standardized form of AuthCrypt
- Both DID and key in each message
- Special Handling of Peer DIDs eliminated
- Message structure split between 'headers' and body.
- No AnonCrypt encryption method.

### Practical Changes

The list of changes above leads to practical changes in how DIDComm is used.

#### DID Exchange not needed

Each message contains both the sender key (used in the encryption layer), and the sender's DID. The exchange of DIDs that occurs via the DID Exchange Protocol used in V1 occurs in each message that is transferred. The important step of rotating DIDs is accomplished via the `from_prior` header that travels alongside any protocol message. These features make the DID Exchange Protocol redundant.

One side effect of the DID Exchange Protocol in V1 was that you confirmed the validity of the DID with a round trip to the other party. Many protocols will provide this assurance via the flow of the protocol prior to the point where round-trip testing is required. When this round-trip is desired prior to the beginning of a protocol, a round trip with another protocol (such as Trust Ping or Feature Discovery) can provide the same assurance.

#### Special Handling of Peer DIDs eliminated

DIDComm V1 defined special handling of Peer DIDs, making it very optimized for usage with Peer DIDs. However this made it less obvious how other DID methods could be used with DIDComm. DIDComm V2 eliminated special handling of Peer DIDs, making handling of all DIDs equal from the perspective of the DIDComm spec. This creates a more distinct separation between how DIDs are used (defined by DID Core and specific DID method) and how to securely communicate using DIDs (defined by DIDComm spec).

The new `to` and `from` attributes inside a DIDComm message allow for query parameters to be included on a DID. Using the query parameters you can exchange additional information without using custom fields. DID methods indicate how query parameters can be used to pass state information. For example, the Peer DID method defines the usage of the [`initial-state` query parameter](https://github.com/decentralized-identity/did-spec-extensions/blob/master/parameters/initial-state.md) to pass all information needed to construct a DIDDoc in a single field.

#### Process From Headers prior to Protocol Processing

Relationship changes in V1 were handled inside the DID Exchange Protocol. In V2, relationship changes including discovery and rotation are handled in message headers.

In V2, messages must evaluate the `from` and `from_prior` headers of every message prior to beginning the protocol message processing.

#### No technical difference between Ephemeral Mode and Full Mode

Ephemeral mode in V1 was a method of passing messages without first performing an exchange of DIDs. Given that we no longer have a need to perform an exchange of DIDs prior to passing messages of another protocol, we no longer need to designate a mode for ephemeral interactions.

#### Use Peer DIDs (or other suitable DID method) in place of AnonCrypt

Anoncrypt was a method present in V1 that allowed a message to be encrypted to a recipient using ephemeral sender keys, allowing the sender to remain anonymous. The ease of using Peer DIDs allows the sender to remain anonymous using the existing authenticated encryption method. The encryption properties are the same between the methods. Eliminating this option makes the spec simpler without loosing any features.

#### Message Level Decorators now represented as Headers

The adjusted structure of DIDComm messages now represents message level decorators as message headers. An example includes `thid`.
