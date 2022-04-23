## Transports
### Summary
DIDComm Messaging is designed to be transport-independent. Regardless of transport, the encryption envelope provides confidentiality, integrity, and (for authcrypt) authentication, providing trust as a feature of each message. However, each transport does have unique features; DIDComm defines conventions that help to align usage. The normative statements below do not prevent someone from using DIDComm + a transport in custom ways; they simply specify one collection of choices that is standardized.

### Delivery

DIDComm Transports serve only as message _delivery_. No information about the effects or results from a message is transmitted over the same connection.

### Transport Requirements

Each transport MUST define:

- format of `serviceEndpoint` `uri`: Which URI schemes are used (if URI), or the properties of the object (if object).
- how to actually send messages:  e.g., through HTTPS POST, through dial protocol (libp2p), etc.
- how mime-types of the content are provided, e.g., through Content-Type header, etc.
- where additional context definition is hosted, e.g., in case the `serviceEndpoint`  object has extra properties specific to the transport.

### Reference
#### HTTPS

HTTPS transports are an effective way to send a message to another online agent.

- Messages MUST be transported via HTTPS POST.
- The IANA media type for the POST request MUST be set to the corresponding media type defined in [Media Types](#media-types), e.g., `application/didcomm-encrypted+json`.
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
