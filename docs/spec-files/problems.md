## When Problems Happen

Detecting, reporting, and handling problems is a challenge in any system. The challenge deepens when systems are decentralized, consist of components written by independent teams, and communicate asynchronously. This is the landscape over which DIDComm operates.

To the extent that it is practical, DIDComm must surface problems, and their supporting contexts, to people and/or automated systems that want to know about them (and perhaps separately, to entities that can actually fix them). ("Practical" here means that it can be done with reasonable effort and without undermining DIDComm's security, privacy, or other technical goals.)

DIDComm offers several tools to deal with these issues. Individually they are easy to use; collectively they offer attractive robustness and clarity.

### Low-level tools

#### Timeouts

In many cases, a DIDComm message SHOULD use the `expires_time` header to announce when its sender will consider the message invalid. This allows for state to be reset in a predictable way. The `expires_time` header is so common that it is discussed in the general [Message Headers](#message-headers) section of the spec. Best practice with timeouts is [discussed in the Implementers Guide](../guide-files/problems.md#timeouts).

#### ACKs

Any DIDComm message MAY use the `please_ack` header to request a read receipt from a recipient. Cooperative parties who wish to honor this request MUST include an `ack` header on a subsequent message, where the value of the header is an array that contains the `id` of one or more messages being acknowledged.

#### Threads

Any DIDComm message that continues a previously begun application-level protocol MUST use a `thid` property that associates it with the prior context. This context is vital for error handling. See [Threading](#threading).

In addition, messages MAY use the [Advanced Sequencing](../../extensions/advanced_sequencing/main.md) extension to detect gaps in delivery or messages arriving out of order.

### Problem reports

DIDComm features a standard mechanism for reporting problems to other entities. These could be parties in the active protocol, or logging products, or internal health monitors, or human tech support staff. Reporting problems remotely is not always possible (e.g., when a sender lacks a route to the other party, or when a recipient's crypto is incompatible with a sender's). Using this mechanism is therefore not a general *requirement* of DIDComm, but it *is* a best practice because it improves robustness and human experience. (But be aware of some [cybersecurity considerations](../guide#cybersecurity-considerations-for-problem-reports).)

Other entities are notified of problems by sending a simple message called a **problem report** that looks like this:

```json
{
  "type": "https://didcomm.org/notify/1.0/problem-report",
  "id": "7c9de639-c51c-4d60-ab95-103fa613c805",
  "pthid": "1e513ad4-48c9-444e-9e7e-5b8b45c5e325",
  "body": {
    "code": "e.p.xfer.cant-use-endpoint",
    "comment": "Unable to use the {1} endpoint for {2}.",
    "args": [
      "https://agents.r.us/inbox",
      "did:sov:C805sNYhMrjHiqZDTUASHg"
    ],
    "escalate_to": "mailto:admin@foo.org"
  }
}
```

The `pthid` header MUST be included with problem reports. Its value is the `thid` of the thread in which the problem occurred. (Thus, the problem report begins a new child thread, of which the triggering context is the parent. The parent context can react immediately to the problem, or can suspend progress while troubleshooting occurs.)

The `code` field is worthy of its own section; [see below](#problem-codes).

The optional `comment` field contains human-friendly text describing the problem. The text MUST be statically associated with `code`, meaning that each time circumstances trigger a problem with the same `code`, the value of `comment` will be the same. This enables [localization](#i18n) and cached lookups, and it has some [cybersecurity benefits](#cybersecurity-implications). The value of `comment` supports simple interopolation with `args` (see next), where args are referenced as `{1}`, `{2}`, and so forth. 

The optional `args` field contains situation-specific values that are interpolated into the value of `comment`, providing extra detail for human readers. Each unique problem code has a definition for the args it takes. In this example, `e.p.xfer.cant-use-endpoint` apparently expects two values in `args`: the first is a URL and the second is a DID. Missing or null args MUST be replaced with a question mark character (`?`) during interpolation; extra args MUST be appended to the main text as comma-separated values. 

The optional `escalate_to` field provides a URI where additional help on the issue can be received.

#### Problem Codes

Perhaps the most important feature of each problem report message is its `code` field. This required value is the main piece of data that recipient software uses to automate reactions. It categorizes what went wrong.

Problem codes are lower kabob-case. They are structured as a sequence of tokens delimited by the dot character `.`, with the tokens being more general to the left, and more specific to the right. Because recipients can do matching by prefix instead of full string, a recipient can recognize and handle broad semantics even if the trailing tokens of the string contain unfamiliar details. In the example below, for example, relatively sophisticated handling is possible even if a recipient only recognizes the `e.p.xfer.` portion of the code.

![problem code structure](problem-code-structure.png)

##### Sorter

The leftmost component of a problem code is its **sorter**. This is a single character that tells whether the consequence of the problem are fully understood. Two values are defined:

* **`e`**: This problem clearly defeats the intentions of at least one of the parties. It is therefore an **error**. A situation with error semantics might be that a protocol requires payment, but a payment attempt was rejected.
* **`w`**: The consequences of this problem are not obvious to the reporter; evaluating its effects requires judgment from a human or from some other party or system. Thus, the message constitutes a **warning** from the sender's perspective. A situation with warning semantics might be that a sender is only able to encrypt a message for some of the recipient's `keyAgreement` keys instead of all of them (perhaps due to an imperfect overlap of supported crypto types). The sender in such a situation might not know whether the recipient considers this an error.

>Note:  What distinguishes an error from a warning is *clarity about its consequences*, not its *severity*. This clarity is inherently contextual. A warning might prove to be just as problematic as an error, once it's fully evaluated. This implies that the same problem can be an error in some contexts, and a warning in others. In our example above, we imagined a payment failure as an error. But if this problem occurs in a context where retries are expected, and there's a good chance of future success, perhaps the problem is a warning the first three times it's reported &mdash; then becomes an error when all hope is lost.

##### Scope

Reading left to right, the next token in a problem code is called the **scope**. This gives the sender's opinion about how much context should be undone if the problem is deemed an error.

>Note: A problem always sorts according to the most pessimistic view that is taken by participants in the protocol. If the sender of a problem report deems it an error, then it is. If the sender deems it a warning, but a recipient with greater context decides that it clearly frustrates their goals, then it becomes an error; see [Replying to Warnings](#replying-to-warnings). Thus, *scope* is relevant even if the sender chooses a problem code that starts with `w`.)

The possible values of *scope* are:

* **`p`**: The protocol within which the error occurs (and any [co-protocols](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0478-coprotocols/README.md) started by and depended on by the protocol) is abandoned or reset. In simple two-party request-response protocols, the `p` reset scope is common and appropriate. However, if a protocol is complex and long-lived, the `p` reset scope may be undesirable. Consider a situation where a protocol helps a person apply for college, and the problem code is `e.p.payment-failed`. With such a `p` reset scope, the entire apply-for-college workflow (collecting letters of recommendation, proving qualifications, filling out various forms) is abandoned when the payment fails.  

* **`m`**: The error was triggered by the previous message on the thread; the scope is one message. The outcome is that the problematic message is rejected (has no effect). If the protocol is a chess game, and the problem code is `e.m.invalid-move`, then someone's invalid move is rejected, and it is still their turn.

* **A formal *state name* from the sender's state machine in the active protocol.** This means the error represented a partial failure of the protocol, but the protocol as a whole is not abandoned. Instead, the sender uses the scope to indicate what state it reverts to. If the protocol is one that helps a person apply for college, and the problem code is `e.get-pay-details.payment-failed`, then the sender is saying that, because of the error, it is moving back to the `get-pay-details` state in the larger workflow.

##### Descriptors

After the *sorter* and the *scope*, problem codes consist of one or more **descriptors**. These are kabob-case tokens separated by the `.` character, where the semantics get progressively more detailed reading left to right. Senders of problem reports SHOULD include at least one descriptor in their problem code, and SHOULD use the most specific descriptor they can. Recipients MAY specialize their reactions to problems in a very granular way, or MAY examine only a prefix of a problem code.

The following descriptor tokens are defined. They can be used by themselves, or as prefixes to more specific descriptors. Additional descriptors &mdash; particularly more granular ones &mdash; may be defined in individual protocols.

Token | Value of `comment` string | Notes
--- | --- | ---
`trust` | Failed to achieve required trust. | Typically this code indicates incorrect or suboptimal behavior by the sender of a previous message in a protocol. For example, a protocol required a known sender but a message arrived anoncrypted instead &mdash; or the encryption is well formed and usable, but is considered weak. Problems with this descriptor are similar to those reported by HTTP's `401`, `403`, or `407` status codes.
`trust.crypto` | Cryptographic operation failed. | A cryptographic operation cannot be performed, or it gives results that indicate tampering or incorrectness. For example, a key is invalid &mdash; or the key types used by another party are not supported &mdash; or a signature doesn't verify &mdash; or a message won't decrypt with the specified key.
`xfer` | Unable to transport data. | The problem is with the mechanics of moving messages or associated data over a transport. For example, the sender failed to download an external attachment &mdash; or attempted to contact an endpoint, but found nobody listening on the specified port.
`did` | DID is unusable. | A DID is unusable because its method is unsupported &mdash; or because its DID doc cannot be parsed &mdash; or because its DID doc lacks required data.
`msg` | Bad message. | Something is wrong with content as seen by application-level protocols (i.e., in a plaintext message). For example, the message might lack a required field, use an unsupported version, or hold data with logical contradictions. Problems in this category resemble HTTP's `400` status code.
`me` | Internal error. | The problem is with conditions inside the sender's system. For example, the sender is too busy to do the work entailed by the next step in the active protocol. Problems in this category resemble HTTP's `5xx` status codes.
`me.res` | A required resource is inadequate or unavailable. | The following subdescriptors are also defined: `me.res.net`, `me.res.memory`, `me.res.storage`, `me.res.compute`, `me.res.money`
`req` | Circumstances don't satisfy requirements. | A behavior occurred out of order or without satisfying certain preconditions &mdash; or circumstances changed in a way that violates constraints. For example, a protocol that books plane tickets fails because, halfway through, it is discovered that all tickets on the flight have been sold.
`req.time` | Failed to satisfy timing constraints. | A message has expired &mdash; or a protocol has timed out &mdash; or it is the wrong time of day/day of week.
`legal` | Failed for legal reasons. | An injunction or a regulatory requirement prevents progress on the workflow. Compare HTTP status code `451`. 

#### Replying to Warnings

When Alice sends a `w.*` problem report to Bob, and Bob decides that the warning is actually an error, he SHOULD reply to Alice to let her know about the consequences of his evaluation. Bob's reply is another `problem-report` message. It looks very similar to Alice's original, except:

* The `code` in Bob's message now begins with `e.`. The remainder of the code MAY (often will be) identical, but this is not required; if Bob knows more details than Alice did, he SHOULD provide them. The *scope* in Bob's code MUST be at least as broad as the scope in Alice's original message. (For example, Bob MUST NOT use scope `m` to say the protocol continues with only a bad message ignored, if Alice's original warning said she considered the scope to be `p`.)
* The `args` property may or may not match.  
* The `id` header for Bob's message has a new value. (Bob's message and Alice's MUST both be part of the same thread, so Bob's message is processed as a reply to Alice's. See [Threading](#threading).)

#### Cascading Problems

Many problems may be experienced during a long-running or complex protocol. Implementers must have the option of tolerating and recovering from them, if we want robustness; perhaps several network retries will be followed by eventual success. However, care must be exercised to prevent situations where malformed or careless problem reports trigger infinite recursion or vicious cycles: 

1. Implementations SHOULD consider implementing a [circuit breaker design pattern](https://codecraft.co/2013/01/11/dont-forget-the-circuit-breakers/) to prevent this problem.
1. [Timeouts](#timeouts) SHOULD be used judiciously.
1. Implementations SHOULD use their own configuration or judgment to establish some type of max error count as they begin a protocol instance. This limit could be protocol-specific, and could be evaluated per unit time (e.g., in a human chat protocol of infinite duration, perhaps the limit is max errors per hour rather than max errors across all time). If implementations establish such a limit, they SHOULD check to see whether this count has been exceeded, both when they receive and when they emit errors. If the limit is crossed as a result of a problem report they *receive*, they SHOULD send back a problem report with `"code": "e.p.req.max-errors-exceeded"` to abort the protocol. If the limit is crossed as a result of an error they are emitting, they MUST NOT emit the problem report for the triggering error; instead, they MUST emit a problem report with `"code": "e.p.req.max-errors-exceeded"` to abort the protocol. In either case, they MUST cease responding to messages that use the `thid` of that protocol instance, once this limit has been crossed.

### Route Tracing

To troubleshoot routing issues, DIDComm offers a header, `trace`. Any party that processes a DIDComm plaintext message containing this header MAY do an HTTP POST of a **route trace report** to the URI in the header's value.

>Note: This mechanism is not intended to profile timing or performance, and thus does not cover the same problem space as technologies like [OpenTracing](https://opentracing.io/). It also *spans* trust domains (paralleling a message's journey from Alice to a web service hosting Bob's endpoint, to Bob himself) -- and thus differs in scope from in-house logging and monitoring technolgies like Splunk and Kibana. Although DIDComm tracing could be integrated with these other technologies, doing so in a methodical way is probably an antipattern; it may indicate a misunderstanding about its purpose as a tool for ad hoc debugging or troubleshooting between unrelated parties.

[TODO: describe the trace report.] For example, in a message for Bob that is double-wrapped (once for his external mediator and once for his cloud agent), three plaintext messages might contain `trace` headers:

1. The outermost message, decrypted by Bob's external mediator, containing forwarding instructions to Bob's cloud agent.
2. The center message, decrypted by Bob's cloud agent, containing an inner encrypted payload and instructions to forward it to Bob's DID.
3. The inner message, seen by Bob's iPhone.

If Alice, the sender of this message, includes a `trace` header on each one, and if handlers of this message along the route cooperate with her request to trace, then Alice can learn where in a route a message delivery is failing.

Tracing has security, privacy, and performance implications. Support for tracing is not required of DIDComm implementations, but it is recommended for parties that need sophisticated debugging. Parties that implement tracing MUST decide whether or not to honor trace requests based upon a policy that ensures accountability and transparency, and MUST default to reject tracing requests unless they have independent reason to believe that appropriate safeguards are in place.

