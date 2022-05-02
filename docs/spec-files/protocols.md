## Protocols

The primitives described earlier in this spec standardize basic behaviors in peer-to-peer secure communication: signing, encryption, plaintext structure, passing metadata in headers, reporting problems, attaching content, etc. Developers can use these primitives to design any number of high-trust, application-level protocols for dedicated purposes, and then compose them into ever broader workflows in arbitrary, powerful ways. Community efforts to design and share protocols can happen anywhere; one locus of that work is [didcomm.org](https://didcomm.org).

A few higher-level protocols are especially fundamental, in that they bootstrap communication and discovery. Those protocols and their underlying principles are described below.

### Protocol Identifier URI

Each protocol constructed atop DIDComm Messaging is uniquely identified and versioned by a __Protocol Identifier URI__ (__PIURI__).

The PIURI MUST be composed of a sequence of tokens as follows:
```
doc-uri delim protocol-name/semver
```
As ABNF:
```ABNF
protocol-identifier-uri = doc-uri delim protocol-name "/" semver
delim                   = "?" / "/" / "&" / ":" / ";" / "="
```

It can be loosely matched and parsed with the following regex:

    (.*?)([a-z0-9._-]+)/(\d[^/]*)/?$

The PIURI for an imaginary protocol to schedule lunch appointments might resemble one of the following:

```
https://didcomm.org/lets_do_lunch/1.0
https://example.com/protocols?which=lets_do_lunch/1.0
did:example:1234567890;spec/lets_do_lunch/1.0/ping
https://github.com/myorg/myproject/tree/master/docs/lets_do_lunch/1.0
```

The PIURI for a given protocol SHOULD resolve to human-friendly documentation about the protocol.

### Message Type URI

A __Message Type URI__ (MTURI) identifies plaintext message types unambiguously. Since the names of message types are only unique within the context of the protocol they embody, an MTURI begins with a prefix that is a PIURI, and then adds a message name token as a suffix.

Standardizing MTURI format is important because MTURIs are parsed by agents and used to map messages to handlers. Code will look at this string and say, "Do I have something that can handle this message type inside protocol *X* version *Y*?" When that analysis happens, it must do more than compare the string for exact equality. It may need to check for semver compatibility, and it has to compare the protocol name and message type name ignoring case and punctuation.

The MTURI MUST be composed of a sequence of tokens as follows:

```
protocol-identifier-uri/message-type-name
```

As ABNF:

```ABNF
message-type-uri  = protocol-identifier-uri "/" message-type-name
protocol-identifier-uri = doc-uri delim protocol-name "/" semver
delim                   = "?" / "/" / "&" / ":" / ";" / "="
protocol-name     = identifier
protocol-version  = semver
message-type-name = identifier
identifier        = alpha *(*(alphanum / "_" / "-" / ".") alphanum)
```

It can be loosely matched and parsed with the following regex:

```
    (.*?)([a-z0-9._-]+)/(\d[^/]*)/([a-z0-9._-]+)$
```

A match will have capturing groups of (1) = `doc-uri`, (2) = `protocol-name`,
(3) = `protocol-version`, and (4) = `message-type-name`.

Building on our previous examples of `lets_do_lunch` PIURIs, the MTURI of a `proposal` message in that protocol might be something like:

```
https://didcomm.org/lets_do_lunch/1.0/proposal
https://example.com/protocols?which=lets_do_lunch/1.0/proposal
did:example:1234567890;spec/lets_do_lunch/1.0/proposal
https://github.com/myorg/myproject/tree/master/docs/lets_do_lunch/1.0/proposal
```

### Semver Rules

The version numbers embedded in PIURIs and MTURIs MUST follow familiar [semver](https://semver.org/) rules, such that two parties that support the same protocol at the same major version but different minor versions could theoretically interoperate with a feature profile that matches the older of their two versions. (Of course, this does not guarantee interoperability; the party supporting a newer version still chooses whether they want to support the older version or not. Semver rules simply define how a version mismatch must be interpreted.)

The major component of a protocol's semver value MUST be updated under either of the following conditions:

* A change breaks important assumptions about the intent, preconditions, postconditions, or state machine of a protocol.
* A change adds or removes required fields or required messages.

The minor component of a protocol's semver value MUST be updated when a change does not justify a major number update, but it is more than a trivial update to documentation. Examples of minor version changes include adding new, optional fields or deprecating existing fields.

The patch component of a protocol's semver value is not used in MTURIs and PIURIs.
