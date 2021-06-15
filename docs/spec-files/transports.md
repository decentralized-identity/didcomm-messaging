## Transports
### Summary
DIDComm Messaging is designed to be transport independent, including message encryption and agent message format. The encryption envelope provides both encryption and authentication, providing trust as a feature of each message. Each transport does have unique features, and we need to standardize how the transport features are (or are not) applied.

### Delivery

DIDComm Transports serve only as message _delivery_. No information about the effects or results from a message is transmitted over the same connection.

### Reference
#### HTTP(S)

HTTP(S) transports are an effective way to send a message to another online agent.

- Messages are transported via HTTP POST.
- The MIME Type for the POST request is set to the corresponding media type defined in [Media Types](#media-types), e.g., `application/didcomm-encrypted+json`.
- A successful message receipt MUST return a code in the 2xx HTTP Status Code range. It is recommended that a HTTP POST should return a 202 Accepted status code. 
- POST requests are transmit only. Messages are only sent from the code that submitted the POST request.
- HTTP Redirects SHOULD be followed. Only Temporary Redirects (307) are acceptable. Permanent endpoint relocation should be managed with a DID Document update.
- Using HTTPS with TLS 1.2 or greater with a forward secret cipher will provide Perfect Forward Secrecy (PFS) on the transmission leg.

#### WebSocket
Websockets are an efficient way to transmit multiple messages without the overhead of individual requests. This is useful in a high bandwidth situation

- Each message is transmitted individually in an Encryption Envelope.
- Each message is sent as single text based message over the websocket.
- The trust of each message comes from the Encryption Envelope, not the socket connection itself.
- Websockets are considered transmit only. Messages flow only from the agent that opened the socket.
- Using Secure Websockets (wss://) with TLS 1.2 or greater with a forward secret cipher will provide Perfect Forward Secrecy (PFS) on the transmission leg.

With STOMP over WebSocket, the content-type header is application/didcomm-enc-env as in the HTTP(S) message.

TODO:

* Quic
* Transport binding
