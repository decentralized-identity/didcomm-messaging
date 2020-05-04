## Transports
### Summary
This spec details how different transports can be used to transmit DIDComm messages.
### Motivation
The DIDComm message is constructed as JWM, using JWE for confidentiality and authentication, so it is transport agnostic.
Each transport has unique features and properties, so we need to define a standard usage that will be aligned with the asynchronous+simplex design decision.
### Reference
#### HTTP(S)
The POST method is used to send the DIDComm message.
The POST message MIME type is application/didcomm-enc-env.
A successful response code is 202 (Accepted), but 200 (OK) is also allowed.
#### WebSocket
The usage of this transport can be beneficial when only one side of the communication can initiate a request to the other side, for example, the former is behind a Firewall or behind NAT.
With STOMP over WebSocket, the content-type header is application/didcomm-enc-env as in the HTTP(S) message.
TODO: Include details of the websocket message to define a standard usage.

TODO:
* Quic
* Transport binding
