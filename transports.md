## Transports
### Summary
DIDComm Messaging is designed to be transport independent, including message encryption and agent message format. The encryption envelope provides both encryption and authentication, providing trust as a feature of each message. Each transport does have unique features, and we need to standardize how the transport features are (or are not) applied.

### Reference
#### HTTP(S)

HTTP(S) transports are an effective way to send a message to another online agent.

- Messages are transported via HTTP POST.
- The MIME Type for the POST request is `application/didcomm-enc-env`.
- The HTTP POST should return a 202 Accepted status code. This indicates that the request was received, but not necessarily processed. Returning a 200 OK status code is allowed.
- POST requests are considered transmit only by default. No agent messages will be returned in the response. This behavior may be modified with additional signaling.
- Using HTTPS with TLS 1.2 or greater with a forward secret cipher will provide Perfect Forward Secrecy (PFS) on the transmission leg.

#### WebSocket
Websockets are an efficient way to transmit multiple messages without the overhead of individual requests. This is useful in a high bandwidth situation

- Each message is transmitted individually in an Encryption Envelope.
- Each message is sent as single text based message over the websocket.
- The trust of each message comes from the Encryption Envelope, not the socket connection itself.
- Websockets are considered transmit only by default. Messages will only flow from the agent that opened the socket. This behavior may be modified with additional signaling.
- Using Secure Websockets (wss://) with TLS 1.2 or greater with a forward secret cipher will provide Perfect Forward Secrecy (PFS) on the transmission leg.

The usage of this transport can be beneficial when only one side of the communication can initiate a request to the other side, for example, the former is behind a Firewall or behind NAT.

With STOMP over WebSocket, the content-type header is application/didcomm-enc-env as in the HTTP(S) message.

TODO:

* Quic
* Transport binding
