### Out Of Band Messages

#### URL & QR Codes

When passing a DIDComm message between two parties, it is often useful to present a message in the form of a URL or encoded into the form of a QR code for scanning with a smartphone or other camera. The format for a QR code is simply the encoded URL form of a message.

#### Privacy Considerations

Any information passed via a URL or QR code is unencrypted, and may be observed by another party. This lack of privacy must be minded in two different ways.

First, no private information may be passed in the message. Private information should be passed between parties in encrypted messages only. Any protocol message that contains private information should not be passed via URL or QR code.

Second, any identifiers passed in a message sent via URL or QR code must no longer be considered private. Any DID used or other identifier no longer considered private MUST be rotated over a secure connection if privacy is required.

#### Message Correlation

The `id` of the message passed in a URL or a QR code is used as the `pthid` on a response sent by the recipient of this message. The response recipient can use the `pthid` to correlate it with the original message.

#### Invitation

Each message passed this way must be contained within an `out-of-band` message, as described below.

The out-of-band protocol consists in a single message that is sent by the *sender*.

```jsonc
{
  "type": "https://didcomm.org/out-of-band/2.0/invitation",
  "id": "<id used for context as pthid>",
  "from":"<sender's did>",
  "body": {
    "goal_code": "issue-vc",
    "goal": "To issue a Faber College Graduate credential",
    "accept": [
      "didcomm/v2",
      "didcomm/aip2;env=rfc587"
    ],
  },
  "attachments": [
    {
        "id": "request-0",
        "mime_type": "application/json",
        "data": {
            "json": "<json of protocol message>"
        }
    }
  ]
}
```

The items in the message are:

