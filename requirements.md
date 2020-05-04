## Requirements

* **decentralized/self-sovereign** (encryption, signing, authn, and authz should all be based on control of DIDs rathern than on CAs, IDPs, etc)

* **transport independent** (HTTPS, bluetooth, AMQP, SMTP, NFC, and so forth)

* **routable** (like email, A can talk to B without a direct connection to B, by requesting that a message be forwarded--needed to mix and match transports; also, could pass through a mix network or other infrastructure that isn’t aware of it as anything other than blobs to be moved)

* **secure** (tamper-proof, MITM impossible, composed of primitives widely considered best practice, vetted by experts, has formal security proofs, security guarantees of a given message are known)

* **private** (third parties can’t learn who’s communicating about what, when--broader than “confidentiality” in CIA because metadata like timing and identities of parties is also protected; also, possible for a sender to be anonymous to recipient) 

* **asynchronous** (can’t require real-time participation by a party; like email in that parties can communicate when they want)

* **supports simplex and duplex** (can’t assume response uses the same channel as request--but allows request~response where desirable)

* **supports repudiable and non-repudiable** (parties can talk off or on the record, as appropriate)

* **platform-independent** (usable on embedded, not just servers+desktops+mobile)

* **composable** (pick the crypto suite and features you need, without incurring overwhelming dependencies for stuff you don’t)

* **pairwise, nwise, anywise** (communicate between 2 parties, or between N parties, or to the whole world)

* **efficient** (doesn’t waste bandwidth, storage space, cpu, etc) 