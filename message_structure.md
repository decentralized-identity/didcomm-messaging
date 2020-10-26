## Message Structure

DIDComm Messages are based on JWM (JSON Web Messages). A message has a basic structure that specifies the message type, id, and other attributes common to all messages. These common attributes appear at the top level of a DIDComm message, and are called headers. A message also includes attributes specific to the message type. Type specific message attributes are contained within the `body` attribute of a message.

Prior to being sent to a recipient, the JWM is encrypted into a JWE according to the JWM spec.

The following example shows common elements of a DIDComm Message. Further details and advanced usage are covered elsewhere in this spec.

```json
{
    "id": "1234567890",
    "type": "<message-type-uri>",
    "from": "did:example:alice",
    "to": ["did:example:bob"],
    "created_time": 1516269022,
    "expires_time": 1516385931,
    "body": {
    	"messagespecificattribute": "and it's value"
	}
}
```

### Message Headers

The attributes of a DIDComm Message at the level of its outer packaging (effectively, the "headers" of the message) are as follows:

- **id** - REQUIRED. Message ID. The `id` attribute value MUST be unique to the sender.
- **type** - REQUIRED. Message Type. The `type` attribute value MUST be a valid [Message Type URI](protocols.md#message-type-uri) , that when resolved gives human readable information about the message. The attributes value also informs the content of the message, for example the presence of other attributes and how they should be processed.
- **to** - OPTIONAL. Recipient(s) identifier. The `to` attribute MUST be an array of strings where each element is a valid [DID](https://w3c.github.io/did-core/#generic-did-syntax) which identifies the recipients of the message.
- **from** - OPTIONAL. Sender identifier. The `from` attribute MUST be a string that is a valid [DID](https://w3c.github.io/did-core/#generic-did-syntax) which identifies the sender of the message. For DID methods that use query parameters to carry additional information, they might also be present in the from string. When a message is encrypted, the sender key MUST be authorized for encryption by this DID. Authorization of the encryption key for this DID MUST be verified by message recipient with the proper proof purposes. See the [message authentication](#Message-Authentication) section for additional details.
- **created_time** - OPTIONAL. Message Created Time. The `created_time` attribute is used for the sender to express when they created the message, expressed in UTC Epoch Seconds (seconds since 1970-01-01T00:00:00Z UTC) [link](1970-01-01T00:00:00Z UTC). This attribute is informative to the recipient, and may be relied on by protocols.
- **expires_time** - OPTIONAL. Message Expired Time. The `expires_time` attribute is used for the sender to express when they consider the message to be expired, expressed in UTC Epoch Seconds (seconds since 1970-01-01T00:00:00Z UTC) [link](1970-01-01T00:00:00Z UTC). This attribute signals when the message is no longer valid, and is to be used by the recipient to discard expired messages on receipt.

The problem domain of DIDComm intersects with other aspects of decentralized identity, where JSON-LD plays a role in some standards. Thus it may be natural to wonder about DIDComm's relationship to JSON-LD and to the rich semantics and extensibility features it offers. The short answer is that DIDComm is not dependent on JSON-LD, but it is compatible with it. We expect these two technologies to remain mostly orthogonal.

In the outer packaging of message metadata, DIDComm follows the extensibility pattern established by the JW* family of standards. (It also emulates the design of message headers in SMTP, request headers in HTTP, and labels on physical pieces of mail.) A modest inventory of predefined "header" fields is specified, as shown above. Additional fields with unreserved names can be added at the discretion of producers and consumers of messages; any software that doesn't understand such fields should ignore them and MUST NOT fail because of their inclusion in a message. This is appropriate for a simple, flat data model.

Aligning with [RFC 6648](https://tools.ietf.org/html/rfc6648.html), DIDComm explicitly rejects the `X-*` headers convention that creates divergent pseudo-standards; if a new header needs broad support, it must be standardized properly. Alternatively, a JSON-LD `@context` header can be added, providing namespacing for fields other than those predefined in the spec. Since we expect header fields to be small in number and modest in complexity, we expect this sort of powerful extensibility to be unnecessary in most cases.

The body of a message -- everything inside the `body` object -- is different. Here, there is substantial variety and complexity. Structures may be sophisticated graphs, represented with nested objects and arrays. JSON-LD is not required at this level, either. However, it is available, and may be appropriate for certain use cases where extensibility is an important feature. JSON-LD usage, if it occurs, SHOULD be a declared feature of a protocol as a whole, not an ad hoc extension to arbitrary individual messages, and MUST be signalled by the inclusion of a `@context` inside `body`. Unless a protocol declares a JSON-LD dependency, the same rules apply to JSON-LD-isms as apply to any other unrecognized structure in a DIDComm message: additional fields can be added to any part of message structure, should be ignored if not understood, and MUST NOT be the basis of failure by recipients.

### DID Rotation

DIDComm is based on DIDs and their associated DID Documents. Changes to keys and endpoints are the concern of each DID method and are utilized but not managed by DIDComm. DID Rotation serves a very specific and narrow need to switch from one DID method to another. This is very common at the beginning of a new DIDComm relationship when a public DID or a temporary DID passed unencrypted is rotated out for a DID chosen for the relationship. As rotation between one DID and another is outside the scope of any DID method, the details of DID Rotation are handled within DIDComm itself.

When a DID is rotated, the new DID is put into immediate use encrypting the message, and one additional attribute is included as a message header:

- **from_prior**: A JWT, with with `sub`: new DID and `iss`: prior DID, with a signature from a key authorized by prior DID.

When a message is received from an unknown DID, the recipient should check for existence of the `from_prior` header. The JWT in the`from_prior` attribute is used to extract the prior DID (`iss`) and is checked to verify the validity of the rotation. The recipient then associates the message with context related to the known sender. The new DID and associated DID Document information should be used for further communication.

The validity of the DID rotation is verified by checking the JWT signature against the key indicated in the `kid` header parameter. The indicated key MUST be authorized in the DID Document of the prior DID (`iss`).

The `from_prior` attribute should be included in messages sent until the party rotating receives a message sent to the new DID. If multiple messages are received to containing the rotation headers after being processed by the recipient, they may be ignored.

#### JWT Details

The JWT is constructed as follows, with appropriate values changed.

**Header**:

```json
{
  "typ": "JWT",
  "alg": "EdDSA",
  "crv": "ED25519",
  "kid": "<key id authorized in prior DID>"
}
```

**Payload**:

```json
{
  "sub": "<new DID URI>",
  "iss": "<prior DID URI>",
  "iat": 1516239022 //datetime of the rotation, not message
}
```

#### Example Message Rotating DID

```json
{
    "id": "1234567890",
    "type": "<message-type-uri>",
    "from": "did:example:alice2",
    "from_prior": "<JWT with sub:did:example:alice2 and iss:did:example:alice>",
    "to": ["did:example:bob"],
    "created_time": 1516269022,
    "expires_time": 1516385931,
    "body": {
    	"messagespecificattribute": "and it's value"
	}
}
```

#### Rotation Limitations

- This rotation method does not cover cases where a multi-sig is required. Rotations with such requirements should use a more expressive protocol.
- This rotation method only supports the case where a new DID is used, replacing an old DID which is no longer used. Adjustments to DIDs used between different parties that does not fit this narrow use should use a more expressive protocol.
