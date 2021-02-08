## General Messaging Constructs

* Decorators (headers)
* Threading
* Message types / families
* Reliable Delivery
* Attachment/Payload Signatures
* Timing
* ACKs
* Errors
* Tracing / troubleshooting

## Attachments

### Summary

DIDComm messages use a structured format with a defined schema and a small inventory of scalar data types (string, number, date, etc). However, it will be quite common for messages to supplement formalized exchange with arbitrary data--images, documents, or types of media not yet invented.

We need a way to "attach" such content to DIDComm messages. This method must be flexible, powerful, and usable without requiring new schema updates for every dynamic variation.

### Reference

Attachments are contained within a list in the `attachments` header.

Each attachment is contained within the following structure.

- `@id`: A [JSON-LD construct](https://github.com/hyperledger/aries-rfcs/blob/master/concepts/0047-json-ld-compatibility/README.md#id) that uniquely identifies attached content within the scope of a given message. Recommended on appended attachment descriptors. Possible but generally unused on embedded attachment descriptors. Never required if no references to the attachment exist; if omitted, then there is no way to refer to the attachment later in the thread, in error messages, and so forth. Because `@id` is used to compose URIs, it is recommended that this name be brief and avoid spaces and other characters that require URI escaping.
- `description`: An optional human-readable description of the content.
- `filename`: A hint about the name that might be used if this attachment is persisted as a file. It is not required, and need not be unique. If this field is present and `mime-type` is not, the extension on the filename may be used to infer a MIME type.
- `mime-type`: Describes the MIME type of the attached content. Optional but recommended.
- `lastmod_time`: A hint about when the content in this attachment was last modified.
- `byte_count`: Optional, and mostly relevant when content is included by reference instead of by value. Lets the receiver guess how expensive it will be, in time, bandwidth, and storage, to fully fetch the attachment.
- `data`: A JSON object that gives access to the actual content of the attachment. Contains the following subfields:
  - `jws`: A JSON Web Signature over the content of the attachment. Optional.
  - `sha256`: The hash of the content. Optional. Used as an integrity check if content is inlined. if content is only referenced, then including this field makes the content tamper-evident. This may be redundant, if the content is stored in an inherently immutable container like content-addressable storage. This may also be undesirable, if dynamic content at a specified link is beneficial. Including a hash without including a way to fetch the content via link is a form of proof of existence.
  - `links`: A list of zero or more locations at which the content may be fetched. Optional.
  - `base64`: Base64-encoded data, when representing arbitrary content inline instead of via `links`. Optional.
  - `encrypted`: Already encrypted data, encoded in Base64. Data contained in this field MUST be encrypted.
  - `json`: Directly embedded JSON data, when representing content inline instead of via `links`, and when the content is natively conveyable as JSON. Optional.

### Example

```json
{
    "type": "<sometype>",
    "to": ["did:example:mediator"],
    "body":{
        "attachment_id": "#1",
    },
    "attachments": [
        {
			"@id": "1",
            "description": "my attachment",
            "data": {
            	"base64": "WW91ciBob3ZlcmNyYWZ0IGlzIGZ1bGwgb2YgZWVscw=="
        	}
        }
    ]
}
```