## Transports
### Summary
DIDComm Messaging is designed to be transport-independent. Regardless of transport, the encryption envelope provides confidentiality, integrity, and (for authcrypt) authentication, providing trust as a feature of each message. However, each transport does have unique features; DIDComm defines conventions that help to align usage. The normative statements below do not prevent someone from using DIDComm + a transport in custom ways; they simply specify one collection of choices that is standardized.

### Delivery

DIDComm Transports serve only as message _delivery_. No information about the effects or results from a message is transmitted over the same connection.

### Transport Requirements

Each transport MUST define:

- format of `serviceEndpoint` `uri`: Which URI schemes are used (if URI), or the properties of the object (if object).
- how to actually send messages:  e.g., through HTTPS POST, through dial protocol (libp2p), etc.
- how [IANA media types](#iana-media-types) of the content are provided, e.g., through `Content-Type` header, etc.
- where additional context definition is hosted, e.g., in case the `serviceEndpoint`  object has extra properties specific to the transport.


### Agent Constraint Disclosure

As mentioned above, DIDComm Messaging is designed to be transport-independent.  Given the wide varity of transports that can be conceived, some agents may have additional capabilities that they would like to disclose regarding how they communicate.  These generic and customizable capabilities may vary over time, be unique to special categories of agents, and may be expressed using using the [Discover Features Protocol](discover-features-protocol-10). The following includes a subset of the many different agent transport capabilities that can be expressed:

#### max\_receive\_bytes
The _optional_ `max_receive_bytes` capability is used to specify the total length of the DIDComm header plus the size of the message payload that an agent is willing to receive. While the core DIDComm protocol itself does not impose a specific maximum size for DIDComm messages, a particular agent may have specific requirements that necessitate only receiving messages up to a specific length.  For example, IoT devices that may not have the bandwidth or buffering capabilites to accept large messages may choose to only accept _small_ messages.  The definition of _large_ vs _small_ is subjective and may be defined according to the needs of the implementing agent.

When a `max_receive_bytes` capability is specified, any received message that exceeds the pre-defined maximum will be discarded. _Optionally_, a response message may be returned in order to inform the sender why their message was rejected (due to size limitations) and also to inform them of the maximum message length.  

Prior to transmission, a sending agent may query a receiving agent for a maximum message length limitation using the [Discover Features Protocol](#discover-features-protocol-10). Using the Discover Features Protocol, a `max_receive_bytes` query message may look like this:

```json
{
    "type": "https://didcomm.org/discover-features/2.0/queries",
    "id": "yWd8wfYzhmuXX3hmLNaV5bVbAjbWaU",
    "body": {
        "queries": [
            { "feature-type": "constraint", "match": "total_length" }
        ]
    }
}
```

In response to a `total_length` request, a Discover Features _disclose_ message may look like this:

```json
{
    "type": "https://didcomm.org/discover-features/1.0/disclose",
    "thid": "yWd8wfYzhmuXX3hmLNaV5bVbAjbWaU",
    "body":{
        "disclosures": [
            {
                "feature-type": "constraint",
                "max_receive_bytes": "65536"
            }
        ]
    }
}
```

### Reference
#### HTTPS

HTTPS transports are an effective way to send a message to another online agent.

- Messages MUST be transported via HTTPS POST.
- The IANA media type for the POST request MUST be set to the [corresponding media type](#iana-media-types), e.g., `application/didcomm-encrypted+json`.
- A successful message receipt MUST return a code in the 2xx HTTPS Status Code range. 202 Accepted is recommended. 
- POST requests are used only for one-way transmission from sender to receiver; responses don't flow back in the web server's HTTP response.
- HTTPS Redirects SHOULD be followed. Only temporary redirects (307) are acceptable. Permanent endpoint relocation should be managed with a DID Document update.
- Using HTTPS with TLS 1.2 or greater with a cipher suite providing Perfect Forward Secrecy (PFS) allows a transmission to benefit from PFS that's already available at the transport level.

#### WebSockets
Websockets are an efficient way to transmit multiple messages without the overhead of individual requests. This is useful in a high bandwidth situation.

- Each message MUST be transmitted individually; if encryption or signing are used, the unit of encryption or signing is one message only.
- The trust of each message MUST be associated with DIDComm encryption or signing, not from the socket connection itself.
- Websockets are used only for one-way transmission from sender to receiver; responses don't flow back the other way on the socket.
- Using Secure Websockets (wss://) with TLS 1.2 or greater with a cipher suite providing Perfect Forward Secrecy (PFS) allows a transmission to benefit from PFS that's already available at the transport level.
- When using STOMP over WebSocket, the `content-type` header is `application/didcomm-encrypted+json` as in the HTTPS message.
