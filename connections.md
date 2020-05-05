### Connections

A Connection is the practical application of a relationship in DID Communication. Having a connection means that each party in the relationship has a DID for the other parties, and parties can communicate securely using the keys and endpoints within each DID Document.

In order to establish a new connection, we use the OutOfBand Protocol and the DID Exchange Protocol.



#### OutOfBand Protocol

Invitations are usually the first message passed between parties. They are passed out of band, such as in a QR code or a link that can either open in an app or in a browser containing getting started instructions.

The OutOfBand Protocol exists as an independent protocol to allow for the invitation recipient to respond with any of the supported protocols.

A Public DID functions as a standing invitation. The information within the resolved DID Document serves the same function as the information passed in OutOfBand protocol messages.

TODO: Include details of the protocol.

##### Ephemeral Mode

Some interactions do not need an established connection to complete their purpose. These interactions occur in _ephemeral mode_ and use OutOfBand protocol messages for the bulk of the interaction.

TODO: Include more details about ephemeral mode.

#### DID Exchange Protocol

##### 1. Exchange Request

The exchange request message is used to communicate the DID document of the _invitee_ to the _inviter_ using the provisional service information present in the _invitation_ message.

If needed, the _invitee_ will provision a new DID according to the DID method spec. The _invitee_ may also use a previously provisioned DID.

The DID is presented in the exchange_request message as follows:

TODO: Add clear details about initial_state usage?

Example

```json
{
  "@id": "5678876542345",
  "@type": "https://didcomm.org/didexchange/2.0/request",
  "~thread": { "pthid": "<id of invitation>" },
  "label": "Bob",
  "did": "<did invitee is sending to inviter>"
}
```

###### Attributes

