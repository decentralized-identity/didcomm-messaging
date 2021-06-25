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

- `id`: Identifies attached content within the scope of a given message. Recommended on appended attachment descriptors. Possible but generally unused on embedded attachment descriptors. Never required if no references to the attachment exist; if omitted, then there is no way to refer to the attachment later in the thread, in error messages, and so forth. Because `id` is used to compose URIs, it is recommended that this name be brief and avoid spaces and other characters that require URI escaping.
- `description`: [optional] A human-readable description of the content.
- `filename`: A hint about the name that might be used if this attachment is persisted as a file. It is not required, and need not be unique. If this field is present and `mime-type` is not, the extension on the filename may be used to infer a MIME type.
- `format`: [optional] Describes the format of the attachment (ie)
- `mime_type`: [optional] Describes the MIME type of the attached content.
- `lastmod_time`: A hint about when the content in this attachment was last modified.
- `byte_count`: [optional] mostly relevant when content is included by reference instead of by value. Lets the receiver guess how expensive it will be, in time, bandwidth, and storage, to fully fetch the attachment.
- `data`: A JSON object that gives access to the actual content of the attachment. Contains the following subfields:
  - `jws`: [optional] A JSON Web Signature over the content of the attachment.
  - `hash`: [optional] The hash of the content encoded in multi-hash format. Used as an integrity check for the attachment, and MUST be used if the data is referenced via the `links` data attribute. 
  - `links`: [optional] A list of zero or more locations at which the content may be fetched.
  - `base64`: [optional]Base64-encoded data, when representing arbitrary content inline instead of via `links`.
  - `jwe`: Already encrypted data in the form of a JWE.
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
            "description": "example encrypted attachment",
            "data": {
            	"jwe": {
                    //jwe json structure
                }
        	}
        }
    ]
}
```