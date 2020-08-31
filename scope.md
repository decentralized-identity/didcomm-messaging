## Purpose and Scope

*Initial: Need for a “trust layer for the internet”, and DIDComm’s pivotal role in enabling trustworthy communication based on DIDs. A decentralized version of PKI plus a decentralized version of DNS plus cutting-edge crypto.*

The purpose of DIDComm is to provide a secure communication layer built on top of the information contained in DID Documents. This secure communication can be used to exchange verifiable credentials and other information, providing key foundational elements for a trust layer on the internet.

Identity owners (people, organizations, etc.) need software to help them manage keys and perform cryptographic operations. These software agents use DIDComm to communicate with each other. The specific interactions enabled by DIDComm--connecting and maintaining relationships, issuing credentials, providing proof, etc.--are called **protocols**. Key protocols are described in this spec. Protocols created within organizations or industry verticals are described elsewhere.

### Overview

To understand how DIDComm works, consider a situation where Alice wants to negotiate with Bob to sell something online. Because DIDComm, not direct human communication, is the methodology in this example, Alice's software agent and Bob's software agent are going to exchange a series of messages.

Alice may just press a button and be unaware of details, but underneath, her agent begins by preparing a plaintext JSON message about the proposed sale. (The particulars are irrelevant here, but would be described in the spec for a higher-level "sell something" protocol that takes DIDComm as its foundation.) Alice's agent then looks up Bob's DID Doc to access two key pieces of information:

- An endpoint (web, email, etc) where messages can be delivered to Bob.
- The public key that Bob's agent is using in the Alice:Bob relationship.

Now Alice's agent uses Bob's public key to encrypt the plaintext so that only Bob's agent can read it, adding authentication with its own private key. The agent arranges delivery to Bob. This "arranging" can involve various hops and intermediaries. It can be complex. (See [Routing in the Implementers Guide](/guide#routing).)

Bob's agent eventually receives and decrypts the message, authenticating its origin as Alice using her public key. It prepares its response and routes it back using a reciprocal process (plaintext &#x2192; lookup endpoint and public key for Alice &#x2192; encrypt with authentication &#x2192; arrange delivery).

That's the essence, in the most common scenarios. However, it does not fit all DIDComm interactions:

- DIDComm doesn't always involve turn-taking and request-response.
- DIDComm interactions can involve more than 2 parties, and the parties are not always individuals.
- DIDComm may include formats other than JSON.

Before we provide more details, let's explore what drives the design of DIDComm.
