# DIDComm Email Transport Extension

### Summary 

Specifies how to use email &mdash; specifically [SMTP / RFC 5321](https://www.rfc-editor.org/rfc/rfc5321.html) and [MIME / RFC 2045+](https://datatracker.ietf.org/doc/html/rfc2045) [<a id="ref1" href="#note1">1</a>] &mdash; as a [DIDComm transport](https://identity.foundation/didcomm-messaging/spec/#transport-requirements).

### Overview

Email was the original killer application for the Internet. It is supported by ubiquitous infrastructure, plus mature libraries and applications on virtually every platform and programming language. It is simple. And unlike its younger and more glamorous cousin, HTTP, its connectivity model maps cleanly onto the assumptions that underpin DIDComm: it is asynchronous, message-based, peer-to-peer, and friendly to parties that are inconsistently connected. It is a natural candidate for SSI-oriented communication.[<a id="ref2" href="#note2">2</a>]

With no planning, no special configuration or coding, and no changes to mail transfer agents or MX records or email headers or libraries or clients, it's already possible to move a DIDComm message over email. Just attach the DIDComm message and click *Send*. However, some conventions can help the recipient of such a message to handle such an attachment in a predictable way. That's the purpose of this extension.

### Conventions

#### Endpoints

Support for this extension is signaled by including, in a DID doc, a DIDComm `serviceEndpoint` with a `uri` field that conforms to the `mailto:` URI scheme defined in [RFC 6068](https://datatracker.ietf.org/doc/html/rfc6068). All other properties of DIDComm-style `serviceEndpoint` objects are [standard](https://identity.foundation/didcomm-messaging/spec/#service-endpoint) with this extension.

The email address that appears in this URI could be the direct email address of an agent, or it could be the address of a mediator, to provide herd privacy (e.g., `mailto:herd@agents-r-us.com`).

#### Managing the audience

Email is not a 1-to-1 medium oriented toward request-response; it facilitates multiparty conversations that are forwarded and replied to in unpredictable ways. It's common for parties to use different clients and to spend little energy in prior coordination.

This has implications for DIDComm over email. We cannot predict whether the sender or recipients of a given message will be agents compliant with this extension, or humans manually handling attachments with a traditional email client. Therefore, this extension constrains the behavior of compliant senders, but it requires that compliant recipients to be very tolerant of variety.

We follow a pattern that's already well established with email: the body of a message[<a id="ref3" href="#note3">3</a>] is oriented toward human readers, and the attachments are handled by applications. This is what we already do with attached photos, documents, and data; DIDComm is no different.

#### Reading

Agents that implement this extension MUST process any message attachments having a declared `Content-Type` that is one of the [DIDComm IANA media types](https://identity.foundation/didcomm-messaging/spec/#iana-media-types). In addition, agents SHOULD look for attachments that appear to be *.dcem, *.dcsm, or *.dcpm files (e.g., based on content sniffing and/or header analysis), and process those as well. The latter behavior is recommended because it facilitates casual human attachment from clients that have no DIDComm knowledge at all.

When reading a particular email to find DIDComm content, compliant agents MUST treat any parts of a multipart message that do not meet either of these criteria as out of scope. If they do not ignore the content, they must process it without relying on this extension. 

Agents MAY inspect email headers for useful metadata (see [below](#email-headers)), but MUST NOT rely upon the existence or accuracy of this metadata; content inside DIDComm attachments MUST be considered definitive if there is a conflict.

#### Writing

When compliant agents prepare email messages for sending, they SHOULD add a message body that provides carefully chosen context and advice for a human. For example:

>This email has attachments that allow secure, private messaging based on self-sovereign identity. To learn more about why and how to use them, see https://didcomm.org/book/v2/attachment-help.
 
This body text MUST NOT encourage a double-click on the attachments (which would be a serious security antipattern); however, it MAY recommend opening attachments in a properly installed application. It MAY contain a human-friendly description of the meaning embodied in the associated attachments. It SHOULD be brief. It SHOULD NOT overload users with acronyms and technical details. It MAY recommend that users install a particular agent. It MAY contain text in multiple human languages. It MAY be repeated as separate parts of the overall MIME structure, in different formats (e.g., both as plain text and as HTML).

See also the section about [problem reports](#problem-reports).

#### Multiple DIDComm messages

A single email may contain many attachments. In any given email, more than one of these attachments could carry DIDComm content. Processing multiple attachments therefore raises some ordering questions.

When a compliant implementation adds multiple DIDComm attachments, the attachments MUST be written to the MIME content stream in the same order that they are intended to be processed. However, since DIDComm attachments might be added in arbitrary order by humans using traditional email clients, compliant implementations that read messages SHOULD also examine timing and sequencing metadata in the plaintext DIDComm headers and attempt to process attachments in logical send order. When such processing is impractical or the metadata does not adequately clarify, compliant implementations MUST fall back to processing the attachments using their order in the MIME content stream. 

#### Email headers

The email ecosystem uses a [rich collection of headers](https://www.rfc-editor.org/rfc/rfc4021.html) to make processing easier. Many of these are irrelevant to this extension. However, a few may be populated by compliant implementations to make the binding between email and DIDComm smoother.

Email header | Use with DIDComm
--- | ---
`From`, `Sender`, `Reply-To` | If the sender DID is intended to be known, and if its DID doc has a DIDComm `serviceEndpoint` where the `uri` field contains a `mailto:` URI (see [above](#endpoints)), then the email address SHOULD appear in one or more of these fields as [described in RFC 2822](https://www.rfc-editor.org/rfc/rfc2822#section-3.6.2).
`To`, `CC`, `BCC` | If the email is being sent to multiple recipients that support this extension, then the recipient email addresses (from the appropriate `serviceEndpoint` &gt; `uri` &gt; `mailto:` value in their DID docs) SHOULD appear in one of these fields, with `To` being the default location. The semantic differences between `To`, `CC`, and `BCC` have no particular significance to this extension.
`Subject`| Each time that compliant agents begin a new DIDComm thread, they SHOULD use the name of the DIDComm application protocol to set this header; subsequent messages should begin with "Re: " and the original subject name. For example, if an email carries the first message in a DIDComm protocol named `issue-credential`, then the email's `Subject` line might be: "issue-credential ABC" (where ABC is some subset of the DIDComm `thid` value, to keep email threads separate), and subsequent messages in the same DIDComm thread might be "Re: issue-credential ABC".
[`Message-ID`](https://www.rfc-editor.org/rfc/rfc2822#section-3.6.2) | If practical, a compliant implementation SHOULD set this value using the same value that is used in the `id` header of the plaintext of the first attached DIDComm message. Since the email header requires a two-part identifier separated by `@`, the convention is for the first part to come from DIDComm's `id`, and the second part to come from DIDComm's `thid` header.
[`In-Reply-To`](https://www.rfc-editor.org/rfc/rfc2822#section-3.6.2) | If practical and applicable, SHOULD follow the same conventions as `Message-ID` -- but reference the preceding message in the DIDComm thread.

#### Problem Reports

When compliant agents prepare an email message to a DIDComm message that's a [problem report](https://identity.foundation/didcomm-messaging/spec/#problem-reports), compliant agents SHOULD observe the following conventions:

1. The body of the message -- the part that would be displayed by a traditional email client and read by a human -- contains a brief statement that a problem has occurred, provides the associated [problem code](https://identity.foundation/didcomm-messaging/spec/#problem-codes), echoes the associated `comment` and `args` field (preferably interpolated), offers the link in the `escalate_to` field (if any), and possibly links to more information. It may also contain the standard text that provides all compliant writers place in the body. 
2. Since the problem report begins a new DIDComm thread of which the previous DIDComm thread is a parent, the value of the `Subject:` header for the email SHOULD be transformed to indicate the error and its relationship to another thread, as follows. If the previous message in the thread had a `Subject` header of "Re: issue-credential ABC", then the `Subject` for the problem report should be: "Problem e.p.xfer.cant-use-endpoint -- Re: issue-credential ABC" (where `e.p.xfer.cant-use-endpoint` is the relevant problem code.) 

<hr>

#### Notes

[<a id="note1">1</a>] The email ecosystem involves some other protocols as well -- notably, POP, IMAP, and S/MIME. We ignore these. Whether emails that carry DIDComm messages are eventually retrieved by POP or IMAP is irrelevant, as this choice is visible only to the recipient. S/MIME could be used to move DIDcomm messages, but its security benefits are irrelevant to DIDComm, and it is not widely used anyway.  [<a href="#ref1">&uarr;</a>]

[<a id="note2">2</a>] This is not to say that email is perfect. It typically has a latency that's measured in seconds, not milliseconds. It's not good at moving bulk data. It has issues with privacy, security, and spam... However, many of the challenges with email can be fixed by DIDComm, as described in this extension.  [<a href="#ref2">&uarr;</a>]

[<a id="note3">3</a>] It turns out that deciding what parts of a multipart MIME message are going to be called "the body" of an email message is [not as easy as it sounds](https://javaee.github.io/javamail/FAQ#mainbody). However, we can mostly ignore this complexity, because we treat everything as "body" unless it is a very specific type of attachment. [<a href="#ref3">&uarr;</a>]