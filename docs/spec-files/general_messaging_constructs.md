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

## Goal Codes

Goal codes are used to coordinate the purpose of an interaction. Some protocols are generic enough to be used for different purposes, and goal codes are a mechanism to communicate the purpose of an interaction in that situation. They are used in Out of Band messages for that reason.

Goal codes may also be used to signal a set of protocols or other mechanisms. This is often useful for interoperability profiles.

In order to avoid collision between different efforts and goal codes, goal codes defined outside of this spec MUST use Reverse Domain Notation with the associated effort's domain, such as com.example.category.specific, where any structure after the domain name portion is acceptable. 

## Attachments

### Summary

DIDComm messages use a structured format with a defined schema and a small inventory of scalar data types (string, number, date, etc). However, it will be quite common for messages to supplement formalized exchange with arbitrary data--images, documents, or types of media not yet invented.

We need a way to "attach" such content to DIDComm messages. This method must be flexible, powerful, and usable without requiring new schema updates for every dynamic variation.

### Reference

Attachments are contained within a list in the `attachments` header.

Each attachment is contained within the following structure.

- `id`: [optional but recommended] Identifies attached content within the scope of a given message, so it can be referenced. For example, in a message documenting items for sale on an auction website, there might be a field named `front_view` that contains the value `#attachment1`; this would reference an attachment to the message with `id` equal to `attachment1`. Recommended on appended attachment descriptors. If omitted, then there is no way to refer to the attachment later in the thread, in error messages, and so forth. Because `id` is used to compose URIs, this value should be brief and MUST consist entirely of [unreserved URI characters](https://datatracker.ietf.org/doc/html/rfc3986/#section-2.3) – meaning that it is not necessary to [percent encode](https://en.wikipedia.org/wiki/Percent-encoding) the value to incorporate it in a URI.
- `description`: [optional] A human-readable description of the content.
- `filename`: A hint about the name that might be used if this attachment is persisted as a file. It is not required, and need not be unique. If this field is present and `mime-type` is not, the extension on the filename may be used to infer a MIME type.
- `media_type`: [optional] Describes the media (MIME) type of the attached content.
- `format`: [optional] Describes the format of the attachment if the `media_type` is not sufficient.
- `lastmod_time`: [optional] A hint about when the content in this attachment was last modified.
- `byte_count`: [optional] mostly relevant when content is included by reference instead of by value. Lets the receiver guess how expensive it will be, in time, bandwidth, and storage, to fully fetch the attachment.
- `data`: A JSON object that gives access to the actual content of the attachment. Contains enough of the following subfields to allow access to the data:
  - `jws`: [optional] A [JWS](https://tools.ietf.org/html/rfc7515) in [detached content mode](https://tools.ietf.org/html/rfc7515#appendix-F), where the `payload` field of the JWS maps to `base64` or to something fetchable via `links`. This allows attachments to be signed. The signature need not come from the author of the message.
  - `hash`: [optional] The hash of the content encoded in multi-hash format. Used as an integrity check for the attachment, and MUST be used if the data is referenced via the `links` data attribute. 
  - `links`: [optional] A list of zero or more locations at which the content may be fetched.
  - `base64`: [optional] [Base64url](https://tools.ietf.org/html/rfc4648#section-5)-encoded data, when representing arbitrary content inline instead of via `links`.
  - `json`: [optional] Directly embedded JSON data, when representing content inline instead of via `links`, and when the content is natively conveyable as JSON.

### Example

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
                "links": ["http://path/to/resource"]
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