- `type` - REQUIRED. The header conveying the DIDComm [MTURI](#message-type-uri).
- `id` - REQUIRED. This value MUST be used as the **parent** thread ID (`pthid`) for the response message that follows. This may feel counter-intuitive &mdash; why not it in the `thid` of the response instead? The answer is that putting it in `pthid` enables multiple, independent interactions (threads) to be triggered from a single out-of-band invitation.
- `from` - REQUIRED for OOB usage. The DID representing the sender to be used by recipients for future interactions.
- `goal_code` - OPTIONAL. A self-attested code the receiver may want to display to the user or use in automatically deciding what to do with the out-of-band message.
- `goal` - OPTIONAL. A self-attested string that the receiver may want to display to the user about the context-specific goal of the out-of-band message.
- `accept` - OPTIONAL. An array of media types in the order of preference for sending a message to the endpoint.
  These identify a *profile* of DIDComm Messaging that the endpoint supports.
  If `accept` is not specified, the sender uses its preferred choice for sending a message to the endpoint.
  Please see [Negotiating Compatibility](#negotiating-compatibility) for details.
- `attachments` - OPTIONAL. An array of attachments that will contain the invitation messages in order of preference that the receiver can use in responding to the message. Each message in the array is a rough equivalent of the others, and all are in pursuit of the stated `goal` and `goal_code`. Only one of the messages should be chosen and acted upon. (While the JSON form of the attachment is used in the example above, the sender could choose to use the base64 form.)

When encoding a message in a URL or QR code, the _sender_ does not know which protocols are supported by the _recipient_ of the message. Encoding multiple alternative messages is a form of optimistic protocol negotiation that allows multiple supported protocols without coordination

#### Standard Message Encoding

Using a standard message encoding allows for easier interoperability between multiple projects and software platforms. Using a URL for that standard encoding provides a built in fallback flow for users who are unable to automatically process the message. Those new users will load the URL in a browser as a default behavior, and may be presented with instructions on how to install software capable of processing the message. Already onboarded users will be able to process the message without loading in a browser via mobile app URL capture, or via capability detection after being loaded in a browser.

The standard message format is a URL with a Base64URLEncoded plaintext JWM json object as a query parameter.

The URL format is as follows, with some elements described below:

```text
https://<domain>/<path>?_oob=<encodedplaintextjwm>
```

`<domain>` and `<path>` should be kept as short as possible, and the full URL should return human readable instructions when loaded in a browser. This is intended to aid new users. The `_oob` query parameter is required and is reserved to contain the DIDComm message string. Additional path elements or query parameters are allowed, and can be leveraged to provide coupons or other promise of payment for new users.

> `_oob` is a shortened form of Out of Band, and was chosen to not conflict with query parameter names in use at a particular domain. When the query parameter is detected, it may be assumed to be an Out Of Band message with a reasonably high confidence.

> When this spec was written, the `didcomm://` URL scheme was in active use for deep linking in mobile apps, and had features that intersect with the OOB protocol described here. That scheme is defined elsewhere; we only note it here to advise against its overloading for other purposes.

The `<encodedplaintextjwm>` is a JWM plaintext message that has been base64-url encoded.

```javascript
encodedplaintextjwm = b64urlencode(<plaintextjwm>)
```

During encoding, whitespace from the json string should be eliminated to keep the resulting out-of-band message string as short as possible.

##### Example Out-of-Band Message Encoding

Invitation:

```json
{
  "type": "https://didcomm.org/out-of-band/2.0/invitation",
  "id": "69212a3a-d068-4f9d-a2dd-4741bca89af3",
  "from": "did:example:alice",
  "body": {
      "goal_code": "",
      "goal": ""
  },
  "attachments": [
      {
          "id": "request-0",
          "media_type": "application/json",
          "data": {
              "json": "<json of protocol message>"
          }
      }
  ]
}
```

Whitespace removed:

```json
{"type":"https://didcomm.org/out-of-band/2.0/invitation","id":"69212a3a-d068-4f9d-a2dd-4741bca89af3","from":"did:example:alice","body":{"goal_code":"","goal":""},"attachments":[{"id":"request-0","media_type":"application/json","data":{"json":"<json of protocol message>"}}]}
```

Base 64 URL Encoded:

```text
eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9vdXQtb2YtYmFuZC8yLjAvaW52aXRhdGlvbiIsImlkIjoiNjkyMTJhM2EtZDA2OC00ZjlkLWEyZGQtNDc0MWJjYTg5YWYzIiwiZnJvbSI6ImRpZDpleGFtcGxlOmFsaWNlIiwiYm9keSI6eyJnb2FsX2NvZGUiOiIiLCJnb2FsIjoiIn0sImF0dGFjaG1lbnRzIjpbeyJpZCI6InJlcXVlc3QtMCIsIm1lZGlhX3R5cGUiOiJhcHBsaWNhdGlvbi9qc29uIiwiZGF0YSI6eyJqc29uIjoiPGpzb24gb2YgcHJvdG9jb2wgbWVzc2FnZT4ifX1dfQ
```

Example URL:

```text
https://example.com/path?_oob=eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9vdXQtb2YtYmFuZC8yLjAvaW52aXRhdGlvbiIsImlkIjoiNjkyMTJhM2EtZDA2OC00ZjlkLWEyZGQtNDc0MWJjYTg5YWYzIiwiZnJvbSI6ImRpZDpleGFtcGxlOmFsaWNlIiwiYm9keSI6eyJnb2FsX2NvZGUiOiIiLCJnb2FsIjoiIn0sImF0dGFjaG1lbnRzIjpbeyJpZCI6InJlcXVlc3QtMCIsIm1lZGlhX3R5cGUiOiJhcHBsaWNhdGlvbi9qc29uIiwiZGF0YSI6eyJqc29uIjoiPGpzb24gb2YgcHJvdG9jb2wgbWVzc2FnZT4ifX1dfQ
```

DIDComm message URLs can be transferred via any method that can send text, including an email, SMS, posting on a website, or QR Code.

Example Email Message:

```email
To: alice@example.com
From: studentrecords@example.com
Subject: Your request to connect and receive your graduate verifiable credential

Dear Alice,

To receive your Faber College graduation certificate, click here to [connect](https://example.com/path?_oob=eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9vdXQtb2YtYmFuZC8yLjAvaW52aXRhdGlvbiIsImlkIjoiNjkyMTJhM2EtZDA2OC00ZjlkLWEyZGQtNDc0MWJjYTg5YWYzIiwiZnJvbSI6ImRpZDpleGFtcGxlOmFsaWNlIiwiYm9keSI6eyJnb2FsX2NvZGUiOiIiLCJnb2FsIjoiIn0sImF0dGFjaG1lbnRzIjpbeyJpZCI6InJlcXVlc3QtMCIsIm1lZGlhX3R5cGUiOiJhcHBsaWNhdGlvbi9qc29uIiwiZGF0YSI6eyJqc29uIjoiPGpzb24gb2YgcHJvdG9jb2wgbWVzc2FnZT4ifX1dfQ with us, or paste the following into your browser:

https://example.com/path?_oob=eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9vdXQtb2YtYmFuZC8yLjAvaW52aXRhdGlvbiIsImlkIjoiNjkyMTJhM2EtZDA2OC00ZjlkLWEyZGQtNDc0MWJjYTg5YWYzIiwiZnJvbSI6ImRpZDpleGFtcGxlOmFsaWNlIiwiYm9keSI6eyJnb2FsX2NvZGUiOiIiLCJnb2FsIjoiIn0sImF0dGFjaG1lbnRzIjpbeyJpZCI6InJlcXVlc3QtMCIsIm1lZGlhX3R5cGUiOiJhcHBsaWNhdGlvbi9qc29uIiwiZGF0YSI6eyJqc29uIjoiPGpzb24gb2YgcHJvdG9jb2wgbWVzc2FnZT4ifX1dfQ

If you don't have an identity agent for holding credentials, you will be given instructions on how you can get one.

Thanks,

Faber College
Knowledge is Good
```

Example URL encoded as a QR Code:

![Example QR Code](./collateral/out_of_band_exampleqr.png)

#### Short URL Message Retrieval

It seems inevitable that the length of some DIDComm messages will be too long to produce a useable QR code. Techniques to avoid unusable QR codes have been presented above, including using attachment links for requests, minimizing the routing of the response and eliminating unnecessary whitespace in the JSON. However, at some point a _sender_ may need generate a very long URL. In that case, a short URL message retrieval redirection should be implemented by the sender as follows:

- The sender should generate and track a GUID for the out-of-band message URL.
- The shortened version should be: `https://example.com/path?_oobid=5f0e3ffb-3f92-4648-9868-0d6f8889e6f3`. Note the replacement of the query parameter `_oob` with `_oobid` when using shortened URL.
- On receipt of this form of message, the agent must do an HTTP GET to retrieve the associated encoded message. A sender may want to wait to generate the full invitation until the redirection event of the shortened URL to the full length form dynamic, so a single QR code can be used for distinct messages.

A usable QR code will always be able to be generated from the shortened form of the URL.

Note: Due to the privacy implications, a standard URL shortening service SHOULD NOT be used.

#### Redirecting Back to Sender

In some cases, interaction between sender and receiver of out-of-band invitation would require receiver application to redirect back to sender.

For example,
* A web based verifier sends out-of-band invitation to a holder application and requests redirect back once present proof protocol execution is over, so that it can show credential verification results and guide the user with next steps.
* A verifier mobile application sending deep link of its mobile application to an agent based mobile wallet application requesting redirect to verifier mobile application.

These redirects may not be required in many cases, for example,
* A mobile application scanning QR code from sender and performing protocol execution. In this case the mobile application may choose to handle successful protocol execution in its own way and close the application.


##### Reference
During the protocol execution sender can securely send [`web_redirect`](https://github.com/hyperledger/aries-rfcs/tree/main/concepts/0700-oob-through-redirect#web-redirect-decorator) information as part of messages concluding protocol executions, like [a formal acknowledgement message](#acks) or a [problem report](#problem-reports).
Once protocol is ended then receiver can optionally choose to redirect by extracting the redirect information from the message.

Example acknowledgement message from verifier to prover containing web redirect information:

```json
{
  "type":"https://didcomm.org/present-proof/3.0/ack",
  "id":"e2f3747b-41e8-4e46-abab-ba51472ab1c3",
  "pthid":"95e63a5f-73e1-46ac-b269-48bb22591bfa",
  "from":"did:example:verifier",
  "to":["did:example:prover"],
  "web_redirect":{
    "status":"OK",
    "redirectUrl":"https://example.com/handle-success/51e63a5f-93e1-46ac-b269-66bb22591bfa"
  }
}
```

A problem report with a web redirect header from the [problem report example](#problem-reports) will look like:
```json
{
  "type": "https://didcomm.org/report-problem/2.0/problem-report",
  "id": "7c9de639-c51c-4d60-ab95-103fa613c805",
  "pthid": "1e513ad4-48c9-444e-9e7e-5b8b45c5e325",
  "web_redirect":{
      "status":"FAIL",
      "redirectUrl":"https://example.com/handle-error/99e80a9f-34e1-41ac-b277-91bb64481bxb"
   },
  "body": {
    "code": "e.p.xfer.cant-use-endpoint",
    "comment": "Unable to use the {1} endpoint for {2}.",
    "args": [
      "https://agents.r.us/inbox",
      "did:sov:C805sNYhMrjHiqZDTUASHg"
    ]
  }
}
```

A sender MUST use ``web_redirect`` headers to request redirect from receiver. A ``web_redirect`` header MUST contain ``status`` and ``redirectUrl`` properties. 
The value of ``status`` property MUST be one of the Acknowledgement statuses defined [here](https://github.com/hyperledger/aries-rfcs/blob/main/features/0015-acks/README.md#ack-status) which indicates protocol execution outcome.
