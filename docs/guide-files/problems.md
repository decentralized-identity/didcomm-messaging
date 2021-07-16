## Timeouts

It is a best practice to ponder appropriate timeout settings when designing application-level protocols atop DIDComm. A protocol for conducting live music over the internet should probably time out its messages to cue musicians within milliseconds, whereas a protocol to apply for college may need timeouts that are days or weeks long. A protocol definition should communicate timeout assumptions like these.

Individual implementers of a protocol should also ponder whether they need timeouts more aggressive than those of the general community. Perhaps a college application protocol allows the process to unfold over weeks -- but an app that promises it can help someone apply to college in 5 minutes shouldn't use default timeouts in the messages it sends.
