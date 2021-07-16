## When Problems Happen

Detecting, reporting, and handling problems is a challenge in any system. The challenge deepens when systems are decentralized, consist of components written by independent teams, and communicate asynchronously. This is the landscape over which DIDComm operates.

To the extent that it is practical, DIDComm must surface problems, and their supporting contexts, to people and/or automated systems that want to know about them (and perhaps separately, to entities that can actually fix them). ("Practical" here means that it can be done with reasonable effort and without undermining DIDComm's security, privacy, or other technical goals.)

DIDComm offers several simple mechanisms to deal with challenges. They are not difficult to implement, but collectively they offer attractive robustness and clarity.

### Low-level mechanisms

#### Timeouts

A DIDComm message often SHOULD use the `expires_time` header to announce when its sender will consider the message invalid. This allows for state to be reset in a predictable way. The `expires_time` header is so common that it is discussed in the general [Message Headers](#message-headers) section of the spec. Best practice with timeouts is [discussed in the Implementers Guide](../guide-files/problems.md#timeouts).

#### ACKs

Any DIDComm message MAY use the `please_ack` header to request a read receipt from a recipient. Cooperative parties who wish to honor this request MUST include an `ack` header on a subsequent message, where the value of the header is an array that contains the `id` of one or more messages being acknowledged.

#### Threads

Any DIDComm message that continues a previously begun application-level protocol MUST use a `thid` property that associates it with the proper context. This context is vital for error handling. See [Threading](#threading).

In addition, messages MAY use the [Advanced Sequencing](../../extensions/advanced_sequencing/main.md) extension to detect gaps in delivery or messages arriving out of order.

### Explicit problem reports

DIDComm features a standard method for reporting problems (errors) to other parties. This is not always possible (e.g., when a sender has o route to the other party, or when a recipient's crypto is incompatible with a sender's). But when it is possible, it can be very helpful.

>NOTE: DIDComm calls these things "problems" instead of "errors" because we use the same reporting mechanism for both errors and warnings.

The mechanism requires the reporting party to send a simple message called a **problem report** that looks like this:

```json
{
  "type": "https://didcomm.org/notify/1.0/problem-report",
  "id": "7c9de639-c51c-4d60-ab95-103fa613c805",
  "pthid": "1e513ad4-48c9-444e-9e7e-5b8b45c5e325",
  "body": {
    "code": "cant-find-route",
    "comment": "Unable to find a route to the specified recipient.",
    "args": [
      "did:sov:C805sNYhMrjHiqZDTUASHg"
    ],
    "cause": "",
    "trigger": "did:example:foo",
    "state_outcome": null,
    "escalate_to": "mailto:admin@foo.org"
  }
}
```

The `pthid` header MUST be included with problem reports. It should contain the `thid` of the thread in which the problem occurred. (Thus, the problem report begins a new child thread, of which the triggering context is the parent.)

The required `code` field is a machine-readable string -- lower kabob case by convention -- that identifies the problem. Codes are formally defined in and namespaced by the protocol definitions where they are triggered -- so in the example above, the protocol that was underway in thread `1e513ad4-48c9-444e-9e7e-5b8b45c5e325` defined a code, `cant-find-route` that was used in this problem report.

The optional `comment` field contains localizable, human-friendly text.

The optional `args` field contains args that are associated with the code when it is defined. In this example, `args` apparently lists a DID that cannot be routed.

The optional `cause` field allows the sender to include a stack trace or other background material to explain what triggered the error. This is akin to the `cause` property of Java's `Throwable`. 

The optional `owner` field declares who the reporter of the problem considers to have the responsibility to do something about it. Typically this would be one of the parties in the protocol. If the sender plans to retry, it would be the sender's DID; if the sender wants to recipient to fix the problem, it would be the recipient's DID.

The required `state_outcome` field tells what the sender's state state machine is in, in the parent protocol, after processing this error. In this case, the sender's state has reverted to `null`, meaning it considers the protocol to be aborted.

The optional `escalate_to` field provides a URI where additional help on the issue can be received.

### Route Tracing

To troubleshoot routing issues, DIDComm offers a header, `trace`. Any party that processes a DIDComm plaintext message containing this header MAY do an HTTP POST of a **route trace report** to the URI in the header's value.

>Note: This mechanism is not intended to profile timing or performance, and thus does not cover the same problem space as technologies like [OpenTracing](https://opentracing.io/). It also *spans* trust domains (paralleling a message's journey from Alice to a web service hosting Bob's endpoint, to Bob himself) -- and thus differs in scope from in-house logging and monitoring technolgies like Splunk and Kibana. Although DIDComm tracing could be integrated with these other technologies, doing so in a methodical way is probably an antipattern; it may indicate a misunderstanding about its purpose as a tool for ad hoc debugging or troubleshooting between unrelated parties.

[TODO: describe the trace report.] For example, in a message for Bob that is double-wrapped (once for his external mediator and once for his cloud agent), three plaintext messages might contain `trace` headers:

1. The outermost message, decrypted by Bob's external mediator, containing forwarding instructions to Bob's cloud agent.
2. The center message, decrypted by Bob's cloud agent, containing an inner encrypted payload and instructions to forward it to Bob's DID.
3. The inner message, seen by Bob's iPhone.

If Alice, the sender of this message, includes a `trace` header on each one, and if handlers of this message along the route cooperate with her request to trace, then Alice can learn where in a route a message delivery is failing.

Tracing has security, privacy, and performance implications. Support for tracing is not required of DIDComm implementations, but it is recommended for parties that need sophisticated debugging. Parties that implement tracing MUST decide whether or not to honor trace requests based upon a policy that ensures accountability and transparency, and MUST default to reject tracing requests unless they have independent reason to believe that appropriate safeguards are in place.

### Incompatible crypto 

What if the problem that you're trying to report is that the other agent is using a type of crypto you can't support? Sending a `problem report` seems problematic...

[TODO: explain why this is a corner case. Show flow chart that shows remedial actions to take.]