### The Empty Message

Sometimes, only headers need to be communicated; there is no content for the body.

The [PIURI](#protocol-identifier-uri) for this protocol is:

    https://didcomm.org/empty/1.0

The `empty` message has no semantic meaning. The message's only purpose is to allow the transfer of message headers. 

```JSON
{
  "type": "https://didcomm.org/empty/1.0/empty",
  "id": "518be002-de8e-456e-b3d5-8fe472477a86",
  "from": "did:example:123456",
  "body": {}
}
```
