## Threading

DIDComm's threading mechanism enables referencing individual messages, the sets of messages that constitute a logically independent interaction (a "run" or "instance" of a protocol), or even the hierarchies of messages that model nested and recursive workflows. This helps with troubleshooting, debugging, error reporting, resend logic, interactions across more than two parties, and patterns of communication that are more flexible or asynchronous than simple request+response.

Some context about the intent and best practices for these features may be helpful:

* For cybersecurity reasons, the `id` properties of related messages SHOULD NOT bear any resemblance to one another; `id` values SHOULD be opaque and SHOULD NOT be used to "tunnel" other semantics. This lack of a detectable relationship should be characteristic of `id` values for messages that stand in sequence to one another, as well as the `id` properties of `forward` messages seen by mediators vis-a-vis the `id` of the innermost plaintext messages they carry.

### Threads

Like threads in email, a **thread** in DIDComm intends to model a discrete interaction. For protocols that have a beginning and end (e.g., exchanging credentials, playing a game of chess, making a payment), a DIDComm thread maps exactly onto the sequence of messages that embody one such interaction; when a new interaction like this starts, the parties MUST impute a new thread to the context.

However, some DIDComm protocols are not obviously discrete. An example of this might be a human-friendly chat; humans don't necessarily perceive crisp interaction boundaries around any given subset of the messages they trade back and forth. In such cases, a thread might map to a topic, a unit of time, or something else. Applications MAY structure the thread construct in whatever way makes sense to the implementers, but MUST describe the threading assumptions of the protocol in the protocol's documentation.

### Parent Threads

Parent threads and child threads do NOT necessarily represent *threads of execution* or concurrency; they only represent logically separable *sequences of messages*. A parent thread MAY trigger multiple child threads, and MAY cascade to multiple levels of nested message threads (for example, issuing a credential triggers payment, which in turn triggers feature discovery). Parent threads and child threads do not have a simple containment or ownership relationship. By definition, a parent is only a trigger &mdash; not necessarily a controller or stakeholder. A parent thread MAY end before or after any of its child threads. Parent and child threads MAY interact or share data, but are not required to do so. (How they do so is out of scope in this spec, but see [Coprotocols](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0478-coprotocols/README.md) for one way to approach this.)

#### Parent and Child Examples

Suppose a DIDComm-based protocol (and therefore, a thread of messages) is underway in which an issuer wants to give a credential to a holder. At a particular stage in this interaction, perhaps the issuer asks the prospective holder of the credential to pay for what they're about to receive. For composability, encapsulation, reusability, and versioning reasons, negotiating and consummating payment is best modeled as a separable interaction from credential exchange &mdash; so a new sequence of messages (dedicated to payment) begins. In this example, the credential issuance interaction (message thread 1) is the parent of the payment interaction (message thread 2). The first message in thread 2 MUST contain a `pthid` header that references the `thid` from thread 1.

>NOTE: When a child protocol is a simple two-party interaction, mentioning the `pthid` in the first message of the child interaction is enough to establish context. However, in protocols involving more than two parties, the first message of the child protocol may not be seen by everyone, so simply mentioning `pthid` once may not provide enough context. Therefore, the rule is that each party in a child protocol MUST learn the identity of the parent thread via the first child protocol message they see. The simplest way to ensure this is to mention the `pthid` with every message in the child protocol. 

Creating a connection is another classic interaction that lends itself to a parent-child paradigm. Alice and Bob rarely connect just to connect; usually they connect so they can conduct some type of business. In such situations, the connection protocol is a parent thread, and whatever business they then conduct becomes a child.

Reporting and resolving errors and warnings is also a good use case for parent and child threads. It is true that problems can be communicated in specialized messages of an individual protocol; some protocols may make this choice. However, problems are often the gateway to deeper troubleshooting or even support tickets, which are complex workflows in their own right. Also, robust mechanisms for logging, analyzing, and reacting to problems may be reusable in many workflows. For this reason, it is recommended to model problem reporting as a child protocol, with an arbitrarily complex thread of messages as child to the parent workflow that triggered them. See [Reporting and Handling Problems](#reporting-and-handling-problems) for more info.

Sometimes the parent of a thread is not known, or is so independent of its child as to be irrelevant. If Alice and Bob connected three years ago, each new interaction that they begin doesn't need to declare a `pthid` that references the original interaction that connected them. Declare a parent relationship for a thread when it is likely to be useful.

### DIDComm Message URIs

The `id`, `thid`, and `pthid` properties of any DIDComm message may be combined to form a URI that uniquely identifies the message (e.g., in debuggers, in log files, in archives). When this is further combined with [JSPath](https://github.com/dfilatov/jspath#quick-example), individual elements of messages may also be hyperlinked. See [Linkable Message Paths](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0217-linkable-message-paths/README.md). Such a scheme is out of scope for this spec, and support for it is NOT required of implementers. However, this spec reserves the `didcomm://` URI prefix for future work with semantics like these.
