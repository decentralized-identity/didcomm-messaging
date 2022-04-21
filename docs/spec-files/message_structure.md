## Message Formats

This specification discusses messages in three different formats. The casual phrase "DIDComm message" is ambiguous, but usually refers to [DIDComm Encrypted Messages](#didcomm-encrypted-messages) (the outermost box in the diagram below). These will constitute the vast majority of network traffic in most DIDComm Messaging deployments, and are responsible for security guarantees in the system. However, the role of encrypted messages cannot be understood without reference to the simpler formats they contain, so all three formats are explored below.

![DIDComm envelopes](../collateral/didcomm-envelopes.png)

### IANA Media Types

Circumstances sometimes require communication about the format of DIDComm messages. The canonical way to do this is with IANA media types, based on the conventions of [RFC6838](https://tools.ietf.org/html/rfc6838).

All three DIDComm message formats &mdash; plaintext, signed, and encrypted &mdash; can be correctly understood as more generic [JWMs](https://tools.ietf.org/html/draft-looker-jwm-01) or even as arbitrary JOSE content. Since code that expects JOSE conventions but not DIDComm may matter in some implementations, this spec recommends the JOSE convention of [using `typ` to make JOSE structure formats self-describing](https://tools.ietf.org/html/rfc7515#section-4.1.9). This is particularly helpful in the outermost envelope of any DIDComm message, before unwrapping begins. (As RFC 7515 notes, `typ` "will typically not be used by applications when the kind of object is already known.")

The relevant media types are:

| Envelope | `typ` |
|-----------------|-------|
| Authcrypted and/or anoncrypted | `application/didcomm-encrypted+json`|
| Signed and then anoncrypted | `application/didcomm-encrypted+json`|
| Signed | `application/didcomm-signed+json` |
| Plaintext | `application/didcomm-plain+json`|

[Aligning with RFC 7515](https://tools.ietf.org/html/rfc7515#section-4.1.9), IANA types for DIDComm messages MAY omit the `application/` prefix; the recipient MUST treat media types not containing `/` as having the `application/` prefix present.

### DIDComm Plaintext Messages

A DIDComm message in its plaintext form, not packaged into any protective envelope, is known as a **DIDComm plaintext message**.

When higher-level protocols are built atop DIDComm Messaging, applications remove protective envelopes and process the plaintext that's inside. They think about protective envelopes the way webapps think about TLS: as required background context, not as a focus. Thus, application-level constructs are embodied in features of plaintext messages, and specifications for higher-level protocols typically document message structure and provide examples in this format. 

In isolation, plaintext messages lack confidentiality and integrity guarantees, and are repudiable. They are therefore not normally transported across security boundaries. However, this may be a helpful format to inspect in debuggers, since it exposes underlying semantics, and it is the format used in this specification to give examples of headers and other internals. Depending on ambient security, plaintext may or may not be an appropriate format for DIDComm Messaging data at rest.

The media type for a generic DIDComm plaintext message MUST be reported as `application/didcomm-plain+json` by conformant implementations.

The media type of the envelope MAY be set in the `typ` [property](https://tools.ietf.org/html/rfc7515#section-4.1.9) of the plaintext; it SHOULD be set if the message is intended for use without a signature or encryption.

When persisted as a file or attached as a payload in other contexts, the file extension for DIDComm plaintext messages SHOULD be `dcpm`, giving a globbing pattern of `*.dcpm`; this SHOULD be be read as "Star Dot D C P M" or as "D C P M" files. We imagine people will reference this media type by saying, "I am looking at a DIDComm Plaintext Message file", or "This database record is in DIDComm Plaintext format", or "Does my editor have a DIDComm Plaintext Message plugin?" A possible icon for this file format depicts green JSON text in a message bubble ([svg](../collateral/dcpm.svg) | [256x256](../collateral/dcpm-256.png) | [128x128](../collateral/dcpm-128.png) | [64x64](../collateral/dcpm-64.png)):

![DIDComm Plaintext Message Icon](../collateral/dcpm-128.png)

### DIDComm Signed Messages

A **DIDComm signed message** is a signed [JWM (JSON Web Messages)](https://tools.ietf.org/html/draft-looker-jwm-01) envelope that associates a non-repudiable signature with the plaintext message inside it.

Signed messages are not necessary to provide message integrity (tamper evidence), or to prove the sender to the recipient. Both of these guarantees automatically occur with the authenticated encryption in DIDComm encrypted messages. Signed messages are only necessary when the origin of plaintext has to be provable to third parties, or when the sender can't be proven to the recipient by authenticated encryption because the recipient is not known in advance (e.g., in a broadcast scenario). Adding a signature when one is not needed [can degrade rather than enhance security because it relinquishes the sender's ability to speak off the record](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0049-repudiation/README.md#summary). We therefore expect signed messages to be used in a few cases, but not as a matter of course.

When a message is *both* signed and encrypted, this spec echoes the [JOSE recommendation about how to combine](https://datatracker.ietf.org/doc/html/rfc7519#section-11.2): sign the plaintext first, and then encrypt. (The opposite order would imply that the signer committed to opaque data. This would be less safe, and would undermine non-repudiation.)

The [media type](https://tools.ietf.org/html/rfc6838) of a DIDComm signed message MUST be `application/didcomm-signed+json`.

The media type of the envelope SHOULD be set in the `typ` [property](https://tools.ietf.org/html/rfc7515#section-4.1.9) of the JWS.

In order to avoid [surreptitious forwarding or malicious usage](https://theworld.com/~dtd/sign_encrypt/sign_encrypt7.html) of a signed message, a signed message SHOULD contain a properly defined `to` header. In the case where a message is *both* signed and encrypted, the inner (signed) JWM being signed MUST contain a `to` header.

When persisted as a file or attached as a payload in other contexts, the file extension for DIDComm signed messages SHOULD be `dcsm`, giving a globbing pattern of `*.dcsm`; this SHOULD be be read as "Star Dot D C S M" or as "D C S M" files. A possible icon for this media type depicts a signed envelope ([svg](../collateral/dcsm.svg) | [256x256](../collateral/dcsm-256.png) | [128x128](../collateral/dcsm-128.png) | [64x64](../collateral/dcsm-64.png)):

![DIDComm Signed Message Icon](../collateral/dcsm-128.png)

### DIDComm Encrypted Messages

A **DIDComm encrypted message** is an encrypted [JWM (JSON Web Messages)](https://tools.ietf.org/html/draft-looker-jwm-01). It hides its content from all but authorized recipients, discloses and proves the sender to exactly and only those recipients, and provides integrity guarantees. It is important in privacy-preserving routing. It is what normally moves over network transports in DIDComm Messaging applications, and is the safest format for storing DIDComm Messaging data at rest.

The [media type](https://tools.ietf.org/html/rfc6838) of a non-nested DIDComm encrypted message MUST be `application/didcomm-encrypted+json`.

> Note: If future versions of this spec allow binary encodings, variations like `application/didcomm-encrypted+cbor` (see [CBOR RFC 7049, section 7.5](https://tools.ietf.org/html/rfc7049#section-7.5)), `application/didcomm-encrypted+msgpack`, or `application/didcomm-encrypted+protobuf` may become reasonable. In the future, specifications that encompass communications patterns other than messaging &mdash; DIDComm Multicast or DIDComm Streaming, for example &mdash; might use a suffix: `application/didcomm-encrypted-multicast` or similar.

The media type of the envelope SHOULD be set in the `typ` [property](https://tools.ietf.org/html/rfc7516#section-4.1.11) of the JWE.

When persisted as a file or attached as a payload in other contexts, the file extension for DIDComm encrypted messages SHOULD be `dcem`, giving a globbing pattern of `*.dcem`; this SHOULD be read as "Star Dot D C E M" or as "D C E M" files. A possible icon for this file format depicts an envelope with binary overlay, protected by a lock ([svg](../collateral/dcem.svg) | [256x256](../collateral/dcem-256.png) | [128x128](../collateral/dcem-128.png) | [64x64](../collateral/dcem-64.png)):

![DIDComm Encrypted Message Icon](../collateral/dcem-128.png)

## Plaintext Message Structure

As mentioned above, **DIDComm plaintext messages** are based on [JWM (JSON Web Messages)](https://tools.ietf.org/html/draft-looker-jwm-01). JWMs follow the same general pattern as other JOSE containers, but are optimized for larger and more arbitrary structure than simple tokens.

A plaintext message has an outermost attribute, `type`, that identifies the *application-level* message category to which it belongs. This value of `type` is a [specialized URI](#message-type-uri); it allows messages to be mapped to specific handler code. Other outermost attributes include a message's `id` and its media type (`typ` attribute, for generic JWM handling, as described above). In addition, plaintext messages may have other other attributes that have meaning across many message types. Such attributes at the top level of a message are called *[headers](#message-headers)*.

A plaintext message also includes attributes and data specific to its message type. These are contained within its `body` attribute.

Prior to being sent, plaintext is usually encrypted into a JWE according to the [JWM](https://tools.ietf.org/html/draft-looker-jwm-01) specification.

The following example shows common elements of a DIDComm plaintext message.

```json
{
  "id": "1234567890",
  "type": "<message-type-uri>",
  "from": "did:example:alice",
  "to": ["did:example:bob"],
  "created_time": 1516269022,
  "expires_time": 1516385931,
  "body": {
    "message_type_specific_attribute": "and its value",
    "another_attribute": "and its value"
  }
}
```

### Message Headers

A DIDComm plaintext message conveys most of its application-level data inside a JSON `body` object that is a direct child of the message root. The structure inside `body` is predicted by the value of the message's `type` attribute, and varies according to the definition of the protocol-specific message in question. Each `type` of message has its own schema for `body`. 

However, some attributes are common to many different message types. When metadata about a message means the same thing regardless of context, and when it is susceptible to generic rather than message-specific handling, that metadata can be placed in **headers**. Headers are siblings of `body` and may be added to any message type. They are encrypted and decrypted (and/or signed and verified) along with `body` and therefore have an identical audience.

If headers need to be sent and there is no message to attach them to, an [empty message](#the-empty-message) may be sent.

Headers in DIDComm Messaging are intended to be extensible in much the same way that headers in HTTP or SMTP are extensible. A few headers are predefined:

- **id** - REQUIRED. Message ID. The `id` attribute value MUST be unique to the sender, across all messages they send. See [Threading &gt; Message IDs](#message-ids) for constraints on this value.

- **type** - REQUIRED. A URI that associates the `body` of a plaintext message with a published and versioned schema. Useful for message handling in application-level protocols. The `type` attribute value MUST be a valid [message type URI](#message-type-uri), that when resolved gives human readable information about the message category.

- **to** - OPTIONAL. Identifier(s) for recipients. MUST be an array of strings where each element is a valid [DID](https://www.w3.org/TR/did-core/) or [DID URL](https://w3c.github.io/did-core/#did-url-syntax) (without the [fragment component](https://w3c.github.io/did-core/#fragment)) that identifies a member of the message's intended audience. These values are useful for recipients to know which of their keys can be used for decryption. It is not possible for one recipient to verify that the message was sent to a different recipient.

    When Alice sends the same plaintext message to Bob and Carol, it is by inspecting this header that the recipients learn the message was sent to both of them. If the header is omitted, each recipient SHOULD assume they are the only recipient (much like an email sent only to `BCC:` addresses).

    For signed messages, there are specific requirements around properly defining the `to` header outlined in the **DIDComm Signed Message** definition above. This prevents certain kind of [forwarding attacks](https://theworld.com/~dtd/sign_encrypt/sign_encrypt7.html), where a message that was not meant for a given recipient is forwarded along with its signature to a recipient which then might blindly trust it because of the signature.

    Upon reception of a message have a defined `to` header, the recipient SHOULD verify that their own identifier appears in the list. Implementations MUST NOT fail to accept a message when this is not the case, but SHOULD give a warning to their user as it could indicate malicious intent from the sender.

    The `to` header cannot be used for routing, since it is encrypted at every intermediate point in a route. Instead, the [`forward` message](#routing) contains a `next` attribute in its body that specifies the target for the next routing operation.

- **from** - OPTIONAL when the message is to be encrypted via anoncrypt; REQUIRED when the message is encrypted via authcrypt. Sender identifier. The `from` attribute MUST be a string that is a valid [DID](https://w3c.github.io/did-core/) or [DID URL](https://w3c.github.io/did-core/#did-url-syntax) (without the [fragment component](https://w3c.github.io/did-core/#fragment)) which identifies the sender of the message. When a message is encrypted, the sender key MUST be authorized for encryption by this DID. Authorization of the encryption key for this DID MUST be verified by message recipient with the proper proof purposes. When the sender wishes to be anonymous using authcrypt, it is recommended to use a new DID created for the purpose to avoid correlation with any other behavior or identity. Peer DIDs are lightweight and require no ledger writes, and therefore a good method to use for this purpose. See the [message authentication](#Message-Authentication) section for additional details.

- **thid** - OPTIONAL. Thread identifier. Uniquely identifies the thread that the message belongs to. If not included, the `id` property of the message MUST be treated as the value of the `thid`. See [Threading](#threading) for details.

- **pthid** - OPTIONAL. Parent thread identifier. If the message is a child of a thread the `pthid` will uniquely identify which thread is the parent.

- **created_time** - OPTIONAL but recommended. Message Created Time. The `created_time` attribute is used for the sender to express when they created the message, expressed in UTC Epoch Seconds (seconds since 1970-01-01T00:00:00Z) as an integer. This allows the recipient to guess about transport latency and clock divergence. The difference between when a message is created and when it is sent is assumed to be negligible; this lets timeout logic start from this value.

- **expires_time** - OPTIONAL. Message Expires Time. The `expires_time` attribute is used for the sender to express when they will consider the message to be expired, expressed in UTC Epoch Seconds (seconds since 1970-01-01T00:00:00Z) as an integer. By default, the meaning of "expired" is that the sender will abort the protocol if it doesn't get a response by this time. However, protocols can nuance this in their formal spec. For example, an online auction protocol might specify that timed out bids must be ignored instead of triggering a cancellation of the whole auction. When omitted from any given message, the message is considered to have no expiration by the sender.

- **body** - REQUIRED. The `body` attribute contains all the data and structure defined uniquely for the schema associated with the `type` attribute. This attribute MUST be present, even if empty. It MUST be a JSON object conforming to [RFC 7159](https://datatracker.ietf.org/doc/html/rfc7159).

- **attachments** - OPTIONAL. See [Attachments](#attachments) for detail. 

With respect to headers, DIDComm Messaging follows the extensibility pattern established by the JW* family of standards. A modest inventory of predefined "header" fields is specified, as shown above. Additional fields with unreserved names can be added at the discretion of producers and consumers of messages; any software that doesn't understand such fields SHOULD ignore them and MUST NOT fail because of their inclusion in a message.

Aligning with [RFC 6648](https://tools.ietf.org/html/rfc6648.html), DIDComm Messaging explicitly rejects the `X-*` headers convention that creates divergent pseudo-standards; if a new header needs broad support, proper standardization is required. Since we expect header fields to be small in number and modest in complexity, we expect this sort of powerful extensibility to be unnecessary in most cases.

#### Simple vs. Structured

Headers can be simple (mapping a header name to an integer or a string) or structured (mapping a header name to JSON substructure -- an array or JSON object). When defining a new header type, the following guidelines apply:

* Headers SHOULD NOT use more structure than necessary; simple headers are preferred.
* However, a header value SHOULD NOT require interpretation over and above ordinary JSON parsing. Prefer JSON structure to specialized string DSLs like the one that encodes media type preferences in an HTTP `Accept` header. ([HTTP Structured Headers](https://tools.ietf.org/html/draft-ietf-httpbis-header-structure-15) provide similar functionality but are unnecessary here, since plaintext messages already have an easily parseable syntax.)
* Headers that are only meaningful together SHOULD be grouped into a JSON object.

### Attachments

It is common for DIDComm messages to supplement formalized structure with arbitrary data &mdash; images, documents, or types of media not yet invented. Such content is "attached" to DIDComm messages in much the same way that attachments work in email.

Attachments are contained within a list in the `attachments` header.

Each attachment is described with an instance of a JSON object that has the following structure.

- `id`: [optional but recommended] Identifies attached content within the scope of a given message, so it can be referenced. For example, in a message documenting items for sale on an auction website, there might be a field named `front_view` that contains the value `#attachment1`; this would reference an attachment to the message with `id` equal to `attachment1`. If omitted, then there is no way to refer to the attachment later in the thread, in error messages, and so forth. Because the `id` of an attachment is used to compose URIs, this value should be brief and MUST consist entirely of [unreserved URI characters](https://datatracker.ietf.org/doc/html/rfc3986/#section-2.3) – meaning that it is not necessary to [percent encode](https://en.wikipedia.org/wiki/Percent-encoding) the value to incorporate it in a URI.
- `description`: [optional] A human-readable description of the content.
- `filename`: A hint about the name that might be used if this attachment is persisted as a file. It is not required, and need not be unique. If this field is present and `media_type` is not, the extension on the filename may be used to infer a MIME type.
- `media_type`: [optional] Describes the media type of the attached content.
- `format`: [optional] Further describes the format of the attachment if the `media_type` is not sufficient.
- `lastmod_time`: [optional] A hint about when the content in this attachment was last modified.
- `data`: A JSON object that gives access to the actual content of the attachment. Contains enough of the following subfields to allow access to the data:
    * `jws`: [optional] A [JWS](https://tools.ietf.org/html/rfc7515) in [detached content mode](https://tools.ietf.org/html/rfc7515#appendix-F), where the `payload` field of the JWS maps to `base64` or to something fetchable via `links`. This allows attachments to be signed. The signature need not come from the author of the message.
    * `hash`: [optional] The hash of the content encoded in multi-hash format. Used as an integrity check for the attachment, and MUST be used if the data is referenced via the `links` data attribute.
    * `links`: [optional] A list of zero or more locations at which the content may be fetched. This allows content to be attached by reference instead of by value.
    * `base64`: [optional] [Base64url](https://tools.ietf.org/html/rfc4648#section-5)-encoded data, when representing arbitrary content inline instead of via `links`.
    * `json`: [optional] Directly embedded JSON data, when representing content inline instead of via `links`, and when the content is natively conveyable as JSON.
- `byte_count`: [optional] mostly relevant when content is included by reference instead of by value. Lets the receiver guess how expensive it will be, in time, bandwidth, and storage, to fully fetch the attachment.

#### Attachment Example

```json
{
    "type": "<sometype>",
    "to": ["did:example:mediator"],
    "body":{
        "attachment_id": "1",
        "encrypted_details": {
            "id": "x",
            "encrypted_to": "",
            "other_details": "about attachment"
        }
    },
    "attachments": [
        {
			"id": "1",
            "description": "example b64 encoded attachment",
            "data": {
            	"base64": "WW91ciBob3ZlcmNyYWZ0IGlzIGZ1bGwgb2YgZWVscw=="
        	}
        },{
			"id": "2",
            "description": "example linked attachment",
            "data": {
            	"hash": "<multi-hash>",
                "links": ["https://path/to/resource"]
        	}
        },{
			"id": "x",
            "description": "example encrypted DIDComm message as attachment",
            "media_type": "application/didcomm-encrypted+json",
            "data": {
            	"json": {
                    //jwe json structure
                }
        	}
        }
    ]
}
```

### Goal Codes

Goal codes are used to coordinate the purpose of an interaction. Some protocols are generic enough to be used for different purposes; goal codes communicate the purpose of the interaction unambiguously. The Out of Band protocol provides an example: A proposes to B that they connect, and supplies a goal code to clarify why the connection is desired. Goal codes may also be used to signal intent to engage in a sequence of protocols as a unit. This is useful for interoperability profiles.

Goal codes are a structured string datatype that is used in plaintext message content. This spec defines their meaning but not their place or field name in a message; the latter questions are for specific protocols to decide.

Reading left to right, goal codes strings convey meaning that gets more specific as the string progresses. In order to avoid collision between different efforts and goal codes, goal codes defined outside of this spec MUST use Reverse Domain Notation with the associated effort's domain as a prefix: `com.example.category.specific`. Any structure after the domain name portion is acceptable; [DIDComm v1 proposed some conventions](https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0519-goal-codes/README.md) that may be useful.