#### The Empty Message

Sometimes, only headers need to be communicated; there is no content for the body. DIDComm explicitly defines a message type with MIURI `https://didcomm.org/reserved/2.0/empty` for this purpose. This message may or may not include an actual `body` element; if present, its value MUST be `null` or an empty JSON object.
