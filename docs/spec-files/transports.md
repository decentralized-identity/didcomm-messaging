## Transports
### Summary
DIDComm Messaging is designed to be transport independent, including message encryption and agent message format. The encryption envelope provides both encryption and authentication, providing trust as a feature of each message. Each transport does have unique features, and we need to standardize how the transport features are (or are not) applied.

### Delivery

DIDComm Transports serve only as message _delivery_. No information about the effects or results from a message is transmitted over the same connection.

### Transport Requirements

Transports are defined within this section. Additional transports may be defined as an extension.

Each transport MUST define:

- format of `serviceEndpoint` `uri`: Which URI schemes are used (if URI), or the properties of the object (if object).
- how to actually send messages:  e.g., through HTTPS POST, through dial protocol (libp2p), etc.
- how mime-types of the content are provided, e.g., through Content-Type header, etc.
- where additional context definition is hosted, e.g., in case the `serviceEndpoint`  object has extra properties specific to the transport.

### Reference
#### HTTPS

HTTPS transports are an effective way to send a message to another online agent.

- Messages are transported via HTTPS POST.
- The MIME Type for the POST request is set to the corresponding media type defined in [Media Types](#media-types), e.g., `application/didcomm-encrypted+json`.
- A successful message receipt MUST return a code in the 2xx HTTPS Status Code range. It is recommended that a HTTPS POST should return a 202 Accepted status code. 
- POST requests are transmit only. Messages are only sent from the code that submitted the POST request.
- HTTPS Redirects SHOULD be followed. Only Temporary Redirects (307) are acceptable. Permanent endpoint relocation should be managed with a DID Document update.
- Using HTTPS with TLS 1.2 or greater with a forward secret cipher will provide Perfect Forward Secrecy (PFS) on the transmission leg.

#### WebSocket
Websockets are an efficient way to transmit multiple messages without the overhead of individual requests. This is useful in a high bandwidth situation

- Each message is transmitted individually in an Encryption Envelope.
- Each message is sent as single text based message over the websocket.
- The trust of each message comes from the Encryption Envelope, not the socket connection itself.
- Websockets are considered transmit only. Messages flow only from the agent that opened the socket.
- Using Secure Websockets (wss://) with TLS 1.2 or greater with a forward secret cipher will provide Perfect Forward Secrecy (PFS) on the transmission leg.
- When using STOMP over WebSocket, the content-type header is application/didcomm-enc-env as in the HTTPS message.
