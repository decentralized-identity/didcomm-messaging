## Threading

DIDComm provides a mechanism for referencing individual messages, the sets of messages that constitute a logically independent interaction (a "run" or "instance" of a protocol), or even the hierarchies of messages that model nested and recursive workflows. This helps with troubleshooting, debugging, error reporting, resend logic, interactions across more than two parties, and patterns of communication that are more flexible or asynchronous than simple request+response. It is the foundation for extremely powerful protocol features.

### Message IDs

All plaintext DIDComm messages MUST have an `id` property, declared in the JWM header. A message without an `id` property SHOULD be considered invalid and SHOULD be rejected; it MUST NOT be interpreted as part of a multi-message interaction.

The value of `id` is a short (<=128 bytes) string consisting entirely of [unreserved URI characters](https://datatracker.ietf.org/doc/html/rfc3986/#section-2.3) -- meaning that it is not necessary to [percent encode](https://en.wikipedia.org/wiki/Percent-encoding) the value to incorporate it in a URI. Beyond this requirement, its format is not strongly constrained, but use of [UUIDs (RFC 4122)](https://datatracker.ietf.org/doc/html/rfc4122) is recommended. Because of the affinity for UUIDs, this field inherits UUID case-sensitivity semantics: it SHOULD be written in lower case but MUST be compared case-insensitively.

The value of an `id` property SHOULD be globally, universally unique; at the very least, it MUST be unique across all interactions visible to the set of parties that see a given set of interactions.

>NOTE: For cybersecurity reasons, the `id` properties of related messages SHOULD NOT bear any resemblance to one another; `id` values SHOULD be opaque and SHOULD NOT be used to "tunnel" other semantics. This lack of a detectable relationship should be characteristic of `id` values for messages that stand in sequence to one another, as well as the `id` properties of `forward` messages seen by mediators vis-a-vis the `id` of the innermost plaintext messages they carry.

### Threads

Like threads in email, a **thread** in DIDComm intends to model a discrete interaction. For protocols that have a beginning and end (e.g., exchanging credentials, playing a game of chess, making a payment), a DIDComm thread maps exactly onto the sequence of messages that embody one such interaction; when a new interaction like this starts, the parties MUST impute a new thread to the context.

However, some DIDComm protocols are not obviously discrete. An example of this might be a human-friendly chat; humans don't necessarily perceive crisp interaction boundaries around any given subset of the messages they trade back and forth. In such cases, a thread might map to a topic, a unit of time, or something else. Applications MAY structure the thread construct in whatever way makes sense to the implementers, but MUST describe the threading assumptions of the protocol in the protocol's documentation.

A thread is uniquely identified by a thread ID. The thread ID is communicated by including a `thid` header in the JWM plaintext of the message. The value of `thid` MUST conform to the same constraints as the value of `id`. The DIDComm plaintext message that begins a thread MAY declare this property for the new thread. If no `thid` property is declared in the first message of an interaction, the `id` property of the message is used as `thid` as well; that is, the message is interpreted as if both `id` and `thid` were present, containing the same value.

All subsequent messages in a thread MUST include a `thid` header that contains the same value as the `thid` set in the first message of the thread. Messages that do not share the same `thid` MUST NOT be imputed to the same thread.

### Parent Threads

When one interaction triggers another, the first interaction is called the **parent** of the second. This can be modeled by incorporating a `pthid` header in the JWM plaintext. The value of the `pthid` header MUST obey the same constraints as `thid` and `id` values.

Parent threads and child threads do NOT necessarily represent *threads of execution* or concurrency; they only represent logically separable *sequences of messages*. A parent thread MAY trigger multiple child threads, and MAY cascade to multiple levels of nested message threads (for example, issuing a credential triggers payment, which in turn triggers feature discovery). Parent threads and child threads do not have a simple containment or ownership relationship. By definition, a parent is only a trigger &mdash; not necessarily a controller or stakeholder. A parent thread MAY end before or after any of its child threads. Parent and child threads MAY interact or share data, but are not required to do so. (How they do so is out of scope in this spec, but see [Coprotocols](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0478-coprotocols/README.md) for one way to approach this.)

#### Parent and Child Examples

Suppose a DIDComm-based protocol (and therefore, a thread of messages) is underway in which an issuer wants to give a credential to a holder. At a particular stage in this interaction, perhaps the issuer asks the prospective holder of the credential to pay for what they're about to receive. For composability, encapsulation, reusability, and versioning reasons, negotiating and consummating payment is best modeled as a separable interaction from credential exchange &mdash; so a new sequence of messages (dedicated to payment) begins. In this example, the credential issuance interaction (message thread 1) is the parent of the payment interaction (message thread 2). The first message in thread 2 MUST contain a `pthid` header that references the `thid` from thread 1.

>NOTE: When a child protocol is a simple two-party interaction, mentioning the `pthid` in the first message of the child interaction is enough to establish context. However, in protocols involving more than two parties, the first message of the child protocol may not be seen by everyone, so simply mentioning `pthid` once may not provide enough context. Therefore, the rule is that each party in a child protocol MUST learn the identity of the parent thread via the first child protocol message they see. The simplest way to ensure this is to mention the `pthid` with every message in the child protocol. 

Creating a connection is another classic interaction that lends itself to a parent-child paradigm. Alice and Bob rarely connect just to connect; usually they connect so they can conduct some type of business. In such situations, the connection protocol is a parent thread, and whatever business they then conduct becomes a child.

Reporting and resolving errors and warnings is also a good use case for parent and child threads. It is true that problems can be communicated in specialized messages of an individual protocol; some protocols may make this choice. However, problems are often the gateway to deeper troubleshooting or even support tickets, which are complex workflows in their own right. Also, robust mechanisms for logging, analyzing, and reacting to problems may be reusable in many workflows. For this reason, it is recommended to model problem reporting as a child protocol, with an arbitrarily complex thread of messages as child to the parent workflow that triggered them. See [Reporting and Handling Problems](#reporting-and-handling-problems) for more info.

Sometimes the parent of a thread is not known, or is so independent of its child as to be irrelevant. If Alice and Bob connected three years ago, each new interaction that they begin doesn't need to declare a `pthid` that references the original interaction that connected them. Declare a parent relationship for a thread when it is likely to be useful.

### DIDComm Message URIs

The `id`, `thid`, and `pthid` properties of any DIDComm message may be combined to form a URI that uniquely identifies the message (e.g., in debuggers, in log files, in archives). When this is further combined with [JSPath](https://github.com/dfilatov/jspath#quick-example), individual elements of messages may also be hyperlinked. See [Linkable Message Paths](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0217-linkable-message-paths/README.md). Such a scheme is out of scope for this spec, and support for it is NOT required of implementers. However, this spec reserves the `didcomm://` URI prefix for future work with semantics like these.

### Advanced Sequencing

In a simple interaction between two parties that consists of a request and a response, the message types usually imply the order without ambiguity. However, some protocols have more complex requirements. For example, an auction protocol that consists of `bid` messages might produce different outcomes depending on whether a lower bid arrives before or after a higher bid. When such protocols unfold over asynchronous transports that don't guarantee a delivery order, and when more than two participants are involved, understanding the intended sequence requires extra data.

For this reason, DIDComm messages offer three headers, `sender_order`, `sent_count`, and `received_orders`. These headers are only relevant to certain protocols. Protocol definitions MUST declare whether they use any of these headers. This is because general implementations of DIDComm are not required to implement support for the headers unless/until they intend to support protocols that use them.

The `sender_order` header tells other parties how the sender of a message perceives their own ordering. Its value is a monotonically increasing natural/ordinal number (1..<var>N</var>) that tells how many different messages the sender has sent in the current thread. When Alice and Bob are both bidding in an auction protocol, each of them marks their first bid with `sender_order: 1`, their second bid with `sender_order: 2`, and so forth. This allows the auctioneer to detect if Alice's bids arrive in a different order than she intended. It also means that any message can be uniquely identified by its `thid`, the sender, and the value of that sender's `sender_order`. Note how this does NOT clarify the sequence of Alice's messages relative to Bob's.

The `sent_count` header enables resend behavior. A resent message contains the same headers (including `id` and `sender_order`) and body as a previous transmission. The first time a message is sent, the `sent_count` for that message is 1, and the header is normally omitted (the value of the header is implicitly 1). The second time the message is sent, the `sent_count` is 2, and the header is added to indicate that the message might be redundant ("this is the second time I've sent this to you"). The header continues to be incremented with each subsequent resend. Once a recipient has received one copy of a message, they MUST ignore subsequent copies that arrive, such that resends are idempotent.

The `received_orders` header tells other parties how the sender has experienced the unfolding interaction so far. This allows gaps to be detected, possibly triggering a resend. The value of this header is an array of *gap detector* objects in the format `{"id":<did of party>, "last":<value of biggest sender_order seen from this party>, "gaps": []}`. In our running auction example, if the auctioneer sees bids 1 and 2 from Bob, and bid 1 and 4 from Alice, the auctioneer might send a message to all the bidders that includes the following `received_orders` header:

```json
"received_orders": [
  {"id": "did:ex:bob", "last": 2, "gaps"=[]},
  {"id": "did:ex:alice", "last": 4, "gaps"=[2,3]}      
]
```

This lets Alice (or Bob) notice that the auctioneer hasn't seen the messages that Alice numbered 2 and 3. Gaps can then be plugged or ignored, depending on protocol rules. 