## Threading

DIDComm's threading mechanism enables referencing individual messages, the sets of messages that constitute a logically independent interaction (a "run" or "instance" of a protocol), or even the hierarchies of messages that model nested and recursive workflows. This helps with troubleshooting, debugging, error reporting, resend logic, interactions across more than two parties, and patterns of communication that are more flexible or asynchronous than simple request+response.

Some context about the intent and best practices for these features may be helpful:

* For cybersecurity reasons, the `id` properties of related messages are intended not to bear any resemblance to one another; `id` values are expected to be opaque and will likely cause additional issues if they include overloaded semantics that are unique to a particular implementation. This lack of a detectable relationship should be characteristic of `id` values for messages that stand in sequence to one another, as well as the `id` properties of `forward` messages seen by mediators vis-a-vis the `id` of the innermost plaintext messages they carry.

### Threads

Like threads in email, a **thread** in DIDComm intends to model a discrete interaction. For protocols that have a beginning and end (e.g., exchanging credentials, playing a game of chess, making a payment), a DIDComm thread maps exactly onto the sequence of messages that embody one such interaction; when a new interaction like this starts, the parties are expected to impute a new thread to the context.

However, some DIDComm protocols are not obviously discrete. An example of this might be a human-friendly chat; humans don't necessarily perceive crisp interaction boundaries around any given subset of the messages they trade back and forth. In such cases, a thread might map to a topic, a unit of time, or something else. Applications can structure the thread construct in whatever way makes sense to the implementers, but MUST describe the threading assumptions of the protocol in the protocol's documentation.

### Parent Threads

Parent threads and child threads do not necessarily represent *threads of execution* or concurrency; they only represent logically separable *sequences of messages*. A parent thread can trigger multiple child threads, whuch could cascade to multiple levels of nested message threads (for example, issuing a credential triggers payment, which in turn triggers feature discovery). Parent threads and child threads do not have a simple containment or ownership relationship. By definition, a parent is only a trigger &mdash; not necessarily a controller or stakeholder. A parent thread has no guarantees about its lifecycle and could end before or after any of its child threads. Parent and child threads also can interact or share data, but are not required to do so. (How they do so is out of scope in this spec, but see [Coprotocols](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0478-coprotocols/README.md) for one way to approach this.)

#### Parent and Child Examples

Creating a connection is a classic interaction that lends itself to a parent-child paradigm. Alice and Bob rarely connect just to connect; usually they connect so they can conduct some type of business. In such situations, the connection protocol is a parent thread, and whatever business they then conduct becomes a child.

Reporting and resolving errors and warnings is also a good use case for parent and child threads. It is true that problems can be communicated in specialized messages of an individual protocol; some protocols may make this choice. However, problems are often the gateway to deeper troubleshooting or even support tickets, which are complex workflows in their own right. Also, robust mechanisms for logging, analyzing, and reacting to problems may be reusable in many workflows. For this reason, it is recommended to model problem reporting as a child protocol, with an arbitrarily complex thread of messages as child to the parent workflow that triggered them. See [Reporting and Handling Problems](#reporting-and-handling-problems) for more info.

Sometimes the parent of a thread is not known, or is so independent of its child as to be irrelevant. If Alice and Bob connected three years ago, each new interaction that they begin doesn't need to declare a `pthid` that references the original interaction that connected them. Declare a parent relationship for a thread when it is likely to be useful.

### DIDComm Message URIs

It's generally considered this functionality will be combined with [JSPath](https://github.com/dfilatov/jspath#quick-example) or [JS Pointer](https://datatracker.ietf.org/doc/html/rfc6901) so individual elements of messages may also be hyperlinked. For a good idea of the concepts that we'd like to enable with this capability, see [Linkable Message Paths](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0217-linkable-message-paths/README.md).
