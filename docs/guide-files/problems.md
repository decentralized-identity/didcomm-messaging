## Timeouts

It is a best practice to ponder appropriate timeout settings when designing application-level protocols atop DIDComm. A protocol for conducting live music over the internet should probably time out its messages to cue musicians within milliseconds, whereas a protocol to apply for college may need timeouts that are days or weeks long. A protocol definition should communicate timeout assumptions like these.

Individual implementers of a protocol should also ponder whether they need timeouts more aggressive than those of the general community. Perhaps a college application protocol allows the process to unfold over weeks -- but an app that promises it can help someone apply to college in 5 minutes shouldn't use default timeouts in the messages it sends.

## Cybersecurity considerations for problem reports

Ethical and unethical hackers deliberately trigger errors on systems to understand what exploits are possible. We expect this to happen with DIDComm. Therefore, the troubleshooting and transparency that comes from problem reports needs to be weighed against the risk of disclosing too much information. The following considerations are recommended.

1. Problem reports do not have to be sent (only) to the party who triggers a problem. Sometimes, a different (or additional) audience may be appropriate.
1. The `problem-report` message type is deliberately decoupled from the versioning and release status of other protocols, so it cannot be used for feature sniffing.
1. Fields that encourage careless, recursive information dumping (e.g., Java's `Throwable.cause`) do not appear in `problem-report`.
1. The `comment` and `args` properties of a `problem-report` are separated, with `comment` mapping consistently to a `code`. This means that the risk of disclosing too much information is concentrated in the value of `args`, not `comment`. Values placed in `args` should be scrubbed of anything sensitive.
1. Sending problem reports to an unknown party is more risky than sending them to someone with known characteristics. (Because DIDComm's normal mode is mutual authentication via DIDs, and because DIDComm connections may accumulate credential-based context, this is a manageable risk.)
1. Sending problem reports immediately may be more risky than sending them with a modest, random delay. This makes denial-of-service attacks and temporal correlation harder, and is the same principle that motivates login dialogs to pause before reporting an incorrect password. 
