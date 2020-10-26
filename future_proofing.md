## Future-Proofing

- Versioning of the standard

- Extensibility

- Adapting for post-quantum crypto

### Extensions

The general mechanism for DIDComm extensibility is the development of
DIDComm protocols. In the case where extensibility requires a modification
to the base DIDComm spec itself, a DIDComm Extension is to be used.

Each DIDComm Extension is described in a specification. Software that
implements a DIDComm Extension in addition to the DIDComm spec will
indicate so via link to the extension spec.

### Encoding

DIDComm Messages are JSON encoded (based on the JOSE family of specs) at the encryption, signature, and content level. Future encodings MUST specify a deterministic and reliable method for indicating the alternative encoding used.