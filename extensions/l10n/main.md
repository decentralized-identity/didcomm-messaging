# DIDComm L10n Extension

## Summary 

Explains how to support advanced localization use cases.

## Scope

DIDComm's `lang` and `accept-lang` headers cover most localization needs. However, some protocols may push the envelope. For example, a three-party introduction protocol may be conducted among parties that have mutually contradictory language preferences. A government policy to be multilingual may require a sender to provide the same field value in multiple languages at the same time. A bilingual dictionary lookup protocol may place source and target language fields next to one another in the same message.

This extension is for those scenarios. It supplements rather than replacing DIDComm's basic i18n features.

## Reference

A sender MAY add the `l10n` header to any message to provide powerful, flexible localization features. This header MUST declare a **localization strategy subfield** from the following list:

* `inline`: The value of this field is an array of triples (3-item arrays) where each triple is in the form `("lang", "field", "translation")`. The second value in the triple identifies the field from `body` that the triple translates, using a relative path from `body` in dotted JSON-Path notation. Building on the main spec's example of Alice and Bob playing chess, if Alice wanted to use this strategy when she checkmates Bob, she might send:

```json
{
  "id": "388d599a-fdc1-4890-b32a-be6cd3893564",
  "type": "https://didcomm.org/chess/1.0/move",
  "lang": "en",
  "l10n": {
    "inline": [
      ["fr", "comment", "C'est échec et mat, mon pote."]
      ["es", "comment", "Eso es jaque mate, amigo"]
    ]
  },
  "body": {
    "move": "BC4+",
    "comment": "That's checkmate, buddy."
  }
}
```

* `service`: Not currently defined, but reserved for use with a URI that allows calls to a web service that provides translations.

* `table`: Not currently defined, but reserved for use with a URI that allows a localized message lookup table to be downloaded.