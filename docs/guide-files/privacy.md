## Privacy
This section discusses best practices and the implications of DIDComm Protocols on the privacy of the communicating parties.

### Public Fingerprinting

Users should avoid disclosing supported protocols until sufficient trust has been established. The broad disclosure of supported protocols may provide a unique fingerprint that can be used to correlate multiple identifiers in use by a single party.

DIDComm's use of the Discover Features Protocol allows selective disclosure of features to mitigate this problem. Leveraging this protocol as a better substitute for Verifiable Data Registry (VDR) published DID Document endpoints will prevent the disclosure of unique protocols.