## Perfect Forward Secrecy

A cryptographic method exhibits perfect forward secrecy (PFS) if the compromise of long-term keys does not allow an attacker to read old messages. The secrecy of the old messages persists forward in time. See [the Wikipedia article](https://en.wikipedia.org/wiki/Forward_secrecy), and also section 6.2 of [this academic article](https://eprint.iacr.org/2005/176.pdf). *This property is valuable to the extent that comm channels are long-lasting and carry many interactions.*

DIDComm does not achieve this property under the familiar definition, because it lacks a session construct that defines how to interpret a phrase like "long-term keys" and "session keys." Whether DIDComm achieves comparable goals is perhaps more interesting.

In TLS, session keys are symmetric keys negotiated during a Diffie-Hellman handshake at the beginning of a [series of request-response interactions that cluster together](https://www.cloudflare.com/learning/ssl/what-is-a-session-key/). Browsers running HTTPS &mdash; the most familiar embodiment of TLS &mdash; typically do a new DH exchange each time a tab is opened to a site's initial page, but not for subsequent requests to fetch graphics, scripts, CSS files, or the content and collateral of subsequent pages. Cryptographic sessions (not to be confused with cookie-based login sessions) may be re-established whenever a socket is re-opened (possibly at intervals only a few seconds apart), or may use techniques like [TLS Session Resumption](https://www.venafi.com/blog/tls-session-resumption) to last for hours or even days.

A simple analysis of DIDComm might map PFS "session keys" to the ephemeral symmetric keys negotiated by the ECDH-1PU key agreement algorithm; this might imply that the static keys in Alice's DID doc would be the "long-term keys" from the PFS definition. In this framing, DIDComm does NOT exhibit PFS, because an attacker that possesses a key from Alice's DID doc can decrypt any old messages sent to that key.

But this analysis misses two important insights:

1. The ephemeral symmetric keys in TLS are two-way and reusable. It makes sense to call them "session" keys. In contrast, the ephemeral symmetric keys negotiated by ECDH-1PU in DIDComm are one-way and single-use only. Calling a one-way delivery of a single message a "session" seems a bit odd. The natural unit of clustered interaction in DIDComm &mdash; what we use "sessions" for in TLS, and what lasts seconds to minutes or hours &mdash; is a single protocol or group of protocols that accomplish one goal for the parties. This is a higher level of abstraction that a single DIDComm message.

2. Only one compromise is contemplated by normal PFS &mdash; the compromise of a single long-term key. But DIDComm is more dynamic. It supports two types of rotation &mdash; rotation of DID doc keys and rotation of DIDs themselves. Moreover, DIDComm supports multiple devices per party, and it encourages the use of pairwise DIDs with a limited lifespan, often not exceeding a single interaction. It is the *value of historic communication* that makes PFS valuable. If DIDComm throws away DIDs after a single brief interaction, then PFS is irrelevant. If DIDComm rotates DIDs on the same time scales as static key rotation in TLS, then it is a *DID's* comm history, not *Alice's* (DID-spanning) comm history, that's endangered by a compromise. And if Alice has a stable DID but updates her DID doc regularly to track an evolving collection of devices, then her vulnerability to long-term key compromise doesn't map very well to the simpler PFS model.

Here are two alternate analyses that suggest DIDComm accomplishes the goals of PFS, even if its approach is unfamiliar. We do NOT advocate these analyses as objectively "true" &mdash; they are mutually incompatible, and unless/until formal definitions are satisfied, it is clearly unwise to rely on loose assertions about cryptographic guarantees. Rather, the point of including them here is to illustrate the importance of assumptions. 

### PFS Reframe 1

In some DIDComm usages, "sessions" might have the same scope as DIDs, and "long-term keys" might have the same scope as a multi-DID-spanning connection between two parties. A compromise of the second "long-term key" (DID and associated keys for all her devices) used by Alice in her relationship with Bob would allow an attacker to read everything sent to Alice in *that session* (while she was using DID #2). However, it wouldn't let the attacker read anything sent to Alice in the previous sessions (with previous DID values). DIDComm would thus accomplish the same goals as perfect forward secrecy.

### PFS Reframe 2

In other DIDComm usages, "sessions" might have the same scope as a single snapshot of the key agreement keys in a DID doc, and "long-term keys" would be the signing keys that authorize updates to a new set of key agreement keys. A compromise of long-term keys would not allow the attacker to decrypt any historical communication at all. DIDComm would thus accomplish the same goals as perfect forward secrecy.

Thus, the guidance on perfect forward secrecy with respect to DIDComm is simple:

>*Understand your goals and your assumptions.*

Consider questions like these: *What is the intended lifespan of a DID in your DIDComm usage patterns? How often are its keys (both encryption and signing) rotated &mdash; and with what purposes?*

DIDComm allows various answers to these questions; depending on the answers, it may or may not provide enough built-in protection of old communication at the point of a future compromise.