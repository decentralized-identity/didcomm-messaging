# DIDComm libp2p Transport Extension

## Summary 

Specifies how to use a [libp2p](https://github.com/libp2p/specs) Stream as a [DIDComm transport](https://identity.foundation/didcomm-messaging/spec/#transport-requirements) and how to create that Stream using a libp2p [Protocol](https://docs.libp2p.io/concepts/fundamentals/protocols/). 

## Overview

[libp2p](https://libp2p.io/) is a modular framework for peer-to-peer communication developed as part of the IPFS tech stack. It is possible to run libp2p nodes on many different platforms, with [implementations for many different languages](https://libp2p.io/implementations/).

### Note on `peerId` and `peer DID`

Please note that a `peerId` is NOT a `peer DID`. A `peerId` is an identifier used within the libp2p/ipfs ecosystem to identify nodes and is not related to the `did:peer` DID method.

## Conventions

### Endpoints

Support for this extension is signaled by including, in a DID doc, a DIDComm `serviceEndpoint` that contains a `uri` with a `libp2p-peerId` scheme described as follows:

```
uri = "libp2p-peerId:" + peerId
```

where `peerId` is a [unique identifier for Libp2p Peers](https://github.com/libp2p/specs/blob/master/peer-ids/peer-ids.md).

A DID Document `serviceEndpoint` for DIDComm over libp2p can be augmented with a field called `multiAddrs`, which is an array of [Multiaddresses](https://github.com/multiformats/multiaddr) that represent libp2p endpoints that the peer is currently listening on. This allows a sender to skip the "Peer Discovery" step (to be detailed later).

All other properties of DIDComm-style `serviceEndpoint` objects are [standard](https://identity.foundation/didcomm-messaging/spec/#service-endpoint) with this extension.


### Sending

A *sender* must instantiate a libp2p node in order to send messages.

To send a message over libp2p, the sender must first find the `peerId` by extracting it from the recipient's DID Document. Using this `peerId`, the sender can discover the multiaddresses on which the recipient is listening using a process called "Peer Discovery". There are multiple approaches to Peer Discovery, and a specific recommendation is out of scope for this specification. Peer Discovery mechanisms are detailed [here](https://github.com/libp2p/js-libp2p/tree/master/examples/discovery-mechanisms)

Once the recipient's multiaddresses are found, the sender must create a *stream* between the two nodes using the `dialProtocol` function, using the string "didcomm/v2" as the `protocol` parameter. This creates a duplex stream, but will only be used as a simplex stream by DIDComm implementations.

The sender may attempt to create a stream for any or all of the recipient's multiaddresses.

Messages can then be "piped" through this stream to the recipient. Examples of how to pipe messages via streams can be found online, but for convenience, a javascript example is given below:

```
    import { pipe } from "it-pipe"
    import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
    import * as lp from 'it-length-prefixed'

    const stream = await libp2pNode.dialProtocol(multiAddr, 'didcomm/v2')

    await pipe(
        message, 
        (source) => map(source, (string) => uint8ArrayFromString(string)),
        lp.encode(),
        stream.sink
    )
    stream.close()
```

### Receiving

A *recipient* must be running a libp2p node in order to receive messages.

The recipient should ensure the multiaddresses on which they're listening are discoverable, whether by announcing themselves to a "Bootstrap" node, or by explicitly specifying the multiaddresses in their DID Document.

In order to receive messages, the recipient must setup their node to handle streams on the "didcomm/v2" protocol. There is some processing of messages required in order to account for how messages are sent in "chunks". Examples and implementations can be found in multiple languages, but for convenience, a javascript example is given below:

```
    import * as lp from 'it-length-prefixed'
    import map from 'it-map'
    import { Uint8ArrayList } from 'uint8arraylist'

    libp2p.handle('didcomm/v2', async ({ stream }) => {
        pipe(
          // Read from the stream (the source)
          stream.source,
          // Decode length-prefixed data
          lp.decode(),
          // Turn buffers into strings
          (source) => map(source, (buf: Uint8ArrayList) => uint8ArrayToString(buf.subarray())),
          // Sink function
          async function (source) {
            // For each chunk of data
            let message = ""
            for await (const msg of source) {
              // console.log("msg of source: ", msg)
              message = message + (msg.toString().replace('\n',''))
            }
            doSomethingWithMessage(message)
          }
        )
      })
```

### Relayers

If both the sender and recipient are behind NAT, or other firewall, or support incompatible transport types, they will need to use a libp2p *Relayer* in order to communicate. Setting up libp2p nodes to communicate via *Relayers* is out of scope for this specification, but examples in the libp2p repositories can be found.
 

### Transports

libp2p supports several different transports. Enabling communication between certain device types may require thoughtful consideration of what transports to support. This specification makes no demands on which transports to support, other than to recommend that implementers support as many transports as is reasonable for them.

https://connectivity.libp2p.io/


### Notes
1. This spec extension was based on an article written by Oliver Terbu and Alen Horvat: [DIDComm Messaging through libp2p](https://medium.com/uport/didcomm-messaging-through-libp2p-cffe0f06a062)
2. The [`js-libp2p`](https://github.com/libp2p/js-libp2p/tree/master/examples) repository contains several examples for setting up libp2p nodes in various circumstances