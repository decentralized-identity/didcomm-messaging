## Future-Proofing

### Versioning

This version of the standard is known as "DIDComm v2" &mdash; acknowledging the fact that a [v1 generation of DIDComm specs](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0005-didcomm/README.md) was incubated under the Hyperledger Aries project umbrella. The v1 specs are close conceptual cousins, but use a slightly different encryption envelope, and base their plaintext format on arbitrary JSON instead of JWMs.

Future evolutions of the spec will follow [semver](https://semver.org) conventions. Minor updates that add features without breaking compatibility will carry a minor version number update: 2.1, 2.2, and so forth. Breaking changes will prompt a major version change.

### Extensions

The general mechanism for DIDComm extensibility is the development of DIDComm protocols. In the case where extensibility requires a modification to the base DIDComm spec itself, a DIDComm extension is to be used. An extension adds a self-contained set of conventions or features. Support for DIDComm extensions is optional.

Each DIDComm extension is described in a specification of its own. Software that implements a DIDComm Extension in addition to the DIDComm spec will indicate so via link to the extension spec.

### Future Work

#### Additional Encodings

DIDComm Messages are JSON encoded (based on the JOSE family of specs) at the encryption, signature, and content level. Future encodings might introduce binary serializations. Each innovation like this MUST specify a deterministic and reliable method for indicating the alternative encoding used.

### Beyond Messaging

This is a DIDComm _messaging_ spec. Security, privacy, routing, and metadata concepts from this spec could be adapted to other communication styles, including multicast/broadcast and streaming. This will create sister specs to DIDComm Messaging, rather than evolving DIDComm Messaging itself. 

### Post-Quantum Crypto

The designers of DIDComm are aware that DIDComm's cryptographic methods will need to be upgraded when quantum computing matures. This is because DIDComm makes heavy use of asymmetric elliptic curve mechanisms that depend on the discrete logarithm problem; this computational hardness is likely to be vulnerable to quantum cracking. Similar risks will drive upgrades to TLS, Ethereum, Bitcoin, and many other systems that are considered highly secure today.

Some modest preparations for quantum-resistant DIDComm have already begun. DIDComm is able to use arbitrary DID methods, which should allow approaches that are quantum-secure without changing the general pattern of DIDComm's interaction with key management technology.

Libraries that provide quantum-resistant algorithms for signing and encryption are now available, but research is needed to determine which approaches are worthy of broad adoption. This is the subject of [an ongoing project sponsored by NIST](https://csrc.nist.gov/projects/post-quantum-cryptography), and of [a similar project in the EU](https://ec.europa.eu/digital-single-market/en/news/future-quantum-eu-countries-plan-ultra-secure-communication-network).

We expect to update the DIDComm Messaging spec as these projects release mature recommendations and the cryptographic libraries they vet achieve adoption. It is not yet clear whether this will require a breaking change to DIDComm's encryption envelope or signing formats.