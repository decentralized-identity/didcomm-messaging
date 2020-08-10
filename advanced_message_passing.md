## Advanced Message Passing

TODO:

* Deep linking
* CHAPI
* NFC
* Wifi-Direct
* Bluetooth
* Sneakernet / file oriented / mimetypes



#### Embedded Messages

DIDComm messages may be passed within other messages are protocols when the outer message is passed in a secure way. When messages are passed in this way, they may be passed either as an encrypted message or in plain text. When in plain text format, messages should be represented in json format.

##### Privacy Considerations

When messages are passed in plain text, the privacy and security of the message is subject to the properties of the protocol and transport moving the messages. Extreme care must be taken to protect the message.



