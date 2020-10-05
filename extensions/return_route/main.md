# DIDComm Messaging Return-Route Extension

## Summary

DIDComm Transports are simplex: they only transfer messages from sender to receiver. This extension enables bi-directional communication on the same transports. Messages can flow back in response to inbound messages over the same connection. This is particularly useful for communication between agents that are unable to provide routable endpoints (such as mobile phones or agents inside a firewall) and their mediators.

## Scope

This extension is only to be used between the immediate sending agent and the agent it connects directly to. This extension is not valid when routing keys are in use.

## Reference

This extension adds a new header in DIDComm messages: `return_route`. When a message is received with this header, use of the connection to return messages should be adjusted according to the value presented.

- `return_route` has the following acceptable values:

  - `none`: Default. No messages should be returned over this connection. If return_route is omitted, this is the default value.
  - `all`: Send all messages for this DID over the connection.
  - `thread`: Send all messages matching the DID and thread specified in the `return_route_thread` attribute.

  TODO: Should we eliminate thread for simplicity?

For HTTP transports, the presence of this message decorator indicates that the receiving agent MAY hold onto the connection and use it to return messages as designated. HTTP transports will only be able to receive at most one message at a time. Websocket transports are capable of receiving multiple messages over a single connection.
