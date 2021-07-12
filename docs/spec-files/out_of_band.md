## Out Of Band Messages

#### URL & QR Codes

When passing a DIDComm Message between two parties, it is often useful to present a message in the form of a URL or encoded into the form of a QR code for scanning with a smartphone or other camera. The format for a QR code is simply the encoded URL form of a message.

##### Privacy Considerations

Any information passed via a URL or QR code is unencrypted, and may be observed by another party. This lack of privacy must be minded in two different ways.

First, no private information may be passed in the message. Private information should be passed between parties in encrypted messages only. Any protocol message that contains private information should not be passed via URL or QR code.

Second, any identifiers passed in a message sent via URL or QR code must no longer be considered private. Any DID used or other identifier no longer considered private MUST be rotated over a secure connection if privacy is required.

##### Message Correlation

The `id` of the message passed in a URL or a QR code is used to as the `thread_id` on a response sent by the recipient of this message. The response recipient can use the `thread_id` to correlate it with the original message.

##### Messages

Each message passed this way must be contained within an `out-of-band` message, as described below.

The out-of-band protocol a single message that is sent by the *sender*.

#### Invitation: `https://didcomm.org/out-of-band/%VER/invitation`

```jsonc
{
  "typ": "application/didcomm-plain+json",
  "type": "https://didcomm.org/out-of-band/%VER/invitation",
  "id": "<id used for context as pthid>",
  "goal_code": "issue-vc",
  "goal": "To issue a Faber College Graduate credential",
  "accept": [
    "didcomm/v2",
    "didcomm/aip2;env=rfc587"
  ],
  "attachments": [
    {
        "@id": "request-0",
        "mime-type": "application/json",
        "data": {
            "json": "<json of protocol message>"
        }
    }
  ]
}
```

The items in the message are:

