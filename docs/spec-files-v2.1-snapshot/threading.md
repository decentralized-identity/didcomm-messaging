## Threading

DIDComm provides threading as foundation for extremely powerful protocol features. For background on the intent and best practices for threading, please see the [DIDComm Guidebook](https://didcomm.org/book/v2/threading).

### Message IDs

All plaintext DIDComm messages MUST have an `id` property, declared in the [JWM headers](#message-headers). A message without an `id` property SHOULD be considered invalid and SHOULD be rejected; it MUST NOT be interpreted as part of a multi-message interaction.

The value of `id` is a short (&lt;=32 bytes) string consisting entirely of [unreserved URI characters](https://datatracker.ietf.org/doc/html/rfc3986/#section-2.3) &mdash; meaning that it is not necessary to [percent encode](https://en.wikipedia.org/wiki/Percent-encoding) the value to incorporate it in a URI. Beyond this requirement, its format is not strongly constrained, but use of [UUIDs (RFC 4122)](https://datatracker.ietf.org/doc/html/rfc4122) is recommended. Because of the affinity for UUIDs, this field inherits UUID case-sensitivity semantics: it SHOULD be written in lower case but MUST be compared case-insensitively.

The value of an `id` property SHOULD be globally, universally unique; at the very least, it MUST be unique across all interactions visible to the set of parties that see a given set of interactions.

### Threads

A thread is uniquely identified by a thread ID. The thread ID is communicated by including a [`thid` header in the JWM plaintext](#message-headers). The value of `thid` MUST conform to the same constraints as the value of `id`. The DIDComm plaintext message that begins a thread MAY declare this property for the new thread. If no `thid` property is declared in the first message of an interaction, the `id` property of the message MUST be treated as the value of the `thid` as well; that is, the message is interpreted as if both `id` and `thid` were present, containing the same value.

All subsequent messages in a thread MUST include a `thid` header that contains the same value as the `thid` set in the first message of the thread. Messages that do not share the same `thid` MUST NOT be considered a part of the same thread.

### Parent Threads

When one interaction triggers another, the first interaction is called the **parent** of the second. This MAY be modeled by incorporating a `pthid` header in the JWM plaintext of the child. The value of the child's `pthid` header MUST obey the same constraints as `thid` and `id` values.

Suppose a DIDComm-based protocol (and therefore, a thread of messages) is underway in which an issuer wants to give a credential to a holder. Perhaps the issuer asks the prospective holder of the credential to pay for what they're about to receive. For many reasons (including composability, encapsulation, reusability, and versioning), negotiating and consummating payment is best modeled as a separable interaction from credential exchange. Thus, a new thread of messages (dedicated to payment) begins. In this example, the credential issuance interaction (message thread 1) is the parent of the payment interaction (message thread 2). The first message in thread 2 MUST contain a `pthid` header that references the `thid` from thread 1:

```json
{
  "id": "new-uuid-for-payment-thread",
  "pthid": "id-of-old-credential-issuance-thread",
```

When a child protocol is a simple two-party interaction, mentioning the `pthid` in the first message of the child interaction is enough to establish context. However, in protocols involving more than two parties, the first message of the child protocol may not be seen by everyone, so simply mentioning `pthid` once may not provide enough context. Therefore, the rule is that each party in a child protocol MUST learn the identity of the parent thread via the first child protocol message they see. The simplest way to ensure this is to mention the `pthid` with every message in the child protocol.

### Message URIs

The `id`, `thid`, and `pthid` properties of any DIDComm message may be combined to form a URI that uniquely identifies the message (e.g., in debuggers, in log files, in archives). Such a scheme is out of scope for this spec, and support for it is OPTIONAL for implementers. 

### Gaps, Resends, and Sophisticated Ordering

Message IDs and threads can be used to build very powerful features for detecting missing and out-of-order messages &mdash; and to recover from them. For more information, see the [Advanced Sequencing Extension](https://github.com/decentralized-identity/didcomm-messaging/blob/master/extensions/advanced_sequencing/main.md). 
