### The Empty Message

Sometimes, only headers need to be communicated; there is no content for the body.

The [PIURI](#protocol-identifier-uri) for this protocol is:

    https://didcomm.org/empty/1.0

#### Roles

There are two parties in a trust ping: the `sender`
and the `receiver`. The sender initiates the trust
ping. The receiver responds. If the receiver wants
to do a ping of their own, they can, but this is a
new interaction in which they become the sender.

#### Messages

##### empty

The `empty` message has no semantic meaning. The message's only purpose is to allow the transfer of message headers. 

```JSON
{
  "type": "https://didcomm.org/empty/1.0/empty",
  "id": "518be002-de8e-456e-b3d5-8fe472477a86",
  "from": "did:example:123456",
  "body": {}
}
```