- `type` - the DIDComm message type
- `id` - the unique ID of the message. The ID should be used as the **parent** thread ID (`pthid`) for the response message, rather than the more common thread ID (`thid`) of the response message. This enables multiple uses of a single out-of-band message.
- `goal_code` - [optional] a self-attested code the receiver may want to display to the user or use in automatically deciding what to do with the out-of-band message.
- `goal` - [optional] a self-attested string that the receiver may want to display to the user about the context-specific goal of the out-of-band message.
- `accept` - [optional] an array of media (aka mime) types in the order of preference of the sender that the receiver can use in responding to the message.
 If `accept` is not specified, the receiver uses its preferred choice to respond to the message.
 Please see [Message Types](#message-types) for details about media types.
- `attachments` - an array of attachments that will contain the invitation messages in order of preference that the receiver can using in responding to the message. Each message in the array is a rough equivalent of the others, an all are in pursuit of the stated `goal` and `goal_code`. Only one of the messages should be chosen and acted upon.
  - While the JSON form of the attachment is used in the example above, the sender could choose to use the base64 form.

When encoding a message in a URL or QR code, the _sender_ does not know which protocols are supported by the _recipient_ of the message. Encoding multiple alternative messages is a form of optimistic protocol negotiation that allows multiple supported protocols without coordination

##### Standard Message Encoding

Using a standard message encoding allows for easier interoperability between multiple projects and software platforms. Using a URL for that standard encoding provides a built in fallback flow for users who are unable to automatically process the message. Those new users will load the URL in a browser as a default behavior, and may be presented with instructions on how to install software capable of processing the message. Already onboarded users will be able to process the message without loading in a browser via mobile app URL capture, or via capability detection after being loaded in a browser.

The standard message format is a URL with a Base64URLEncoded plaintext JWM json object as a query parameter.

The URL format is as follows, with some elements described below:

```text
https://<domain>/<path>?_oob=<encodedplaintextjwm>
```

`<domain>` and `<path>` should be kept as short as possible, and the full URL should return human readable instructions when loaded in a browser. This is intended to aid new users. The `_oob` query parameter is required and is reserved to contain the DIDComm message string. Additional path elements or query parameters are allowed, and can be leveraged to provide coupons or other promise of payment for new users.

> `_oob` is a shortened form of Out of Band, and was chosen to not conflict with query parameter names in use at a particular domain. When the query parameter is detected, it may be assumed to be an Out Of Band message with a reasonably high confidence.

> To do: We need to rationalize this approach `https://` approach with the use of a special protocol (e.g. `didcomm://`) that will enable handling of the URL on mobile devices to automatically invoke an installed app on both Android and iOS. A user must be able to process the out-of-band message on the device of the agent (e.g. when the mobile device can't scan the QR code because it is on a web page on device).

The `<encodedplaintextjwm>` is a JWM plaintext message that has been base64-url encoded.

```javascript
encodedplaintextjwm = b64urlencode(<plaintextjwm>)
```

During encoding, whitespace from the json string should be eliminated to keep the resulting out-of-band message string as short as possible.

##### Example Out-of-Band Message Encoding

Invitation:

```json
{
  "typ": "application/didcomm-plain+json",
  "type": "https://didcomm.org/out-of-band/0.1/invitation",
  "id": "69212a3a-d068-4f9d-a2dd-4741bca89af3",
  "from": "did:example:alice",
  "body": {
      "goal_code": "",
      "goal": "",
  },
  "attachments": [
      {
          "@id": "request-0",
          "mime-type": "application/json",
          "data": {
              "json": "<json of protocol message>"
          }
      }
  ]
}
```

Whitespace removed:

```json
{"typ": "application/didcomm-plain+json","type":"https://didcomm.org/out-of-band/0.1/invitation","id":"69212a3a-d068-4f9d-a2dd-4741bca89af3","from":"did:example:alice","body":{"goal_code":"","goal": "","request~attach":[{"@id":"request-0","mime-type":"application/json","data":{"json":"<json of protocol message>"}}]}}
```

Base 64 URL Encoded:

```text
eyJ0eXAiOiAiYXBwbGljYXRpb24vZGlkY29tbS1wbGFpbitqc29uIiwidHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMC4xL2ludml0YXRpb24iLCJpZCI6IjY5MjEyYTNhLWQwNjgtNGY5ZC1hMmRkLTQ3NDFiY2E4OWFmMyIsImZyb20iOiJkaWQ6ZXhhbXBsZTphbGljZSIsImJvZHkiOnsiZ29hbF9jb2RlIjoiIiwiZ29hbCI6ICIiLCJyZXF1ZXN0fmF0dGFjaCI6W3siQGlkIjoicmVxdWVzdC0wIiwibWltZS10eXBlIjoiYXBwbGljYXRpb24vanNvbiIsImRhdGEiOnsianNvbiI6Ijxqc29uIG9mIHByb3RvY29sIG1lc3NhZ2U-In19XX19
```

Example URL:

```text
http://example.com/path?_oob=eyJ0eXAiOiAiYXBwbGljYXRpb24vZGlkY29tbS1wbGFpbitqc29uIiwidHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMC4xL2ludml0YXRpb24iLCJpZCI6IjY5MjEyYTNhLWQwNjgtNGY5ZC1hMmRkLTQ3NDFiY2E4OWFmMyIsImZyb20iOiJkaWQ6ZXhhbXBsZTphbGljZSIsImJvZHkiOnsiZ29hbF9jb2RlIjoiIiwiZ29hbCI6ICIiLCJyZXF1ZXN0fmF0dGFjaCI6W3siQGlkIjoicmVxdWVzdC0wIiwibWltZS10eXBlIjoiYXBwbGljYXRpb24vanNvbiIsImRhdGEiOnsianNvbiI6Ijxqc29uIG9mIHByb3RvY29sIG1lc3NhZ2U-In19XX19
```

DIDComm message URLs can be transferred via any method that can send text, including an email, SMS, posting on a website, or QR Code.

Example Email Message:

```email
To: alice@example.com
From: studentrecords@example.com
Subject: Your request to connect and receive your graduate verifiable credential

Dear Alice,

To receive your Faber College graduation certificate, click here to [connect](http://example.com/path?_oob=eyJ0eXAiOiAiYXBwbGljYXRpb24vZGlkY29tbS1wbGFpbitqc29uIiwidHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMC4xL2ludml0YXRpb24iLCJpZCI6IjY5MjEyYTNhLWQwNjgtNGY5ZC1hMmRkLTQ3NDFiY2E4OWFmMyIsImZyb20iOiJkaWQ6ZXhhbXBsZTphbGljZSIsImJvZHkiOnsiZ29hbF9jb2RlIjoiIiwiZ29hbCI6ICIiLCJyZXF1ZXN0fmF0dGFjaCI6W3siQGlkIjoicmVxdWVzdC0wIiwibWltZS10eXBlIjoiYXBwbGljYXRpb24vanNvbiIsImRhdGEiOnsianNvbiI6Ijxqc29uIG9mIHByb3RvY29sIG1lc3NhZ2U-In19XX19 with us, or paste the following into your browser:

http://example.com/path?_oob=eyJ0eXAiOiAiYXBwbGljYXRpb24vZGlkY29tbS1wbGFpbitqc29uIiwidHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvb3V0LW9mLWJhbmQvMC4xL2ludml0YXRpb24iLCJpZCI6IjY5MjEyYTNhLWQwNjgtNGY5ZC1hMmRkLTQ3NDFiY2E4OWFmMyIsImZyb20iOiJkaWQ6ZXhhbXBsZTphbGljZSIsImJvZHkiOnsiZ29hbF9jb2RlIjoiIiwiZ29hbCI6ICIiLCJyZXF1ZXN0fmF0dGFjaCI6W3siQGlkIjoicmVxdWVzdC0wIiwibWltZS10eXBlIjoiYXBwbGljYXRpb24vanNvbiIsImRhdGEiOnsianNvbiI6Ijxqc29uIG9mIHByb3RvY29sIG1lc3NhZ2U-In19XX19

If you don't have an identity agent for holding credentials, you will be given instructions on how you can get one.

Thanks,

Faber College
Knowledge is Good
```

Example URL encoded as a QR Code:

![Example QR Code](.//collateral/out_of_band_exampleqr.png)

##### Short URL Message Retrieval

It seems inevitable that the length of some DIDComm messages will be too long to produce a useable QR code. Techniques to avoid unusable QR codes have been presented above, including using attachment links for requests, minimizing the routing of the response and eliminating unnecessary whitespace in the JSON. However, at some point a _sender_ may need generate a very long URL. In that case, a short URL message retrieval redirection should be implemented by the sender as follows:

- The sender should generate and track a GUID for the out-of-band message URL.
- The shortened version should be:
  - `https://example.com/path?_oobid=5f0e3ffb-3f92-4648-9868-0d6f8889e6f3`
  - Note the replacement of the query parameter `_oob` with `_oobid` when using shortened URL.
- On receipt of this form of message, the agent must do an HTTP GET to retrieve the associated encoded  message.
  - A sender may want to wait to generate the full invitation until the redirection event of the shortened URL to the full length form dynamic, so a single QR code can be used for distinct messages.

A usable QR code will always be able to be generated from the shortened form of the URL.

Note: Due to the privacy implications, a standard URL shortening service SHOULD NOT be used.
