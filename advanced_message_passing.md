## Advanced Message Passing

TODO:

* Deep linking
* CHAPI
* NFC
* Wifi-Direct
* Bluetooth
* Sneakernet / file oriented / mimetypes

#### URL & QR Codes

When passing a DIDComm Message between two parties, it is often useful to present a message in the form of a URL or encoded into the form of a QR code for scanning with a smartphone or other camera. The format for a QR code is simply the encoded URL form of a message.

##### Privacy Considerations

Any information passed via a URL or QR code is unencrypted, and may be observed by another party. This lack of privacy must be minded in two different ways.

First, no private information may be passed in the message. Private information should be passed between parties in encrypted messages only. Any protocol message that contains private information should not be passed via URL or QR code.

Second, any identifiers passed in a message sent via URL or QR code must no longer be considered private. Any DID used or other identifier no longer considered private MUST be rotated over a secure connection if privacy is required.

##### Message Correlation

The `id` of the message passed in a URL or a QR code is used to as the `thread_id` on a response sent by the recipient of this message. The response recipient can use the `thread_id` to correlate it with the original message.

##### Standard Message Encoding

Using a standard message encoding allows for easier interoperability between multiple projects and software platforms. Using a URL for that standard encoding provides a built in fallback flow for users who are unable to automatically process the message. Those new users will load the URL in a browser as a default behavior, and may be presented with instructions on how to install software capable of processing the message. Already onboarded users will be able to process the message without loading in a browser via mobile app URL capture, or via capability detection after being loaded in a browser.

The standard message format is a URL with a Base64URLEncoded plaintext JWM json object as a query parameter.

The URL format is as follows, with some elements described below:

```text
https://<domain>/<path>?_dc=<encodedplaintextjwm>
```

`<domain>` and `<path>` should be kept as short as possible, and the full URL should return human readable instructions when loaded in a browser. This is intended to aid new users. The `_dc` query parameter is required and is reserved to contain the DIDComm message string. Additional path elements or query parameters are allowed, and can be leveraged to provide coupons or other promise of payment for new users.

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
  "type": "https://didcomm.org/myprotocol/0.1/mymessagetype",
  "id": "69212a3a-d068-4f9d-a2dd-4741bca89af3",
  "from": "did:example:alice",
  "body": {
      "my_attribute": "myvalue"
  }
}
```

Whitespace removed:

```json
{"type":"https://didcomm.org/myprotocol/0.1/mymessagetype","id":"69212a3a-d068-4f9d-a2dd-4741bca89af3","from":"did:example:alice","body":{"my_attribute": "myvalue"}}
```

Base 64 URL Encoded:

```text
eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9teXByb3RvY29sLzAuMS9teW1lc3NhZ2V0eXBlIiwiaWQiOiI2OTIxMmEzYS1kMDY4LTRmOWQtYTJkZC00NzQxYmNhODlhZjMiLCJmcm9tIjoiZGlkOmV4YW1wbGU6YWxpY2UiLCJib2R5Ijp7Im15X2F0dHJpYnV0ZSI6ICJteXZhbHVlIn19
```

Example URL:

```text
http://example.com/path?_dc=eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9teXByb3RvY29sLzAuMS9teW1lc3NhZ2V0eXBlIiwiaWQiOiI2OTIxMmEzYS1kMDY4LTRmOWQtYTJkZC00NzQxYmNhODlhZjMiLCJmcm9tIjoiZGlkOmV4YW1wbGU6YWxpY2UiLCJib2R5Ijp7Im15X2F0dHJpYnV0ZSI6ICJteXZhbHVlIn19
```

DIDComm message URLs can be transferred via any method that can send text, including an email, SMS, posting on a website, or QR Code.

Example Email Message:

```email
To: alice@example.com
From: studentrecords@example.com
Subject: Your request to connect and receive your graduate verifiable credential

Dear Alice,

To receive your Faber College graduation certificate, click here to [connect](http://example.com/path?_dc=eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9teXByb3RvY29sLzAuMS9teW1lc3NhZ2V0eXBlIiwiaWQiOiI2OTIxMmEzYS1kMDY4LTRmOWQtYTJkZC00NzQxYmNhODlhZjMiLCJmcm9tIjoiZGlkOmV4YW1wbGU6YWxpY2UiLCJib2R5Ijp7Im15X2F0dHJpYnV0ZSI6ICJteXZhbHVlIn19) with us, or paste the following into your browser:

http://example.com/path?_dc=eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9teXByb3RvY29sLzAuMS9teW1lc3NhZ2V0eXBlIiwiaWQiOiI2OTIxMmEzYS1kMDY4LTRmOWQtYTJkZC00NzQxYmNhODlhZjMiLCJmcm9tIjoiZGlkOmV4YW1wbGU6YWxpY2UiLCJib2R5Ijp7Im15X2F0dHJpYnV0ZSI6ICJteXZhbHVlIn19

If you don't have an identity agent for holding credentials, you will be given instructions on how you can get one.

Thanks,

Faber College
Knowledge is Good
```

Example URL encoded as a QR Code:

![Example QR Code](ExampleQRCode.png)

##### Short URL Message Retrieval

It seems inevitable that the length of some DIDComm messages will be too long to produce a useable QR code. Techniques to avoid unusable QR codes have been presented above, including using attachment links for requests, minimizing the routing of the response and eliminating unnecessary whitespace in the JSON. However, at some point a _sender_ may need generate a very long URL. In that case, a short URL message retrieval redirection should be implemented by the sender as follows:

- The sender should generate and track a GUID for the out-of-band message URL.
- The shortened version should be:
  - `https://example.com/path?_dcid=5f0e3ffb-3f92-4648-9868-0d6f8889e6f3`
  - Note the replacement of the query parameter `_dc` with `_dcid` when using shortened URL.
- On receipt of this form of message, the agent must do an HTTP GET to retrieve the associated encoded  message.
  - A sender may want to wait to generate the full invitation until the redirection event of the shortened URL to the full length form dynamic, so a single QR code can be used for distinct messages.

A usable QR code will always be able to be generated from the shortened form of the URL.

Note: Due to the privacy implications, a standard URL shortening service SHOULD NOT be used.

#### Embedded Messages

DIDComm messages may be passed within other messages are protocols when the outer message is passed in a secure way. When messages are passed in this way, they may be passed either as an encrypted message or in plain text. When in plain text format, messages should be represented in json format.

##### Privacy Considerations

When messages are passed in plain text, the privacy and security of the message is subject to the properties of the protocol and transport moving the messages. Extreme care must be taken to protect the message.



