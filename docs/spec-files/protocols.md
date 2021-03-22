### Protocols

DIDComm serves as a foundational layer for the development of protocols. This spec does not include protocols themselves, but describes the basic requirements and foundational elements.

Each Protocol is uniquely identified by a Protocol Identifier URI, and contains one or more messages identified by a Message Type URI. In addition to serving as a unique identifier, the URIs may be used by a developer to locate documentation.

#### Protocol Identifier URI

A Protocol Identifier URI identifies protocol versions unambiguously.  Additionally, Protocol Identifier URIs may be used by a developer to locate documentation about a protocol. 

The URI must be composed as follows:
```
[doc-uri][delim][protocol-name]/[semver]
```
With ABNF:
```ABNF
protocol-identifier-uri = doc-uri delim protocol-name "/" semver
delim                   = "?" / "/" / "&" / ":" / ";" / "="
```


Its loose matcher regex is:

    (.*?)([a-z0-9._-]+)/(\d[^/]*)/?$


Example Protocol Type URIs:

```
http://example.com/protocols?which=lets_do_lunch/1.0
http://example.com/protocols/lets_do_lunch/1.0
https://github.com/hyperledger/aries-toolbox/tree/master/docs/admin-invitations/0.1
```

The goals of this URI are, in descending priority:

* Code can use the URI to route messages to protocol
  handlers using [semver rules](semver.md).

* The definition of a protocol should be tied to the URI such
  that it is semantically stable. This means that once version 1.0
  of a protocol is defined, its definition [should not change in
  ways that would break implementations](semver.md).

* Developers can discover information about novel protocols, using
  the URI to browse or search the web.

The `doc-uri` portion is any URI that exposes documentation about
protocols. A developer should be able to browse to that URI and use human intelligence
to look up the named and versioned protocol.


#### Message Type URI

A __Message Type URI__ identifies message types unambiguously.
Standardizing its format is important because it is parsed by agents that
will map messages to handlers--basically, code will look at this string and
say, "Do I have something that can handle this message type inside protocol
*X* version *Y*?" When that analysis happens, it must do more than compare
the string for exact equality; it may need to check for semver compatibility,
and it has to compare the protocol name and message type name ignoring case
and punctuation.

The URI MUST be composed as follows:


```
[protocol-identifier-uri] / [message-type-name]
```
With ABNF:
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
A match will have captures groups of (1) = `doc-uri`, (2) = `protocol-name`,
(3) = `protocol-version`, and (4) = `message-type-name`.

The goals of this URI are, in descending priority:

* Use of the `protocol-identifier-uri` portion as described above.
* Optionally and preferably, the full URI may produce a page of documentation about the specific message type, with no human mediation involved.

Example Message Type URIs:

```
http://example.com/protocols?which=lets_do_lunch/1.0/proposal
http://example.com/protocols/lets_do_lunch/1.0/proposal
did:example:1234567890;spec/trust_ping/1.0/ping
https://github.com/hyperledger/aries-toolbox/tree/master/docs/admin-invitations/0.1/create-invitation
```