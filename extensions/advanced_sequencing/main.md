# DIDComm Advanced Sequencing Extension

## Summary 

In a simple interaction between two parties that consists of a request and a response, the message types usually imply the order without ambiguity. However, some protocols have more complex requirements. For example, an auction protocol that consists of `bid` messages might produce different outcomes depending on whether a lower bid arrives before or after a higher bid. When such protocols unfold over asynchronous transports that don't guarantee a delivery order, and when more than two participants are involved, understanding the intended sequence requires extra data.

## Scope

This extension does not specify how gaps or out-of-order messages should be *handled* -- only how they should be *detected*. That is because some protocols may consider out-of-order messages harmless, whereas other protocols may be highly sensitive to problems triggered by such conditions. Thus, the scope of this extension is *detecting sequencing issues*. Any protocol that cares about sequencing issues SHOULD use this mechanism as its foundational semantics for understanding the problem, and MAY choose to react to the issues in whatever way the protocol designers deem appropriate. 

## Reference

DIDComm messages that support this extension offer three headers related to sequencing: `sender_order`, `sent_count`, and `received_orders`. These headers are only relevant to certain protocols. Protocol definitions MUST declare whether they use any of these headers. This is because general implementations of DIDComm are not required to implement support for the headers unless/until they intend to support protocols that use them.

### `sender_order`

The `sender_order` header tells other parties how the sender of a message perceives their own ordering. Its value is a monotonically increasing natural/ordinal number (1..<var>N</var>) that tells how many different messages the sender has sent in the current thread. When Alice and Bob are both bidding in an auction protocol, each of them marks their first bid with `sender_order: 1`, their second bid with `sender_order: 2`, and so forth. This allows the auctioneer to detect if Alice's bids arrive in a different order than she intended. It also means that any message can be uniquely identified by its `thid`, the sender, and the value of that sender's `sender_order`. Note how this does NOT clarify the sequence of Alice's messages relative to Bob's.

### `sent_count`

The `sent_count` header enables resend behavior. A resent message contains the same headers (including `id` and `sender_order`) and body as a previous transmission. The first time a message is sent, the `sent_count` for that message is 1, and the header is normally omitted (the value of the header is implicitly 1). The second time the message is sent, the `sent_count` is 2, and the header is added to indicate that the message might be redundant ("this is the second time I've sent this to you"). The header continues to be incremented with each subsequent resend. Once a recipient has received one copy of a message, they MUST ignore subsequent copies that arrive, such that resends are idempotent.

### `received_orders`

The `received_orders` header tells other parties how the sender has experienced the unfolding interaction so far. This allows gaps to be detected, possibly triggering a resend. The value of this header is an array of *gap detector* objects in the format `{"id":<did of party>, "last":<value of biggest sender_order seen from this party>, "gaps": []}`. In our running auction example, if the auctioneer sees bids 1 and 2 from Bob, and bid 1 and 4 from Alice, the auctioneer might send a message to all the bidders that includes the following `received_orders` header:

```json
"received_orders": [
  {"id": "did:ex:bob", "last": 2, "gaps": []},
  {"id": "did:ex:alice", "last": 4, "gaps": [2,3]}      
]
```

This lets Alice (or Bob) notice that the auctioneer hasn't seen the messages that Alice numbered 2 and 3. Gaps can then be plugged or ignored, depending on protocol rules. 