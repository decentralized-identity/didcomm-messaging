## Purpose and Scope

The purpose of DIDComm is to provide a secure, private communication methodology built atop the decentralized design of [DIDs](https://www.w3.org/TR/did-core/).

Other robust mechanisms for secure communication already exist. However, most rely on key registries, identity providers, certificate authorities, browser or app vendors, or similarly centralized assumptions. They also tend to be tied to a single transport, making it difficult to use the same solution for human and machine conversations, online and offline, simplex and duplex, across a broad set of modalities. The net result is that they perpetuate an asymmetry between institutions and ordinary people. The former maintain certificates and always-connected servers, and publish APIs under terms and conditions they dictate; the latter suffer with usernames and passwords, poor interoperability, and a Hobson's choice between privacy and convenience.

DIDComm can fix this. Using DIDComm, individuals on semi-connected mobile devices become full peers of highly available web servers operated by IT experts. Registration is self-service, intermediaries require little trust, and no terms and conditions apply.

DIDComm enables higher-order protocols that inherit its security, privacy, decentralization, and transport independence. Examples include exchanging verifiable credentials, creating and maintaining relationships, buying and selling, scheduling events, negotiating contracts, voting, presenting tickets for travel, applying to employers or schools or banks, arranging healthcare, and playing games. Like web services atop HTTP, the possibilities are endless; unlike web services atop HTTP, many parties can participate without being clients of a central server, and they can use a mixture of connectivity models and technologies.

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
