## Trust Ping Protocol 1.0

A standard way for agents to test connectivity,
responsiveness, and security of a DIDComm channel.

### Motivation

Agents are distributed. They are not guaranteed to be
connected or running all the time. They support a
variety of transports, speak a variety of protocols,
and run software from many different vendors.

This can make it very difficult to prove that two
agents have a functional pairwise channel. Troubleshooting
connectivity, responsiveness, and security is vital.

### Reference

This protocol is analogous to the familiar `ping`
command in networking--but because it operates
over DIDComm, it is transport
agnostic and asynchronous, and it can produce insights
into privacy and security that a regular ping
cannot.

#### Roles

There are two parties in a trust ping: the `sender`
and the `receiver`. The sender initiates the trust
ping. The receiver responds. If the receiver wants
to do a ping of their own, they can, but this is a
new interaction in which they become the sender.

#### Protocol Type URI

`https://didcomm.org/trust_ping/1.0`

#### Messages

##### ping

The trust ping interaction begins when `sender`
creates a `ping` message like this:

```JSON
{
  "type": "https://didcomm.org/trust_ping/1.0/ping",
  "id": "518be002-de8e-456e-b3d5-8fe472477a86",
  "body": {
      "response_requested": true
  }
}
```

**response_requested**: default value is `true`. If false, the `sender` is not requesting a `ping_response` from the `receiver`. If `true`, the `sender` is requesting a response.

##### ping_response

When the message arrives at the receiver, assuming that `response_requested`
is not `false`, the receiver should reply as quickly as possible with a
`ping_response` message that looks like this:

```JSON
{
  "type": "https://didcomm.org/trust_ping/1.0/ping_response",
  "id": "e002518b-456e-b3d5-de8e-7a86fe472847",
  "thread_id": "518be002-de8e-456e-b3d5-8fe472477a86"
}
```



#### Trust

This is the "**trust** ping protocol", not just the "ping protocol."
The "trust" in its name comes from several features that the interaction
gains by virtue of the properties of the DIDComm messages. A ping and response verify to both parties that the necessary encryption is in place and working properly for the messages to be understood.

