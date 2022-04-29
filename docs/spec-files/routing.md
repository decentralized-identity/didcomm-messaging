### Routing Protocol 2.0

The routing protocol defines how a sender and a recipient cooperate, using a partly trusted mediator, to facilitate message delivery. No party is required to know the full route of a message.

#### Name and Version

The name of this protocol is "Routing Protocol", and its [version](#semver-rules) is "2.0". It is uniquely identified by the [PIURI](#protocol-identifier-iuri):

    https://didcomm.org/routing/2.0

#### Roles

There are 3 roles in the protocol: `sender`, `mediator`, and `recipient`. The sender emits messages of type `forward` to the `mediator`. The mediator unpacks (decrypts) the payload of an encrypted `forward` message and passes on the result (a blob that probably contains a differently encrypted payload) to the `recipient`.

![ordinary sequence](../collateral/routing-roles.png)

>Note: the protocol is one-way; the return route for communication might not exist at all, or if it did, it could invert the roles of sender and receiver and use the same mediator, or it could use one or more different mediators, or it could use no mediator at all. This is a separate concern partly specified by the service endpoints in the DID docs of the sender and receiver, and partly explored in other protocols.

>Note: When the mediator is the routing agent of a single identity subject like Alice, the logical receiver is Alice herself, but the physical receiver may manifest as multiple edge devices (a phone, a laptop, a tablet). From the perspective of this protocol, multiplexing the send from mediator to receiver is out of scope for interoperability &mdash; compatible and fully supported, but not required or specified in any way.

In this protocol, the sender and the receiver never interact directly; they only interact via the mediator.

The sender can add the standard `expires_time` to a `forward` message. An additional header, `delay_milli` is also possible; this allows the sender to request that a mediator wait a specified number of milliseconds before delivering. Negative values mean that the mediator should randomize delay by picking a number of milliseconds between 0 and the absolute value of the number, with a uniform distribution.

The mediator is NOT required to support or implement any of these semantics; only the core forwarding behavior is indispensable. If a mediator sees a header that requests behavior it doesn't support, it MAY return a [`problem-report`](#problem-reports) to the sender identifying the unsupported feature, but it is not required to do so.

>Note: The [`please_ack` header](#acks) SHOULD NOT be included on [`forward` messages](#routing), and MUST NOT be honored by mediators. It is only for use between ultimate senders and receivers; otherwise, it would add a burden of sourceward communication to mediators, and undermine the privacy of recipients.

#### States

Since data flow is normally one-way, and since the scope of the protocol is a single message delivery, a simplistic way to understand it might be as two instances of a stateless notification pattern, unfolding in sequence.

However, this doesn't quite work on close inspection, because the mediator is at least potentially stateful with respect to any particular message; it needs to be if it wants to implement delayed delivery or retry logic. (Or, as noted earlier, the possibility of sending to multiple physical receivers. Mediators are not required to implement any of these features, but the state machine needs to account for their possibility.) Plus, the notification terminology obscures the sender and receiver roles. So we use the following formalization:

![](../collateral/routing-state-machines.png)]

#### Messages

The only message in this protocol is the `forward` message. A simple and common version of a `forward` message might look like this:

```json
{
    "type": "https://didcomm.org/routing/2.0/forward",
    "id": "abc123xyz456",
    "to": ["did:example:mediator"],
    "expires_time": 1516385931,
    "body":{
        "next": "did:foo:1234abcd"
    },
    "attachments": [
        // The payload(s) to be forwarded
    ]
}
```

- `next` - REQUIRED. The identifier of the party to send the attached message to.
- `attachments` - REQUIRED. The DIDComm message(s) to send to the party indicated in the `next` body attribute. This content should be encrypted for the next recipient.

When the internal message expires, it's a good idea to also include an expiration for forward message requests. Include the `expires_time` header with the appropriate value.

The value of the `next` field is typically a DID. However, it may also be a key, for the last hop of a route. The `routingKeys` array in the `serviceEndpoint` portion of a DID doc allow a party to list keys that should receive inbound communication, with encryption multiplexed so any of the keys can decrypt. This supports a use case where Alice wants to process messages on any of several devices that she owns.

The attachment(s) in the `attachments` field are able to use the full power of DIDComm attachments, including features like instructing the receiver to download the payload content from a CDN.

#### Rewrapping

Normally, the payload attached to the `forward` message received by the mediator is transmitted directly to the receiver with no further packaging. However, optionally, the mediator can attach the opaque payload to a new `forward` message (appropriately anoncrypted), which then acts as a fresh outer envelope for the second half of the delivery. This rewrapping means that the "onion" of packed messages stays the same size rather than getting smaller as a result of the forward operation:

![re-wrapped sequence](../collateral/routing-roles-2.png)

Rewrapping mode is invisible to senders, but mediators need to know about it, since they change their behavior as a result. Receivers also need to know about it, because it causes them to receive a double-packaged message instead of a singly-packaged one. The outer envelope is a `forward` message where `to` is the receiver itself.

Why is such indirection useful?

* It lets the mediator decorate messages with its own timing and tracing mixins, which may aid troubleshooting. (This would otherwise be impossible, since the inner payload is an opaque blob that is almost certainly tamper-evident and encrypted.)
* It lets the mediator remain uncommitted to whether the next receiver is another mediator or not. This may provide flexibility in some routing scenarios.
* It lets the mediator change the size of the message by adding or subtracting noise from the content. 
* It allows for dynamic routing late in the delivery chain.

These last two characteristics could provide the foundation of mixnet features for DIDComm; however, such functionality is out of scope in this spec. 

#### Sender Process to Enable Forwarding

1. Construct a plaintext message, M.
2. If appropriate, sign M.
3. Encrypt M for each party that is an intended recipient. Assuming each recipient has several keys, corresponding to several devices, but that all the keys are of the same type, this produces a single message, N, for each recipient &mdash; and N is decryptable on any device the recipient is using. If Alice is sending to Bob and Carol, this step produces N<sub>Bob</sub> and N<sub>Carol</sub>, which have identical plaintext but different encrypted embodiments.
4. Perform a wrapping process that loops *in reverse order* over all items in the `routingKeys` array of the [service endpoint](#service-endpoint) for the DID document that corresponds to the intended recipient of N. For each item X in that array, *beginning at the end of the array and working to its beginning*, Sender creates a new plaintext `forward` message, attaches the current N, and encrypts it for X. The output is a new encrypted message, N', that is treated as N in the next round of wrapping.
5. Transmit the fully wrapped version of N to the `uri` given in the associated `serviceEndpoint` of the recipient's DID document.

The party that receives it will have the ability to decrypt, producing a `forward` message with an encrypted attachment that is then forwarded to the next hop in `routingKeys`. This unwrapping and forwarding is repeated until the message reaches its final destination.

#### Mediator Process

_Prior to using a Mediator, it is the recipient's responsibility to coordinate with the mediator. Part of this coordination informs them of the `next` address(es) expected, the endpoint, and any Routing Keys to be used when forwarding messages. That coordination is out of the scope of this spec._

1. Receive Forward Message.
2. Retrieve Service Endpoint pre-configured by recipient (`next` attribute).
3. Transmit `payload` message to Service Endpoint in the manner specified in the [transports] section.

The recipient (`next` attribute of Forward Message) may have pre-configured additional routing keys with the mediator that were not present in the DID Document and therefore unknown to the original sender. If this is the case, the mediator should wrap the attached `payload` message into an additional Forward message once per routing key. This step is performed between (2) and (3).

#### DID Document Keys

Ideally, all keys declared in the `keyAgreement` section of a given recipient's DID document are used as target keys when encrypting a message. To encourage this, DIDComm encrypts the main message content only once, using an ephemeral content encryption key, and then encrypts the relatively tiny ephemeral key once per recipient key. This "multiplexed ecnryption" is efficient, and it allows a recipient to change devices over the course of a conversation without prior arrangement.

However, practical considerations can frustrate this ideal. If a recipient's DID document declares keys of different types, a sender has to prepare more than one encryption envelope &mdash; and if not all of a recipient's key types are supported by the sender, the goal is simply unachievable.

In addition, if a sender is routing the same message to more than one recipient (not just more than one key of the same recipient), the sender has to wrap the message differently because it will flow through different mediators.

This leads to a rule of thumb rather than a strong normative requirement: a sender SHOULD encrypt for as many of a recipient's keys as is practical.

The details of key representation are described in the [Public Keys section of the DID Core Spec](https://www.w3.org/TR/did-core/#public-keys).

Keys used in a signed JWM are declared in the DID Document's `authentication` section.

#### Service Endpoint

Parties who wish to communicate via DIDComm Messaging MAY tell other parties how to reach them by declaring a `serviceEndpoint` block in their DID document. (It is also possible to convey this information in other ways, but they are out of scope for this spec.)

The relevant entry in the DID document matches this format:

```json
{
    "id": "did:example:123456789abcdefghi#didcomm-1",
    "type": "DIDCommMessaging",
    "serviceEndpoint": [{
        "uri": "https://example.com/path",
        "accept": [
            "didcomm/v2",
            "didcomm/aip2;env=rfc587"
        ],
        "routingKeys": ["did:example:somemediator#somekey"]
    }]
}
```

**id**: must be unique, as required in [DID Core](https://www.w3.org/TR/did-core/#service-endpoints). No special meaning should be inferred from the `id` chosen.

**type**: MUST be `DIDCommMessaging`. 

**serviceEndpoint**: MUST contain an ordered list of objects. Each represents a DIDComm Service Endpoint URI and its associated details. The order of the endpoints SHOULD indicate the DID Document owner's preference in receiving messages. Any endpoint MAY be selected by the sender, typically by protocol availability or preference. A message should be delivered to only one of the endpoints specified.

Each object has the following properties:

**uri**: MUST contain a URI for a transport specified in the [transports] section of this spec, or a URI from Alternative Endpoints. It MAY be desirable to constraint endpoints from the [transports] section so that they are used only for the reception of DIDComm messages. This can be particularly helpful in cases where auto-detecting message types is inefficient or undesirable.

**accept**: An optional array of media types in the order of preference for sending a message to the endpoint.
If `accept` is not specified, the sender uses its preferred choice for sending a message to the endpoint.
Please see [Message Types](#message-types) for details about media types.

**routingKeys**: An optional ordered array of strings referencing keys to be used when preparing the message for transmission as specified in [Sender Process to Enable Forwarding](#sender-process-to-enable-forwarding), above. 

#### Failover

If the transmission of a message fails, the sender SHOULD try another endpoint or try delivery at a later time.

#### Using a DID as an endpoint

In addition to the sorts of URIs familiar to all web developers, it is possible to use a DID as the `uri` value in a `serviceEndpoint`. This is useful when a recipient sits behind a mediator, because it allows the mediator to rotate its keys or update its own service endpoints without disrupting communication between sender and recipient. In such cases, the DID (which belongs to the mediator) is resolved. Inside the resulting DID document, a `serviceEndpoint` with type `DIDCommMessaging` MUST exist. The `keyAgreement` keys of the mediator are implicitly prepended to the `routingKeys` section from the message recipient's DID Document as per the process in [Sender Process to Enable Forwarding](#sender-process-to-enable-forwarding).

A DID representing a mediator SHOULD NOT use alternative endpoints in its own DID Document to avoid recursive endpoint resolution. Using only the URIs described in [Transports](#transports) will prevent such recursion.

Example 1: Mediator

```json
{
    "id": "did:example:123456789abcdefghi#didcomm-1",
    "type": "DIDCommMessaging",
    "serviceEndpoint": [{
        "uri": "did:example:somemediator"
    }]
}
```
The message is encrypted to the recipient, then wrapped in a forward message encrypted to the keyAgreement keys within the `did:example:somemediator` DID Document, and transmitted to the URIs present in the `did:example:somemediator` DID Document with type `DIDCommMessaging`.

Example 2: Mediator + Routing Keys
```json
{
    "id": "did:example:123456789abcdefghi#didcomm-1",
    "type": "DIDCommMessaging",
    "serviceEndpoint": [{
        "uri": "did:example:somemediator",
        "routingKeys": ["did:example:anothermediator#somekey"]
    }]
}
```

The message is encrypted to the recipient, then wrapped in a `forward` message encrypted to `did:example:anothermediator#somekey`. That forward message is wrapped in a forward message encrypted to keyAgreement keys within the `did:example:somemediator` DID Document, and transmitted to the URIs present in the `did:example:somemediator` DID Document with type `DIDCommMessaging`.
