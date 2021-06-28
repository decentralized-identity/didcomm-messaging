[![DIDComm logo](didcomm-logo.png)](didcomm-logo.svg)
# DIDComm Messaging

DIDComm Messaging is a powerful way for people, institutions, and IoT things to interact via machine-readable messages, using features of [decentralized identifiers](https://www.w3.org/TR/did-core/) (DIDs) as the basis of security and privacy. It works over any transport: HTTP, BlueTooth, SMTP, raw sockets, and sneakernet, for example.

This repo is where we develops specs and reference code to explain DIDComm Messaging. Some of the work incubated here is likely to be standardized at IETF or in other places.

### Implementations

Here are links to some implementations of the DIDComm v2 spec that you may find useful. This WG is not endorsing these implementations in any special way -- simply listing ones we know about. They might be at different levels of maturity/conformance. If you want to add something to this list, please raise a PR against the repo to let us know.

* JavaScript: https://github.com/uport-project/veramo
* Go: https://github.com/hyperledger/aries-framework-go/tree/main/pkg/didcomm/packer
* Rust: https://github.com/decentralized-identity/didcomm-rs
* WACI/PEx JavaScript: https://github.com/aviarytech/wacinsteins-monster/pull/3

### Artifacts

Browse the latest rendered draft of the spec [here](https://identity.foundation/didcomm-messaging/spec/) and its underlying markdown files [here](docs/spec-files/).

View the rendered draft of the Implementer's Guide [here](https://identity.foundation/didcomm-messaging/guide/) and its underlying markdown files [here](docs/guide-files/).

When editing locally, run `npm run spec` from the the root directory to continuously render the HTML versions at `/docs/spec/index.html` and `/docs/guide/index.html`, which can be opened in a browser and "refreshed" after each save of the underlying .md files.  For more detailed instructions, see the [specup repo](https://github.com/decentralized-identity/spec-up)

### Process

The specs we're working on are broken into sections. Each section is a separate markdown document. Sections evolve independently through this status sequence:

    PROPOSED → REFINING → STABLE

Adding new content with the PROPOSED status is very easy and fast: just submit a PR that passes a smell test of reasonableness for one or more maintainers.

The REFINING status is applied after WG discussion, when there is rough consensus on the amount and type of content in a section. Github issues are used for discussion.

The WG moves sections to STABLE status once they have code/tests, implementations, quiet trends in github issues, and other indicators that they are polished and unlikely to change much. See [here](https://docs.google.com/document/d/1TS4XXCtlNL9YwW-Op9alevOmhgY2RP6lFfQ3AtB6Sq8/edit) for more details.

### People
Contributors to the repo come from [DIF's DIDComm Working Group](https://medium.com/decentralized-identity/dif-starts-didcomm-working-group-9c114d9308dc). [Here](https://drive.google.com/file/d/1bZBkVrC8Fh5N16oBi2zAoqPxCTghUhpB/view) is our charter, and [here](https://docs.google.com/document/d/1a-KpG734mq-xizcNE0JAu5_1_EslXL07QGr2HYLEZFE/edit) are some more details about how we work.

### WG information

More information about the WG on the WG github page [here](https://github.com/decentralized-identity/didcomm/)

Our working group meets each Monday at 12 pm PST / 9 pm CET at https://us02web.zoom.us/j/81621403519?pwd=TXJqMWcvYjlQcjhJVzJ0b2FpSGU2UT09. A rolling agenda is [here](https://github.com/decentralized-identity/identifiers-discovery/blob/main/agenda.md). You can also find us at https://difdn.slack.com and on our mailing list at [didcomm-wg@lists.identity.foundation](mailto:didcomm-wg@lists.identity.foundation). Anybody is welcome to listen in; however, we need IPR protections around what we build, to keep it free from patent encumbrances -- so if you'd like to contribute more formally, please email [membership@identity.foundation](mailto:membership@identity.foundation).

### Relationship to generic DIDComm

DIDComm Messaging is the first in a potential family of related specs; others could include DIDComm Streaming, DIDComm Multicast, and so forth. **DIDComm** is the common adjective for all of them, meaning that all will share DID mechanisms as the basis of security.