* The `@type` attribute is a required string value that denotes that the received message is an exchange request.
* The [`~thread`](../../concepts/0008-message-id-and-threading/README.md#thread-object) decorator MUST be included:
  * It MUST include the ID of the parent thread (`pthid`) such that the `request` can be correlated to the corresponding `invitation`. More on correlation [below](#correlating-requests-to-invitations).
  * It MAY include the `thid` property. In doing so, implementations MUST set its value to that of `@id` on the same request message. In other words, the values of `@id` and `~thread.thid` MUST be equal.
* The `label` attribute provides a suggested label for the DID being exchanged. This allows the user to tell multiple exchange requests apart. This is not a trusted attribute.
* The `connection` attribute contains the `did` and `did_doc` attributes. This format maintains consistency with the Response message where this attribute is signed.
* The `did` indicates the DID being exchanged.

###### Correlating requests to invitations

An invitation is presented in one of two forms:

* An explicit OutOfBand invitation with its own `@id`.
* An [implicit](#implicit-invitation) invitation contained in a DID document's [`service`](https://w3c-ccg.github.io/did-spec/#service-endpoints) attribute.

When a `request` responds to an explicit invitation, its `~thread.pthid` MUST be equal to the `@id` property of the invitation.

When a `request` responds to an implicit invitation, its `~thread.pthid` MUST contain a [DID URL](https://w3c-ccg.github.io/did-spec/#dfn-did-url) that resolves to the specific `service` on a DID document that contains the invitation.

TODO: Include examples using a ledger resolvable DID.

**Example referencing an explicit invitation**

```json
{
  "@id": "a46cdd0f-a2ca-4d12-afbf-2e78a6f1f3ef",
  "@type": "https://didcomm.org/didexchange/2.0/request",
  "~thread": { "pthid": "032fbd19-f6fd-48c5-9197-ba9a47040470" },
  "label": "Bob",
  "did": "<did invitee is sending to inviter>"
}
```

**Example referencing an implicit invitation**

```json
{
  "@id": "a46cdd0f-a2ca-4d12-afbf-2e78a6f1f3ef",
  "@type": "https://didcomm.org/didexchange/2.0/request",
  "~thread": { "pthid": "did:example:21tDAKCERh95uGgKbJNHYp#invitation" },
  "label": "Bob",
  "did": "<did invitee is sending to inviter>"
}
```


###### Request Transmission

The Request message is encoded according to the standards of the Encryption Envelope, using the `recipientKeys` present in the invitation.

If the `routingKeys` attribute was present and non-empty in the invitation, each key must be used to wrap the message in a forward request, then encoded in an Encryption Envelope. This processing is in order of the keys in the list, with the last key in the list being the one for which the `serviceEndpoint` possesses the private key.

The message is then transmitted to the `serviceEndpoint`.

We are now in the `requested` state.

###### Request processing

After receiving the exchange request, the _inviter_ evaluates the provided DID and DID Doc according to the DID Method Spec.

The _inviter_ should check the information presented with the keys used in the wire-level message transmission to ensure they match.

The _inviter_ MAY look up the corresponding invitation identified in the request's `~thread.pthid` to determine whether it should accept this exchange request.

If the _inviter_ wishes to continue the exchange, they will persist the received information in their wallet. They will then either update the provisional service information to rotate the key, or provision a new DID entirely. The choice here will depend on the nature of the DID used in the invitation.

The _inviter_ will then craft an exchange response using the newly updated or provisioned information.

###### Request Errors

See [Error Section](#errors) above for message format details.

**request_rejected**

Possible reasons:

- Unsupported DID method for provided DID
- Expired Invitation
- DID Doc Invalid
- Unsupported key type
- Unsupported endpoint protocol
- Missing reference to invitation

**request_processing_error**

- unknown processing error

##### 2. Exchange Response

The exchange response message is used to complete the exchange. This message is required in the flow, as it updates the provisional information presented in the invitation.

###### Example

```json
{
  "@type": "https://didcomm.org/didexchange/2.0/response",
  "@id": "12345678900987654321",
  "~thread": {
    "thid": "<The Thread ID is the Message ID (@id) of the first message in the thread>"
  },
  "did": "<did inviter is sending to invitee>"
}
```

The signature data must be used to verify against the invitation's `recipientKeys` for continuity.

###### Attributes

* The `@type` attribute is a required string value that denotes that the received message is an exchange request.
* The `~thread` block contains a `thid` reference to the `@id` of the request message.
* The `connection` attribute contains the `did` and `did_doc` attributes to enable simpler signing.
* The `did` attribute is a required string value and denotes DID in use by the _inviter_. Note that this may not be the same DID used in the invitation.

In addition to a new DID, the associated DID Doc might contain a new endpoint. This new DID and endpoint are to be used going forward in the relationship.

###### Response Transmission

The message should be packaged in the encrypted envelope format, using the keys from the request, and the new keys presented in the internal did doc.

When the message is transmitted, we are now in the `responded` state.

###### Response Processing

When the _invitee_ receives the `response` message, they will verify the `change_sig` provided. After validation, they will update their wallet with the new information. If the endpoint was changed, they may wish to execute a Trust Ping to verify that new endpoint.

###### Response Errors

See [Error Section](#errors) above for message format details.

**response_rejected**

Possible reasons:

- unsupported DID method for provided DID
- Expired Request
- DID Doc Invalid
- Unsupported key type
- Unsupported endpoint protocol
- Invalid Signature

**response_processing_error**

- unknown processing error### 3. Exchange Acknowledgement

### 3. Exchange Complete

The exchange complete message is used to confirm the exchange to the _inviter_. The _inviter_ may then invoke any protocols desired based on the context expressed via the `pthid` in the DID Exchange protocol.

##### Example

```json
{
  "@type": "https://didcomm.org/didexchange/2.0/complete",
  "@id": "12345678900987654321",
  "~thread": {
    "thid": "<The Thread ID is the Message ID (@id) of the first message in the thread>",
    "pthid": "<The Message ID (@id) of the Out Of Band Invitation message>"
  }
}
```

The `pthid` is required in this message, even if present in the `request` method.

After a message is sent, the *invitee* in the `complete` state. Receipt of a message puts the *inviter* into the `complete` state.

##### Next Steps

The exchange between the _inviter_ and the _invitee_ is now established. This relationship has no trust associated with it. The next step should be the exchange of proofs to build trust sufficient for the purpose of the relationship.

### Exchange Reuse

When an out of band invitation is received containing a public DID for which the _invitee_ already has a connection, the _invitee_ may use the `reuse` message in the protocol sent over the existing connection. The `pthid` passed in the `reuse` message allows the _inviter_ to correlate the invitation with the identified existing connection and then invoke any protocols desired based on that context.

##### Example

```json
{
  "@type": "https://didcomm.org/didexchange/2.0/reuse",
  "@id": "12345678900987654321",
  "~thread": {
    "pthid": "<The Parent Thread ID of the Out Of Band Invitation>"
  }
}
```

The `pthid` is required in this message. It provides the context link for the _inviter_ to prompt additional protocol interactions.

Sending or receiving this message does not change the state of the existing connection.

###### Next Steps

The exchange between the _inviter_ and the _invitee_ is now established. This relationship has no trust associated with it. The next step should be the exchange of proofs to build trust sufficient for the purpose of the relationship.

###### Peer DID Maintenance

When Peer DIDs are used in an exchange, it is likely that both Alice and Bob will want to perform some relationship maintenance such as key rotations. Future updates will add these maintenance features.





##### TODO:

- Pairwise vs n-wise connections, how to transition.
- Reuse of existing connections, add `continue` message for use with connection reuse. (ack message?)
