## Routing

### Routing Protocol

#### Name and Version

The name of this protocol is "Routing Protocol", and its [version](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0003-protocols/semver.md) is "2.0". It is uniquely identified by the [PIURI](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0003-protocols/uris.md#piuri):

    https://didcomm.org/routing/2.0

#### Roles

There are 3 roles in the protocol: `sender`, `mediator`, and `recipient`. The sender emits messages of type `forward` to the `mediator`. The mediator unpacks (decrypts) the payload of an encrypted `forward` message and passes on the result (an opaque blob that probably contains a differently encrypted payload) to the `recipient`.

![ordinary sequence](../collateral/routing-roles.png)

>Note: the protocol is one-way; the return route for communication might not exist at all, or if it did, it could invert the roles of sender and receiver and use the same mediator, or it could use one or more different mediators, or it could use no mediator at all. This is a separate concern partly specified by the service endpoints in the DID docs of the sender and receiver, and partly explored in [RFC 0092: Transports Return Route](https://github.com/hyperledger/aries-rfcs/blob/master/features/0092-transport-return-route/README.md). 

>Note: When the mediator is the routing agent of a single identity subject like Alice, the logical receiver is Alice herself, but the physical receiver may manifest as multiple edge devices (a phone, a laptop, a tablet). From the perspective of this protocol, multiplexing the send from mediator to receiver is out of scope for interoperability--compatible and fully supported, but not required or specified in any way.

In this protocol, the sender and the receiver never interact directly; they only interact via the mediator.

The sender can decorate the `forward` message in standard DIDComm ways: using [`~timing.expires_time`, `~timing.delay_milli` and `~timing.wait_until_time`](https://github.com/hyperledger/aries-rfcs/blob/master/features/0032-message-timing/README.md#tutorial) to introduce timeouts and delays, and so forth. However, the mediator is NOT required to support or implement any of these mixin semantics; only the core forwarding behavior is indispensable. If a mediator sees a decorator that requests behavior it doesn't support, it MAY return a [`problem-report`](https://github.com/hyperledger/aries-rfcs/blob/master/features/0035-report-problem/README.md) to the sender identifying the unsupported feature, but it is not required to do so, any more than other recipients of DIDComm messages would be required to complain about unsupported decorators in messages they receive.

>One particular decorator is worth special mention here: [`~please_ack`](https://github.com/hyperledger/aries-rfcs/blob/master/features/0015-acks/README.md#requesting-an-ack-please_ack). This decorator is intended to be processed by ultimate recipients, not mediators. It imposes a burden of backward-facing communication that mediators should not have. Furthermore, it may be used to probe a delivery chain in a way that risks privacy for the receiver. Therefore, senders SHOULD NOT use this, and mediators SHOULD NOT honor it if present. If a sender wishes to troubleshoot, the [message tracing](https://github.com/hyperledger/aries-rfcs/blob/master/features/0034-message-tracing/README.md) mechanism is recommended.

#### States

Since data flow is normally one-way, and since the scope of the protocol is a single message delivery, a simplistic way to understand it might be as two instances of the stateless [notification pattern](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0003-protocols/notification.png), unfolding in sequence.

However, this doesn't quite work on close inspection, because the mediator is at least potentially stateful with respect to any particular message; it needs to be if it wants to implement delayed delivery or retry logic. (Or, as noted earlier, the possibility of sending to multiple physical receivers. Mediators are not required to implement any of these features, but the state machine needs to account for their possibility.) Plus, the notification terminology obscures the sender and receiver roles. So we use the following formalization:

![](../collateral/routing-state-machines.png)]
Src: [state machine diagram on gdocs](https://docs.google.com/spreadsheets/d/1zxm3cPZ1UDQPDpYJjGmg_qY8451WMk105HBSARJkvDI/edit#gid=0)

#### Messages

The only message in this protocol is the `forward` message. A simple and common version of a `forward` message might look like this:

```json
{
    "type": "https://didcomm.org/routing/2.0/forward",
    "to": ["did:example:mediator"],
    "expires_time": 1516385931,
    "body":{
        "next"   : "did:foo:1234abcd",
        "payloads~attach": [
            // One payload?
        ]
    }
}
```

- **next** - REQUIRED. The DID of the party to send the attached message to. 
- **payloads~attach** - REQUIRED. The encrypted message to send to the party indicated in the `next` body attribute. 

When the internal message expires, it's a good idea to also include an expiration for forward message requests. Include the `expires_time` header with the appropriate value.



[TODO: describe use of the `attn` field, and explain why it's an important construct that allows us to encrypt to all (cryptographic route) but deliver just to the agent most likely to be interested (network route).

[TODO: further revise the following paragraph to clarify that either a key or a DID might be used. Each possibility makes certain tradeoffs, and may be appropriate in certain cases. Keys may be fragile in the face of rotation, and they require a lot of knowledge/maintenance cost for the external mediator. However, DID key references and DIDs may introduce some complications in how the recipient proves control of a DID (a requirement for security, but also a privacy eroder).]

For most external mediators, the value of the `next` field is likely to be a DID, not a key. However... (see previous TODO note). This hides details about the internals of a sovereign domain from external parties. The sender will have had to multiplex encrypt for all relevant recipient keys, but doesn't need to know how routing happens to those keys. The mediator and the receiver may have coordinated about how distribution to individual keys takes place (see [RFC 0211: Route Coordination](https://github.com/hyperledger/aries-rfcs/blob/master/features/0211-route-coordination/README.md)), but that is outside the scope of concerns of this protocol. 

The attachment(s) in the `payloads~attach` field are able to use the full power of DIDComm attachments, including features like instructing the receiver to download the payload content from a CDN.

#### Rewrapping

Normally, the payload attached to the `forward` message received by the mediator is transmitted directly to the receiver with no further packaging. However, optionally, the mediator can attach the opaque payload to a new `forward` message, which then acts as a fresh outer envelope for the second half of the delivery. This [rewrapping](#rewrapping) means that the "onion" of packed messages stays the same size rather than getting smaller as a result of the forward operation:

![re-wrapped sequence](../collateral/routing-roles-2.png)

Rewrapping mode is invisible to senders, but mediators need to know about it, since they change their behavior as a result. Receivers also need to know about it, because it causes them to receive a double-packaged message instead of a singly-packaged one. The outer envelope is a `forward` message where `to` is the receiver itself.

Why is such indirection useful?

* It lets the mediator decorate messages with its own timing and tracing mixins, which may aid troubleshooting. (This would otherwise be impossible, since the inner payload is an opaque blob that almost certainly tamper-evident and encrypted.)
* It lets the mediator remain uncommitted to whether the next receiver is another mediator or not. This may provide flexibility in some routing scenarios.
* It lets the mediator change the size of the message by adding or subtracting noise from the content. 
* It allows for dynamic routing late in the delivery chain.

These last two characteristics are the foundation of mix networking feature for DIDComm. That feature is the subject of a different RFC; here we only note the existence of the optional feature. 

### Sender Forward Process

1. Sender Constructs Message.
2. Sender Encrypts Message to recipient(s).
3. Wrap Encrypted Message in Forward Message for each Routing Key.
4. Transmit to `serviceEndpoint` in the manner specified in the [transports] section.

### Mediator Process

_Prior to using a Mediator, it is the recipient's responsibility to coordinate with the mediator. Part of this coordination informs them of the `to` address(es) expected, the endpoint, and any Routing Keys to be used when forwarding messages. That coordination is out of the scope of this spec._

1. Receives Forward Message.
2. Retrieves Service Endpoint pre-configured by recipient (`to` attribute).
4. Transmit `payload` message to Service Endpoint in the manner specified in the [transports] section.

The recipient (`to` attribute of Forward Message) may have pre-configured additional routing keys with the mediator that were not present in the DID Document and therefore unknown to the original sender. If this is the case, the mediator should wrap the attached `payload` message into an additional Forward message once per routing key. This step is performed between (2) and (3).

### DID Document Keys

All keys declared in the DID Document's `keyAgreement` section should be used as recipients when encrypting a message. The details of key representation are described in the [Public Keys section of the DID Core Spec](https://www.w3.org/TR/did-core/#public-keys).

Keys used in a signed JWM are declared in the DID Document's `authentication` section.

TODO: include details about how DIDComm keys are represented/identified in the DID Document. The DID Core Spec appears light on details and examples of `keyAgreement` keys. Clarifying language should be included here or there.

### DID Document Service Endpoint

DIDComm DID Document endpoints have the following format:

```json
{
    "id": "did:example:123456789abcdefghi#didcomm-1",
    "type": "DIDCommMessaging",
    "serviceEndpoint": "http://example.com/path",
    "routingKeys": ["did:example:somemediator#somekey"]
}
```

**id**: must be unique, as required in [DID Core](https://www.w3.org/TR/did-core/#service-endpoints). No special meaning should be inferred from the `id` chosen.

**type**: MUST be `DIDCommMessaging`. 

**serviceEndpoint**: MUST contain a URI for a transport specified in the [transports] section of this spec, or a URI from Alternative Endpoints. It MAY be desirable to constraint endpoints from the [transports] section so that they are used only for the reception of DIDComm messages. This can be particularly helpful in cases where auto-detecting message types is inefficient or undesirable.

**routingKeys**: An optional ordered array of strings referencing keys to be used when preparing the message for transmission as specified in the [Routing] section of this spec. 

#### Multiple Endpoints

A DID Document may contain multiple service entries of type `DIDCommMessaging`. Entries are SHOULD be specified in order of receiver preference, but any endpoint MAY be selected by the sender, typically by protocol availability or preference.

#### Alternative Endpoints

In addition to the URIs for [transports], some alternative forms are available.

##### DID

Using a DID for the `serviceEndpoint` is useful when using a mediator. The DID should be resolved, and services with type of "DIDComm" will contain valid `serviceEndpoints`. The keyAgreement keys of that DID Document should be appended at the end of the routingKeys section from the message recipient's DID Document as per the process in [Sender Forward Process]. The key advantage with this approach is that a mediator can rotate keys and update serviceEndpoints without any updates needed to dependent recipients` DID Documents.

A DID representing a mediator SHOULD NOT use alternative endpoints in it's own DID Document to avoid recursive endpoint resolution. Using only the URIs described in [transports] will prevent such recursion.

Example 1: Mediator

```json
{
    "id": "did:example:123456789abcdefghi#didcomm-1",
    "type": "DIDCommMessaging",
    "serviceEndpoint": "did:example:somemediator"
}
```
The message is encrypted to the recipient, then wrapped in a forward message encrypted to the keyAgreement keys within the `did:example:somemediator` DID Document, and transmitted to the URIs present in the `did:example:somemediator` DID Document with type `DIDCommMessaging`.

Example 2: Mediator + Routing Keys
```json
{
    "id": "did:example:123456789abcdefghi#didcomm-1",
    "type": "DIDCommMessaging",
    "serviceEndpoint": "did:example:somemediator",
    "routingKeys": ["did:example:anothermediator#somekey"]
}
```

The message is encrypted to the recipient, then wrapped in a forward message encrypted to `did:example:anothermediator#somekey`. That forward message is wrapped in a forward message encrypted to keyAgreement keys within the `did:example:somemediator` DID Document, and transmitted to the URIs present in the `did:example:somemediator` DID Document with type `DIDComm`.