# DIDComm Filesystem Transport Extension

### Summary 

Specifies how to use a filesystem (or a filesystem-like container such as S3 or DropBox) as a [DIDComm transport](https://identity.foundation/didcomm-messaging/spec/#transport-requirements).

### Overview

Because DIDComm messages are self-contained data packages, they can be saved as files. If the intended recipient of messages sees the same filesystem and is aware of the conventions in this extension, they can process the files as received messages. The file system thus becomes a DIDComm transport.

Since filesystems can be carried on USB thumb drives, a filesystem transport enables a "sneakernet" that is full-featured despite being offline and highly asynchronous. Filesystem-based DIDComm can also be used for duplex and fan-out (e.g., broadcast, group chat) communication patterns, since the same filesystem can be used by many parties.

Filesystems are not the ideal transport for ultra-low-latency communication. However, their massive bandwidth and storage capacity, their mature and well integrated security models, their simplicity, their familiarity to developers, and their status as a first-class component with no special dependencies in all programming stacks makes them an interesting option for moving and storing DIDComm messages.

### Conventions

#### Endpoints

Support for this extension is signaled by including, in a DID doc, a DIDComm `serviceEndpoint` with a `uri` field that conforms to the `file:` URI scheme defined in [RFC 8089](https://datatracker.ietf.org/doc/html/rfc8089). The target of this URL MUST be a folder, not a file, and it MUST be writable to the sender and readable to the recipient. Such a folder is known as an __endpoint folder__.

All other properties of DIDComm-style `serviceEndpoint` objects are [standard](https://identity.foundation/didcomm-messaging/spec/#service-endpoint) with this extension.

#### Format and Naming conventions

The format of messages as files is exactly as given in the [DIDComm v2 spec](https://identity.foundation/didcomm-messaging/spec/). This means files contain exactly and only the bytes that one would expect for a [DIDComm Encrypted Message](https://identity.foundation/didcomm-messaging/spec/#didcomm-encrypted-messages), a [DIDComm Signed Message](https://identity.foundation/didcomm-messaging/spec/#didcomm-signed-messages), or a [DIDComm Plaintext Message](https://identity.foundation/didcomm-messaging/spec/#didcomm-encrypted-messages) if transferred over the wire. Conforming implementations MUST apply the appropriate extension as given in the spec (*.dcem, *.dcsm, *.dcpm, respectively). This allows DIDComm messages to be displayed in filesystem GUI tools like Windows Explorer or Mac Finder with appropriate icons, and with correctly inferred [IANA media types](https://identity.foundation/didcomm-messaging/spec/#iana-media-types).

Files in a folder that lack these extensions MUST be ignored by conforming implementations. This allows agents to hide messages that have already been processed, or that are still being built, by simply changing their extension.

Aside from the extension, the remainder of the filename of an individual message is arbitrary. However, it MAY include the value from the message's `id` header to guarantee uniqueness.

#### Ordering

When more than one DIDComm message is found in a single folder, receivers MUST process them in a predictable order to simulate the order-of-arrival semantics that are taken for granted in most other transports.

Two ordering semantics are supported. The simplest and default is to process files in order of ascending last modification date. Usually this suffices. However, there may be corner cases where this is inadequate. Therefore, it is also possible for senders to force an arbitrary order by naming files with an __ordinal prefix__ that consists of digits followed by a double hyphen, as in `01--msg.dcem`, `02--msg.dcem`. Leading zeros are optional; the double hyphen is required to distinguish this convention from names based on UUIDs. When filenames of messages begin with an ordinal prefix, messages MUST be processed by a receiver in the numeric (NOT lexicographic) order implied by the prefixes.

These two ordering strategies are intended to be mutually exclusive and SHOULD NOT be mixed by a given sender within a single folder. However, if a receiver sees a mixture of ordering strategies, the receiver MUST process all messages without an ordinal prefix first, and then process messages with an ordinal prefix, in ordinal order. This allows an endpoint folder to switch from a last modification date strategy to an ordinal prefix strategy in a predictable way.

#### Organizing Folders for Many Messages

Filesystems become unwieldy if the number of files in a given container gets very large. Because of this, the extension defines some nesting behavior that becomes relevant if the endpoint is used to move many DIDComm messages.

The endpoint folder is considered the canonical location for DIDComm message files at that endpoint. However, __per-thread subfolders__ MAY be created beneath this endpoint folder without prior arrangement, by simply naming the per-thread subfolders `<threadid>.thid`. Thus, the valid location of a DCEM message X that is part of DIDComm thread `4edb801f-4735-4305-952e-4486dda87b81` might be either `<endpoint folder>/X.dcem` or `<endpoint folder>/4edb801f-4735-4305-952e-4486dda87b81.thid/X.dcem`, depending on the sender's expectations about file count. Conforming implementations must look for messages in either place.

Senders SHOULD preserve case of message and thread IDs when creating file and folder names that contain these ID values. However, they MUST remember that DIDComm requires message and thread IDs to be compared in case-insensitive fashion.

In cases where the number of threads is truly massive, one other nesting strategy is supported by this extension: either before or instead of grouping messages into *per-thread subfolders*, messages MAY be grouped into a __thread prefix subfolder__ using the first 3 characters of the associated thread ID. Thread prefix subfolders are named according to the pattern `<prefix>.threads`. Thus, all messages for threads with IDs starting with `a73` would be written in a folder named `a73.threads`.  Conforming implementations MUST also process messages organized according to this convention.

These two strategies may be used independently, or combined. Combining them gives the greatest capacity by spreading files among the largest number of subfolders.

strategy | example | appropriate for
--- |---| ---
no subfolders | `/X.dcem` | Up to hundreds of messages.
per-thread subfolders | `/4edb801f-4735-4305-952e-4486dda87b81/X.dcem` | Up to hundreds of messages in up to hundreds of threads.
thread prefix subfolders with messages named by ID | `/4ed.threads/4edb801f-4735-4305-952e-4486dda87b81.dcem` | Up to a handful of messages in each of thousands of threads. (Messages from many threads could be in the same prefix folder, overcrowding it if many threads have more than a handful of messages.)
thread prefix subfolders plus per-thread subfolders | `/4ed.threads/4edb801f-4735-4305-952e-4486dda87b81/X.dcem` | Up to hundreds of messages in hundreds of thousands of threads.

Subfolders that do not conform to either of these nesting conventions MUST be ignored by conforming implementations. This allows agents to organize messages beneath an endpoint folder in arbitrary ways after they have been processed (e.g., to retain a long-term record).

#### Duplex and Fan-Out

As with all of DIDComm, an endpoint is only required to service communication in one direction. However, it is common for a filesystem to be writable by more than one party. In such cases, a single endpoint folder can support duplex communication -- holding both Alice's messages to Bob, and Bob's messages to Alice. As with other duplex-capable transports, this behavior is invited by using the `return-route` header.

Networked filesystems (or promiscuously shared USB drives) can support an audience much larger than a single recipient. This means that an endpoint folder can also support fan-out patterns such as public broadcast or communication with everyone in an enumerated group.

Since each receiver chooses their own service endpoint, no receiver is forced to use endpoints that allow duplex or fan-out. Therefore, support for such endpoints is optional. However, an endpoint's usage pattern MUST be consistent. This means that all parties using the endpoint need to have a shared expectation of its behavior. If a receiver chooses to use a shared endpoint, their implementation MUST support the same features that the other users of the endpoint expect to find at that endpoint. This surprises from inconsistent behavior among the members of a group. 

Both duplex and fan-out patterns imply that some messages in a folder might be directed to someone other than a given reader who finds it. Encryption prevents leakage -- and whether a particular message is intended for a particular reader is detectable from the external envelope. Messages broadcast to an indeterminate audience (e.g., as plaintext or signed but not encrypted) SHOULD be processed by all readers except the sender, unless there is an additional convention that allows narrower scoping. Such conventions are not defined here.

If a filesystem is used by many parties at the same time, concurrency can be an issue. Conformant implementations MUST ensure that messages do not become candidates for processing before they are fully ready to consume. A simple way to do this is to create new messages with a different extension, and then to rename them to the appropriate extension when they are ready to process (e.g., `msg1.dcem.tmp` &rarr; `msg1.dcem`).

Cleanup of an endpoint folder also becomes an issue when multiple parties are consuming and producing messages in the same place. Implementations that conform to this extension and that intend to support either duplex or fan-out behaviors in an endpoint SHOULD remove messages that were uniquely addressed to them, once they have been read. This MAY be done  by deleting them, by moving them to a subfolder, or by changing their extension. Creators of shared endpoints SHOULD stipulate the convention that they expect with respect to this requirement.

Cleanup of files that are multiplex-encrypted (targeting decryption by any of several keys associated with the same DID) SHOULD be cleaned up when the controller of that DID deems the messages to be adequately processed. This MAY be when at least one key holder has processed it, when all key holders have processed it, or anything in between. How this is done is not relevant to interoperability and is thus left unspecified. However, a possible convention is to create a sidecar text file named `<msg filename>-processed.txt` that lists the keys that have processed a message. New keys that process the file append their value as a new line of text in the sidecar until a threshold has been reached, and the key holder that crosses the threshold removes the message and the sidecar file as a unit.

Cleanup of files that have an indeterminate audience (plaintext or signed but not encrypted) is left to the owner of the endpoint folder. It may be performed on a schedule, or deferred indefinitely.

