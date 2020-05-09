## Message Structure

DIDComm Messages are based on JWM (JSON Web Messages). A message has a basic structure that specifies the message type, id, and other attributes common to all messages. A message also includes attributes specific to the message type. Prior to being sent to a recipient, the JWM is encrypted into a JWE according to the JWM spec.

The following example shows common elements of a DIDComm Message. Further details and advanced usage are covered elsewhere in this spec.

```json
{
    "@id": "1234567890",
    "@type": "<message-type-uri>",
    "from": "did:example:alice",
    "to": ["did:example:bob"],
    "created_time": "1516269022",
    "expires_time": "1516269022",
    "body": {
    	"messagespecificattribute": "and it's value"
	}
}
```



The attributes of a DIDComm Message are as follows:

- **id** - REQUIRED. Message ID. The `id` attribute value MUST be unique to the sender.
- **type** - REQUIRED. Message Type. The `type` attribute value MUST be a valid [Message Type URI](protocols.md#message-type-uri) , that when resolved gives human readable information about the message. The attributes value also informs the content of the message, for example the presence of other attributes and how they should be processed.
- **to** - OPTIONAL. Recipient(s) identifier. The `to` attribute MUST be an array of strings where each element is a valid [DID](https://w3c.github.io/did-core/#generic-did-syntax) which identifies the recipients of the message.
- **from** - OPTIONAL. Sender identifier. The `from` attribute MUST be a string that is a valid [DID](https://w3c.github.io/did-core/#generic-did-syntax) which identifies the sender of the message. For DID methods that use query parameters to carry additional information, they might also be present in the from string. When a message is encrypted, the sender key MUST be authorized for encryption by this DID. Authorization of the encryption key for this DID MUST be verified by message recipient.
- **created_time** - OPTIONAL. Message Created Time. The `created_time` attribute is used for the sender to express when they created the message, expressed in UTC Epoch Seconds (seconds since 1970-01-01T00:00:00Z UTC) [link](1970-01-01T00:00:00Z UTC). This attribute is informative to the recipient, and may be relied on by protocols.
- **expires_time** - OPTIONAL. Message Expired Time. The `expires_time` attribute is used for the sender to express when they consider the message to be expired, expressed in UTC Epoch Seconds (seconds since 1970-01-01T00:00:00Z UTC) [link](1970-01-01T00:00:00Z UTC). This attribute signals when the message is no longer valid, and is to be used by the recipient to discard expired messages on receipt.

When the sender is rotating their _from_ DID, additional fields are required to link the new did (present in **from**) and the prior DID:

- **from_prior**: The previously used DID.
- **from_provenance**: The signature of the new **from** DID with an authorized key of the DID in **from_prior**. 

TODO: Define the format of the from_provenance attribute. JWT? 

This method  is only needed when moving from one DID to another. Updating a DID should be performed according to the DID method update procedure. 

