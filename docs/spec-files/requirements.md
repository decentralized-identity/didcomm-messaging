### Specific Requirements

The DIDComm design attempts to be:

1. **Secure** (tamper-proof; uses best-of-breed crypto; allows parties to talk both on and off the record...)
2. **Private** (third parties can’t learn who’s communicating about what, when; lets sender be anonymous to recipient) 
3. **Decentralized** (derives trust for encryption, signing, authn, and authz from control of DIDs rather than oracles like CAs, IDPs, etc; usable at the edge)
4. **Transport-agnostic** (usable over HTTPS 1.x and 2.0, WebSockets, BlueTooth, chat, push notifications, AMQP, SMTP, NFC, sneakernet, snail mail; supports both simplex and duplex; works offline; doesn't assume client-server or synchronous or real-time; allows paired or n-wise or public broadcast usage)
5. **Routable** (like email, A can talk to B without a direct connection to B; allows mixed and dynamic transports; passes through mix networks and other generic infrastructure that sees only payload BLOBs)
6. **Interoperable** (works across programming languages, blockchains, vendors, OS/platforms, networks, legal jurisdictions, geos, cryptographies, and hardware--as well as across time; avoids vendor lock-in)
7. **Extensible** (lets devs start simple without heavy learning or dependencies; customize easily; facilitates higher-level protocols that inherit DIDComm's guarantees)
8. **Efficient** (doesn’t waste bandwidth, battery, storage space, or CPU)

### Ramifications

As a list of buzz words, this may elicit nods rather than surprise. However, design tradeoffs are inevitable, and several of these items have noteworthy ramifications.

#### Message-Based, Asynchronous, and Simplex

The dominant paradigm in mobile and web development today is duplex request-response. You call an API with certain inputs, and you get back a response with certain outputs over the same channel, shortly thereafter. This is the world of [OpenAPI (Swagger)](https://swagger.io/docs/specification/about/), and it has many virtues.

Unfortunately, many agents are not good analogs to web servers. They may be mobile devices that turn off at unpredictable intervals and that lack a stable connection to the network. They may need to work peer-to-peer, when the internet is not available. They may need to interact in time frames of hours or days, not with 30-second timeouts. They may not listen over the same channel that they use to talk.

Because of this, the fundamental paradigm for DIDComm is message-based, asynchronous, and simplex. Agent X sends a message over channel A. Sometime later, it may receive a response from Agent Y over channel B. This is much closer to an email paradigm than a web paradigm.

On top of this foundation, it is possible to build elegant, synchronous request-response interactions. All of us have interacted with a friend who's emailing or texting us in near-realtime. However, interoperability begins with a least-common-denominator assumption that's simpler.

#### Message-Level Security, Reciprocal Authentication

The security and privacy goals, and the asynchronous+simplex design decision, break familiar web assumptions in another way. Servers are commonly run by institutions, and we authenticate them with certificates. People and things are usually authenticated to servers by some sort of login process quite different from certificates, and this authentication is cached in a session object that expires. Furthermore, web security is provided at the transport level (TLS); it is not an independent attribute of the messages themselves.

In a partially disconnected world where a communication channel is not assumed to support duplex request-response, and where the security can't be ignored as a transport problem, traditional TLS, login, and expiring sessions are impractical. Furthermore, centralized servers and certificate authorities perpetuate a power and UX imbalance between servers and clients that doesn't fit with the peer-oriented DIDComm.

DIDComm uses public key cryptography, not certificates from some parties and passwords from others. Its security guarantees are independent of the transport over which it flows. It is sessionless (though sessions can *easily* be built atop it). When authentication is required, all parties do it the same way.
