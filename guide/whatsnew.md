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

#### Process From Headers prior to Protocol Processing

Relationship changes in V1 were handled inside the DID Exchange Protocol. In V2, relationship changes including discovery and rotation are handled in message headers.

In V2, messages must evaluate the `from` and `from_prior` headers of every message prior to beginning the protocol message processing. 

#### No technical difference between Ephemeral Mode and Full Mode

Ephemeral mode in V1 was a method of passing messages without first performing an exchange of DIDs. Given that we no longer have a need to perform an exchange of DIDs prior to passing messages of another protocol, we no longer need to designate a mode for ephemeral interactions.

#### Use Peer DIDs (or other suitable DID method) in place of AnonCrypt

Anoncrypt was a method present in V1 that allowed a message to be encrypted to a recipient using ephemeral sender keys, allowing the sender to remain anonymous. The ease of using Peer DIDs allows the sender to remain anonymous using the existing authenticated encryption method. The encryption properties are the same between the methods. Eliminating this option makes the spec simpler without loosing any features.

#### Message Level Decorators now represented as Headers

The adjusted structure of DIDComm messages now represents message level decorators as message headers. An example includes `thread_id`.

